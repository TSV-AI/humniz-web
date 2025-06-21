
export interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
  credits: number;
  subscriptionTier: string;
  subscriptionId?: string;
  billingCycleEnd?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface SubscriptionTier {
  id: string;
  name: string;
  displayName: string;
  credits: number;
  price: number;
  features: string[];
  isActive: boolean;
  stripePriceId?: string | null;
}

export interface TextProcess {
  id: string;
  userId: string;
  originalText: string;
  humanizedText?: string;
  aiDetectionScore?: number;
  detectorResults?: Record<string, number>;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  creditsUsed: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UsageHistory {
  id: string;
  userId: string;
  action: string;
  details?: Record<string, any>;
  creditsChanged?: number;
  timestamp: Date;
}

export interface PaymentSession {
  checkoutUrl: string;
  sessionId: string;
}
