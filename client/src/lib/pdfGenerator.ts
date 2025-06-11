import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import type { Invoice, Lot, EsgMetric, FactoryFlag } from '@shared/schema';

export class PDFGenerator {
  private static addHeader(doc: jsPDF, title: string) {
    doc.setFontSize(20);
    doc.setTextColor(79, 70, 229); // Primary blue
    doc.text('iTea Flow', 20, 25);
    
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(title, 20, 40);
    
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 50);
    
    doc.setLineWidth(0.5);
    doc.setDrawColor(79, 70, 229);
    doc.line(20, 55, 190, 55);
  }

  private static addFooter(doc: jsPDF) {
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text('iTea Flow - Powered by Elastic OS', 20, pageHeight - 15);
    doc.text(`Page ${doc.getCurrentPageInfo().pageNumber}`, 160, pageHeight - 15);
  }

  static async generateInvoicePDF(invoice: Invoice, lot?: Lot): Promise<Blob> {
    const doc = new jsPDF();
    
    this.addHeader(doc, `Invoice ${invoice.invoiceNumber}`);
    
    // Invoice details
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    
    // Buyer information
    doc.text('Bill To:', 20, 75);
    doc.setFontSize(10);
    doc.text(`Buyer ID: ${invoice.buyerId}`, 20, 85);
    doc.text(`Invoice Date: ${new Date(invoice.createdAt).toLocaleDateString()}`, 20, 95);
    const dueDate = new Date(invoice.createdAt);
    dueDate.setDate(dueDate.getDate() + 30); // 30 days from creation
    doc.text(`Due Date: ${dueDate.toLocaleDateString()}`, 20, 105);
    
    // Invoice status
    doc.setFontSize(12);
    const statusColor = invoice.status === 'paid' ? [34, 197, 94] : 
                       invoice.status === 'overdue' ? [239, 68, 68] : [251, 191, 36];
    doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
    doc.text(`Status: ${invoice.status.toUpperCase()}`, 130, 75);
    
    // Lot details if available
    if (lot) {
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(11);
      doc.text('Lot Information:', 20, 125);
      
      autoTable(doc, {
        startY: 135,
        head: [['Property', 'Value']],
        body: [
          ['Lot ID', lot.lotId],
          ['Factory', lot.factory],
          ['Grade', lot.grade],
          ['Weight (kg)', lot.kg],
          ['Unit Price (KES)', lot.offerPrice],
          ['Total Amount (USD)', invoice.amountUSD]
        ],
        theme: 'grid',
        headStyles: { fillColor: [79, 70, 229] },
        styles: { fontSize: 9 }
      });
    }
    
    // Payment details
    const finalY = (doc as any).lastAutoTable?.finalY || 180;
    
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Payment Summary', 20, finalY + 20);
    
    autoTable(doc, {
      startY: finalY + 30,
      head: [['Description', 'Amount (KES)']],
      body: [
        ['Subtotal', invoice.amountUSD],
        ['Tax (16%)', (parseFloat(invoice.amountUSD) * 0.16).toFixed(2)],
        ['Total Due', (parseFloat(invoice.amountUSD) * 1.16).toFixed(2)]
      ],
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229] },
      styles: { fontSize: 10 },
      columnStyles: {
        1: { halign: 'right' }
      }
    });
    
    this.addFooter(doc);
    
    return new Blob([doc.output('blob')], { type: 'application/pdf' });
  }

  static async generateESGReportPDF(metrics: EsgMetric[]): Promise<Blob> {
    const doc = new jsPDF();
    
    this.addHeader(doc, 'ESG Compliance Report');
    
    // Summary statistics
    const avgEnvironmental = metrics.reduce((sum, m) => sum + parseFloat(m.environmentalScore), 0) / metrics.length;
    const avgSocial = metrics.reduce((sum, m) => sum + parseFloat(m.socialScore), 0) / metrics.length;
    const avgGovernance = metrics.reduce((sum, m) => sum + parseFloat(m.governanceScore), 0) / metrics.length;
    const avgOverall = metrics.reduce((sum, m) => sum + parseFloat(m.overallScore), 0) / metrics.length;
    
    doc.setFontSize(12);
    doc.text('Executive Summary', 20, 75);
    
    autoTable(doc, {
      startY: 85,
      head: [['ESG Category', 'Average Score', 'Rating']],
      body: [
        ['Environmental', avgEnvironmental.toFixed(2), this.getESGRating(avgEnvironmental)],
        ['Social', avgSocial.toFixed(2), this.getESGRating(avgSocial)],
        ['Governance', avgGovernance.toFixed(2), this.getESGRating(avgGovernance)],
        ['Overall', avgOverall.toFixed(2), this.getESGRating(avgOverall)]
      ],
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229] },
      styles: { fontSize: 10 }
    });
    
    // Detailed metrics by factory
    const detailStartY = (doc as any).lastAutoTable?.finalY + 20 || 140;
    doc.setFontSize(12);
    doc.text('Factory-Level ESG Metrics', 20, detailStartY);
    
    const tableData = metrics.map(metric => [
      metric.factoryId,
      metric.environmentalScore,
      metric.socialScore,
      metric.governanceScore,
      metric.overallScore,
      new Date(metric.assessmentDate).toLocaleDateString(),
      metric.certifications ? metric.certifications.join(', ') : 'None'
    ]);
    
    autoTable(doc, {
      startY: detailStartY + 10,
      head: [['Factory ID', 'Environmental', 'Social', 'Governance', 'Overall', 'Assessment Date', 'Certifications']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229] },
      styles: { fontSize: 8 },
      columnStyles: {
        1: { halign: 'center' },
        2: { halign: 'center' },
        3: { halign: 'center' },
        4: { halign: 'center' },
        5: { halign: 'center' }
      }
    });
    
    this.addFooter(doc);
    
    return new Blob([doc.output('blob')], { type: 'application/pdf' });
  }

  static async generateFactoryPerformanceReport(flags: FactoryFlag[]): Promise<Blob> {
    const doc = new jsPDF();
    
    this.addHeader(doc, 'Factory Performance Report');
    
    // Performance summary
    const totalFlags = flags.length;
    const openFlags = flags.filter(f => f.status === 'open').length;
    const resolvedFlags = flags.filter(f => f.status === 'resolved').length;
    const criticalFlags = flags.filter(f => f.severity === 'critical').length;
    
    doc.setFontSize(12);
    doc.text('Performance Overview', 20, 75);
    
    autoTable(doc, {
      startY: 85,
      head: [['Metric', 'Count', 'Percentage']],
      body: [
        ['Total Issues', totalFlags.toString(), '100%'],
        ['Open Issues', openFlags.toString(), `${((openFlags/totalFlags)*100).toFixed(1)}%`],
        ['Resolved Issues', resolvedFlags.toString(), `${((resolvedFlags/totalFlags)*100).toFixed(1)}%`],
        ['Critical Issues', criticalFlags.toString(), `${((criticalFlags/totalFlags)*100).toFixed(1)}%`]
      ],
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229] },
      styles: { fontSize: 10 }
    });
    
    // Issues by factory
    const factoryGroups = flags.reduce((acc, flag) => {
      if (!acc[flag.factoryId]) acc[flag.factoryId] = [];
      acc[flag.factoryId].push(flag);
      return acc;
    }, {} as Record<string, FactoryFlag[]>);
    
    const factorySummary = Object.entries(factoryGroups).map(([factoryId, factoryFlags]) => [
      factoryId,
      factoryFlags.length.toString(),
      factoryFlags.filter(f => f.status === 'open').length.toString(),
      factoryFlags.filter(f => f.severity === 'critical').length.toString(),
      factoryFlags.filter(f => f.status === 'resolved').length.toString()
    ]);
    
    const summaryStartY = (doc as any).lastAutoTable?.finalY + 20 || 140;
    doc.setFontSize(12);
    doc.text('Issues by Factory', 20, summaryStartY);
    
    autoTable(doc, {
      startY: summaryStartY + 10,
      head: [['Factory ID', 'Total Issues', 'Open', 'Critical', 'Resolved']],
      body: factorySummary,
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229] },
      styles: { fontSize: 9 },
      columnStyles: {
        1: { halign: 'center' },
        2: { halign: 'center' },
        3: { halign: 'center' },
        4: { halign: 'center' }
      }
    });
    
    this.addFooter(doc);
    
    return new Blob([doc.output('blob')], { type: 'application/pdf' });
  }

  static async generateBoardAnalyticsPDF(data: any): Promise<Blob> {
    const doc = new jsPDF();
    
    this.addHeader(doc, 'Board Analytics Report');
    
    // Key metrics
    doc.setFontSize(12);
    doc.text('Key Performance Indicators', 20, 75);
    
    const kpiData = [
      ['Total Transaction Volume', 'KES 45.2M', '+15.3% vs last month'],
      ['Active Factories', '127', '+3 new this month'],
      ['ESG Compliance Rate', '94.2%', '+2.1% improvement'],
      ['Average Auction Price', 'KES 420/kg', '+8.5% vs last month'],
      ['Processing Efficiency', '96.8%', '+1.2% improvement']
    ];
    
    autoTable(doc, {
      startY: 85,
      head: [['Metric', 'Current Value', 'Trend']],
      body: kpiData,
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229] },
      styles: { fontSize: 10 }
    });
    
    // Financial summary
    const financialStartY = (doc as any).lastAutoTable?.finalY + 20 || 140;
    doc.setFontSize(12);
    doc.text('Financial Performance', 20, financialStartY);
    
    const financialData = [
      ['Gross Merchandise Value', 'KES 45,230,000'],
      ['Platform Revenue', 'KES 2,261,500'],
      ['Pending Settlements', 'KES 3,450,000'],
      ['Credit Facilities Utilized', 'KES 8,900,000'],
      ['Insurance Coverage', 'KES 125,000,000']
    ];
    
    autoTable(doc, {
      startY: financialStartY + 10,
      head: [['Financial Metric', 'Amount (KES)']],
      body: financialData,
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229] },
      styles: { fontSize: 10 },
      columnStyles: {
        1: { halign: 'right' }
      }
    });
    
    this.addFooter(doc);
    
    return new Blob([doc.output('blob')], { type: 'application/pdf' });
  }

  private static getESGRating(score: number): string {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Good';
    if (score >= 70) return 'Fair';
    if (score >= 60) return 'Poor';
    return 'Critical';
  }

  static downloadPDF(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}