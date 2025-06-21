
export interface User {
  id: string;
  name?: string;
  email: string;
  credits: number;
  subscriptionTier: string;
  billingCycleEnd?: Date;
}

export interface TextProcess {
  id: string;
  originalText: string;
  humanizedText?: string;
  aiDetectionScore?: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  creditsUsed: number;
  createdAt: Date;
}

export interface SubscriptionTier {
  id: string;
  name: string;
  displayName: string;
  credits: number;
  price: number;
  features: string[];
  isActive: boolean;
}

export interface UsageHistory {
  id: string;
  action: string;
  details?: any;
  creditsChanged?: number;
  timestamp: Date;
}
