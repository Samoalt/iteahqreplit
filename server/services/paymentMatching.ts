import { db } from "../db";
import { paymentInflows, bids, entities, auditLogs } from "@shared/schema";
import { eq, and, isNull, desc } from "drizzle-orm";

export interface MatchResult {
  paymentId: number;
  bidId: string;
  score: number;
  confidence: 'high' | 'medium' | 'low';
  matchedFields: string[];
}

export class PaymentMatcher {
  async runAutomaticMatching() {
    // Get unmatched payments
    const unmatchedPayments = await db
      .select()
      .from(paymentInflows)
      .where(eq(paymentInflows.matchStatus, 'unmatched'))
      .orderBy(desc(paymentInflows.receivedDate));

    const results: MatchResult[] = [];

    for (const payment of unmatchedPayments) {
      const matches = await this.findMatches(payment);

      // Auto-match if confidence is high and score > 0.8
      const bestMatch = matches[0];
      if (bestMatch && bestMatch.score > 0.8 && bestMatch.confidence === 'high') {
        await this.executeMatch(payment.id, bestMatch.bidId, bestMatch.score, 'auto');
        results.push(bestMatch);
      }
    }

    return results;
  }

  async findMatches(payment: any): Promise<MatchResult[]> {
    // Get all pending bids that could match this payment
    const pendingBids = await db
      .select()
      .from(bids)
      .where(eq(bids.status, 'payment-matching'));

    const matches: MatchResult[] = [];

    for (const bid of pendingBids) {
      const score = await this.calculateMatchScore(payment, bid);

      if (score > 0.3) { // Only consider matches above 30%
        matches.push({
          paymentId: payment.id,
          bidId: bid.bidId,
          score,
          confidence: this.getConfidenceLevel(score),
          matchedFields: this.getMatchedFields(payment, bid)
        });
      }
    }

    // Sort by score descending
    return matches.sort((a, b) => b.score - a.score);
  }

  private async calculateMatchScore(payment: any, bid: any): Promise<number> {
    let score = 0;
    let totalWeight = 0;

    // Amount matching (weight: 40%)
    const amountWeight = 0.4;
    const amountDiff = Math.abs(parseFloat(payment.amount) - parseFloat(bid.amount));
    const amountScore = Math.max(0, 1 - (amountDiff / parseFloat(bid.amount)));
    score += amountScore * amountWeight;
    totalWeight += amountWeight;

    // Buyer name matching (weight: 30%)
    const nameWeight = 0.3;
    if (payment.payerName && bid.buyerId) {
      // Get buyer entity
      const [buyer] = await db
        .select()
        .from(entities)
        .where(eq(entities.id, bid.buyerId));

      if (buyer) {
        const nameScore = this.calculateStringMatch(
          payment.payerName.toLowerCase(),
          buyer.name.toLowerCase()
        );
        score += nameScore * nameWeight;
      }
    }
    totalWeight += nameWeight;

    // Reference matching (weight: 20%)
    const refWeight = 0.2;
    if (payment.reference && bid.bidId) {
      const refScore = this.calculateStringMatch(
        payment.reference.toLowerCase(),
        bid.bidId.toLowerCase()
      );
      score += refScore * refWeight;
    }
    totalWeight += refWeight;

    // Date proximity (weight: 10%)
    const dateWeight = 0.1;
    const daysDiff = Math.abs(
      (new Date(payment.receivedDate).getTime() - new Date(bid.createdAt).getTime()) 
      / (1000 * 60 * 60 * 24)
    );
    const dateScore = Math.max(0, 1 - (daysDiff / 30)); // 30 day window
    score += dateScore * dateWeight;
    totalWeight += dateWeight;

    return totalWeight > 0 ? score / totalWeight : 0;
  }

  private calculateStringMatch(str1: string, str2: string): number {
    // Simple Levenshtein distance-based matching
    const distance = this.levenshteinDistance(str1, str2);
    const maxLength = Math.max(str1.length, str2.length);
    return maxLength > 0 ? 1 - (distance / maxLength) : 0;
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  }

  private getConfidenceLevel(score: number): 'high' | 'medium' | 'low' {
    if (score >= 0.8) return 'high';
    if (score >= 0.6) return 'medium';
    return 'low';
  }

  private getMatchedFields(payment: any, bid: any): string[] {
    const fields = [];

    // Check which fields contributed to the match
    const amountDiff = Math.abs(parseFloat(payment.amount) - parseFloat(bid.amount));
    if (amountDiff / parseFloat(bid.amount) < 0.05) { // Within 5%
      fields.push('amount');
    }

    if (payment.reference && bid.bidId && 
        payment.reference.toLowerCase().includes(bid.bidId.toLowerCase())) {
      fields.push('reference');
    }

    return fields;
  }

  async executeMatch(paymentId: number, bidId: string, score: number, matchType: 'auto' | 'manual', userId?: number) {
    // Update payment record
    await db
      .update(paymentInflows)
      .set({
        matchedBidId: bidId,
        matchScore: score.toString(),
        matchStatus: matchType === 'auto' ? 'auto_matched' : 'manual_matched',
        matchedBy: userId,
        matchedAt: new Date()
      })
      .where(eq(paymentInflows.id, paymentId));

    // Update bid status to next stage
    await db
      .update(bids)
      .set({
        status: 'split-processing',
        updatedAt: new Date()
      })
      .where(eq(bids.bidId, bidId));

    // Log the matching action
    await db.insert(auditLogs).values({
      entityType: 'payment_matching',
      entityId: paymentId.toString(),
      action: 'matched',
      changes: { bidId, score, matchType },
      performedBy: userId || 1, // System user
    });
  }

  async manualMatch(paymentId: number, bidId: string, userId: number, notes?: string) {
    const score = 1.0; // Manual matches get perfect score
    await this.executeMatch(paymentId, bidId, score, 'manual', userId);

    if (notes) {
      await db.insert(auditLogs).values({
        entityType: 'payment_matching',
        entityId: paymentId.toString(),
        action: 'manual_match_note',
        changes: { notes },
        performedBy: userId,
      });
    }
  }

  async disputeMatch(paymentId: number, userId: number, reason: string) {
    await db
      .update(paymentInflows)
      .set({
        matchStatus: 'disputed',
        matchedBidId: null,
        matchScore: null
      })
      .where(eq(paymentInflows.id, paymentId));

    await db.insert(auditLogs).values({
      entityType: 'payment_matching',
      entityId: paymentId.toString(),
      action: 'disputed',
      changes: { reason },
      performedBy: userId,
    });
  }
}

export const paymentMatcher = new PaymentMatcher();