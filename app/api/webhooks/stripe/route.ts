
import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { stripe, getTierFromPriceId } from '@/lib/stripe';
import { prisma } from '@/lib/db';
import { SUBSCRIPTION_TIERS } from '@/lib/subscription-tiers';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = headers();
    const signature = headersList.get('stripe-signature')!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;
      
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
      
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;
      
      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log('Checkout session completed:', session.id);
  
  const userId = session.metadata?.userId;
  const tier = session.metadata?.tier;
  
  if (!userId || !tier) {
    console.error('Missing metadata in checkout session');
    return;
  }

  try {
    // Update user subscription
    await updateUserSubscription(userId, tier, session.subscription as string);
    
    // Log the subscription change
    await prisma.usageHistory.create({
      data: {
        userId: userId,
        action: 'subscription_change',
        details: { 
          tier: tier,
          sessionId: session.id,
          subscriptionId: typeof session.subscription === 'string' ? session.subscription : session.subscription?.id || null,
        },
        creditsChanged: SUBSCRIPTION_TIERS[tier]?.credits || 0,
      },
    });

    console.log(`User ${userId} subscription updated to ${tier}`);
  } catch (error) {
    console.error('Error handling checkout session completion:', error);
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  console.log('Subscription created:', subscription.id);
  
  const userId = subscription.metadata?.userId;
  const tier = subscription.metadata?.tier;
  
  if (!userId || !tier) {
    // Try to get tier from price ID
    const priceId = subscription.items.data[0]?.price.id;
    const tierFromPrice = priceId ? getTierFromPriceId(priceId) : null;
    
    if (!tierFromPrice) {
      console.error('Cannot determine tier for subscription:', subscription.id);
      return;
    }
  }

  const finalTier = tier || getTierFromPriceId(subscription.items.data[0]?.price.id);
  
  if (userId && finalTier) {
    await updateUserSubscription(userId, finalTier, subscription.id);
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log('Subscription updated:', subscription.id);
  
  const userId = subscription.metadata?.userId;
  if (!userId) return;

  // Get tier from price ID
  const priceId = subscription.items.data[0]?.price.id;
  const tier = priceId ? getTierFromPriceId(priceId) : null;
  
  if (tier) {
    await updateUserSubscription(userId, tier, subscription.id);
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('Subscription deleted:', subscription.id);
  
  try {
    // Find user by subscription ID and downgrade to free tier
    const user = await prisma.user.findFirst({
      where: { subscriptionId: subscription.id },
    });

    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          subscriptionTier: 'free',
          subscriptionId: null,
          billingCycleEnd: null,
          credits: 10, // Reset to free tier credits
        },
      });

      // Log the subscription cancellation
      await prisma.usageHistory.create({
        data: {
          userId: user.id,
          action: 'subscription_change',
          details: {
            tier: 'free',
            previousTier: user.subscriptionTier,
            reason: 'subscription_cancelled',
          },
          creditsChanged: 10 - user.credits,
        },
      });

      console.log(`User ${user.id} downgraded to free tier`);
    }
  } catch (error) {
    console.error('Error handling subscription deletion:', error);
  }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log('Invoice payment succeeded:', invoice.id);
  
  // Type assertion to handle the subscription property
  const invoiceWithSub = invoice as Stripe.Invoice & { subscription?: string | Stripe.Subscription };
  const subscriptionId = typeof invoiceWithSub.subscription === 'string' 
    ? invoiceWithSub.subscription 
    : invoiceWithSub.subscription?.id;
  
  if (subscriptionId) {
    // Refresh user credits for the new billing cycle
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const userId = subscription.metadata?.userId;
    
    if (userId) {
      const priceId = subscription.items.data[0]?.price.id;
      const tier = priceId ? getTierFromPriceId(priceId) : null;
      
      if (tier && SUBSCRIPTION_TIERS[tier]) {
        await prisma.user.update({
          where: { id: userId },
          data: {
            credits: SUBSCRIPTION_TIERS[tier].credits,
            billingCycleEnd: new Date((subscription as any).current_period_end * 1000),
          },
        });

        // Log the credit refresh
        await prisma.usageHistory.create({
          data: {
            userId: userId,
            action: 'credit_purchase',
            details: {
              tier: tier,
              invoiceId: invoice.id,
              billingCycle: 'monthly_refresh',
            },
            creditsChanged: SUBSCRIPTION_TIERS[tier].credits,
          },
        });

        console.log(`Credits refreshed for user ${userId}, tier ${tier}`);
      }
    }
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  console.log('Invoice payment failed:', invoice.id);
  
  // Type assertion to handle the subscription property
  const invoiceWithSub = invoice as Stripe.Invoice & { subscription?: string | Stripe.Subscription };
  const subscriptionId = typeof invoiceWithSub.subscription === 'string' 
    ? invoiceWithSub.subscription 
    : invoiceWithSub.subscription?.id;
  
  // Handle failed payment - could pause subscription, send notification, etc.
  if (subscriptionId) {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const userId = subscription.metadata?.userId;
    
    if (userId) {
      // Log the failed payment
      await prisma.usageHistory.create({
        data: {
          userId: userId,
          action: 'subscription_change',
          details: {
            reason: 'payment_failed',
            invoiceId: invoice.id,
            subscriptionId: subscription.id,
          },
        },
      });

      console.log(`Payment failed for user ${userId}`);
    }
  }
}

async function updateUserSubscription(userId: string, tier: string, subscriptionId: string) {
  const tierConfig = SUBSCRIPTION_TIERS[tier];
  if (!tierConfig) {
    console.error(`Invalid tier: ${tier}`);
    return;
  }

  // Calculate billing cycle end (1 month from now)
  const billingCycleEnd = new Date();
  billingCycleEnd.setMonth(billingCycleEnd.getMonth() + 1);

  await prisma.user.update({
    where: { id: userId },
    data: {
      subscriptionTier: tier,
      subscriptionId: subscriptionId,
      credits: tierConfig.credits,
      billingCycleEnd: billingCycleEnd,
    },
  });
}
