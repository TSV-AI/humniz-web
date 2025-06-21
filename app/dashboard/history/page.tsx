
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
  Loader2, 
  History, 
  Copy, 
  Eye,
  Calendar,
  BarChart3,
  FileText
} from 'lucide-react';
import { TextProcess } from '@/lib/types';

export default function HistoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  
  const [history, setHistory] = useState<TextProcess[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProcess, setSelectedProcess] = useState<TextProcess | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchHistory();
    }
  }, [session]);

  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/user/history');
      const data = await response.json();
      
      if (response.ok) {
        setHistory(data.data);
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch history',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
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
    if (score < 30) return 'text-green-600';
    if (score < 70) return 'text-yellow-600';
    return 'text-red-600';
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
            <History className="h-8 w-8 mr-3" />
            Processing History
          </h1>
          <p className="text-muted-foreground mt-2">
            View your past text humanization requests and results
          </p>
        </div>

        {history.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No history yet</h3>
              <p className="text-muted-foreground text-center mb-4">
                Start humanizing text to see your processing history here
              </p>
              <Button asChild>
                <a href="/dashboard">Start Humanizing</a>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {history.map((process) => (
              <Card key={process.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center text-lg">
                      <Calendar className="h-4 w-4 mr-2" />
                      {format(new Date(process.createdAt), 'MMM dd, yyyy HH:mm')}
                    </CardTitle>
                    <div className="flex items-center space-x-4">
                      {process.aiDetectionScore && (
                        <div className="flex items-center space-x-2">
                          <BarChart3 className="h-4 w-4" />
                          <span className={`font-medium ${getScoreColor(process.aiDetectionScore)}`}>
                            {process.aiDetectionScore.toFixed(1)}%
                          </span>
                        </div>
                      )}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        process.status === 'completed' ? 'bg-green-100 text-green-800' :
                        process.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                        process.status === 'failed' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {process.status}
                      </span>
                    </div>
                  </div>
                  <CardDescription>
                    {process.creditsUsed} credit{process.creditsUsed !== 1 ? 's' : ''} used
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Original Text */}
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
                    <div className="bg-muted p-3 rounded-lg text-sm">
                      <p className="line-clamp-3">{process.originalText}</p>
                      {process.originalText.length > 200 && (
                        <Button
                          variant="link"
                          size="sm"
                          className="p-0 h-auto text-xs"
                          onClick={() => setSelectedProcess(selectedProcess?.id === process.id ? null : process)}
                        >
                          {selectedProcess?.id === process.id ? 'Show less' : 'Show more'}
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Humanized Text */}
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
                      <div className="bg-accent p-3 rounded-lg text-sm">
                        <p className="line-clamp-3">{process.humanizedText}</p>
                        {process.humanizedText.length > 200 && (
                          <Button
                            variant="link"
                            size="sm"
                            className="p-0 h-auto text-xs"
                            onClick={() => setSelectedProcess(selectedProcess?.id === process.id ? null : process)}
                          >
                            {selectedProcess?.id === process.id ? 'Show less' : 'Show more'}
                          </Button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Expanded view */}
                  {selectedProcess?.id === process.id && (
                    <div className="border-t pt-4 space-y-4">
                      <div>
                        <h4 className="font-medium text-sm mb-2">Complete Original Text</h4>
                        <div className="bg-muted p-4 rounded-lg text-sm max-h-40 overflow-y-auto">
                          {process.originalText}
                        </div>
                      </div>
                      {process.humanizedText && (
                        <div>
                          <h4 className="font-medium text-sm mb-2">Complete Humanized Text</h4>
                          <div className="bg-accent p-4 rounded-lg text-sm max-h-40 overflow-y-auto">
                            {process.humanizedText}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
