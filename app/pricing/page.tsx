
import Link from 'next/link';
import { Check, Crown, Zap, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { SUBSCRIPTION_TIERS } from '@/lib/subscription-tiers';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
              Simple, transparent pricing
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that's right for you. Start with our free trial and upgrade as you grow.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Object.values(SUBSCRIPTION_TIERS).map((tier) => {
              const isPopular = tier.name === 'pro';
              
              return (
                <Card key={tier.id} className={`relative flex flex-col h-full ${isPopular ? 'ring-2 ring-primary scale-105' : ''}`}>
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                      {tier.name === 'enterprise' ? (
                        <Crown className="h-12 w-12 text-yellow-500" />
                      ) : tier.name === 'pro' ? (
                        <Zap className="h-12 w-12 text-primary" />
                      ) : tier.name === 'basic' ? (
                        <CreditCard className="h-12 w-12 text-blue-500" />
                      ) : (
                        <CreditCard className="h-12 w-12 text-muted-foreground" />
                      )}
                    </div>
                    <CardTitle className="text-2xl">{tier.displayName}</CardTitle>
                    <div className="text-4xl font-bold mt-4">
                      ${tier.price}
                      {tier.price > 0 && <span className="text-lg font-normal text-muted-foreground">/month</span>}
                    </div>
                    <CardDescription className="mt-2">
                      {tier.credits} credits{tier.price > 0 ? ' per month' : ' one-time'}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="flex flex-col flex-1 space-y-6">
                    <ul className="space-y-3 flex-1">
                      {tier.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      className="w-full mt-auto"
                      variant={isPopular ? 'default' : 'outline'}
                      size="lg"
                      asChild
                    >
                      <Link href="/auth/signup">
                        {tier.name === 'free' ? 'Start Free Trial' : 'Get Started'}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Everything you need to know about our pricing
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-2">How do credits work?</h3>
              <p className="text-sm text-muted-foreground">
                Each credit allows you to humanize one text. Credits reset monthly for paid plans, 
                while the free trial provides 10 one-time credits.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Can I change plans anytime?</h3>
              <p className="text-sm text-muted-foreground">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect 
                immediately with prorated billing.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Do unused credits roll over?</h3>
              <p className="text-sm text-muted-foreground">
                No, unused credits don't roll over to the next month. We recommend choosing 
                a plan that matches your monthly usage.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Is there a money-back guarantee?</h3>
              <p className="text-sm text-muted-foreground">
                Yes, we offer a 30-day money-back guarantee for all paid plans. 
                Try humniz risk-free.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">What makes humniz different?</h3>
              <p className="text-sm text-muted-foreground">
                Our advanced AI technology ensures your text passes popular AI detectors 
                while maintaining natural readability and meaning.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Need enterprise features?</h3>
              <p className="text-sm text-muted-foreground">
                Our Enterprise plan includes API access, priority support, and custom 
                integrations. Contact us for volume discounts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold">Ready to get started?</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Join thousands of users who trust humniz for reliable text humanization
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/auth/signup">Start Free Trial</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/contact">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
