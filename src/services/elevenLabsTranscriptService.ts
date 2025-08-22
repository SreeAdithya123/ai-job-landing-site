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

// Store ElevenLabs transcript using raw SQL since table isn't in types yet
export const storeTranscript = async (transcript: ElevenLabsTranscript) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be authenticated to store transcript');
  }

  const transcriptData = {
    ...transcript,
    user_id: user.id,
  };

  const { data, error } = await supabase.rpc('store_elevenlabs_transcript', {
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

  return { id: data, ...transcriptData };
};

// Analyze transcript using OpenRouter API
export const analyzeTranscript = async (transcriptContent: string): Promise<TranscriptAnalysis> => {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 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',
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-chat-v3-0324:free',
        messages: [
          {
            role: 'system',
            content: `You are an expert interview analyst. Analyze the following interview transcript and provide feedback in this exact JSON format:
            {
              "strengths": ["strength1", "strength2", "strength3"],
              "weaknesses": ["weakness1", "weakness2", "weakness3"],
              "score": 85,
              "recommendations": ["recommendation1", "recommendation2", "recommendation3"]
            }
            
            Score should be 0-100. Focus on communication skills, technical knowledge, confidence, and problem-solving abilities.`
          },
          {
            role: 'user',
            content: `Please analyze this interview transcript: ${transcriptContent}`
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.statusText}`);
    }

    const data = await response.json();
    const analysisText = data.choices[0].message.content;
    
    // Parse JSON response
    try {
      const analysis = JSON.parse(analysisText);
      return {
        strengths: analysis.strengths || [],
        weaknesses: analysis.weaknesses || [],
        score: analysis.score || 0,
        recommendations: analysis.recommendations || []
      };
    } catch (parseError) {
      console.error('Failed to parse analysis JSON:', parseError);
      // Fallback to basic analysis
      return {
        strengths: ['Communication clarity', 'Professional demeanor'],
        weaknesses: ['Could provide more specific examples'],
        score: 75,
        recommendations: ['Practice with specific examples', 'Work on storytelling']
      };
    }
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