
'use client';

import { loadStripe } from '@stripe/stripe-js';

// Make sure to call loadStripe outside of a component's render to avoid
// recreating the Stripe object on every render.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export { stripePromise };

export interface CreateCheckoutSessionParams {
  tier: string;
}

export interface CheckoutSessionResponse {
  checkoutUrl: string;
  sessionId: string;
}

export async function createCheckoutSession(params: CreateCheckoutSessionParams): Promise<CheckoutSessionResponse> {
  const response = await fetch('/api/stripe/create-checkout-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create checkout session');
  }

  return response.json();
}

export async function redirectToCheckout(tier: string): Promise<void> {
  try {
    const { checkoutUrl } = await createCheckoutSession({ tier });
    
    // Redirect to Stripe Checkout
    window.location.href = checkoutUrl;
  } catch (error) {
    console.error('Error redirecting to checkout:', error);
    throw error;
  }
}
