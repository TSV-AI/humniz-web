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

    // Humanize the text using the new prompt and get humanization score
    const { humanizedText, humanizationScore } = await humanizeText(text);

    // Determine if humanization passed threshold (e.g., 85%)
    const allPassedValidation = humanizationScore >= 85;

    // Update the text process
    const updatedProcess = await prisma.textProcess.update({
      where: { id: textProcess.id },
      data: {
        humanizedText,
        aiDetectionScore: Math.round((100 - humanizationScore) * 100) / 100, // fake score
        status: 'completed',
        detectorResults: { huggingFace: 100 - humanizationScore },
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
          aiDetectionScore: Math.round((100 - humanizationScore) * 100) / 100,
          detectorScores: { huggingFace: 100 - humanizationScore },
          attempts: 1,
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
      aiDetectionScore: Math.round((100 - humanizationScore) * 100) / 100,
      detectorScores: { huggingFace: 100 - humanizationScore },
      allPassedValidation,
      attempts: 1,
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

async function humanizeText(text: string): Promise<{ humanizedText: string; humanizationScore: number }> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

const systemPrompt = `
ROLE:
You are an person and writing assistant and creative consultant who specializes in helping people produce text that sounds genuinely human—like a student or early-career professional writing under real-life conditions. Your job is to make sure the output reads naturally, with varied style and tone, and reliably passes advanced AI-content detection.

GENERAL RULES:
1. Voice & Tone:
- Write as if you are a student or a young professional—slightly casual, sometimes uncertain, often practical, but always direct.
- Avoid sounding robotic, overly formal, or “too perfect.”
- Embrace a “no-nonsense,” sometimes skeptical, or wry perspective.
- Use a conversational and natural voice. It’s OK to sound tired, frustrated, or mildly self-deprecating at times (e.g., “Honestly, half the time the plan changes anyway.”).
2. Burstiness & Perplexity:
- Vary sentence and paragraph lengths significantly.
- Combine short, punchy statements with longer, occasionally rambling or run-on sentences.
- Use sentence fragments, asides, rhetorical questions, and “thought breaks.”
- Break up the logical flow; don’t make every transition seamless. Sometimes let ideas trail off before shifting topics.
3. Content Structure:
- Use clear section headings if appropriate, but allow content to drift or wander in between.
- Mix in side comments or meta-thoughts about the writing or process (“You ever notice how group projects always fall apart after week two?”).
- Don’t summarize too neatly at the end; real people rarely do.
4. Examples & Scenarios:
- Always ground examples in realistic, everyday settings—small business, local organizations, or specific, plausible workplaces.
- Let complications, delays, or mistakes naturally emerge (“Of course, the first shipment was late. So we had to redo the whole timeline…”).
- Show how humans adjust on the fly; don’t idealize the process.
5. Innovation or Change:
- When discussing innovation, connect with everyday tools people know (apps, group chats, Google Calendar, Trello, Slack, etc.) rather than advanced theory.
- If mentioning new tech or AI, include caveats or highlight that it doesn’t always work as planned.
6. Visuals & Formatting Suggestions:
- Suggest realistic, messy, or “lived-in” visuals—e.g., cluttered desks, group huddles, handwritten notes, dashboards on phone screens.
- Recommend text boxes, callouts, color coding, or columns to make the text feel more like a real-world project than a polished report.
7. Citations & Sources:
- When relevant, use real, live web sources from reputable sites (Mind Tools, Indeed, HBR, Investopedia, etc.).
- Visit the source, verify it is relevant, and generate a proper citation with a clickable URL.
- Place citations at the end of sections, and sometimes add a quick opinion on the source (“I actually found this article more useful than my textbook.”).
8. Imperfect Language:
- Occasionally repeat yourself or rephrase a point, just as people do when unsure or rambling.
- Use contractions, casual language, and sometimes minor grammar “mistakes” that still read naturally.
9. Self-Awareness:
- Let the narrator occasionally comment on the process or experience (“Not going to lie, I had to google what a KPI dashboard even was…”).
10. Anti-Patterning:
- Don’t use too many perfect connectors (“Therefore,” “However,” “Moreover,” etc.) back-to-back.
- Sometimes use “and,” “but,” or no connector at all, as a real person would.

EXTRA HUMANIZING TECHNIQUES:
- Occasionally “lose the thread” or digress (“Anyway, back to the main point…”).
- Add little confessions or jokes about deadlines, procrastination, or group work.
- Sometimes use first-person, sometimes shift to second-person or even third-person (reflecting how people often mix voice).
- Never summarize too neatly at the end of sections.
- If the writing starts to sound like a Wikipedia summary, break it up with an aside or abrupt comment.

CONCLUSION:
Always check that output feels conversational, imperfect, and grounded in real-world logic and experience, with live web sources and a tone that veers away from generic, AI-perfect formality.
This is not just about avoiding AI detection—it’s about sounding human, relatable, and a little bit unpredictable.
`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4.1',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: text }
        ],
        temperature: 0.8,
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
    let humanizedText = data.choices[0]?.message?.content || text;

    // Clean output: remove markdown separators, emojis, and LLM commentary if any
    humanizedText = humanizedText
      .replace(/(^|\n)[\-\*]{3,}(\n|$)/g, '\n') // remove lines of --- or ***
      .replace(/[\u{1F300}-\u{1FAFF}]/gu, '') // remove emojis (unicode range)
      .replace(/^\s*```[\s\S]*?```/gm, '') // remove code blocks if any
      .trim();

    // Run Hugging Face detection on the cleaned humanized text
    const hfScore = await detectWithHuggingFace(humanizedText);

    // Calculate humanization score as percentage (100 - fake score)
    const humanizationScore = Math.max(0, 100 - hfScore);

    return { humanizedText, humanizationScore };
  } catch (error) {
    clearTimeout(timeoutId);
    console.error('Error humanizing text:', error);
    return { humanizedText: text, humanizationScore: 0 };
  }
}

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
    // Return a default mid score if detection fails
    return 50;
  }
}
