
import Link from 'next/link';
import { Search, Book, MessageSquare, Video, FileText, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export default function HelpPage() {
  const helpCategories = [
    {
      icon: Book,
      title: 'Getting Started',
      description: 'Learn the basics of using humniz effectively',
      articles: [
        'Creating your first humanized text',
        'Understanding AI detection scores',
        'Managing your credits and subscription',
        'Setting up your account'
      ]
    },
    {
      icon: FileText,
      title: 'Text Humanization',
      description: 'Best practices for optimal results',
      articles: [
        'How to prepare text for humanization',
        'Improving your AI detection scores',
        'Working with different content types',
        'Quality guidelines and tips'
      ]
    },
    {
      icon: Users,
      title: 'Account & Billing',
      description: 'Managing your account and payments',
      articles: [
        'Upgrading your subscription plan',
        'Understanding credit usage',
        'Payment methods and billing',
        'Account settings and preferences'
      ]
    },
    {
      icon: Video,
      title: 'API Documentation',
      description: 'Technical integration guides',
      articles: [
        'Getting started with the API',
        'Authentication and security',
        'API endpoints and examples',
        'Rate limits and best practices'
      ]
    }
  ];

  const popularArticles = [
    'How to achieve the best humanization results',
    'Understanding AI detection scores',
    'Troubleshooting common issues',
    'Billing and subscription FAQ',
    'API integration guide',
    'Data security and privacy'
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
              Help Center
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Find answers, guides, and resources to help you get the most out of humniz
            </p>
            
            {/* Search Bar */}
            <div className="mt-8 max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  className="pl-10" 
                  placeholder="Search for help articles..."
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="pb-12">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardContent className="pt-6">
                <MessageSquare className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Contact Support</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Get help from our support team
                </p>
                <Button variant="outline" asChild>
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <Video className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Video Tutorials</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Watch step-by-step guides
                </p>
                <Button variant="outline">
                  Watch Videos
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Community Forum</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Connect with other users
                </p>
                <Button variant="outline">
                  Join Forum
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Help Categories */}
      <section className="py-12">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Browse by Category</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {helpCategories.map((category, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <category.icon className="h-6 w-6 mr-3 text-primary" />
                    {category.title}
                  </CardTitle>
                  <CardDescription>
                    {category.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {category.articles.map((article, articleIndex) => (
                      <li key={articleIndex}>
                        <Link 
                          href={`#${article.toLowerCase().replace(/\s+/g, '-')}`}
                          className="text-sm text-primary hover:underline"
                        >
                          {article}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Articles */}
      <section className="py-12 bg-muted/50">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Popular Articles</h2>
          
          <div className="space-y-4">
            {popularArticles.map((article, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-primary mr-3" />
                      <h3 className="font-medium">{article}</h3>
                    </div>
                    <Button variant="ghost" size="sm">
                      Read More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold">Still need help?</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Our support team is here to help you succeed with humniz
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/contact">Contact Support</Link>
            </Button>
            <Button variant="outline" size="lg">
              Schedule a Call
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
