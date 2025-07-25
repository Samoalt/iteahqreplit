
import { Client } from '@replit/object-storage';
import { db } from "../db";
import { documents } from "@shared/schema";
import { eq } from "drizzle-orm";
import crypto from 'crypto';

export class FileStorageService {
  private client: Client;

  constructor() {
    this.client = new Client();
  }

  async uploadFile(
    file: Buffer,
    filename: string,
    mimeType: string,
    entityType: string,
    entityId: string,
    documentType: string,
    userId: number
  ) {
    try {
      // Generate unique file ID
      const fileId = crypto.randomUUID();
      const fileExtension = filename.split('.').pop();
      const storageKey = `${entityType}/${entityId}/${fileId}.${fileExtension}`;

      // Upload to Object Storage
      const { ok, error } = await this.client.uploadFromBytes(storageKey, file);
      if (!ok) {
        throw new Error(`Failed to upload file: ${error}`);
      }

      // Store metadata in database
      const [document] = await db
        .insert(documents)
        .values({
          documentId: fileId,
          name: filename,
          type: documentType,
          entityType,
          entityId,
          fileUrl: storageKey,
          fileSize: file.length,
          mimeType,
          generatedBy: userId
        })
        .returning();

      return document;
    } catch (error) {
      console.error('File upload error:', error);
      throw error;
    }
  }

  async downloadFile(documentId: string) {
    try {
      // Get document metadata
      const [document] = await db
        .select()
        .from(documents)
        .where(eq(documents.documentId, documentId));

      if (!document) {
        throw new Error('Document not found');
      }

      // Download from Object Storage
      const { ok, value, error } = await this.client.downloadAsBytes(document.fileUrl);
      if (!ok) {
        throw new Error(`Failed to download file: ${error}`);
      }

      return {
        data: value,
        metadata: document
      };
    } catch (error) {
      console.error('File download error:', error);
      throw error;
    }
  }

  async generateESlip(bidId: string, bidData: any): Promise<string> {
    try {
      // Generate PDF content (simplified - you'd use a PDF library like PDFKit)
      const pdfContent = this.createESlipPDF(bidData);
      const filename = `e-slip-${bidId}.pdf`;
      
      const document = await this.uploadFile(
        Buffer.from(pdfContent),
        filename,
        'application/pdf',
        'bid',
        bidId,
        'e_slip',
        1 // System user
      );

      return document.documentId;
    } catch (error) {
      console.error('E-slip generation error:', error);
      throw error;
    }
  }

  async generateTeaReleaseCertificate(bidId: string, bidData: any): Promise<string> {
    try {
      const pdfContent = this.createReleaseCertificatePDF(bidData);
      const filename = `release-certificate-${bidId}.pdf`;
      
      const document = await this.uploadFile(
        Buffer.from(pdfContent),
        filename,
        'application/pdf',
        'bid',
        bidId,
        'release_certificate',
        1 // System user
      );

      return document.documentId;
    } catch (error) {
      console.error('Release certificate generation error:', error);
      throw error;
    }
  }

  async deleteFile(documentId: string) {
    try {
      // Get document metadata
      const [document] = await db
        .select()
        .from(documents)
        .where(eq(documents.documentId, documentId));

      if (!document) {
        throw new Error('Document not found');
      }

      // Delete from Object Storage
      const { ok, error } = await this.client.delete(document.fileUrl);
      if (!ok) {
        console.error(`Failed to delete file from storage: ${error}`);
        // Continue with database cleanup even if storage deletion fails
      }

      // Remove from database
      await db
        .delete(documents)
        .where(eq(documents.documentId, documentId));

      return { success: true };
    } catch (error) {
      console.error('File deletion error:', error);
      throw error;
    }
  }

  async listFiles(entityType: string, entityId: string) {
    return await db
      .select()
      .from(documents)
      .where(eq(documents.entityType, entityType))
      .where(eq(documents.entityId, entityId));
  }

  // PDF generation helpers (simplified - in production use proper PDF libraries)
  private createESlipPDF(bidData: any): string {
    return `
      E-SLIP DOCUMENT
      ===============
      
      Bid ID: ${bidData.bidId}
      Buyer: ${bidData.buyerName}
      Tea Type: ${bidData.teaType}
      Quantity: ${bidData.quantity} kg
      Price per Kg: $${bidData.pricePerKg}
      Total Amount: $${bidData.amount}
      
      Factory: ${bidData.originFactory}
      Grade: ${bidData.grade}
      Packaging: ${bidData.packagingType}
      
      Payment Instructions:
      - Reference: ${bidData.bidId}
      - Bank Details: [Bank information here]
      
      Generated: ${new Date().toISOString()}
    `;
  }

  private createReleaseCertificatePDF(bidData: any): string {
    return `
      TEA RELEASE CERTIFICATE
      ======================
      
      Certificate ID: RC-${bidData.bidId}
      
      This certifies that the following tea lot is ready for release:
      
      Bid Reference: ${bidData.bidId}
      Buyer: ${bidData.buyerName}
      Tea Description: ${bidData.teaType} - ${bidData.grade}
      Quantity: ${bidData.quantity} kg
      
      Warehouse Details:
      Location: ${bidData.warehouseLocation}
      Contact: ${bidData.warehouseContact}
      
      Released By: iTea Flow Operations
      Date: ${new Date().toLocaleDateString()}
      
      Authorized Signature: _________________
    `;
  }
}

export const fileStorage = new FileStorageService();
