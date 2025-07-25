
import { db } from "../db";
import { workflowInstances, workflowDefinitions, bids, approvalWorkflows, paymentInflows } from "@shared/schema";
import { eq, and } from "drizzle-orm";

export interface WorkflowStage {
  id: string;
  name: string;
  type: 'automatic' | 'manual' | 'approval';
  conditions?: Record<string, any>;
  actions?: Record<string, any>;
  nextStages: string[];
  timeout?: number; // in minutes
}

export class WorkflowEngine {
  async startWorkflow(workflowType: string, entityType: string, entityId: string, data?: any) {
    // Get workflow definition
    const [workflowDef] = await db
      .select()
      .from(workflowDefinitions)
      .where(and(
        eq(workflowDefinitions.type, workflowType),
        eq(workflowDefinitions.isActive, true)
      ));

    if (!workflowDef) {
      throw new Error(`No active workflow found for type: ${workflowType}`);
    }

    const stages = workflowDef.stages as WorkflowStage[];
    const firstStage = stages[0];

    // Create workflow instance
    const [instance] = await db
      .insert(workflowInstances)
      .values({
        workflowId: workflowDef.id,
        entityType,
        entityId,
        currentStage: firstStage.id,
        data: data || {}
      })
      .returning();

    // Process first stage
    await this.processStage(instance.id, firstStage);
    
    return instance;
  }

  async processStage(instanceId: number, stage: WorkflowStage) {
    const [instance] = await db
      .select()
      .from(workflowInstances)
      .where(eq(workflowInstances.id, instanceId));

    if (!instance) {
      throw new Error(`Workflow instance not found: ${instanceId}`);
    }

    switch (stage.type) {
      case 'automatic':
        await this.processAutomaticStage(instance, stage);
        break;
      case 'manual':
        await this.processManualStage(instance, stage);
        break;
      case 'approval':
        await this.processApprovalStage(instance, stage);
        break;
    }
  }

  private async processAutomaticStage(instance: any, stage: WorkflowStage) {
    try {
      // Execute stage actions based on entity type
      switch (instance.entityType) {
        case 'bid':
          await this.processBidStage(instance, stage);
          break;
        case 'payment':
          await this.processPaymentStage(instance, stage);
          break;
      }

      // Move to next stage if conditions are met
      if (this.evaluateConditions(stage.conditions, instance.data)) {
        await this.moveToNextStage(instance.id, stage);
      }
    } catch (error) {
      console.error(`Error processing automatic stage ${stage.id}:`, error);
      await this.markWorkflowFailed(instance.id, error);
    }
  }

  private async processBidStage(instance: any, stage: WorkflowStage) {
    const bidId = instance.entityId;
    
    switch (stage.id) {
      case 'e_slip_generation':
        // Generate and send e-slip
        await this.generateESlip(bidId);
        await this.sendESlipEmail(bidId);
        break;
      case 'payment_matching':
        // Run payment matching algorithm
        await this.runPaymentMatching(bidId);
        break;
      case 'auto_split':
        // Automatically calculate splits
        await this.calculateSplits(bidId);
        break;
    }
  }

  private async processPaymentStage(instance: any, stage: WorkflowStage) {
    // Payment-specific workflow processing
    const paymentId = instance.entityId;
    
    switch (stage.id) {
      case 'matching':
        await this.matchPaymentToBids(paymentId);
        break;
      case 'verification':
        await this.verifyPaymentDetails(paymentId);
        break;
    }
  }

  private async processManualStage(instance: any, stage: WorkflowStage) {
    // For manual stages, we just mark as waiting for human intervention
    // The actual processing happens when a user takes action
    console.log(`Manual stage ${stage.id} waiting for user action`);
  }

  private async processApprovalStage(instance: any, stage: WorkflowStage) {
    // Create approval workflow
    const approvalData = stage.actions?.approval || {};
    
    await db.insert(approvalWorkflows).values({
      entityType: instance.entityType,
      entityId: instance.entityId,
      approvalType: stage.id,
      requiredApprovers: approvalData.approvers || [],
      totalLevels: approvalData.levels || 1,
      amountThreshold: approvalData.threshold,
      initiatedBy: instance.data?.userId || 1
    });
  }

  private async moveToNextStage(instanceId: number, currentStage: WorkflowStage) {
    if (currentStage.nextStages.length === 0) {
      // Workflow completed
      await db
        .update(workflowInstances)
        .set({
          status: 'completed',
          completedAt: new Date()
        })
        .where(eq(workflowInstances.id, instanceId));
      return;
    }

    // For simplicity, take the first next stage
    // In a real implementation, you might have conditional logic here
    const nextStageId = currentStage.nextStages[0];
    
    await db
      .update(workflowInstances)
      .set({
        currentStage: nextStageId
      })
      .where(eq(workflowInstances.id, instanceId));

    // Continue processing next stage if it's automatic
    const [workflowDef] = await db
      .select()
      .from(workflowDefinitions)
      .where(eq(workflowDefinitions.id, instanceId));

    if (workflowDef) {
      const stages = workflowDef.stages as WorkflowStage[];
      const nextStage = stages.find(s => s.id === nextStageId);
      
      if (nextStage?.type === 'automatic') {
        await this.processStage(instanceId, nextStage);
      }
    }
  }

  private evaluateConditions(conditions: any, data: any): boolean {
    if (!conditions) return true;
    
    // Simple condition evaluation - can be extended
    for (const [key, expectedValue] of Object.entries(conditions)) {
      if (data[key] !== expectedValue) {
        return false;
      }
    }
    return true;
  }

  private async markWorkflowFailed(instanceId: number, error: any) {
    await db
      .update(workflowInstances)
      .set({
        status: 'failed',
        data: { error: error.message }
      })
      .where(eq(workflowInstances.id, instanceId));
  }

  // Placeholder methods for specific actions
  private async generateESlip(bidId: string) {
    console.log(`Generating e-slip for bid ${bidId}`);
    // Implementation would generate PDF and store in documents table
  }

  private async sendESlipEmail(bidId: string) {
    console.log(`Sending e-slip email for bid ${bidId}`);
    // Implementation would queue email in emailQueue table
  }

  private async runPaymentMatching(bidId: string) {
    console.log(`Running payment matching for bid ${bidId}`);
    // Implementation would run payment matching algorithm
  }

  private async calculateSplits(bidId: string) {
    console.log(`Calculating splits for bid ${bidId}`);
    // Implementation would calculate and store split details
  }

  private async matchPaymentToBids(paymentId: string) {
    console.log(`Matching payment ${paymentId} to bids`);
    // Implementation would run matching algorithm
  }

  private async verifyPaymentDetails(paymentId: string) {
    console.log(`Verifying payment details for ${paymentId}`);
    // Implementation would verify payment information
  }
}

export const workflowEngine = new WorkflowEngine();
