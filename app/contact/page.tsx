
import Link from 'next/link';
import { Mail, MessageSquare, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
              Get in touch
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Have questions about humniz? We're here to help. Send us a message and we'll get back to you soon.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form and Info */}
      <section className="pb-20">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Information */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Mail className="h-5 w-5 mr-2" />
                      Email Support
                    </CardTitle>
                    <CardDescription>
                      For general questions and technical support
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="font-medium">support@humniz.io</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      We typically respond within 24 hours
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MessageSquare className="h-5 w-5 mr-2" />
                      Live Chat
                    </CardTitle>
                    <CardDescription>
                      Chat with our support team in real-time
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      Available Monday - Friday, 9 AM - 6 PM EST
                    </p>
                    <Button variant="outline" className="w-full">
                      Start Live Chat
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Phone className="h-5 w-5 mr-2" />
                      Enterprise Sales
                    </CardTitle>
                    <CardDescription>
                      For custom solutions and enterprise plans
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="font-medium">+1 (555) 123-4567</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Monday - Friday, 9 AM - 6 PM EST
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Send us a message</CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you as soon as possible
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="first-name">First Name</Label>
                        <Input id="first-name" placeholder="John" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last-name">Last Name</Label>
                        <Input id="last-name" placeholder="Doe" required />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="john@example.com" required />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input id="subject" placeholder="How can we help you?" required />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea 
                        id="message" 
                        placeholder="Tell us more about your question or feedback..."
                        className="min-h-[120px]"
                        required 
                      />
                    </div>
                    
                    <Button type="submit" className="w-full">
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Quick answers to common questions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-3">How does humniz work?</h3>
              <p className="text-sm text-muted-foreground">
                humniz uses advanced AI to transform AI-generated text into natural, human-like writing that passes AI detection while maintaining meaning and quality.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Is my data secure?</h3>
              <p className="text-sm text-muted-foreground">
                Yes, we take data security seriously. All text is processed securely and we don't store your content after processing is complete.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Can I get a refund?</h3>
              <p className="text-sm text-muted-foreground">
                We offer a 30-day money-back guarantee for all paid plans. Contact support if you're not satisfied with our service.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Do you offer API access?</h3>
              <p className="text-sm text-muted-foreground">
                Yes, API access is available with Pro and Enterprise plans. Check our pricing page for more details about API features.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">
              Still have questions?
            </p>
            <Button asChild>
              <Link href="/help">Visit Help Center</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
