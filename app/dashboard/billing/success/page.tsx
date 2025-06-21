
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, Loader2, CreditCard } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DashboardLayout } from '@/components/dashboard-layout';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  
  const [isLoading, setIsLoading] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError('No session ID found');
      setIsLoading(false);
      return;
    }

    // Verify payment success
    verifyPayment();
  }, [sessionId]);

  const verifyPayment = async () => {
    try {
      // Small delay to allow webhook processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Refresh user profile to get updated subscription
      const response = await fetch('/api/user/profile');
      const data = await response.json();
      
      if (response.ok) {
        setPaymentDetails(data);
      } else {
        setError('Failed to verify payment status');
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      setError('Failed to verify payment status');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Verifying your payment...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto">
          <Card className="border-red-200">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle className="text-red-600">Payment Verification Failed</CardTitle>
              <CardDescription>
                {error}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                Don't worry! If your payment was successful, your subscription will be activated shortly.
                Please check your email for confirmation or contact support if needed.
              </p>
              <div className="space-x-4">
                <Button onClick={() => router.push('/dashboard/billing')}>
                  Go to Billing
                </Button>
                <Button variant="outline" onClick={() => router.push('/dashboard')}>
                  Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <Card className="border-green-200">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-green-600">Payment Successful!</CardTitle>
            <CardDescription>
              Your subscription has been activated successfully
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {paymentDetails && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold capitalize">
                    {paymentDetails.subscriptionTier}
                  </div>
                  <p className="text-sm text-muted-foreground">Plan</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {paymentDetails.credits}
                  </div>
                  <p className="text-sm text-muted-foreground">Credits Available</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {paymentDetails.billingCycleEnd 
                      ? new Date(paymentDetails.billingCycleEnd).toLocaleDateString()
                      : 'N/A'
                    }
                  </div>
                  <p className="text-sm text-muted-foreground">Next Billing</p>
                </div>
              </div>
            )}
            
            <div className="text-center space-y-4">
              <h3 className="font-semibold">What's Next?</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Your credits have been added to your account</li>
                <li>• You can now use all premium features</li>
                <li>• Check your email for payment confirmation</li>
                <li>• Start humanizing text with your new credits!</li>
              </ul>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button onClick={() => router.push('/dashboard')}>
                  Start Using Humniz
                </Button>
                <Button variant="outline" onClick={() => router.push('/dashboard/billing')}>
                  View Billing Details
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
