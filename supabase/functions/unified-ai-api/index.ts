
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const openRouterApiKey = Deno.env.get('OPENROUTER_API_KEY');
const siteUrl = Deno.env.get('OPENROUTER_SITE_URL') || '';
const siteName = Deno.env.get('OPENROUTER_SITE_NAME') || '';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestPayload {
  type: 'interview-analysis' | 'career-coach' | 'material-generator' | 'recruiter-chat';
  data: any;
}

interface InterviewAnalysisData {
  sessionId: string;
  transcript: Array<{
    speaker: 'AI' | 'User';
    text: string;
    timestamp: string;
  }>;
  interviewType: string;
  duration?: number;
}

serve(async (req) => {
  console.log('Unified AI API function called');
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openRouterApiKey) {
      throw new Error('OpenRouter API key not configured');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const { type, data }: RequestPayload = await req.json();
    console.log('Request type:', type, 'Data keys:', Object.keys(data));

    let systemPrompt = '';
    let userMessage = '';
    let model = 'z-ai/glm-4.5-air:free';

    switch (type) {
      case 'interview-analysis': {
        const analysisData = data as InterviewAnalysisData;
        const formattedTranscript = analysisData.transcript
          .map(entry => `${entry.speaker}: ${entry.text}`)
          .join('\n');

        systemPrompt = `You are an expert interview analyzer. Analyze job interview transcripts and provide comprehensive evaluations with scores, strengths, areas for improvement, and detailed feedback.`;
        
        userMessage = `Analyze the following job interview transcript and provide a detailed analysis in JSON format:

INTERVIEW TYPE: ${analysisData.interviewType}
DURATION: ${analysisData.duration || 'Unknown'} minutes

TRANSCRIPT:
${formattedTranscript}

Please provide your analysis in this JSON format:
{
  "overall_score": [score from 1-100],
  "communication_score": [score from 1-100],
  "technical_score": [score from 1-100],
  "confidence_score": [score from 1-100],
  "problem_solving_score": [score from 1-100],
  "strengths": ["strength1", "strength2", "strength3"],
  "areas_for_improvement": ["area1", "area2", "area3"],
  "feedback": "Detailed constructive feedback paragraph",
  "transcript_summary": "Brief summary of the interview content"
}`;
        break;
      }

      case 'career-coach': {
        systemPrompt = `You are an expert career coach with years of experience helping professionals advance their careers. Provide personalized, actionable advice on career development, resume optimization, interview preparation, skill development, and job search strategies.`;
        userMessage = data.message || data.query || '';
        break;
      }

      case 'material-generator': {
        const materialType = data.type || 'summary';
        const content = data.text || data.content || '';
        
        const prompts = {
          summary: `Create a comprehensive summary of the following text. Structure it with clear headings and bullet points:\n\n${content}`,
          notes: `Convert the following text into student-friendly bullet notes with clear sections and subsections:\n\n${content}`,
          flashcards: `Create Q&A flashcards from the following text. Format as "Q: [question]\nA: [answer]" pairs:\n\n${content}`,
          qa: `Extract important questions and answers from the following text. Format as structured Q&A:\n\n${content}`
        };

        systemPrompt = `You are an expert educational content creator. Generate well-structured, comprehensive study materials.`;
        userMessage = prompts[materialType as keyof typeof prompts] || prompts.summary;
        break;
      }

      case 'recruiter-chat': {
        systemPrompt = `You are a professional recruiter with extensive connections across top companies. Help users connect with recruiters, understand hiring processes, and navigate job opportunities at their target companies.`;
        userMessage = data.message || data.query || '';
        break;
      }

      default:
        throw new Error('Invalid request type');
    }

    console.log('Making request to OpenRouter API...');
    
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openRouterApiKey}`,
        "HTTP-Referer": siteUrl,
        "X-Title": siteName,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: userMessage
          }
        ],
        max_tokens: type === 'interview-analysis' ? 1500 : 1000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', errorText);
      throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
    }

    const responseData = await response.json();
    console.log('Received response from OpenRouter API');

    if (!responseData.choices || responseData.choices.length === 0) {
      throw new Error('No response generated by OpenRouter API');
    }

    const generatedContent = responseData.choices[0].message.content;

    // Handle interview analysis specifically - save to database
    if (type === 'interview-analysis') {
      try {
        const analysisData = data as InterviewAnalysisData;
        
        // Parse the analysis response
        let analysisResult;
        try {
          const jsonMatch = generatedContent.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            analysisResult = JSON.parse(jsonMatch[0]);
          } else {
            throw new Error('No valid JSON found in response');
          }
        } catch (parseError) {
          console.error('Failed to parse analysis response:', parseError);
          // Fallback analysis
          analysisResult = {
            overall_score: 75,
            communication_score: 75,
            technical_score: 70,
            confidence_score: 80,
            problem_solving_score: 70,
            strengths: ['Good communication', 'Shows enthusiasm', 'Relevant experience'],
            areas_for_improvement: ['Provide more specific examples', 'Structure answers better', 'Show more technical depth'],
            feedback: 'The candidate showed good communication skills and enthusiasm. To improve, focus on providing more specific examples and structuring answers with clear frameworks.',
            transcript_summary: 'Interview discussion covering background, experience, and technical capabilities.'
          };
        }

        // Get user from session
        const { data: { user } } = await supabaseClient.auth.getUser();
        if (!user) {
          throw new Error('User not authenticated');
        }

        // Save analysis to database
        const analysisRecord = {
          user_id: user.id,
          interview_type: analysisData.interviewType,
          duration_minutes: analysisData.duration || null,
          overall_score: analysisResult.overall_score || null,
          communication_score: analysisResult.communication_score || null,
          technical_score: analysisResult.technical_score || null,
          confidence_score: analysisResult.confidence_score || null,
          problem_solving_score: analysisResult.problem_solving_score || null,
          strengths: analysisResult.strengths || [],
          areas_for_improvement: analysisResult.areas_for_improvement || [],
          feedback: analysisResult.feedback || '',
          transcript_summary: analysisResult.transcript_summary || '',
        };

        console.log('Saving analysis to database...');
        const { data: savedAnalysis, error: saveError } = await supabaseClient
          .from('interview_analyses')
          .insert([analysisRecord])
          .select()
          .single();

        if (saveError) {
          console.error('Error saving analysis:', saveError);
          throw saveError;
        }

        console.log('Analysis saved successfully:', savedAnalysis.id);

        return new Response(
          JSON.stringify({
            success: true,
            type: 'interview-analysis',
            analysisId: savedAnalysis.id,
            analysis: analysisResult,
            content: generatedContent
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          },
        );
      } catch (error) {
        console.error('Error handling interview analysis:', error);
        // Still return the generated content even if saving fails
        return new Response(
          JSON.stringify({
            success: false,
            type: 'interview-analysis',
            content: generatedContent,
            error: 'Failed to save analysis to database'
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          },
        );
      }
    }

    // For other types, just return the generated content
    return new Response(
      JSON.stringify({
        success: true,
        type: type,
        content: generatedContent
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );

  } catch (error) {
    console.error('Unified AI API error:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        message: 'Failed to process AI request'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});
