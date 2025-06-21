
import Link from 'next/link';
import { ArrowRight, Zap, Shield, BarChart3, Clock, Users, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export default function FeaturesPage() {
  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast Processing',
      description: 'Transform your AI-generated text in seconds with our advanced humanization algorithms.',
      benefits: ['Instant results', 'Batch processing', 'Real-time feedback']
    },
    {
      icon: Shield,
      title: 'Undetectable Humanization',
      description: 'Pass popular AI detectors while maintaining natural readability and original meaning.',
      benefits: ['Beats AI detectors', 'Preserves meaning', 'Natural flow']
    },
    {
      icon: BarChart3,
      title: 'AI Detection Scoring',
      description: 'Real-time scoring shows exactly how human-like your text appears to detection systems.',
      benefits: ['Live scoring', 'Detailed metrics', 'Performance tracking']
    },
    {
      icon: Clock,
      title: 'Usage History',
      description: 'Track all your humanization requests with detailed history and analytics.',
      benefits: ['Complete history', 'Usage analytics', 'Export capabilities']
    },
    {
      icon: Users,
      title: 'Multi-User Support',
      description: 'Perfect for teams, agencies, and organizations with collaborative features.',
      benefits: ['Team accounts', 'Role management', 'Shared credits']
    },
    {
      icon: Globe,
      title: 'API Access',
      description: 'Integrate humniz into your workflow with our powerful REST API.',
      benefits: ['REST API', 'SDKs available', 'Webhook support']
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
              Powerful features for{' '}
              <span className="text-primary">perfect humanization</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-3xl mx-auto">
              Everything you need to transform AI-generated text into natural, human-like writing 
              that passes detection and reads beautifully.
            </p>
            <Button size="lg" className="mt-8" asChild>
              <Link href="/auth/signup">
                Try All Features Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="card-hover">
                <CardHeader>
                  <feature.icon className="h-12 w-12 text-primary mb-4" />
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-center text-sm">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold">How it works</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Simple, powerful, and effective in just three steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Paste Your Text</h3>
              <p className="text-muted-foreground">
                Simply paste your AI-generated text into our editor. No formatting required.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Click Humanize</h3>
              <p className="text-muted-foreground">
                Our advanced AI processes your text in seconds, making it undetectable.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Get Human Text</h3>
              <p className="text-muted-foreground">
                Receive naturally flowing text with an AI detection score to verify quality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold">Perfect for every use case</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Whatever your content needs, humniz delivers
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-6">Academic Writing</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary rounded-full mr-4 mt-2" />
                  <div>
                    <strong>Essays & Research Papers:</strong> Transform AI assistance into naturally flowing academic writing
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary rounded-full mr-4 mt-2" />
                  <div>
                    <strong>Application Essays:</strong> Make your personal statements genuinely human and compelling
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary rounded-full mr-4 mt-2" />
                  <div>
                    <strong>Thesis Work:</strong> Ensure your research maintains an authentic academic voice
                  </div>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-6">Professional Content</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary rounded-full mr-4 mt-2" />
                  <div>
                    <strong>Business Reports:</strong> Present AI-assisted research with confidence and authority
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary rounded-full mr-4 mt-2" />
                  <div>
                    <strong>Marketing Copy:</strong> Create compelling content that resonates with human audiences
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary rounded-full mr-4 mt-2" />
                  <div>
                    <strong>Email Communications:</strong> Ensure your professional emails sound naturally human
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold">Ready to humanize your content?</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Join thousands of users who trust humniz for undetectable, natural text humanization
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/auth/signup">Start Free Trial</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
