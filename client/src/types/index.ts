export interface User {
  id: number;
  username: string;
  role: 'producer' | 'buyer' | 'ktda_ro' | 'ops_admin';
  workspace: 'Producer' | 'Buyer' | 'KTDA Board' | 'Operations';
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
}

export interface AuctionTimer {
  hours: number;
  minutes: number;
  seconds: number;
}

export interface KPICard {
  label: string;
  value: string | number;
  change: string;
  icon: string;
  color: string;
}

export interface GradeData {
  name: string;
  count: number;
  percentage: number;
}

export interface Activity {
  id: number;
  type: string;
  description: string;
  createdAt: string;
  metadata?: any;
}

export interface StatusCounts {
  unmatched: number;
  review: number;
  processing: number;
  paid: number;
}

export interface WireTransferCounts {
  inClearing: number;
  cleared: number;
  overdue: number;
}

export interface FXRate {
  rate: string;
  currency: string;
  timestamp: string;
  change24h: string;
}

export interface BidData {
  lotId: string;
  bidAmount: string;
  fxRate?: string;
  lockFx: boolean;
}

export interface InstantCashData {
  lotId: string;
  ltvPercentage: number;
  advanceAmount: string;
}

export interface FXLockData {
  amountUSD: string;
  lockedRate: string;
  duration: string;
  expiresAt: string;
}

export interface InsuranceQuote {
  type: string;
  coverageAmount: string;
  premiumAmount: string;
  premiumRate: string;
  validUntil: string;
}
