
import { db } from "../db";
import { emailQueue, smsQueue, notifications, users } from "@shared/schema";
import { eq } from "drizzle-orm";

export interface EmailTemplate {
  subject: string;
  htmlBody: string;
  textBody?: string;
}

export interface NotificationPayload {
  userId: number;
  type: string;
  title: string;
  message: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  actionUrl?: string;
  metadata?: any;
}

export class NotificationService {
  // Email Templates
  private readonly emailTemplates: Record<string, (data: any) => EmailTemplate> = {
    e_slip_delivery: (data) => ({
      subject: `E-Slip for Bid ${data.bidId} - ${data.teaType}`,
      htmlBody: `
        <h2>E-Slip Delivery</h2>
        <p>Dear ${data.buyerName},</p>
        <p>Please find attached the e-slip for your successful bid:</p>
        <ul>
          <li><strong>Bid ID:</strong> ${data.bidId}</li>
          <li><strong>Tea Type:</strong> ${data.teaType}</li>
          <li><strong>Quantity:</strong> ${data.quantity} kg</li>
          <li><strong>Amount:</strong> $${data.amount}</li>
        </ul>
        <p>Please review the details and proceed with payment.</p>
        <p>Best regards,<br>iTea Flow Team</p>
      `,
      textBody: `E-Slip for Bid ${data.bidId} - Please find attached your e-slip.`
    }),

    payment_confirmation: (data) => ({
      subject: `Payment Confirmed for Bid ${data.bidId}`,
      htmlBody: `
        <h2>Payment Confirmation</h2>
        <p>Dear ${data.buyerName},</p>
        <p>We have successfully matched your payment to bid ${data.bidId}.</p>
        <p><strong>Amount:</strong> $${data.amount}</p>
        <p><strong>Reference:</strong> ${data.reference}</p>
        <p>Your order is now being processed for tea release.</p>
        <p>Best regards,<br>iTea Flow Team</p>
      `,
    }),

    payout_approval_request: (data) => ({
      subject: `Payout Approval Required - $${data.amount}`,
      htmlBody: `
        <h2>Payout Approval Request</h2>
        <p>Dear ${data.approverName},</p>
        <p>A payout requires your approval:</p>
        <ul>
          <li><strong>Amount:</strong> $${data.amount}</li>
          <li><strong>Beneficiary:</strong> ${data.beneficiary}</li>
          <li><strong>Request ID:</strong> ${data.requestId}</li>
        </ul>
        <p><a href="${data.approvalUrl}">Click here to review and approve</a></p>
        <p>Best regards,<br>iTea Flow Team</p>
      `,
    }),

    tea_release_certificate: (data) => ({
      subject: `Tea Release Certificate - Bid ${data.bidId}`,
      htmlBody: `
        <h2>Tea Release Certificate</h2>
        <p>Dear ${data.buyerName},</p>
        <p>Your tea is ready for collection. Please find attached the release certificate.</p>
        <p><strong>Collection Details:</strong></p>
        <ul>
          <li><strong>Location:</strong> ${data.warehouseLocation}</li>
          <li><strong>Contact:</strong> ${data.warehouseContact}</li>
          <li><strong>Quantity:</strong> ${data.quantity} kg</li>
        </ul>
        <p>Best regards,<br>iTea Flow Team</p>
      `,
    })
  };

  async sendEmail(
    to: string,
    templateName: string,
    data: any,
    attachments?: Array<{ documentId: string; filename: string }>,
    priority: 'low' | 'normal' | 'high' = 'normal',
    scheduledFor?: Date
  ) {
    const template = this.emailTemplates[templateName];
    if (!template) {
      throw new Error(`Email template not found: ${templateName}`);
    }

    const emailContent = template(data);

    const [queuedEmail] = await db
      .insert(emailQueue)
      .values({
        to,
        subject: emailContent.subject,
        htmlBody: emailContent.htmlBody,
        textBody: emailContent.textBody,
        attachments: attachments || [],
        priority,
        scheduledFor
      })
      .returning();

    // In a real implementation, you would integrate with an email service like SendGrid, AWS SES, etc.
    console.log(`Email queued for delivery: ${queuedEmail.id}`);
    
    return queuedEmail;
  }

  async sendSMS(
    to: string,
    message: string,
    priority: 'low' | 'normal' | 'high' = 'normal',
    scheduledFor?: Date
  ) {
    const [queuedSMS] = await db
      .insert(smsQueue)
      .values({
        to,
        message,
        priority,
        scheduledFor
      })
      .returning();

    // In a real implementation, you would integrate with an SMS service like Twilio, Africa's Talking, etc.
    console.log(`SMS queued for delivery: ${queuedSMS.id}`);
    
    return queuedSMS;
  }

  async createNotification(payload: NotificationPayload) {
    const [notification] = await db
      .insert(notifications)
      .values({
        userId: payload.userId,
        type: payload.type,
        title: payload.title,
        message: payload.message,
        priority: payload.priority || 'medium',
        actionUrl: payload.actionUrl,
        metadata: payload.metadata
      })
      .returning();

    // Also send email/SMS if urgent
    if (payload.priority === 'urgent') {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, payload.userId));

      if (user?.email) {
        await this.sendEmail(
          user.email,
          'urgent_notification',
          {
            userName: `${user.firstName} ${user.lastName}`,
            title: payload.title,
            message: payload.message,
            actionUrl: payload.actionUrl
          },
          undefined,
          'high'
        );
      }

      if (user?.phone) {
        await this.sendSMS(
          user.phone,
          `URGENT: ${payload.title} - ${payload.message}`,
          'high'
        );
      }
    }

    return notification;
  }

  // Workflow-specific notification methods
  async notifyESlipSent(bidId: string, buyerEmail: string, buyerName: string) {
    const bid = await this.getBidDetails(bidId);
    
    await this.sendEmail(
      buyerEmail,
      'e_slip_delivery',
      {
        bidId,
        buyerName,
        teaType: bid.teaType,
        quantity: bid.quantity,
        amount: bid.amount
      },
      [{ documentId: `eslip_${bidId}`, filename: `e-slip-${bidId}.pdf` }]
    );
  }

  async notifyPaymentMatched(bidId: string, amount: string, reference: string) {
    const bid = await this.getBidDetails(bidId);
    const buyer = await this.getBuyerDetails(bid.buyerId);
    
    if (buyer?.email) {
      await this.sendEmail(
        buyer.email,
        'payment_confirmation',
        {
          bidId,
          buyerName: buyer.name,
          amount,
          reference
        }
      );
    }
  }

  async notifyPayoutApprovalRequired(approverIds: number[], amount: string, beneficiary: string, requestId: string) {
    for (const approverId of approverIds) {
      const [approver] = await db
        .select()
        .from(users)
        .where(eq(users.id, approverId));

      if (approver?.email) {
        const approvalUrl = `${process.env.APP_URL}/app/operations/bid-processing?approval=${requestId}`;
        
        await this.sendEmail(
          approver.email,
          'payout_approval_request',
          {
            approverName: `${approver.firstName} ${approver.lastName}`,
            amount,
            beneficiary,
            requestId,
            approvalUrl
          },
          undefined,
          'high'
        );

        // Also create in-app notification
        await this.createNotification({
          userId: approverId,
          type: 'payout_approval',
          title: 'Payout Approval Required',
          message: `Payout of $${amount} requires your approval`,
          priority: 'high',
          actionUrl: `/app/operations/bid-processing?approval=${requestId}`
        });
      }
    }
  }

  async notifyTeaRelease(bidId: string) {
    const bid = await this.getBidDetails(bidId);
    const buyer = await this.getBuyerDetails(bid.buyerId);
    
    if (buyer?.email) {
      await this.sendEmail(
        buyer.email,
        'tea_release_certificate',
        {
          bidId,
          buyerName: buyer.name,
          quantity: bid.quantity,
          warehouseLocation: bid.warehouseLocation || 'Main Warehouse',
          warehouseContact: '+254 700 123 456'
        },
        [{ documentId: `release_cert_${bidId}`, filename: `release-certificate-${bidId}.pdf` }]
      );
    }
  }

  // Process email queue (would be called by a background job)
  async processEmailQueue() {
    const pendingEmails = await db
      .select()
      .from(emailQueue)
      .where(eq(emailQueue.status, 'queued'))
      .limit(10);

    for (const email of pendingEmails) {
      try {
        // In real implementation, send via email service
        console.log(`Sending email to ${email.to}: ${email.subject}`);
        
        await db
          .update(emailQueue)
          .set({
            status: 'sent',
            sentAt: new Date()
          })
          .where(eq(emailQueue.id, email.id));
      } catch (error) {
        console.error(`Failed to send email ${email.id}:`, error);
        
        await db
          .update(emailQueue)
          .set({
            status: 'failed',
            attempts: email.attempts + 1,
            lastError: error instanceof Error ? error.message : 'Unknown error'
          })
          .where(eq(emailQueue.id, email.id));
      }
    }
  }

  // Helper methods
  private async getBidDetails(bidId: string) {
    const [bid] = await db
      .select()
      .from(bids)
      .where(eq(bids.bidId, bidId));
    return bid;
  }

  private async getBuyerDetails(buyerId: number) {
    const [buyer] = await db
      .select()
      .from(entities)
      .where(eq(entities.id, buyerId));
    return buyer;
  }
}

export const notificationService = new NotificationService();
