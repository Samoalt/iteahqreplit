import {
  users, lots, bids, invoices, wallets, instantCashAdvances,
  fxLocks, insurancePolicies, wireTransfers, activities, notifications,
  lenderPools, esgMetrics, factoryFlags, paymentMethods, otpSessions,
  type User, type InsertUser, type Lot, type InsertLot,
  type Bid, type InsertBid, type Invoice, type InsertInvoice,
  type Wallet, type InsertWallet, type InstantCashAdvance, type InsertInstantCashAdvance,
  type FxLock, type InsertFxLock, type InsurancePolicy, type InsertInsurancePolicy,
  type WireTransfer, type InsertWireTransfer, type Activity, type InsertActivity,
  type Notification, type InsertNotification, type LenderPool, type InsertLenderPool,
  type EsgMetric, type InsertEsgMetric, type FactoryFlag, type InsertFactoryFlag,
  type PaymentMethod, type InsertPaymentMethod, type OtpSession, type InsertOtpSession
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Lots
  getLots(): Promise<Lot[]>;
  getLot(id: string): Promise<Lot | undefined>;
  createLot(lot: InsertLot): Promise<Lot>;
  updateLotStatus(lotId: string, status: string): Promise<void>;
  
  // Bids
  getBidsForLot(lotId: string): Promise<Bid[]>;
  createBid(bid: InsertBid): Promise<Bid>;
  getWinningBid(lotId: string): Promise<Bid | undefined>;
  
  // Invoices
  getInvoicesForUser(userId: number): Promise<Invoice[]>;
  createInvoice(invoice: InsertInvoice): Promise<Invoice>;
  updateInvoiceStatus(invoiceId: string, status: string, paymentMethod?: string): Promise<void>;
  
  // Wallets
  getWalletsForUser(userId: number): Promise<Wallet[]>;
  getWallet(userId: number, currency: string): Promise<Wallet | undefined>;
  updateWalletBalance(userId: number, currency: string, amount: string): Promise<void>;
  
  // Instant Cash Advances
  createInstantCashAdvance(advance: InsertInstantCashAdvance): Promise<InstantCashAdvance>;
  getInstantCashAdvancesForUser(userId: number): Promise<InstantCashAdvance[]>;
  
  // FX Locks
  createFxLock(fxLock: InsertFxLock): Promise<FxLock>;
  getFxLocksForUser(userId: number): Promise<FxLock[]>;
  
  // Insurance Policies
  createInsurancePolicy(policy: InsertInsurancePolicy): Promise<InsurancePolicy>;
  getInsurancePoliciesForUser(userId: number): Promise<InsurancePolicy[]>;
  
  // Wire Transfers
  createWireTransfer(transfer: InsertWireTransfer): Promise<WireTransfer>;
  getWireTransfersForUser(userId: number): Promise<WireTransfer[]>;
  getWireTransferCounts(): Promise<{ inClearing: number; cleared: number; overdue: number }>;
  
  // Activities
  createActivity(activity: InsertActivity): Promise<Activity>;
  getActivitiesForUser(userId: number): Promise<Activity[]>;

  // Notifications
  getNotificationsForUser(userId: number): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(notificationId: number): Promise<void>;
  markAllNotificationsAsRead(userId: number): Promise<void>;

  // Lender Pools
  getLenderPools(): Promise<LenderPool[]>;
  createLenderPool(pool: InsertLenderPool): Promise<LenderPool>;

  // ESG Metrics
  getEsgMetrics(): Promise<EsgMetric[]>;
  getEsgMetricsByFactory(factoryId: string): Promise<EsgMetric[]>;
  createEsgMetric(metric: InsertEsgMetric): Promise<EsgMetric>;

  // Factory Flags
  getFactoryFlags(): Promise<FactoryFlag[]>;
  createFactoryFlag(flag: InsertFactoryFlag): Promise<FactoryFlag>;
  updateFactoryFlagStatus(flagId: number, status: string): Promise<void>;

  // Payment Methods
  getPaymentMethodsForUser(userId: number): Promise<PaymentMethod[]>;
  createPaymentMethod(method: InsertPaymentMethod): Promise<PaymentMethod>;

  // OTP Sessions
  createOtpSession(session: InsertOtpSession): Promise<OtpSession>;
  verifyOtpSession(sessionId: string, otpCode: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getLots(): Promise<Lot[]> {
    return await db.select().from(lots);
  }

  async getLot(lotId: string): Promise<Lot | undefined> {
    const [lot] = await db.select().from(lots).where(eq(lots.lotId, lotId));
    return lot || undefined;
  }

  async createLot(insertLot: InsertLot): Promise<Lot> {
    const [lot] = await db
      .insert(lots)
      .values(insertLot)
      .returning();
    return lot;
  }

  async updateLotStatus(lotId: string, status: string): Promise<void> {
    await db
      .update(lots)
      .set({ status })
      .where(eq(lots.lotId, lotId));
  }

  async getBidsForLot(lotId: string): Promise<Bid[]> {
    return await db.select().from(bids).where(eq(bids.lotId, lotId));
  }

  async createBid(insertBid: InsertBid): Promise<Bid> {
    const [bid] = await db
      .insert(bids)
      .values(insertBid)
      .returning();
    return bid;
  }

  async getWinningBid(lotId: string): Promise<Bid | undefined> {
    const [bid] = await db
      .select()
      .from(bids)
      .where(eq(bids.lotId, lotId))
      .orderBy(bids.bidAmount)
      .limit(1);
    return bid || undefined;
  }

  async getInvoicesForUser(userId: number): Promise<Invoice[]> {
    return await db.select().from(invoices).where(eq(invoices.buyerId, userId));
  }

  async createInvoice(insertInvoice: InsertInvoice): Promise<Invoice> {
    const [invoice] = await db
      .insert(invoices)
      .values(insertInvoice)
      .returning();
    return invoice;
  }

  async updateInvoiceStatus(invoiceNumber: string, status: string, paymentMethod?: string): Promise<void> {
    await db
      .update(invoices)
      .set({ 
        status, 
        paymentMethod: paymentMethod || null,
        paidAt: status === "paid" ? new Date() : null
      })
      .where(eq(invoices.invoiceNumber, invoiceNumber));
  }

  async getWalletsForUser(userId: number): Promise<Wallet[]> {
    return await db.select().from(wallets).where(eq(wallets.userId, userId));
  }

  async getWallet(userId: number, currency: string): Promise<Wallet | undefined> {
    const [wallet] = await db
      .select()
      .from(wallets)
      .where(and(eq(wallets.userId, userId), eq(wallets.currency, currency)));
    return wallet || undefined;
  }

  async updateWalletBalance(userId: number, currency: string, amount: string): Promise<void> {
    await db
      .update(wallets)
      .set({ balance: amount, updatedAt: new Date() })
      .where(and(eq(wallets.userId, userId), eq(wallets.currency, currency)));
  }

  async createInstantCashAdvance(insertAdvance: InsertInstantCashAdvance): Promise<InstantCashAdvance> {
    const [advance] = await db
      .insert(instantCashAdvances)
      .values(insertAdvance)
      .returning();
    return advance;
  }

  async getInstantCashAdvancesForUser(userId: number): Promise<InstantCashAdvance[]> {
    return await db.select().from(instantCashAdvances).where(eq(instantCashAdvances.producerId, userId));
  }

  async createFxLock(insertFxLock: InsertFxLock): Promise<FxLock> {
    const [fxLock] = await db
      .insert(fxLocks)
      .values(insertFxLock)
      .returning();
    return fxLock;
  }

  async getFxLocksForUser(userId: number): Promise<FxLock[]> {
    return await db.select().from(fxLocks).where(eq(fxLocks.userId, userId));
  }

  async createInsurancePolicy(insertPolicy: InsertInsurancePolicy): Promise<InsurancePolicy> {
    const [policy] = await db
      .insert(insurancePolicies)
      .values(insertPolicy)
      .returning();
    return policy;
  }

  async getInsurancePoliciesForUser(userId: number): Promise<InsurancePolicy[]> {
    return await db.select().from(insurancePolicies).where(eq(insurancePolicies.userId, userId));
  }

  async createWireTransfer(insertTransfer: InsertWireTransfer): Promise<WireTransfer> {
    const [transfer] = await db
      .insert(wireTransfers)
      .values(insertTransfer)
      .returning();
    return transfer;
  }

  async getWireTransfersForUser(userId: number): Promise<WireTransfer[]> {
    return await db.select().from(wireTransfers).where(eq(wireTransfers.userId, userId));
  }

  async getWireTransferCounts(): Promise<{ inClearing: number; cleared: number; overdue: number }> {
    const transfers = await db.select().from(wireTransfers);
    return {
      inClearing: transfers.filter(t => t.status === "in_clearing").length,
      cleared: transfers.filter(t => t.status === "cleared").length,
      overdue: transfers.filter(t => t.status === "overdue").length
    };
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const [activity] = await db
      .insert(activities)
      .values(insertActivity)
      .returning();
    return activity;
  }

  async getActivitiesForUser(userId: number): Promise<Activity[]> {
    return await db.select().from(activities).where(eq(activities.userId, userId));
  }

  // Notifications
  async getNotificationsForUser(userId: number): Promise<Notification[]> {
    return await db.select().from(notifications).where(eq(notifications.userId, userId)).orderBy(notifications.createdAt);
  }

  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const [notification] = await db
      .insert(notifications)
      .values(insertNotification)
      .returning();
    return notification;
  }

  async markNotificationAsRead(notificationId: number): Promise<void> {
    await db
      .update(notifications)
      .set({ read: true })
      .where(eq(notifications.id, notificationId));
  }

  async markAllNotificationsAsRead(userId: number): Promise<void> {
    await db
      .update(notifications)
      .set({ read: true })
      .where(eq(notifications.userId, userId));
  }

  // Lender Pools
  async getLenderPools(): Promise<LenderPool[]> {
    return await db.select().from(lenderPools);
  }

  async createLenderPool(insertPool: InsertLenderPool): Promise<LenderPool> {
    const [pool] = await db
      .insert(lenderPools)
      .values(insertPool)
      .returning();
    return pool;
  }

  // ESG Metrics
  async getEsgMetrics(): Promise<EsgMetric[]> {
    return await db.select().from(esgMetrics);
  }

  async getEsgMetricsByFactory(factoryId: string): Promise<EsgMetric[]> {
    return await db.select().from(esgMetrics).where(eq(esgMetrics.factoryId, factoryId));
  }

  async createEsgMetric(insertMetric: InsertEsgMetric): Promise<EsgMetric> {
    const [metric] = await db
      .insert(esgMetrics)
      .values(insertMetric)
      .returning();
    return metric;
  }

  // Factory Flags
  async getFactoryFlags(): Promise<FactoryFlag[]> {
    return await db.select().from(factoryFlags);
  }

  async createFactoryFlag(insertFlag: InsertFactoryFlag): Promise<FactoryFlag> {
    const [flag] = await db
      .insert(factoryFlags)
      .values(insertFlag)
      .returning();
    return flag;
  }

  async updateFactoryFlagStatus(flagId: number, status: string): Promise<void> {
    await db
      .update(factoryFlags)
      .set({ status })
      .where(eq(factoryFlags.id, flagId));
  }

  // Payment Methods
  async getPaymentMethodsForUser(userId: number): Promise<PaymentMethod[]> {
    return await db.select().from(paymentMethods).where(eq(paymentMethods.userId, userId));
  }

  async createPaymentMethod(insertMethod: InsertPaymentMethod): Promise<PaymentMethod> {
    const [method] = await db
      .insert(paymentMethods)
      .values(insertMethod)
      .returning();
    return method;
  }

  // OTP Sessions
  async createOtpSession(insertSession: InsertOtpSession): Promise<OtpSession> {
    const [session] = await db
      .insert(otpSessions)
      .values(insertSession)
      .returning();
    return session;
  }

  async verifyOtpSession(sessionId: string, otpCode: string): Promise<boolean> {
    const [session] = await db
      .select()
      .from(otpSessions)
      .where(and(eq(otpSessions.sessionId, sessionId), eq(otpSessions.otpCode, otpCode)));
    
    if (!session) return false;
    if (session.verified) return false;
    if (session.expiresAt < new Date()) return false;
    if (session.attempts >= 3) return false;

    await db
      .update(otpSessions)
      .set({ verified: true })
      .where(eq(otpSessions.id, session.id));

    return true;
  }
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private lots: Map<string, Lot> = new Map();
  private bids: Map<number, Bid> = new Map();
  private invoices: Map<string, Invoice> = new Map();
  private wallets: Map<string, Wallet> = new Map(); // key: userId_currency
  private instantCashAdvances: Map<number, InstantCashAdvance> = new Map();
  private fxLocks: Map<number, FxLock> = new Map();
  private insurancePolicies: Map<string, InsurancePolicy> = new Map();
  private wireTransfers: Map<number, WireTransfer> = new Map();
  private activities: Map<number, Activity> = new Map();
  
  private currentUserId = 1;
  private currentBidId = 1;
  private currentAdvanceId = 1;
  private currentFxLockId = 1;
  private currentTransferId = 1;
  private currentActivityId = 1;

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Create demo users
    const demoUsers = [
      {
        username: "sarah.chen",
        password: "password123",
        role: "buyer",
        workspace: "Buyer",
        firstName: "Sarah",
        lastName: "Chen",
        email: "sarah.chen@buyer.com",
        isActive: true
      },
      {
        username: "john.producer",
        password: "password123",
        role: "producer",
        workspace: "Producer",
        firstName: "John",
        lastName: "Kamau",
        email: "john.kamau@producer.com",
        isActive: true
      },
      {
        username: "board.member",
        password: "password123",
        role: "ktda_ro",
        workspace: "KTDA Board",
        firstName: "Mary",
        lastName: "Wanjiku",
        email: "mary.wanjiku@ktda.com",
        isActive: true
      }
    ];

    demoUsers.forEach(user => {
      const id = this.currentUserId++;
      this.users.set(id, { ...user, id });
      
      // Create wallets for each user
      const kesWallet: Wallet = {
        id: parseInt(`${id}1`),
        userId: id,
        currency: "KES",
        balance: "2847356.00",
        availableBalance: "2847356.00",
        updatedAt: new Date()
      };
      
      const usdWallet: Wallet = {
        id: parseInt(`${id}2`),
        userId: id,
        currency: "USD",
        balance: "21847.00",
        availableBalance: "21847.00",
        updatedAt: new Date()
      };
      
      this.wallets.set(`${id}_KES`, kesWallet);
      this.wallets.set(`${id}_USD`, usdWallet);
    });

    // Create demo lots
    const demoLots = [
      {
        lotId: "LOT-3456",
        saleNo: "SALE-2024-001",
        factory: "Kangaita Tea Factory",
        grade: "PEKOE",
        kg: "2450.00",
        offerPrice: "4.75",
        reservePrice: "4.50",
        qualityStars: 4,
        esgCertified: true,
        status: "live",
        canBid: true,
        canInstantCash: true,
        auctionEndTime: new Date(Date.now() + 3600000) // 1 hour from now
      },
      {
        lotId: "LOT-3457",
        saleNo: "SALE-2024-001",
        factory: "Michimikuru Tea",
        grade: "BOPF",
        kg: "1850.00",
        offerPrice: "4.20",
        reservePrice: "4.00",
        qualityStars: 5,
        esgCertified: true,
        status: "live",
        canBid: true,
        canInstantCash: false,
        auctionEndTime: new Date(Date.now() + 3600000)
      },
      {
        lotId: "LOT-3458",
        saleNo: "SALE-2024-001",
        factory: "Githambo Factory",
        grade: "BROKEN",
        kg: "3200.00",
        offerPrice: "3.95",
        reservePrice: "3.75",
        qualityStars: 3,
        esgCertified: false,
        status: "sold",
        canBid: false,
        canInstantCash: false,
        auctionEndTime: new Date(Date.now() - 3600000) // 1 hour ago
      }
    ];

    demoLots.forEach(lot => {
      this.lots.set(lot.lotId, { ...lot, id: parseInt(lot.lotId.split('-')[1]), createdAt: new Date() });
    });

    // Create demo invoices
    const demoInvoices = [
      {
        invoiceNumber: "INV-8901",
        buyerId: 1,
        lotIds: ["LOT-3456", "LOT-3457"],
        amountUSD: "23475.00",
        status: "pending",
        paymentMethod: null
      },
      {
        invoiceNumber: "INV-8902",
        buyerId: 1,
        lotIds: ["LOT-3458"],
        amountUSD: "12640.00",
        status: "in_clearing",
        paymentMethod: "wire"
      },
      {
        invoiceNumber: "INV-8903",
        buyerId: 1,
        lotIds: ["LOT-3459", "LOT-3460"],
        amountUSD: "18230.00",
        status: "paid",
        paymentMethod: "wallet",
        paidAt: new Date(Date.now() - 86400000) // 1 day ago
      }
    ];

    demoInvoices.forEach(invoice => {
      this.invoices.set(invoice.invoiceNumber, { 
        ...invoice, 
        id: parseInt(invoice.invoiceNumber.split('-')[1]), 
        createdAt: new Date(),
        paidAt: invoice.paidAt || null
      });
    });

    // Create demo activities
    const demoActivities = [
      {
        userId: 1,
        type: "lot_won",
        description: "Won lot #3456 - PEKOE grade",
        metadata: { lotId: "LOT-3456", grade: "PEKOE" }
      },
      {
        userId: 1,
        type: "invoice_paid",
        description: "Invoice #INV-8901 paid via wallet",
        metadata: { invoiceNumber: "INV-8901", method: "wallet" }
      },
      {
        userId: 1,
        type: "bid_rejected",
        description: "Bid rejected - lot #3421",
        metadata: { lotId: "LOT-3421" }
      },
      {
        userId: 1,
        type: "fx_locked",
        description: "FX rate locked at 130.45 KES/USD",
        metadata: { rate: "130.45", amount: "25000" }
      },
      {
        userId: 1,
        type: "credit_increased",
        description: "Credit limit increased to $500K",
        metadata: { newLimit: "500000" }
      }
    ];

    demoActivities.forEach(activity => {
      const id = this.currentActivityId++;
      this.activities.set(id, { ...activity, id, createdAt: new Date(), metadata: activity.metadata || {} });
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id, isActive: insertUser.isActive ?? true };
    this.users.set(id, user);
    return user;
  }

  // Lot methods
  async getLots(): Promise<Lot[]> {
    return Array.from(this.lots.values());
  }

  async getLot(lotId: string): Promise<Lot | undefined> {
    return this.lots.get(lotId);
  }

  async createLot(insertLot: InsertLot): Promise<Lot> {
    const id = parseInt(insertLot.lotId.split('-')[1]);
    const lot: Lot = { 
      ...insertLot, 
      id, 
      createdAt: new Date(),
      status: insertLot.status || "active",
      qualityStars: insertLot.qualityStars || 4,
      esgCertified: insertLot.esgCertified || false,
      canBid: insertLot.canBid !== false,
      canInstantCash: insertLot.canInstantCash !== false,
      auctionEndTime: insertLot.auctionEndTime || null
    };
    this.lots.set(insertLot.lotId, lot);
    return lot;
  }

  async updateLotStatus(lotId: string, status: string): Promise<void> {
    const lot = this.lots.get(lotId);
    if (lot) {
      lot.status = status;
      this.lots.set(lotId, lot);
    }
  }

  // Bid methods
  async getBidsForLot(lotId: string): Promise<Bid[]> {
    return Array.from(this.bids.values()).filter(bid => bid.lotId === lotId);
  }

  async createBid(insertBid: InsertBid): Promise<Bid> {
    const id = this.currentBidId++;
    const bid: Bid = { 
      ...insertBid, 
      id, 
      createdAt: new Date(),
      fxRate: insertBid.fxRate || null,
      lockFx: insertBid.lockFx || false,
      isWinning: insertBid.isWinning || false
    };
    this.bids.set(id, bid);
    return bid;
  }

  async getWinningBid(lotId: string): Promise<Bid | undefined> {
    return Array.from(this.bids.values())
      .filter(bid => bid.lotId === lotId)
      .sort((a, b) => parseFloat(b.bidAmount) - parseFloat(a.bidAmount))[0];
  }

  // Invoice methods
  async getInvoicesForUser(userId: number): Promise<Invoice[]> {
    return Array.from(this.invoices.values()).filter(invoice => invoice.buyerId === userId);
  }

  async createInvoice(insertInvoice: InsertInvoice): Promise<Invoice> {
    const id = parseInt(insertInvoice.invoiceNumber.split('-')[1]);
    const invoice: Invoice = { 
      ...insertInvoice, 
      id, 
      createdAt: new Date(),
      status: insertInvoice.status || "pending",
      paymentMethod: insertInvoice.paymentMethod || null,
      paidAt: insertInvoice.paidAt || null
    };
    this.invoices.set(insertInvoice.invoiceNumber, invoice);
    return invoice;
  }

  async updateInvoiceStatus(invoiceNumber: string, status: string, paymentMethod?: string): Promise<void> {
    const invoice = this.invoices.get(invoiceNumber);
    if (invoice) {
      invoice.status = status;
      if (paymentMethod) invoice.paymentMethod = paymentMethod;
      if (status === "paid") invoice.paidAt = new Date();
      this.invoices.set(invoiceNumber, invoice);
    }
  }

  // Wallet methods
  async getWalletsForUser(userId: number): Promise<Wallet[]> {
    return Array.from(this.wallets.values()).filter(wallet => wallet.userId === userId);
  }

  async getWallet(userId: number, currency: string): Promise<Wallet | undefined> {
    return this.wallets.get(`${userId}_${currency}`);
  }

  async updateWalletBalance(userId: number, currency: string, amount: string): Promise<void> {
    const wallet = this.wallets.get(`${userId}_${currency}`);
    if (wallet) {
      wallet.balance = amount;
      wallet.availableBalance = amount;
      wallet.updatedAt = new Date();
      this.wallets.set(`${userId}_${currency}`, wallet);
    }
  }

  // Instant Cash Advance methods
  async createInstantCashAdvance(insertAdvance: InsertInstantCashAdvance): Promise<InstantCashAdvance> {
    const id = this.currentAdvanceId++;
    const advance: InstantCashAdvance = { 
      ...insertAdvance, 
      id, 
      createdAt: new Date(),
      status: insertAdvance.status || "pending",
      repaidAt: insertAdvance.repaidAt || null
    };
    this.instantCashAdvances.set(id, advance);
    return advance;
  }

  async getInstantCashAdvancesForUser(userId: number): Promise<InstantCashAdvance[]> {
    return Array.from(this.instantCashAdvances.values()).filter(advance => advance.producerId === userId);
  }

  // FX Lock methods
  async createFxLock(insertFxLock: InsertFxLock): Promise<FxLock> {
    const id = this.currentFxLockId++;
    const fxLock: FxLock = { 
      ...insertFxLock, 
      id, 
      createdAt: new Date(),
      status: insertFxLock.status || "active"
    };
    this.fxLocks.set(id, fxLock);
    return fxLock;
  }

  async getFxLocksForUser(userId: number): Promise<FxLock[]> {
    return Array.from(this.fxLocks.values()).filter(lock => lock.userId === userId);
  }

  // Insurance Policy methods
  async createInsurancePolicy(insertPolicy: InsertInsurancePolicy): Promise<InsurancePolicy> {
    const id = parseInt(insertPolicy.policyNumber.split('-')[1]);
    const policy: InsurancePolicy = { 
      ...insertPolicy, 
      id, 
      createdAt: new Date(),
      status: insertPolicy.status || "active"
    };
    this.insurancePolicies.set(insertPolicy.policyNumber, policy);
    return policy;
  }

  async getInsurancePoliciesForUser(userId: number): Promise<InsurancePolicy[]> {
    return Array.from(this.insurancePolicies.values()).filter(policy => policy.userId === userId);
  }

  // Wire Transfer methods
  async createWireTransfer(insertTransfer: InsertWireTransfer): Promise<WireTransfer> {
    const id = this.currentTransferId++;
    const transfer: WireTransfer = { 
      ...insertTransfer, 
      id, 
      createdAt: new Date(),
      status: insertTransfer.status || "pending",
      clearedAt: insertTransfer.clearedAt || null
    };
    this.wireTransfers.set(id, transfer);
    return transfer;
  }

  async getWireTransfersForUser(userId: number): Promise<WireTransfer[]> {
    return Array.from(this.wireTransfers.values()).filter(transfer => transfer.userId === userId);
  }

  async getWireTransferCounts(): Promise<{ inClearing: number; cleared: number; overdue: number }> {
    const transfers = Array.from(this.wireTransfers.values());
    return {
      inClearing: transfers.filter(t => t.status === 'in_clearing').length || 5,
      cleared: transfers.filter(t => t.status === 'cleared').length || 18,
      overdue: transfers.filter(t => t.status === 'overdue').length || 2
    };
  }

  // Activity methods
  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const id = this.currentActivityId++;
    const activity: Activity = { ...insertActivity, id, createdAt: new Date(), metadata: insertActivity.metadata || null };
    this.activities.set(id, activity);
    return activity;
  }

  async getActivitiesForUser(userId: number): Promise<Activity[]> {
    return Array.from(this.activities.values())
      .filter(activity => activity.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // Notification methods (stub implementations for MemStorage)
  async getNotificationsForUser(userId: number): Promise<Notification[]> {
    return [];
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const id = 1;
    const created: Notification = { 
      ...notification, 
      id, 
      createdAt: new Date(),
      metadata: notification.metadata || null,
      priority: notification.priority || "medium",
      read: notification.read || false,
      actionUrl: notification.actionUrl || null
    };
    return created;
  }

  async markNotificationAsRead(notificationId: number): Promise<void> {
    // Stub implementation
  }

  async markAllNotificationsAsRead(userId: number): Promise<void> {
    // Stub implementation
  }

  // Lender Pool methods (stub implementations)
  async getLenderPools(): Promise<LenderPool[]> {
    return [];
  }

  async createLenderPool(pool: InsertLenderPool): Promise<LenderPool> {
    const id = 1;
    const created: LenderPool = { 
      ...pool, 
      id, 
      createdAt: new Date(),
      isActive: pool.isActive !== false,
      description: pool.description || null,
      riskTier: pool.riskTier || "medium"
    };
    return created;
  }

  // ESG Metrics methods (stub implementations)
  async getEsgMetrics(): Promise<EsgMetric[]> {
    return [];
  }

  async getEsgMetricsByFactory(factoryId: string): Promise<EsgMetric[]> {
    return [];
  }

  async createEsgMetric(metric: InsertEsgMetric): Promise<EsgMetric> {
    const id = 1;
    const created: EsgMetric = { 
      ...metric, 
      id, 
      createdAt: new Date(),
      certifications: metric.certifications || null
    };
    return created;
  }

  // Factory Flag methods (stub implementations)
  async getFactoryFlags(): Promise<FactoryFlag[]> {
    return [];
  }

  async createFactoryFlag(flag: InsertFactoryFlag): Promise<FactoryFlag> {
    const id = 1;
    const created: FactoryFlag = { 
      ...flag, 
      id, 
      createdAt: new Date(),
      status: flag.status || "open",
      severity: flag.severity || "medium",
      assignedTo: flag.assignedTo || null,
      resolvedAt: flag.resolvedAt || null
    };
    return created;
  }

  async updateFactoryFlagStatus(flagId: number, status: string): Promise<void> {
    // Stub implementation
  }

  // Payment Method methods (stub implementations)
  async getPaymentMethodsForUser(userId: number): Promise<PaymentMethod[]> {
    return [];
  }

  async createPaymentMethod(method: InsertPaymentMethod): Promise<PaymentMethod> {
    const id = 1;
    const created: PaymentMethod = { 
      ...method, 
      id, 
      createdAt: new Date(),
      isActive: method.isActive !== false,
      provider: method.provider || null,
      accountDetails: method.accountDetails || null,
      isDefault: method.isDefault || false
    };
    return created;
  }

  // OTP Session methods (stub implementations)
  async createOtpSession(session: InsertOtpSession): Promise<OtpSession> {
    const id = 1;
    const created: OtpSession = { 
      ...session, 
      id, 
      createdAt: new Date(),
      verified: session.verified || false,
      attempts: session.attempts || 0
    };
    return created;
  }

  async verifyOtpSession(sessionId: string, otpCode: string): Promise<boolean> {
    return false;
  }
}

export const storage = new MemStorage();
