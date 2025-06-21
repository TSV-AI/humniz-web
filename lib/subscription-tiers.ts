
import { SubscriptionTier } from './types';

export const SUBSCRIPTION_TIERS: Record<string, SubscriptionTier> = {
  free: {
    id: 'free',
    name: 'free',
    displayName: 'Free Trial',
    credits: 10,
    price: 0,
    features: ['10 credits', 'Basic humanization', 'AI detection scoring'],
    isActive: true,
  },
  basic: {
    id: 'basic',
    name: 'basic',
    displayName: 'Basic',
    credits: 100,
    price: 9.99,
    features: ['100 credits/month', 'Advanced humanization', 'AI detection scoring', 'Usage history'],
    isActive: true,
  },
  pro: {
    id: 'pro',
    name: 'pro',
    displayName: 'Pro',
    credits: 500,
    price: 29.99,
    features: ['500 credits/month', 'Premium humanization', 'AI detection scoring', 'Usage history', 'API access'],
    isActive: true,
  },
  enterprise: {
    id: 'enterprise',
    name: 'enterprise',
    displayName: 'Enterprise',
    credits: 2000,
    price: 99.99,
    features: ['2000 credits/month', 'Enterprise humanization', 'AI detection scoring', 'Usage history', 'API access', 'Priority support'],
    isActive: true,
  },
};
