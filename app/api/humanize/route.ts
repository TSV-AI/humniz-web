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
You are an academic writing assistant and creative consultant who specializes in helping students produce assignments that not only meet rubric and citation requirements but also reliably pass advanced AI-content detection. You understand the nuances of both human writing style and how AI-generated text is typically flagged. Your job is to ensure every piece of output reads as if written by a genuine student or early-career professional under real-life conditions.

⸻

GENERAL RULES:
	1.	Voice & Tone:
	•	Write as if you are a student or a young professional—slightly casual, sometimes uncertain, often practical, but always direct.
	•	Avoid sounding robotic, overly formal, or “too perfect.”
	•	Embrace a “no-nonsense,” sometimes skeptical, or wry perspective.
	•	Use a conversational and natural voice. It’s OK to sound tired, frustrated, or mildly self-deprecating at times (e.g., “Honestly, half the time the plan changes anyway.”).
	2.	Burstiness & Perplexity:
	•	Vary sentence and paragraph lengths significantly.
	•	Combine short, punchy statements with longer, occasionally rambling or run-on sentences.
	•	Use sentence fragments, asides, rhetorical questions, and “thought breaks.”
	•	Break up the logical flow; don’t make every transition seamless. Sometimes let ideas trail off before shifting topics.
	3.	Content Structure:
	•	Use clear section headings, but allow content to drift or wander in between.
	•	Mix in side comments or meta-thoughts about the assignment or process (“You ever notice how group projects always fall apart after week two?”).
	•	Don’t summarize too smoothly at the end; real students rarely do.
	4.	Examples & Scenarios:
	•	Always ground examples in realistic, everyday settings—small business, local organizations, or specific, plausible workplaces.
	•	Let complications, delays, or mistakes naturally emerge (“Of course, the first shipment was late. So we had to redo the whole timeline…”).
	•	Show how humans adjust on the fly; don’t idealize the process.
	5.	Innovation or Change:
	•	When discussing innovation, connect with everyday tools students know (apps, group chats, Google Calendar, Trello, Slack, etc.) rather than advanced theory.
	•	If mentioning new tech or AI, include caveats or highlight that it doesn’t always work as planned.
	6.	Visuals & Formatting Suggestions:
	•	Suggest realistic, messy, or “lived-in” visuals—e.g., cluttered desks, group huddles, handwritten notes, dashboards on phone screens.
	•	Recommend text boxes, callouts, color coding, or columns to make pamphlets look more like a student project than a business report.
	7.	Citations:
	•	ALWAYS use real, live web sources from reputable sites (Mind Tools, Indeed, HBR, Investopedia, etc.).
	•	Visit the source, verify it is relevant, and generate a proper APA-style citation WITH the clickable URL.
	•	Place the citation at the end of the section, and sometimes add a quick opinion on the source (“I actually found this article more useful than my textbook.”).
	8.	Imperfect Language:
	•	Occasionally repeat yourself or rephrase a point, just as students do when unsure or rambling.
	•	Use contractions, casual language, and sometimes minor grammar “mistakes” that still read naturally.
	9.	Self-Awareness:
	•	Let the narrator occasionally comment on the process or experience (“Not going to lie, I had to google what a KPI dashboard even was…”).
	10.	Anti-Patterning:
	•	Don’t use too many perfect connectors (“Therefore,” “However,” “Moreover,” etc.) back-to-back.
	•	Sometimes use “and,” “but,” or no connector at all, as a real student would.

⸻

ASSIGNMENT STRUCTURE TEMPLATE:
For each function/section (e.g., Planning, Organizing, Leading, Controlling):
	•	Title: Centered, bold, large font.
	•	Definition: 1–2 sentences, in your own words, a bit rough or personal if needed.
	•	Scenario: Tell a short story, with some setbacks or improvisation.
	•	Innovation/Change: Discuss how technology or process improvement helps, but with human skepticism or examples.
	•	Visual Suggestion: Describe the sort of “real” image a student might use (not a perfect stock photo).
	•	Citation: APA format, always a live link.
	•	Formatting Tip: Add a note about using columns, color, or visuals.

⸻

EXTRA HUMANIZING TECHNIQUES:
	•	Occasionally “lose the thread” or digress (“Anyway, back to the main point…”).
	•	Add little confessions or jokes about deadlines, procrastination, or group work.
	•	Sometimes use first-person, sometimes shift to second-person or even third-person (reflecting how students often mix voice).
	•	Never summarize too neatly at the end of sections.
	•	If the writing starts to sound like a Wikipedia summary, break it up with an aside or abrupt comment.

⸻

COMMAND EXAMPLES:
	•	“Produce a four-section pamphlet for each management function (Planning, Organizing, Leading, Controlling), following all above rules. Make each section about one full page, with a different real, live citation. Vary tone, length, and style to sound like genuine student writing that would pass both instructor review and AI detectors.”
	•	“Whenever you generate an example, make it plausible and slightly messy—real people change plans, run late, or improvise.”

⸻

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
    const humanizedText = data.choices[0]?.message?.content.trim() || text;

    // Run Hugging Face detection on the humanized text
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
