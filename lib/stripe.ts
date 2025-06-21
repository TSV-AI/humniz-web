import Stripe from 'stripe';

let stripe: Stripe | null = null;

export const getStripe = (): Stripe => {
  if (!stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
    }
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-04-10',
      typescript: true,
    });
  }
  return stripe;
};

export const getStripePriceId = (tier: string): string | null => {
  switch (tier) {
    case 'basic':
      return process.env.STRIPE_BASIC_PRICE_ID || null;
    case 'pro':
      return process.env.STRIPE_PRO_PRICE_ID || null;
    case 'enterprise':
      return process.env.STRIPE_ENTERPRISE_PRICE_ID || null;
    default:
      return null;
  }
};

export const getTierFromPriceId = (priceId: string): string | null => {
  if (priceId === process.env.STRIPE_BASIC_PRICE_ID) {
    return 'basic';
  }
  if (priceId === process.env.STRIPE_PRO_PRICE_ID) {
    return 'pro';
  }
  if (priceId === process.env.STRIPE_ENTERPRISE_PRICE_ID) {
    return 'enterprise';
  }
  return null;
};
