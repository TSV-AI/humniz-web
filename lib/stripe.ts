
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-05-28.basil',
  typescript: true,
});

// Price ID mapping for subscription tiers
export const STRIPE_PRICE_IDS = {
  basic: process.env.STRIPE_BASIC_PRICE_ID!,
  pro: process.env.STRIPE_PRO_PRICE_ID!,
  enterprise: process.env.STRIPE_ENTERPRISE_PRICE_ID!,
} as const;

// Helper function to get price ID by tier
export function getStripePriceId(tier: string): string | null {
  const priceIds: Record<string, string> = STRIPE_PRICE_IDS;
  return priceIds[tier] || null;
}

// Helper function to get tier from price ID
export function getTierFromPriceId(priceId: string): string | null {
  const entries = Object.entries(STRIPE_PRICE_IDS);
  const found = entries.find(([, id]) => id === priceId);
  return found ? found[0] : null;
}
