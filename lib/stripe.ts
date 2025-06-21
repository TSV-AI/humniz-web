import Stripe from 'stripe';

let stripe: Stripe | null = null;

export const getStripe = (): Stripe => {
  if (!stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
    }
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-04-10', // Using a stable API version
      typescript: true,
    });
  }
  return stripe;
};

/**
 * Retrieves the Stripe Price ID for a given subscription tier.
 * This function relies on environment variables for the price IDs.
 * e.g., STRIPE_BASIC_PRICE_ID, STRIPE_PRO_PRICE_ID
 * @param tier The subscription tier ('basic', 'pro', 'enterprise').
 * @returns The corresponding Stripe Price ID, or null if not found.
 */
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
