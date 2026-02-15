import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    let { resumeText, targetRole } = await req.json();

    if (!resumeText || resumeText.trim().length < 50) {
      return new Response(JSON.stringify({ error: 'Resume text must be at least 50 characters' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Truncate resume text to ~100k characters (~25k tokens) to stay within API limits
    const MAX_CHARS = 100000;
    if (resumeText.length > MAX_CHARS) {
      console.warn(`Resume text truncated from ${resumeText.length} to ${MAX_CHARS} characters`);
      resumeText = resumeText.substring(0, MAX_CHARS);
    }

    const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY');
    if (!OPENROUTER_API_KEY) {
      throw new Error('OPENROUTER_API_KEY is not configured');
    }

    const prompt = `You are an expert ATS (Applicant Tracking System) resume analyzer. Analyze the following resume text and provide a detailed ATS compatibility report.

${targetRole ? `The target role is: ${targetRole}` : 'No specific target role provided.'}

Resume Text:
---
${resumeText}
---

Respond with ONLY valid JSON in this exact format (no markdown, no code blocks):
{
  "overallScore": <number 0-100>,
  "sections": {
    "contactInfo": { "score": <0-100>, "feedback": "<brief feedback>" },
    "summary": { "score": <0-100>, "feedback": "<brief feedback>" },
    "experience": { "score": <0-100>, "feedback": "<brief feedback>" },
    "skills": { "score": <0-100>, "feedback": "<brief feedback>" },
    "education": { "score": <0-100>, "feedback": "<brief feedback>" },
    "keywords": { "score": <0-100>, "feedback": "<brief feedback>" },
    "formatting": { "score": <0-100>, "feedback": "<brief feedback>" }
  },
  "suggestions": [
    { "priority": "high" | "medium" | "low", "category": "<category>", "text": "<actionable suggestion>" }
  ],
  "missingKeywords": ["<keyword1>", "<keyword2>"],
  "strengths": ["<strength1>", "<strength2>"],
  "summary_text": "<2-3 sentence overall assessment>"
}`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': Deno.env.get('OPENROUTER_SITE_URL') || 'https://ai-job-landing-site.lovable.app',
        'X-Title': Deno.env.get('OPENROUTER_SITE_NAME') || 'AI Interviewer',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-001',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenRouter API error [${response.status}]: ${errorText}`);
    }

    const result = await response.json();
    const content = result.choices?.[0]?.message?.content || '';

    // Parse JSON from response, stripping markdown code blocks if present
    const jsonMatch = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const analysisData = JSON.parse(jsonMatch);

    return new Response(JSON.stringify(analysisData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Resume scanner error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Failed to analyze resume' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
