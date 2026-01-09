import { supabase } from '@/integrations/supabase/client';

export interface ElevenLabsTranscript {
  id?: string;
  user_id?: string;
  interview_id: string;
  content: string;
  timestamp: string;
  conversation_id?: string;
  created_at?: string;
}

export interface TranscriptAnalysis {
  strengths: string[];
  weaknesses: string[];
  score: number;
  recommendations: string[];
}

// Store ElevenLabs transcript using RPC function
export const storeTranscript = async (transcript: ElevenLabsTranscript) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be authenticated to store transcript');
  }

  const { data: transcriptId, error } = await supabase.rpc('store_elevenlabs_transcript', {
    p_user_id: user.id,
    p_interview_id: transcript.interview_id,
    p_content: transcript.content,
    p_timestamp: transcript.timestamp,
    p_conversation_id: transcript.conversation_id || null
  });

  if (error) {
    console.error('Error storing transcript:', error);
    throw error;
  }

  return { id: transcriptId, ...transcript, user_id: user.id };
};

// Analyze transcript using Edge Function (secure server-side API call)
export const analyzeTranscript = async (transcriptContent: string): Promise<TranscriptAnalysis> => {
  try {
    const { data, error } = await supabase.functions.invoke('analyze-transcript', {
      body: { transcriptContent }
    });

    if (error) {
      console.error('Error calling analyze-transcript function:', error);
      throw error;
    }

    return {
      strengths: data.strengths || [],
      weaknesses: data.weaknesses || [],
      score: data.score || 0,
      recommendations: data.recommendations || []
    };
  } catch (error) {
    console.error('Error analyzing transcript:', error);
    throw error;
  }
};

// Store analysis results
export const storeAnalysisResults = async (
  interviewId: string,
  analysis: TranscriptAnalysis
) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be authenticated to store analysis');
  }

  const analysisData = {
    user_id: user.id,
    interview_type: 'ElevenLabs Interview',
    overall_score: analysis.score,
    communication_score: Math.round(analysis.score * 0.9), // Derived score
    technical_score: Math.round(analysis.score * 1.1), // Derived score
    confidence_score: analysis.score,
    problem_solving_score: analysis.score,
    strengths: analysis.strengths,
    areas_for_improvement: analysis.weaknesses,
    feedback: analysis.recommendations.join('. '),
    transcript_summary: `Interview analysis completed with score: ${analysis.score}/100`,
  };

  const { data, error } = await supabase
    .from('interview_analyses')
    .insert([analysisData])
    .select()
    .single();

  if (error) {
    console.error('Error storing analysis results:', error);
    throw error;
  }

  return data;
};

// Complete workflow: collect, store, analyze, and save
export const processElevenLabsTranscript = async (
  conversationId: string,
  transcriptContent: string
) => {
  try {
    console.log('🎯 Starting ElevenLabs transcript processing...');
    
    // Generate interview ID
    const interviewId = `elevenlabs_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Step 1: Store transcript
    const storedTranscript = await storeTranscript({
      interview_id: interviewId,
      content: transcriptContent,
      timestamp: new Date().toISOString(),
      conversation_id: conversationId,
    });
    
    console.log('✅ Transcript stored:', storedTranscript.id);
    
    // Step 2: Analyze transcript
    const analysis = await analyzeTranscript(transcriptContent);
    console.log('🧠 Analysis completed:', analysis);
    
    // Step 3: Store analysis results
    const storedAnalysis = await storeAnalysisResults(interviewId, analysis);
    console.log('💾 Analysis results stored:', storedAnalysis.id);
    
    // Step 4: Trigger dashboard update event
    window.dispatchEvent(new CustomEvent('newInterviewAnalysis'));
    window.dispatchEvent(new CustomEvent('refreshInterviewAnalyses'));
    
    return {
      success: true,
      transcriptId: storedTranscript.id,
      analysisId: storedAnalysis.id,
      analysis
    };
    
  } catch (error) {
    console.error('❌ Error processing ElevenLabs transcript:', error);
    throw error;
  }
};