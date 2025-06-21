
import Link from 'next/link';
import { ArrowRight, Zap, Shield, BarChart3, Check, Sparkles, Brain, Users, Trophy, ChevronRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-transparent to-teal-600/5" />
        
        <div className="relative container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-32 lg:pt-32 lg:pb-48">
          <div className="text-center space-y-8 animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 mb-8">
              <Sparkles className="h-4 w-4 text-teal-500 mr-2" />
              <span className="text-teal-500 text-sm font-medium">AI Text Humanizer</span>
              <div className="ml-2 px-2 py-0.5 bg-teal-500 text-white text-xs font-bold rounded-full">
                NEW
              </div>
            </div>

            {/* Main headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.1]">
              Transform AI Text to{' '}
              <span className="bg-gradient-to-r from-teal-500 to-teal-600 bg-clip-text text-transparent">
                Human Writing
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Advanced multi-detector validation with GPTZero, Hugging Face, and GLTR ensures your content bypasses all AI detection systems while maintaining perfect readability.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-teal-500" />
                <span>3 AI Detectors</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-teal-500" />
                <span>10,000+ Users</span>
              </div>
              <div className="flex items-center space-x-2">
                <Trophy className="h-4 w-4 text-teal-500" />
                <span>98% Success Rate</span>
              </div>
            </div>

            {/* Floating CTA */}
            <div className="pt-8">
              <div className="inline-flex flex-col sm:flex-row gap-4 p-6 bg-card/80 backdrop-blur-lg border border-border rounded-3xl shadow-teal-subtle">
                <Button variant="premium" size="xl" asChild>
                  <Link href="/auth/signup">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Start Free Trial
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="xl" asChild>
                  <Link href="/auth/signin">
                    <span>Sign In</span>
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <p className="text-sm text-muted-foreground pt-4">
              Start with <span className="text-teal-500 font-semibold">10 free credits</span> • No credit card required
            </p>
          </div>
        </div>
      </section>

      {/* Features Section - Three AI Detectors */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 mb-6">
              <Shield className="h-4 w-4 text-teal-500 mr-2" />
              <span className="text-teal-500 text-sm font-medium">Triple Validation System</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-semibold mb-6">
              Pass All AI Detectors
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our advanced system tests your humanized text against three industry-leading AI detectors to ensure complete undetectability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card hover className="group">
              <CardHeader className="pb-4">
                <div className="p-4 rounded-2xl bg-blue-500/10 w-fit group-hover:bg-blue-500/20 transition-colors">
                  <Brain className="h-8 w-8 text-blue-500" />
                </div>
                <CardTitle className="text-xl">GPTZero</CardTitle>
                <CardDescription className="text-base">
                  One of the most advanced AI detection tools used by educators and professionals worldwide.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-teal-500" />
                    <span className="text-sm">Education sector favorite</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-teal-500" />
                    <span className="text-sm">High accuracy detection</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-teal-500" />
                    <span className="text-sm">Real-time analysis</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card hover className="group border-teal-500/20 bg-teal-500/5">
              <CardHeader className="pb-4">
                <div className="p-4 rounded-2xl bg-teal-500/20 w-fit group-hover:bg-teal-500/30 transition-colors">
                  <Shield className="h-8 w-8 text-teal-500" />
                </div>
                <CardTitle className="text-xl">Hugging Face AI Detector</CardTitle>
                <CardDescription className="text-base">
                  Open-source AI detection model trusted by researchers and developers globally.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-teal-500" />
                    <span className="text-sm">Open-source reliability</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-teal-500" />
                    <span className="text-sm">Developer community trusted</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-teal-500" />
                    <span className="text-sm">Research-grade accuracy</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card hover className="group">
              <CardHeader className="pb-4">
                <div className="p-4 rounded-2xl bg-purple-500/10 w-fit group-hover:bg-purple-500/20 transition-colors">
                  <BarChart3 className="h-8 w-8 text-purple-500" />
                </div>
                <CardTitle className="text-xl">GLTR</CardTitle>
                <CardDescription className="text-base">
                  Giant Language model Test Room - Advanced statistical analysis for AI text detection.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-teal-500" />
                    <span className="text-sm">Statistical analysis</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-teal-500" />
                    <span className="text-sm">Language pattern detection</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-teal-500" />
                    <span className="text-sm">Academic research tool</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Success guarantee */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center px-6 py-3 rounded-2xl bg-teal-500/10 border border-teal-500/20">
              <Trophy className="h-5 w-5 text-teal-500 mr-3" />
              <span className="text-teal-500 font-semibold">
                All three detectors must show below 5% for validation ✅
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Target Audiences */}
      <section className="py-24">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-semibold mb-6">
              Built for Everyone
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From students to Fortune 500 companies, humniz empowers success across all industries and use cases.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card hover className="group">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 rounded-2xl bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                    <Users className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Students</CardTitle>
                    <CardDescription>Academic excellence made simple</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-teal-500 mr-3 flex-shrink-0" />
                    <span>Essays and research papers</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-teal-500 mr-3 flex-shrink-0" />
                    <span>College applications</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-teal-500 mr-3 flex-shrink-0" />
                    <span>Academic writing assistance</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-teal-500 mr-3 flex-shrink-0" />
                    <span>Thesis and dissertation support</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card hover className="group border-teal-500/20 bg-teal-500/5">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 rounded-2xl bg-teal-500/20 group-hover:bg-teal-500/30 transition-colors">
                    <Brain className="h-6 w-6 text-teal-500" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Professionals</CardTitle>
                    <CardDescription>Enterprise-grade reliability</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-teal-500 mr-3 flex-shrink-0" />
                    <span>Business proposals and reports</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-teal-500 mr-3 flex-shrink-0" />
                    <span>Client communications</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-teal-500 mr-3 flex-shrink-0" />
                    <span>Marketing materials</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-teal-500 mr-3 flex-shrink-0" />
                    <span>Internal documentation</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card hover className="group">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 rounded-2xl bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors">
                    <Sparkles className="h-6 w-6 text-purple-500" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Content Creators</CardTitle>
                    <CardDescription>Creative freedom unleashed</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-teal-500 mr-3 flex-shrink-0" />
                    <span>Blog posts and articles</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-teal-500 mr-3 flex-shrink-0" />
                    <span>Social media content</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-teal-500 mr-3 flex-shrink-0" />
                    <span>Email campaigns</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-teal-500 mr-3 flex-shrink-0" />
                    <span>Website copy</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-500 to-teal-600 p-8 sm:p-12 lg:p-16">
            <div className="absolute inset-0 bg-black/20" />
            
            <div className="relative text-center text-white space-y-8">
              <h2 className="text-4xl sm:text-5xl font-semibold">
                Ready to Transform Your Content?
              </h2>
              <p className="text-xl opacity-90 max-w-3xl mx-auto">
                Join thousands of users who trust humniz for reliable, undetectable text humanization. Start your free trial today.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                <Button size="xl" variant="secondary" asChild>
                  <Link href="/auth/signup">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="xl" variant="outline" className="border-white/20 text-white hover:bg-white/10" asChild>
                  <Link href="/pricing">
                    View Pricing
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap items-center justify-center gap-8 pt-12 text-sm opacity-80">
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 fill-current" />
                  <span>4.9/5 Rating</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <span>100% Safe & Secure</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4" />
                  <span>Instant Results</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
