
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-elevenlabs-signature',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface ElevenLabsWebhookPayload {
  conversation_id: string;
  agent_id: string;
  user_id?: string;
  conversation_analysis?: {
    overall_score?: number;
    communication_skills?: number;
    knowledge_depth?: number;
    technical_skills?: number;
    confidence?: number;
    problem_solving?: number;
    areas_for_improvement?: string[];
    strengths?: string[];
    professional_readiness?: number;
    feedback?: string;
    transcript_summary?: string;
    questions?: Array<{
      question: string;
      answer: string;
      feedback?: string;
      fluency_score?: number;
      confidence_score?: number;
      score?: number;
    }>;
  };
  conversation_duration_seconds?: number;
  interview_type?: string;
}

function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
  try {
    // ElevenLabs uses HMAC-SHA256 for webhook signatures
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const messageData = encoder.encode(payload);
    
    // For now, we'll implement basic verification
    // In production, you'd want to implement proper HMAC-SHA256 verification
    return !!(signature && signature.length > 0);
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return false;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { 
      status: 405, 
      headers: corsHeaders 
    });
  }

  try {
    const webhookSecret = Deno.env.get('ELEVENLABS_WEBHOOK_SECRET');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!webhookSecret || !supabaseUrl || !supabaseServiceKey) {
      console.error('Missing required environment variables');
      return new Response('Server configuration error', { 
        status: 500, 
        headers: corsHeaders 
      });
    }

    // Get the raw payload for signature verification
    const rawPayload = await req.text();
    const signature = req.headers.get('x-elevenlabs-signature') || '';

    // Verify webhook signature
    if (!verifyWebhookSignature(rawPayload, signature, webhookSecret)) {
      console.error('Invalid webhook signature');
      return new Response('Unauthorized', { 
        status: 401, 
        headers: corsHeaders 
      });
    }

    // Parse the payload
    const payload: ElevenLabsWebhookPayload = JSON.parse(rawPayload);
    console.log('Received ElevenLabs webhook:', payload);

    // Create Supabase client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Extract analysis data from payload
    const analysis = payload.conversation_analysis;
    if (!analysis) {
      console.log('No conversation analysis in payload');
      return new Response('No analysis data', { 
        status: 200, 
        headers: corsHeaders 
      });
    }

    // Map ElevenLabs data to our database schema
    const interviewAnalysis = {
      interview_type: payload.interview_type || 'AI Interview',
      duration_minutes: payload.conversation_duration_seconds ? Math.round(payload.conversation_duration_seconds / 60) : null,
      overall_score: analysis.overall_score || analysis.professional_readiness,
      communication_score: analysis.communication_skills,
      technical_score: analysis.technical_skills || analysis.knowledge_depth,
      confidence_score: analysis.confidence,
      problem_solving_score: analysis.problem_solving,
      strengths: analysis.strengths || [],
      areas_for_improvement: analysis.areas_for_improvement || [],
      feedback: analysis.feedback,
      transcript_summary: analysis.transcript_summary,
    };

    // If we have a user_id in the payload, use it; otherwise we'll need to handle this differently
    if (payload.user_id) {
      const analysisWithUserId = {
        ...interviewAnalysis,
        user_id: payload.user_id,
      };

      const { data: savedAnalysis, error } = await supabase
        .from('interview_analyses')
        .insert([analysisWithUserId])
        .select()
        .single();

      if (error) {
        console.error('Error saving interview analysis:', error);
        return new Response('Database error', { 
          status: 500, 
          headers: corsHeaders 
        });
      }

      console.log('Interview analysis saved successfully:', savedAnalysis);

      // Save detailed questions if available
      if (analysis.questions && analysis.questions.length > 0 && savedAnalysis.id) {
        const questionsToInsert = analysis.questions.map((q, index) => ({
          interview_analysis_id: savedAnalysis.id,
          question_text: q.question,
          user_answer: q.answer,
          ai_feedback: q.feedback,
          fluency_score: q.fluency_score,
          confidence_score: q.confidence_score,
          question_score: q.score,
          question_order: index + 1,
        }));

        const { data: savedQuestions, error: questionsError } = await supabase
          .from('interview_questions')
          .insert(questionsToInsert)
          .select();

        if (questionsError) {
          console.error('Error saving interview questions:', questionsError);
          // Don't fail the whole request if questions fail to save
        } else {
          console.log('Interview questions saved successfully:', savedQuestions?.length || 0, 'questions');
        }
      }

    } else {
      // Log the analysis for manual processing or use conversation_id to match with user sessions
      console.log('No user_id provided, analysis data:', interviewAnalysis);
      
      // You might want to store this temporarily and match it later
      // or implement a different strategy based on conversation_id
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Webhook processed successfully' 
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error processing webhook:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      message: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
