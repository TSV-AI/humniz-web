export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { text } = await request.json();

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    if (text.length > 10000) {
      return NextResponse.json(
        { error: 'Text too long. Maximum 10,000 characters allowed.' },
        { status: 400 }
      );
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user has credits
    if (user.credits <= 0) {
      return NextResponse.json(
        { error: 'Insufficient credits' },
        { status: 400 }
      );
    }

    // Create text process record
    const textProcess = await prisma.textProcess.create({
      data: {
        userId: user.id,
        originalText: text,
        status: 'processing',
      }
    });

    // Multi-detector humanization process
    let humanizedText = text;
    let detectorScores = { huggingFace: 100, heuristic: 100, perplexity: 100 };
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      attempts++;
      
      try {
        // Humanize the text
        humanizedText = await humanizeText(humanizedText, attempts);
        
        // Test with multiple detection methods
        const [huggingFaceScore, heuristicScore, perplexityScore] = await Promise.allSettled([
          detectWithHuggingFace(humanizedText),
          calculateHeuristicScore(humanizedText),
          calculatePerplexityScore(humanizedText)
        ]);

        detectorScores = {
          huggingFace: huggingFaceScore.status === 'fulfilled' ? huggingFaceScore.value : 50,
          heuristic: heuristicScore.status === 'fulfilled' ? heuristicScore.value : 50,
          perplexity: perplexityScore.status === 'fulfilled' ? perplexityScore.value : 50
        };

        // Check if average score is below 15% (more realistic threshold)
        const averageScore = (detectorScores.huggingFace + detectorScores.heuristic + detectorScores.perplexity) / 3;
        
        if (averageScore < 15) {
          break; // Success!
        }

        // Brief pause between attempts
        if (attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      } catch (error) {
        console.error(`Attempt ${attempts} failed:`, error);
        if (attempts === maxAttempts) {
          throw error;
        }
      }
    }

    // Calculate final results
    const averageScore = (detectorScores.huggingFace + detectorScores.heuristic + detectorScores.perplexity) / 3;
    const allPassedValidation = averageScore < 15;

    // Update the text process
    const updatedProcess = await prisma.textProcess.update({
      where: { id: textProcess.id },
      data: {
        humanizedText,
        aiDetectionScore: Math.round(averageScore * 100) / 100,
        status: 'completed',
        detectorResults: detectorScores,
      }
    });

    // Only deduct credit if validation passed
    let creditsChanged = 0;
    let creditsRemaining = user.credits;
    
    if (allPassedValidation) {
      await prisma.user.update({
        where: { id: user.id },
        data: { credits: user.credits - 1 }
      });
      creditsChanged = -1;
      creditsRemaining = user.credits - 1;
    }

    // Log usage
    await prisma.usageHistory.create({
      data: {
        userId: user.id,
        action: 'humanize',
        details: { 
          textLength: text.length,
          aiDetectionScore: Math.round(averageScore * 100) / 100,
          detectorScores,
          attempts,
          allPassedValidation,
          processId: textProcess.id,
          creditsCharged: allPassedValidation ? 1 : 0
        },
        creditsChanged,
      }
    });

    return NextResponse.json({
      id: updatedProcess.id,
      humanizedText: updatedProcess.humanizedText,
      aiDetectionScore: Math.round(averageScore * 100) / 100,
      detectorScores,
      allPassedValidation,
      attempts,
      creditsRemaining,
    });

  } catch (error) {
    console.error('Humanize error:', error);
    
    // Try to update process status to failed
    try {
      const failedProcesses = await prisma.textProcess.findMany({
        where: {
          userId: (await prisma.user.findUnique({
            where: { email: (await getServerSession())?.user?.email || '' }
          }))?.id,
          status: 'processing'
        },
        orderBy: { createdAt: 'desc' },
        take: 1
      });

      if (failedProcesses.length > 0) {
        await prisma.textProcess.update({
          where: { id: failedProcesses[0].id },
          data: { status: 'failed' }
        });
      }
    } catch (updateError) {
      console.error('Failed to update process status:', updateError);
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function humanizeText(text: string, attempt: number = 1): Promise<string> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo', // Using GPT-4 Turbo (most stable version)
        messages: [
          {
            role: 'system',
            content: getHumanizationPrompt(attempt)
          },
          {
            role: 'user',
            content: text
          }
        ],
        temperature: 0.7 + (attempt * 0.1),
        max_tokens: Math.min(Math.ceil(text.length * 1.5), 4000),
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API request failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const result = data.choices[0]?.message?.content || text;
    
    return cleanHumanizedText(result);
  } catch (error) {
    clearTimeout(timeoutId);
    console.error('Error humanizing text:', error);
    
    return fallbackHumanization(text, attempt);
  }
}

function cleanHumanizedText(text: string): string {
  return text
    .replace(/^(Here's|Here is|Certainly!?\s*Here's|Sure!?\s*Here's|The humanized version is:?)\s*/i, '')
    .replace(/^(Humanized text:?|Rewritten text:?)\s*/i, '')
    .replace(/^\s*["']|["']\s*$/g, '')
    .trim();
}

function fallbackHumanization(text: string, attempt: number): string {
  let result = text;
  
  const modifications = [
    () => result
      .replace(/\b(However|Furthermore|Moreover|Additionally)\b/g, (match) => {
        const alternatives = {
          'However': ['But', 'Though', 'Yet', 'Still'][Math.floor(Math.random() * 4)],
          'Furthermore': ['Also', 'Plus', 'What\'s more', 'Beyond that'][Math.floor(Math.random() * 4)],
          'Moreover': ['Plus', 'Also', 'On top of that', 'What\'s more'][Math.floor(Math.random() * 4)],
          'Additionally': ['And', 'Also', 'Plus', 'Too'][Math.floor(Math.random() * 4)]
        };
        return alternatives[match as keyof typeof alternatives] || match;
      })
      .replace(/\b(utilize|implement|facilitate|demonstrate)\b/g, (match) => {
        const alternatives = {
          'utilize': 'use',
          'implement': 'put in place',
          'facilitate': 'help',
          'demonstrate': 'show'
        };
        return alternatives[match as keyof typeof alternatives] || match;
      }),
    
    () => result
      .replace(/\. ([A-Z])/g, (match, letter) => 
        Math.random() > 0.4 ? `. ${letter}` : `, and ${letter.toLowerCase()}`
      )
      .replace(/\bin order to\b/g, 'to')
      .replace(/\bit is important to note that\b/gi, 'note that')
      .replace(/\bIt should be noted that\b/gi, 'Worth noting:'),
    
    () => result
      .split('. ')
      .map((sentence, index) => {
        if (Math.random() > 0.6 && sentence.length > 40) {
          const parts = sentence.split(', ');
          if (parts.length > 2) {
            return parts.slice(1).concat(parts[0]).join(', ');
          }
        }
        return sentence;
      })
      .join('. ')
  ];

  for (let i = 0; i < Math.min(attempt, modifications.length); i++) {
    result = modifications[i]();
  }

  return result;
}

function getHumanizationPrompt(attempt: number): string {
  const prompts = [
    'Rewrite this text to sound completely natural and human-written. Vary sentence structure, use conversational language, and make it flow naturally. Keep all the key information but make it sound like a real person wrote it. Return only the rewritten text.',
    
    'Completely rewrite this text with maximum human variation. Use different sentence lengths, add natural transitions, include some informal language, and make the writing style unpredictable while keeping the core message. Return only the rewritten text.',
    
    'Transform this text to be maximally human-like. Restructure paragraphs, use idiomatic expressions, add natural imperfections, vary rhythm and flow, and include subtle personality. Make it sound authentically human while preserving all important information. Return only the rewritten text.'
  ];

  return prompts[Math.min(attempt - 1, prompts.length - 1)];
}

// Enhanced Detection Methods

async function detectWithHuggingFace(text: string): Promise<number> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch('https://api-inference.huggingface.co/models/roberta-base-openai-detector', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: text,
        options: { wait_for_model: true }
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.status}`);
    }

    const data = await response.json();
    const fakeScore = data[0]?.find((item: any) => item.label === 'FAKE')?.score || 0;
    return Math.round(fakeScore * 10000) / 100;
    
  } catch (error) {
    clearTimeout(timeoutId);
    console.error('Hugging Face detection error:', error);
    return calculateHeuristicScore(text);
  }
}

async function calculateHeuristicScore(text: string): Promise<number> {
  let score = 0;
  
  // Sentence analysis
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const sentenceLengths = sentences.map(s => s.trim().split(/\s+/).length);
  const avgSentenceLength = sentenceLengths.reduce((a, b) => a + b, 0) / sentenceLengths.length;
  
  // AI tends to have consistent sentence lengths (15-25 words)
  if (avgSentenceLength > 15 && avgSentenceLength < 25) {
    score += 20;
  }
  
  // Calculate sentence length variance
  const variance = sentenceLengths.reduce((acc, len) => acc + Math.pow(len - avgSentenceLength, 2), 0) / sentenceLengths.length;
  if (variance < 10) { // Low variance = more AI-like
    score += 15;
  }
  
  // Vocabulary analysis
  const words = text.toLowerCase().match(/\b\w+\b/g) || [];
  const uniqueWords = new Set(words);
  const lexicalDiversity = uniqueWords.size / words.length;
  
  if (lexicalDiversity < 0.4) { // Low diversity = more repetitive = more AI-like
    score += 25;
  }
  
  // Formal language patterns
  const formalPatterns = [
    /\b(furthermore|moreover|additionally|consequently|therefore|thus|hence)\b/gi,
    /\b(it is important to note|it should be noted|it is worth mentioning)\b/gi,
    /\b(in conclusion|to summarize|in summary)\b/gi,
    /\b(utilize|implement|facilitate|demonstrate|establish)\b/gi
  ];
  
  let formalCount = 0;
  formalPatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) formalCount += matches.length;
  });
  
  if (formalCount > 3) {
    score += 20;
  }
  
  // Transition word overuse
  const transitions = text.match(/\b(however|therefore|furthermore|moreover|additionally|consequently)\b/gi) || [];
  if (transitions.length > sentences.length * 0.3) {
    score += 15;
  }
  
  // Passive voice detection
  const passivePatterns = /\b(was|were|is|are|been)\s+\w+ed\b/gi;
  const passiveMatches = text.match(passivePatterns) || [];
  if (passiveMatches.length > sentences.length * 0.4) {
    score += 10;
  }
  
  return Math.min(Math.max(score, 5), 95);
}

async function calculatePerplexityScore(text: string): Promise<number> {
  // Simplified perplexity calculation based on word frequency and patterns
  const words = text.toLowerCase().match(/\b\w+\b/g) || [];
  
  // Common English word frequencies (simplified)
  const commonWords = new Set([
    'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 
    'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this', 'but', 'his', 
    'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or', 'an', 'will', 'my',
    'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out', 'if',
    'about', 'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can', 'like',
    'time', 'no', 'just', 'him', 'know', 'take', 'people', 'into', 'year', 'your'
  ]);
  
  let score = 0;
  
  // Calculate ratio of common to uncommon words
  const commonWordCount = words.filter(word => commonWords.has(word)).length;
  const commonWordRatio = commonWordCount / words.length;
  
  // AI text often has lower common word ratios (more formal vocabulary)
  if (commonWordRatio < 0.4) {
    score += 30;
  }
  
  // Check for repetitive n-grams (2-word and 3-word phrases)
  const bigrams = [];
  const trigrams = [];
  
  for (let i = 0; i < words.length - 1; i++) {
    bigrams.push(`${words[i]} ${words[i + 1]}`);
  }
  
  for (let i = 0; i < words.length - 2; i++) {
    trigrams.push(`${words[i]} ${words[i + 1]} ${words[i + 2]}`);
  }
  
  // Count unique vs total n-grams
  const uniqueBigrams = new Set(bigrams);
  const uniqueTrigrams = new Set(trigrams);
  
  const bigramRepetition = 1 - (uniqueBigrams.size / bigrams.length);
  const trigramRepetition = 1 - (uniqueTrigrams.size / trigrams.length);
  
  if (bigramRepetition > 0.3) score += 20;
  if (trigramRepetition > 0.2) score += 25;
  
  // Check for predictable patterns
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  let patternScore = 0;
  
  sentences.forEach(sentence => {
    const trimmed = sentence.trim();
    // Check for formulaic sentence starters
    if (/^(This|These|The|In|By|Through|With|For|As)\s/i.test(trimmed)) {
      patternScore += 2;
    }
    // Check for formulaic endings
    if (/\b(important|significant|crucial|essential|necessary|beneficial)\s*\.?\s*$/i.test(trimmed)) {
      patternScore += 2;
    }
  });
  
  score += Math.min(patternScore, 20);
  
  return Math.min(Math.max(score, 5), 95);
}