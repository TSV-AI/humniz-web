
'use client';

import { useRouter } from 'next/navigation';
import { XCircle, ArrowLeft, CreditCard } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DashboardLayout } from '@/components/dashboard-layout';

export default function PaymentCancelPage() {
  const router = useRouter();

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <Card className="border-yellow-200">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
              <XCircle className="h-6 w-6 text-yellow-600" />
            </div>
            <CardTitle className="text-yellow-600">Payment Cancelled</CardTitle>
            <CardDescription>
              No charges were made to your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">
                You cancelled the payment process. Your subscription remains unchanged 
                and no charges were applied to your payment method.
              </p>
              
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-semibold mb-2">Why upgrade to a paid plan?</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Get more credits per month</li>
                  <li>• Access premium humanization features</li>
                  <li>• Better AI detection bypass rates</li>
                  <li>• Priority customer support</li>
                  <li>• API access for integrations</li>
                </ul>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button onClick={() => router.push('/dashboard/billing')}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                <Button variant="outline" onClick={() => router.push('/dashboard')}>
                  Continue with Current Plan
                </Button>
              </div>
              
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-3">
                  Need help deciding? View our pricing comparison:
                </p>
                <Button variant="ghost" onClick={() => router.push('/pricing')}>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Compare Plans
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
