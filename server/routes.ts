import type { Express } from "express";
import { createServer, type Server } from "http";
import { Server as SocketIOServer } from "socket.io";
import { storage } from "./storage";
import { insertBidSchema, insertInstantCashAdvanceSchema, insertFxLockSchema, insertInsurancePolicySchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  // Authentication routes
  app.post("/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Demo authentication - in production use proper password hashing
      const demoUsers = [
        { id: 1, email: "producer@iteaflow.com", password: "demo123", role: "producer", firstName: "Michael", lastName: "Wambugu", username: "michael.wambugu" },
        { id: 2, email: "buyer@iteaflow.com", password: "demo123", role: "buyer", firstName: "Sarah", lastName: "Chen", username: "sarah.chen" },
        { id: 3, email: "board@ktda.com", password: "demo123", role: "ktda_ro", firstName: "David", lastName: "Kimani", username: "david.kimani" },
        { id: 4, email: "admin@iteaflow.com", password: "demo123", role: "ops_admin", firstName: "Admin", lastName: "User", username: "admin.user" }
      ];
      
      const user = demoUsers.find(u => u.email === email && u.password === password);
      
      if (user) {
        const token = `demo_token_${user.id}`;
        res.json({
          token,
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            role: user.role,
            isActive: true,
            emailVerified: true,
            kycStatus: "approved",
            status: "active"
          }
        });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/auth/signup", async (req, res) => {
    try {
      const { email, password, role, legalName, country, kraPin, phone, currency, walletType, bankIban } = req.body;
      
      res.json({
        message: "Registration successful",
        user: {
          id: Math.floor(Math.random() * 1000),
          email,
          role,
          status: "pending",
          emailVerified: false,
          kycStatus: "pending"
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Registration failed" });
    }
  });

  app.post("/auth/forgot", async (req, res) => {
    try {
      const { email } = req.body;
      
      // Simulate sending reset email
      res.json({ message: "Reset email sent" });
    } catch (error) {
      res.status(500).json({ message: "Failed to send reset email" });
    }
  });

  app.get("/auth/me", async (req, res) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (token && token.startsWith('demo_token_')) {
        const userId = parseInt(token.replace('demo_token_', ''));
        const demoUsers = [
          { id: 1, email: "producer@iteaflow.com", role: "producer", firstName: "Michael", lastName: "Wambugu", username: "michael.wambugu" },
          { id: 2, email: "buyer@iteaflow.com", role: "buyer", firstName: "Sarah", lastName: "Chen", username: "sarah.chen" },
          { id: 3, email: "board@ktda.com", role: "ktda_ro", firstName: "David", lastName: "Kimani", username: "david.kimani" },
          { id: 4, email: "admin@iteaflow.com", role: "ops_admin", firstName: "Admin", lastName: "User", username: "admin.user" }
        ];
        
        const user = demoUsers.find(u => u.id === userId);
        if (user) {
          res.json({
            ...user,
            isActive: true,
            emailVerified: true,
            kycStatus: "approved",
            status: "active"
          });
        } else {
          res.status(401).json({ message: "Invalid token" });
        }
      } else {
        res.status(401).json({ message: "No token provided" });
      }
    } catch (error) {
      res.status(500).json({ message: "Authentication check failed" });
    }
  });

  // WebSocket connection handling
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  // Simulate live auction updates
  setInterval(() => {
    io.emit('auctionUpdate', {
      type: 'bid_update',
      data: {
        lotId: 'LOT-3456',
        newBid: {
          amount: (Math.random() * 2 + 4).toFixed(2),
          bidder: 'Anonymous',
          timestamp: new Date()
        }
      }
    });
  }, 15000);

  // Auth endpoints
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      res.json({ 
        user: { 
          id: user.id, 
          username: user.username, 
          role: user.role, 
          workspace: user.workspace,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        } 
      });
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.get("/api/auth/me", async (req, res) => {
    // For demo purposes, return the buyer user
    const user = await storage.getUser(1);
    if (user) {
      res.json({ 
        user: { 
          id: user.id, 
          username: user.username, 
          role: user.role, 
          workspace: user.workspace,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        } 
      });
    } else {
      res.status(401).json({ message: "Not authenticated" });
    }
  });

  // Lots endpoints
  app.get("/api/lots", async (req, res) => {
    try {
      const lots = await storage.getLots();
      res.json(lots);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch lots" });
    }
  });

  app.get("/api/lots/:lotId", async (req, res) => {
    try {
      const lot = await storage.getLot(req.params.lotId);
      if (!lot) {
        return res.status(404).json({ message: "Lot not found" });
      }
      res.json(lot);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch lot" });
    }
  });

  // Bids endpoints
  app.post("/api/lots/:lotId/bid", async (req, res) => {
    try {
      const bidData = insertBidSchema.parse({
        lotId: req.params.lotId,
        bidderId: 1, // Demo user ID
        ...req.body
      });
      
      const bid = await storage.createBid(bidData);
      
      // Create activity
      await storage.createActivity({
        userId: bidData.bidderId,
        type: "bid_placed",
        description: `Placed bid of $${bidData.bidAmount} on lot ${bidData.lotId}`,
        metadata: { lotId: bidData.lotId, amount: bidData.bidAmount }
      });

      // Emit WebSocket event
      io.emit('bidPlaced', {
        lotId: req.params.lotId,
        bid: bid
      });
      
      res.json(bid);
    } catch (error) {
      res.status(400).json({ message: "Failed to place bid" });
    }
  });

  app.get("/api/lots/:lotId/bids", async (req, res) => {
    try {
      const bids = await storage.getBidsForLot(req.params.lotId);
      res.json(bids);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bids" });
    }
  });

  // Invoices endpoints
  app.get("/api/invoices", async (req, res) => {
    try {
      const invoices = await storage.getInvoicesForUser(1); // Demo user ID
      res.json(invoices);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch invoices" });
    }
  });

  // Stripe payment intent creation
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { amount, invoiceId } = req.body;
      
      // In a real implementation, this would create a Stripe payment intent
      // For now, return a mock client secret for demonstration
      const clientSecret = `pi_mock_${Date.now()}_secret`;
      
      res.json({ 
        clientSecret,
        amount,
        invoiceId
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to create payment intent" });
    }
  });

  app.post("/api/invoices/:invoiceId/pay", async (req, res) => {
    try {
      const { method } = req.body;
      
      if (method === "stripe") {
        // Handle Stripe payment - set to clearing first
        await storage.updateInvoiceStatus(req.params.invoiceId, "in_clearing", method);
        
        // Simulate Stripe processing delay
        setTimeout(async () => {
          await storage.updateInvoiceStatus(req.params.invoiceId, "paid", method);
          
          // Create activity for successful payment
          await storage.createActivity({
            userId: 1,
            type: "invoice_paid",
            description: `Invoice ${req.params.invoiceId} paid via credit card`,
            metadata: { invoiceNumber: req.params.invoiceId, method: "stripe" }
          });

          // Emit WebSocket event
          io.emit('invoicePaid', {
            invoiceId: req.params.invoiceId,
            method: "stripe"
          });
        }, 3000); // 3 second processing delay
        
        res.json({ message: "Payment processing initiated" });
      } else {
        // Handle wallet and wire payments immediately
        await storage.updateInvoiceStatus(req.params.invoiceId, "paid", method);
        
        // Create activity
        await storage.createActivity({
          userId: 1,
          type: "invoice_paid",
          description: `Invoice ${req.params.invoiceId} paid via ${method}`,
          metadata: { invoiceNumber: req.params.invoiceId, method }
        });

        // Emit WebSocket event
        io.emit('invoicePaid', {
          invoiceId: req.params.invoiceId,
          method: method
        });
        
        res.json({ message: "Payment processed successfully" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to process payment" });
    }
  });

  // Wallets endpoints
  app.get("/api/wallets", async (req, res) => {
    try {
      const wallets = await storage.getWalletsForUser(1); // Demo user ID
      res.json(wallets);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch wallets" });
    }
  });

  // Instant Cash endpoints
  app.post("/api/instant-cash", async (req, res) => {
    try {
      const advanceData = insertInstantCashAdvanceSchema.parse({
        producerId: 1, // Demo user ID
        aprRate: "12.00",
        status: "active",
        ...req.body
      });
      
      const advance = await storage.createInstantCashAdvance(advanceData);
      
      // Create activity
      await storage.createActivity({
        userId: advanceData.producerId,
        type: "cash_advance",
        description: `Instant cash advance of $${advanceData.advanceAmount} approved`,
        metadata: { lotId: advanceData.lotId, amount: advanceData.advanceAmount }
      });
      
      res.json(advance);
    } catch (error) {
      res.status(400).json({ message: "Failed to process cash advance" });
    }
  });

  // FX Lock endpoints
  app.post("/api/fx-lock", async (req, res) => {
    try {
      const fxLockData = insertFxLockSchema.parse({
        userId: 1, // Demo user ID
        status: "active",
        ...req.body
      });
      
      const fxLock = await storage.createFxLock(fxLockData);
      
      // Create activity
      await storage.createActivity({
        userId: fxLockData.userId,
        type: "fx_locked",
        description: `FX rate locked at ${fxLockData.lockedRate} KES/USD`,
        metadata: { rate: fxLockData.lockedRate, amount: fxLockData.amountUSD }
      });
      
      res.json(fxLock);
    } catch (error) {
      res.status(400).json({ message: "Failed to lock FX rate" });
    }
  });

  app.get("/api/fx-locks", async (req, res) => {
    try {
      const fxLocks = await storage.getFxLocksForUser(1); // Demo user ID
      res.json(fxLocks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch FX locks" });
    }
  });

  // Insurance endpoints
  app.post("/api/insurance/quote", async (req, res) => {
    try {
      const { type, coverageAmount } = req.body;
      
      // Calculate premium based on type
      let premiumRate = 0.025; // 2.5% default
      if (type === "quality") premiumRate = 0.018;
      if (type === "marine") premiumRate = 0.005;
      
      const premiumAmount = (parseFloat(coverageAmount) * premiumRate).toFixed(2);
      
      res.json({
        type,
        coverageAmount,
        premiumAmount,
        premiumRate: (premiumRate * 100).toFixed(1) + "%",
        validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      });
    } catch (error) {
      res.status(400).json({ message: "Failed to generate quote" });
    }
  });

  app.post("/api/insurance/buy", async (req, res) => {
    try {
      const policyData = insertInsurancePolicySchema.parse({
        userId: 1, // Demo user ID
        policyNumber: `POL-${Date.now()}`,
        status: "bound",
        ...req.body
      });
      
      const policy = await storage.createInsurancePolicy(policyData);
      
      // Create activity
      await storage.createActivity({
        userId: policyData.userId,
        type: "insurance_purchased",
        description: `${policyData.type} insurance policy purchased`,
        metadata: { policyNumber: policyData.policyNumber, type: policyData.type }
      });
      
      res.json(policy);
    } catch (error) {
      res.status(400).json({ message: "Failed to purchase insurance" });
    }
  });

  app.get("/api/insurance/policies", async (req, res) => {
    try {
      const policies = await storage.getInsurancePoliciesForUser(1); // Demo user ID
      res.json(policies);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch insurance policies" });
    }
  });

  // Wire Transfer endpoints
  app.get("/api/wire-transfers/counts", async (req, res) => {
    try {
      const counts = await storage.getWireTransferCounts();
      res.json(counts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch wire transfer counts" });
    }
  });

  // Activities endpoints
  app.get("/api/activities", async (req, res) => {
    try {
      const activities = await storage.getActivitiesForUser(1); // Demo user ID
      res.json(activities.slice(0, 10)); // Return last 10 activities
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  // Notification endpoints
  app.get("/api/notifications", async (req, res) => {
    try {
      const notifications = await storage.getNotificationsForUser(1); // Demo user ID
      res.json(notifications);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/notifications/:id/read", async (req, res) => {
    try {
      await storage.markNotificationAsRead(parseInt(req.params.id));
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/notifications/mark-all-read", async (req, res) => {
    try {
      await storage.markAllNotificationsAsRead(1); // Demo user ID
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ESG Metrics endpoints
  app.get("/api/esg-metrics", async (req, res) => {
    try {
      const metrics = await storage.getEsgMetrics();
      res.json(metrics);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/esg-metrics/:factoryId", async (req, res) => {
    try {
      const metrics = storage.getEsgMetricsByFactory ? await storage.getEsgMetricsByFactory(req.params.factoryId) : [];
      res.json(metrics);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Factory Flags endpoints
  app.get("/api/factory-flags", async (req, res) => {
    try {
      const flags = storage.getFactoryFlags ? await storage.getFactoryFlags() : [];
      res.json(flags);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Lender Pools endpoints
  app.get("/api/lender-pools", async (req, res) => {
    try {
      const pools = storage.getLenderPools ? await storage.getLenderPools() : [];
      res.json(pools);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Payment Methods endpoints
  app.get("/api/payment-methods", async (req, res) => {
    try {
      const methods = await storage.getPaymentMethodsForUser(1); // Demo user ID
      res.json(methods);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Dashboard KPIs endpoints
  app.get("/api/dashboard/kpis", async (req, res) => {
    try {
      const kpis = {
        activeBids: { value: 24, change: "+12.5%" },
        portfolioValue: { value: "$847,230", change: "+8.2%" },
        pendingInvoices: { value: 7, change: "2 due today" },
        creditAvailable: { value: "$425K", change: "85% utilization" }
      };
      res.json(kpis);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch KPIs" });
    }
  });

  app.get("/api/dashboard/grade-data", async (req, res) => {
    try {
      const gradeData = [
        { name: "PEKOE", count: 45, percentage: 75 },
        { name: "BOPF", count: 32, percentage: 53 },
        { name: "BROKEN", count: 28, percentage: 47 },
        { name: "FANNINGS", count: 19, percentage: 32 },
        { name: "DUST", count: 12, percentage: 20 }
      ];
      res.json(gradeData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch grade data" });
    }
  });

  // Current FX rate endpoint
  app.get("/api/fx-rate", async (req, res) => {
    try {
      // Simulate live FX rate with small variations
      const baseRate = 130.45;
      const variation = (Math.random() - 0.5) * 0.5;
      const currentRate = (baseRate + variation).toFixed(4);
      
      res.json({
        rate: currentRate,
        currency: "KES/USD",
        timestamp: new Date(),
        change24h: "+0.12%"
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch FX rate" });
    }
  });

  // Auto-listing endpoints
  app.get("/api/auto-listing/rules", async (req: any, res) => {
    try {
      // Use session-based user ID for demonstration
      const userId = req.session?.passport?.user || 2; // Default to producer user
      const rules = await storage.getAutoListingRulesForUser(userId);
      res.json(rules);
    } catch (error: any) {
      console.error("Auto-listing rules error:", error);
      res.status(500).json({ message: "Error fetching auto-listing rules: " + error.message });
    }
  });

  app.post("/api/auto-listing/rules", async (req: any, res) => {
    try {
      const userId = req.session?.passport?.user || 2;
      const rule = await storage.createAutoListingRule({
        ...req.body,
        userId: userId
      });
      res.json(rule);
    } catch (error: any) {
      console.error("Auto-listing create error:", error);
      res.status(500).json({ message: "Error creating auto-listing rule: " + error.message });
    }
  });

  app.patch("/api/auto-listing/rules/:id", async (req: any, res) => {
    try {
      await storage.updateAutoListingRule(req.params.id, req.body);
      res.json({ success: true });
    } catch (error: any) {
      console.error("Auto-listing update error:", error);
      res.status(500).json({ message: "Error updating auto-listing rule: " + error.message });
    }
  });

  return httpServer;
}
