
import { Bid, StatusStat } from "@/types/bid"

export const mockBids: Bid[] = [
  // Bid Intake - Most recent entries
  {
    id: "BID-001",
    buyerName: "Global Tea Co.",
    amount: 45000,
    factory: "Kericho Tea Factory",
    status: "bid-intake",
    date: "2024-01-15",
    lotId: "LOT-001",
    quantity: 500,
    grade: "PEKOE",
    pricePerKg: 90,
    broker: "ITEA Limited"
  },
  {
    id: "BID-008",
    buyerName: "African Tea Imports",
    amount: 38000,
    factory: "Meru Tea Estate",
    status: "bid-intake",
    date: "2024-01-14",
    lotId: "LOT-008",
    quantity: 400,
    grade: "FBOP",
    pricePerKg: 95,
    broker: "Kenya Tea Auctioneers"
  },
  {
    id: "BID-012",
    buyerName: "Continental Tea Ltd",
    amount: 29000,
    factory: "Nandi Hills Tea",
    status: "bid-intake",
    date: "2024-01-13",
    lotId: "LOT-012",
    quantity: 320,
    grade: "BOP",
    pricePerKg: 90.6,
    broker: "East Africa Tea Brokers"
  },

  // E-Slip Sent - Recent but progressed
  {
    id: "BID-002",
    buyerName: "Premium Tea Imports",
    amount: 32000,
    factory: "Nandi Hills Tea",
    status: "e-slip-sent",
    date: "2024-01-12",
    lotId: "LOT-002",
    quantity: 400,
    grade: "FBOP",
    pricePerKg: 80,
    broker: "ITEA Limited"
  },
  {
    id: "BID-009",
    buyerName: "Euro Tea Distributors",
    amount: 52000,
    factory: "Kericho Tea Factory",
    status: "e-slip-sent",
    date: "2024-01-11",
    lotId: "LOT-009",
    quantity: 650,
    grade: "PEKOE",
    pricePerKg: 80,
    broker: "Kenya Tea Auctioneers"
  },

  // Payment Matching - Further progressed
  {
    id: "BID-003",
    buyerName: "East African Tea Buyers",
    amount: 28000,
    factory: "Highland Tea Co.",
    status: "payment-matching",
    date: "2024-01-10",
    lotId: "LOT-003",
    quantity: 350,
    grade: "PEKOE",
    pricePerKg: 80,
    broker: "East Africa Tea Brokers"
  },
  {
    id: "BID-010",
    buyerName: "Asia Pacific Tea",
    amount: 41000,
    factory: "Thururu Tea Estate",
    status: "payment-matching",
    date: "2024-01-09",
    lotId: "LOT-010",
    quantity: 480,
    grade: "BOPF",
    pricePerKg: 85.4,
    broker: "ITEA Limited"
  },

  // Split Processing - Mid-workflow
  {
    id: "BID-004",
    buyerName: "Northern Tea Company",
    amount: 35500,
    factory: "Kipkebe Tea Factory",
    status: "split-processing",
    date: "2024-01-08",
    lotId: "LOT-004",
    quantity: 425,
    grade: "FBOP",
    pricePerKg: 83.5,
    broker: "Kenya Tea Auctioneers"
  },
  {
    id: "BID-011",
    buyerName: "International Tea Traders",
    amount: 46000,
    factory: "Meru Tea Estate",
    status: "split-processing",
    date: "2024-01-07",
    lotId: "LOT-011",
    quantity: 575,
    grade: "OP",
    pricePerKg: 80,
    broker: "East Africa Tea Brokers"
  },

  // Payout Approval - Near completion
  {
    id: "BID-005",
    buyerName: "Middle East Tea Co.",
    amount: 42500,
    factory: "Highland Tea Co.",
    status: "payout-approval",
    date: "2024-01-06",
    lotId: "LOT-005",
    quantity: 500,
    grade: "PEKOE",
    pricePerKg: 85,
    broker: "ITEA Limited"
  },
  {
    id: "BID-013",
    buyerName: "Royal Tea Merchants",
    amount: 39000,
    factory: "Kericho Tea Factory",
    status: "payout-approval",
    date: "2024-01-05",
    lotId: "LOT-013",
    quantity: 450,
    grade: "FBOP",
    pricePerKg: 86.7,
    broker: "Kenya Tea Auctioneers"
  },
  {
    id: "BID-016",
    buyerName: "Premium Blends Ltd",
    amount: 33000,
    factory: "Nandi Hills Tea",
    status: "payout-approval",
    date: "2024-01-04",
    lotId: "LOT-016",
    quantity: 380,
    grade: "BOP",
    pricePerKg: 86.8,
    broker: "East Africa Tea Brokers"
  },

  // Tea Release - Completed
  {
    id: "BID-006",
    buyerName: "Global Premium Teas",
    amount: 48000,
    factory: "Thururu Tea Estate",
    status: "tea-release",
    date: "2024-01-03",
    lotId: "LOT-006",
    quantity: 600,
    grade: "PEKOE",
    pricePerKg: 80,
    broker: "ITEA Limited"
  },
  {
    id: "BID-007",
    buyerName: "European Tea Importers",
    amount: 37500,
    factory: "Kipkebe Tea Factory",
    status: "tea-release",
    date: "2024-01-02",
    lotId: "LOT-007",
    quantity: 470,
    grade: "FBOP",
    pricePerKg: 79.8,
    broker: "Kenya Tea Auctioneers"
  },
  {
    id: "BID-014",
    buyerName: "Specialty Tea House",
    amount: 31000,
    factory: "Highland Tea Co.",
    status: "tea-release",
    date: "2024-01-01",
    lotId: "LOT-014",
    quantity: 350,
    grade: "OP",
    pricePerKg: 88.6,
    broker: "East Africa Tea Brokers"
  },
  {
    id: "BID-015",
    buyerName: "Gourmet Tea Selections",
    amount: 44000,
    factory: "Meru Tea Estate",
    status: "tea-release",
    date: "2023-12-30",
    lotId: "LOT-015",
    quantity: 520,
    grade: "PEKOE",
    pricePerKg: 84.6,
    broker: "ITEA Limited"
  }
]

// Updated status stats to match the actual bid counts and realistic values
export const statusStats: StatusStat[] = [
  { stage: "Bid Intake", count: 3, value: 112000, status: "bid-intake", color: "bg-yellow-500" },
  { stage: "E-Slip Sent", count: 2, value: 84000, status: "e-slip-sent", color: "bg-orange-500" },
  { stage: "Payment Matching", count: 2, value: 69000, status: "payment-matching", color: "bg-blue-500" },
  { stage: "Split Processing", count: 2, value: 81500, status: "split-processing", color: "bg-purple-500" },
  { stage: "Payout Approval", count: 3, value: 114500, status: "payout-approval", color: "bg-green-500" },
  { stage: "Tea Release", count: 4, value: 160500, status: "tea-release", color: "bg-emerald-500" },
]
