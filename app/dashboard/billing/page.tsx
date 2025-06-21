
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DashboardLayout } from '@/components/dashboard-layout';
import { SUBSCRIPTION_TIERS } from '@/lib/subscription-tiers';
import { redirectToCheckout } from '@/lib/stripe-client';
import { toast } from 'sonner';
import { 
  CreditCard, 
  Check, 
  Loader2,
  Crown,
  Zap
} from 'lucide-react';

export default function BillingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchUserProfile();
    }
  }, [session]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/user/profile');
      const data = await response.json();
      
      if (response.ok) {
        setUserProfile(data);
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const [isUpgrading, setIsUpgrading] = useState<string | null>(null);

  const handleUpgrade = async (tierName: string) => {
    if (tierName === 'Free Trial') {
      toast.error('Cannot downgrade to free trial from billing page');
      return;
    }

    const tier = Object.values(SUBSCRIPTION_TIERS).find(t => t.displayName === tierName);
    if (!tier || tier.name === 'free') {
      toast.error('Invalid tier selected');
      return;
    }

    setIsUpgrading(tier.name);

    try {
      await redirectToCheckout(tier.name);
      // The redirect will happen, so this line won't execute
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(
        error instanceof Error 
          ? error.message 
          : 'Failed to start payment process. Please try again.'
      );
    } finally {
      setIsUpgrading(null);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (!session) {
    return null;
  }

  const currentTier = userProfile?.subscriptionTier || 'free';

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <CreditCard className="h-8 w-8 mr-3" />
            Billing & Subscription
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your subscription and billing information
          </p>
        </div>

        {/* Current Plan */}
        <Card>
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
            <CardDescription>
              Your active subscription and credit balance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="text-2xl font-bold capitalize">{currentTier}</div>
                <p className="text-sm text-muted-foreground">Subscription tier</p>
              </div>
              <div>
                <div className="text-2xl font-bold">{userProfile?.credits || 0}</div>
                <p className="text-sm text-muted-foreground">Credits remaining</p>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  ${SUBSCRIPTION_TIERS[currentTier]?.price || 0}
                </div>
                <p className="text-sm text-muted-foreground">Monthly cost</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Plans */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Available Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.values(SUBSCRIPTION_TIERS).map((tier) => {
              const isCurrentPlan = tier.name === currentTier;
              const isPopular = tier.name === 'pro';
              
              return (
                <Card key={tier.id} className={`relative flex flex-col ${isCurrentPlan ? 'ring-2 ring-teal-500' : ''}`}>
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-teal-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <CardHeader className="text-center">
                    <div className="flex justify-center mb-2">
                      {tier.name === 'enterprise' ? (
                        <Crown className="h-8 w-8 text-yellow-500" />
                      ) : tier.name === 'pro' ? (
                        <Zap className="h-8 w-8 text-teal-500" />
                      ) : (
                        <CreditCard className="h-8 w-8 text-muted-foreground" />
                      )}
                    </div>
                    <CardTitle className="capitalize">{tier.displayName}</CardTitle>
                    <div className="text-3xl font-bold">
                      ${tier.price}
                      {tier.price > 0 && <span className="text-sm font-normal text-muted-foreground">/month</span>}
                    </div>
                    <CardDescription>
                      {tier.credits} credits{tier.price > 0 ? '/month' : ' free trial'}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="flex-1 flex flex-col justify-between space-y-4">
                    <ul className="space-y-2 flex-1">
                      {tier.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <Check className="h-4 w-4 text-teal-500 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    {/* Button aligned to bottom */}
                    <div className="pt-4">
                      <Button 
                        className="w-full"
                        variant={isCurrentPlan ? 'outline' : 'default'}
                        disabled={isCurrentPlan || isUpgrading === tier.name}
                        onClick={() => handleUpgrade(tier.displayName)}
                        size="lg"
                      >
                        {isUpgrading === tier.name ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : isCurrentPlan ? (
                          'Current Plan'
                        ) : tier.name === 'free' ? (
                          'Downgrade'
                        ) : (
                          'Upgrade Plan'
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Usage Information */}
        <Card>
          <CardHeader>
            <CardTitle>Usage Information</CardTitle>
            <CardDescription>
              Understand how credits work and manage your usage
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">How Credits Work</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• 1 credit = 1 text humanization</li>
                  <li>• Credits reset monthly (except free trial)</li>
                  <li>• Unused credits don't roll over</li>
                  <li>• Free trial: 10 one-time credits</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2">Need More Credits?</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Upgrade your plan anytime to get more monthly credits and access premium features.
                </p>
                <Button variant="outline" size="sm">
                  Contact Support
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
