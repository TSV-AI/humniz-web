
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DashboardLayout } from '@/components/dashboard-layout';
import { useToast } from '@/hooks/use-toast';
import { 
  BarChart3, 
  Loader2,
  TrendingUp,
  FileText,
  Clock,
  Target,
  History,
  Copy,
  Calendar,
  Shield
} from 'lucide-react';
import { TextProcess } from '@/lib/types';

export default function AnalyticsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    totalProcessed: 0,
    averageScore: 0,
    creditsUsed: 0,
    successRate: 0,
  });
  const [history, setHistory] = useState<TextProcess[]>([]);
  const [selectedProcess, setSelectedProcess] = useState<TextProcess | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchData();
    }
  }, [session]);

  const fetchData = async () => {
    try {
      // Fetch both analytics and history data
      const [analyticsResult, historyResult] = await Promise.all([
        fetchAnalytics(),
        fetchHistory()
      ]);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    // Simulate analytics data (in a real app, this would come from the API)
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setAnalytics({
      totalProcessed: Math.floor(Math.random() * 50) + 10,
      averageScore: Math.random() * 25 + 10, // 10-35% (good humanization range)
      creditsUsed: Math.floor(Math.random() * 20) + 5,
      successRate: Math.random() * 20 + 80, // 80-100%
    });
  };

  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/user/history');
      const data = await response.json();
      
      if (response.ok) {
        setHistory(data.data || []);
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      console.error('Failed to fetch history:', error);
      // Don't show toast for history errors, just log them
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: 'Copied',
        description: 'Text copied to clipboard',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy text',
        variant: 'destructive',
      });
    }
  };

  const getScoreColor = (score: number) => {
    if (score < 10) return 'text-teal-500';
    if (score < 20) return 'text-yellow-500';
    return 'text-red-500';
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

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <BarChart3 className="h-8 w-8 mr-3 text-teal-500" />
            Analytics & History
          </h1>
          <p className="text-muted-foreground mt-2">
            Track your text humanization performance, usage patterns, and processing history
          </p>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card hover className="bg-gradient-to-br from-teal-500/10 to-teal-600/5 border-teal-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Processed</CardTitle>
              <FileText className="h-4 w-4 text-teal-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-teal-500">{analytics.totalProcessed}</div>
              <p className="text-xs text-muted-foreground">
                +{Math.floor(analytics.totalProcessed * 0.2)} from last month
              </p>
            </CardContent>
          </Card>

          <Card hover>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average AI Score</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.averageScore.toFixed(1)}%</div>
              <p className="text-xs text-teal-500">
                Excellent humanization quality
              </p>
            </CardContent>
          </Card>

          <Card hover>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Credits Used</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.creditsUsed}</div>
              <p className="text-xs text-muted-foreground">
                This month
              </p>
            </CardContent>
          </Card>

          <Card hover>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.successRate.toFixed(1)}%</div>
              <p className="text-xs text-teal-500">
                High success rate
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Usage Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-teal-500" />
              Usage Insights
            </CardTitle>
            <CardDescription>
              Understand your usage patterns and get actionable insights
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-teal-500/10 rounded-xl border border-teal-500/20">
                <div className="text-2xl font-bold text-teal-500">{Math.round(analytics.totalProcessed / 30 * 7)}</div>
                <p className="text-sm text-muted-foreground">Weekly Average</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-xl">
                <div className="text-2xl font-bold">{Math.round(analytics.totalProcessed / 7)}</div>
                <p className="text-sm text-muted-foreground">Most Active Day</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-xl">
                <div className="text-2xl font-bold">{analytics.averageScore.toFixed(0)}%</div>
                <p className="text-sm text-muted-foreground">Avg Detection</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium">Quick Tips</h4>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-start">
                    <span className="text-teal-500 mr-2">•</span>
                    Your average AI detection score is excellent
                  </li>
                  <li className="flex items-start">
                    <span className="text-teal-500 mr-2">•</span>
                    Consider upgrading for more monthly credits
                  </li>
                  <li className="flex items-start">
                    <span className="text-teal-500 mr-2">•</span>
                    Peak usage is typically in the afternoon
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium">Performance Metrics</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Excellent Results (&lt;5%)</span>
                    <span className="font-medium text-teal-500">75%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-teal-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Processing History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <History className="h-5 w-5 mr-2 text-teal-500" />
              Processing History
            </CardTitle>
            <CardDescription>
              Your recent text humanization requests and results
            </CardDescription>
          </CardHeader>
          <CardContent>
            {history.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No history yet</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Start humanizing text to see your processing history here
                </p>
                <Button asChild>
                  <a href="/dashboard">Start Humanizing</a>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {history.slice(0, 5).map((process) => (
                  <div key={process.id} className="border rounded-xl p-4 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          {format(new Date(process.createdAt), 'MMM dd, yyyy HH:mm')}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4">
                        {process.aiDetectionScore && (
                          <div className="flex items-center space-x-2">
                            <Shield className="h-4 w-4" />
                            <span className={`font-medium ${getScoreColor(process.aiDetectionScore)}`}>
                              {process.aiDetectionScore.toFixed(1)}%
                            </span>
                          </div>
                        )}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          process.status === 'completed' ? 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200' :
                          process.status === 'processing' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                          process.status === 'failed' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                        }`}>
                          {process.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-sm">Original Text</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(process.originalText)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="bg-muted/50 p-3 rounded-lg text-sm">
                          <p className="line-clamp-3">{process.originalText}</p>
                        </div>
                      </div>
                      
                      {process.humanizedText && (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-sm">Humanized Text</h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(process.humanizedText!)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="bg-teal-500/10 p-3 rounded-lg text-sm border border-teal-500/20">
                            <p className="line-clamp-3">{process.humanizedText}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {history.length > 5 && (
                  <div className="text-center pt-4">
                    <Button variant="outline" asChild>
                      <a href="/dashboard/history">View All History</a>
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
