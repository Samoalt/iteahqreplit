import { db } from "../db";
import { workflowInstances, workflowDefinitions, bids, paymentInflows } from "@shared/schema";
import { eq, and } from "drizzle-orm";

export class WorkflowEngine {
  async startWorkflow(workflowType: string, entityType: string, entityId: string, data: any) {
    try {
      // Get workflow definition
      const [definition] = await db
        .select()
        .from(workflowDefinitions)
        .where(eq(workflowDefinitions.type, workflowType))
        .limit(1);

      if (!definition) {
        throw new Error(`Workflow definition not found for type: ${workflowType}`);
      }

      // Create workflow instance
      const [instance] = await db
        .insert(workflowInstances)
        .values({
          workflowDefinitionId: definition.id,
          entityType,
          entityId,
          currentStage: definition.stages[0]?.name || 'start',
          status: 'active',
          data,
          startedBy: data.userId || 1
        })
        .returning();

      return instance;
    } catch (error) {
      console.error('Workflow start error:', error);
      throw error;
    }
  }

  async progressWorkflow(instanceId: number, nextStage: string, data?: any) {
    try {
      await db
        .update(workflowInstances)
        .set({
          currentStage: nextStage,
          data: data || undefined
        })
        .where(eq(workflowInstances.id, instanceId));

      return true;
    } catch (error) {
      console.error('Workflow progress error:', error);
      throw error;
    }
  }

  async completeWorkflow(instanceId: number) {
    try {
      await db
        .update(workflowInstances)
        .set({
          status: 'completed',
          completedAt: new Date()
        })
        .where(eq(workflowInstances.id, instanceId));

      return true;
    } catch (error) {
      console.error('Workflow completion error:', error);
      throw error;
    }
  }

  async getWorkflowInstance(instanceId: number) {
    try {
      const [instance] = await db
        .select()
        .from(workflowInstances)
        .where(eq(workflowInstances.id, instanceId))
        .limit(1);

      return instance;
    } catch (error) {
      console.error('Get workflow instance error:', error);
      throw error;
    }
  }
}

export const workflowEngine = new WorkflowEngine();