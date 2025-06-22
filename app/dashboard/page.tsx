
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { DashboardLayout } from '@/components/dashboard-layout';
import { useToast } from '@/hooks/use-toast';
import { Loader2, PenTool, Zap, CreditCard, Shield, CheckCircle, XCircle, AlertCircle, Copy, Sparkles } from 'lucide-react';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [aiDetectionScore, setAiDetectionScore] = useState<number | null>(null);
  const [detectorScores, setDetectorScores] = useState<{
    gptZero: number;
    huggingFace: number;
    gltr: number;
  } | null>(null);
  const [allPassedValidation, setAllPassedValidation] = useState(false);
  const [processingAttempts, setProcessingAttempts] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [userCredits, setUserCredits] = useState(0);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.credits) {
      setUserCredits(session.user.credits);
    }
  }, [session]);

  const handleHumanize = async () => {
    if (!inputText.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter some text to humanize',
        variant: 'destructive',
      });
      return;
    }

    if (userCredits <= 0) {
      toast({
        title: 'No Credits',
        description: 'You need credits to humanize text. Please upgrade your plan.',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);
    setOutputText('');
    setAiDetectionScore(null);
    setDetectorScores(null);
    setAllPassedValidation(false);
    setProcessingAttempts(0);

    try {
      const response = await fetch('/api/humanize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to humanize text');
      }

      setOutputText(data.humanizedText);
      setAiDetectionScore(data.aiDetectionScore);
      setDetectorScores(data.detectorScores);
      setAllPassedValidation(data.allPassedValidation);
      setProcessingAttempts(data.attempts);
      setUserCredits(data.creditsRemaining);
      
      toast({
        title: data.allPassedValidation ? 'Perfect! ✅' : 'Completed',
        description: data.allPassedValidation 
          ? 'Average AI detection below 10% - text is perfectly humanized!'
          : `Humanization completed in ${data.attempts} attempt${data.attempts > 1 ? 's' : ''} - No credits charged (didn't meet 10% guarantee)`,
        variant: data.allPassedValidation ? 'default' : 'destructive',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to humanize text',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(outputText);
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

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-12 animate-fade-in">
        {/* Hero Header */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20">
            <Sparkles className="h-4 w-4 text-teal-500 mr-2" />
            <span className="text-teal-500 text-sm font-medium">AI Text Humanizer</span>
          </div>
          <h1 className="text-5xl font-semibold tracking-tight bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Transform AI Text to Human Writing
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Advanced multi-detector validation ensures your text passes all AI detection systems
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <CreditCard className="h-4 w-4 text-teal-500" />
              <span className="font-medium">{userCredits} credits remaining</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-teal-500" />
              <span>3-Detector Validation</span>
            </div>
          </div>
        </div>

        {/* Main Interface */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card hover className="group">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <PenTool className="h-5 w-5 mr-3 text-teal-500" />
                Original Text
              </CardTitle>
              <CardDescription className="text-base">
                Paste your AI-generated content here
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Enter your AI-generated text here..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="min-h-[400px] resize-none border-0 bg-muted/30 rounded-xl text-base leading-relaxed focus:bg-muted/50 transition-colors"
                maxLength={5000}
              />
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>{inputText.length}/5000 characters</span>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${inputText.length > 0 ? 'bg-teal-500 animate-pulse' : 'bg-muted-foreground/30'}`} />
                  <span>Ready</span>
                </div>
              </div>
              
              {/* Humanize Button at bottom of input */}
              <Button 
                onClick={handleHumanize} 
                disabled={isProcessing || !inputText.trim() || userCredits <= 0}
                variant="premium"
                size="lg"
                className="w-full"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 mr-2" />
                    Humanize Text
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Processing/Results Section */}
          <Card hover className="group">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-lg">
                <span className="flex items-center">
                  <Zap className="h-5 w-5 mr-3 text-teal-500" />
                  Humanized Result
                  {allPassedValidation && (
                    <CheckCircle className="h-5 w-5 ml-2 text-teal-500" />
                  )}
                </span>
                {processingAttempts > 0 && (
                  <span className="text-sm text-muted-foreground">
                    {processingAttempts} attempt{processingAttempts > 1 ? 's' : ''}
                  </span>
                )}
              </CardTitle>
              <CardDescription className="text-base">
                {allPassedValidation 
                  ? "✅ Perfect! Average AI detection below 10%" 
                  : "Your humanized text with AI detection validation"
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="relative">
                <Textarea
                  value={outputText}
                  readOnly
                  placeholder="Your perfectly humanized text will appear here..."
                  className="min-h-[300px] resize-none border-0 bg-muted/30 rounded-xl text-base leading-relaxed"
                />
              </div>
              
              {/* Action Buttons in Results Box */}
              {outputText && (
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    onClick={copyToClipboard}
                    variant="outline"
                    size="default"
                    className="flex-1"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Result
                  </Button>
                  <Button 
                    onClick={handleHumanize}
                    variant="secondary"
                    size="default"
                    disabled={isProcessing || userCredits <= 0}
                    className="flex-1"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Re-Humanize
                  </Button>
                </div>
              )}

              {/* AI Detection Result - Single Average Score */}
              {aiDetectionScore !== null && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-teal-500" />
                    AI Detection Result
                  </h4>
                  
                  {/* Single Average Score Display */}
                  <div className="bg-muted/30 rounded-xl p-6 space-y-4">
                    <div className="text-center space-y-2">
                      <div className="flex items-center justify-center space-x-3">
                        {aiDetectionScore < 10 ? (
                          <CheckCircle className="h-8 w-8 text-teal-500" />
                        ) : aiDetectionScore < 20 ? (
                          <AlertCircle className="h-8 w-8 text-yellow-500" />
                        ) : (
                          <XCircle className="h-8 w-8 text-red-500" />
                        )}
                        <div className="text-center">
                          <div className={`text-4xl font-bold ${aiDetectionScore < 10 ? 'text-teal-500' : aiDetectionScore < 20 ? 'text-yellow-500' : 'text-red-500'}`}>
                            {aiDetectionScore.toFixed(1)}%
                          </div>
                          <p className="text-sm text-muted-foreground">Average AI Detection Score</p>
                        </div>
                      </div>
                      
                      <Progress 
                        value={Math.min(aiDetectionScore, 100)} 
                        className={`h-4 ${aiDetectionScore < 10 ? '[&>div]:bg-teal-500' : aiDetectionScore < 20 ? '[&>div]:bg-yellow-500' : '[&>div]:bg-red-500'}`}
                      />
                      
                      <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                        aiDetectionScore < 10 
                          ? 'bg-teal-500/10 text-teal-500 border border-teal-500/20'
                          : aiDetectionScore < 20 
                            ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                            : 'bg-red-500/10 text-red-500 border border-red-500/20'
                      }`}>
                        {aiDetectionScore < 10 ? (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Excellent - Perfectly Humanized ✅
                          </>
                        ) : aiDetectionScore < 20 ? (
                          <>
                            <AlertCircle className="h-4 w-4 mr-2" />
                            Good - Well Humanized ⚠️
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4 mr-2" />
                            Needs Improvement - Try Again ❌
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-center text-xs text-muted-foreground">
                      Based on average of 3 AI detectors: GPTZero, Hugging Face, and GLTR
                    </div>
                  </div>

                  {/* Overall Status Message */}
                  <div className={`rounded-xl p-4 border ${aiDetectionScore < 10 ? 'bg-teal-500/10 border-teal-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                    <div className="flex items-center space-x-3">
                      {aiDetectionScore < 10 ? (
                        <CheckCircle className="h-6 w-6 text-teal-500" />
                      ) : (
                        <XCircle className="h-6 w-6 text-red-500" />
                      )}
                      <div>
                        <p className={`font-semibold ${aiDetectionScore < 10 ? 'text-teal-500' : 'text-red-500'}`}>
                          {aiDetectionScore < 10 ? 'Perfect Humanization!' : 'Humanization Needs Improvement'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {aiDetectionScore < 10 
                            ? 'Your text is perfectly humanized and will bypass AI detection systems. Credits charged.'
                            : 'No credits charged - result did not meet our 10% guarantee. Try again to improve results.'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}


            </CardContent>
          </Card>
        </div>

        {/* Enhanced Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card hover className="bg-gradient-to-br from-teal-500/10 to-teal-600/5 border-teal-500/20">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-2xl bg-teal-500/20">
                  <CreditCard className="h-6 w-6 text-teal-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{userCredits}</p>
                  <p className="text-sm text-muted-foreground">Credits Left</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card hover>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-2xl bg-blue-500/20">
                  <Shield className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold capitalize">{session.user?.subscriptionTier || 'Free'}</p>
                  <p className="text-sm text-muted-foreground">Current Plan</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card hover>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-2xl bg-purple-500/20">
                  <Zap className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">3</p>
                  <p className="text-sm text-muted-foreground">AI Detectors</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card hover>
            <CardContent className="p-8">
              <Button variant="premium" size="lg" className="w-full h-12" asChild>
                <a href="/dashboard/billing" className="flex items-center justify-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>Add Credits</span>
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
