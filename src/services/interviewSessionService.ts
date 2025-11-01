
import { supabase } from '@/integrations/supabase/client';

export interface TranscriptEntry {
  speaker: 'AI' | 'User';
  text: string;
  timestamp: string;
}

export interface InterviewSession {
  id?: string;
  session_id: string;
  user_id?: string;
  interview_type: string;
  question: string;
  user_response: string;
  ai_feedback?: string;
  transcript: TranscriptEntry[];
  audio_url?: string;
  duration_minutes?: number;
  timestamp_start?: string;
  timestamp_end?: string;
  created_at?: string;
  updated_at?: string;
}

// Helper function to safely convert JSON to TranscriptEntry[]
const parseTranscriptFromJson = (transcript: any): TranscriptEntry[] => {
  if (!Array.isArray(transcript)) {
    console.warn('Transcript is not an array:', transcript);
    return [];
  }

  return transcript.filter((entry: any) => {
    return entry && 
           typeof entry === 'object' && 
           typeof entry.speaker === 'string' &&
           typeof entry.text === 'string' &&
           typeof entry.timestamp === 'string' &&
           (entry.speaker === 'AI' || entry.speaker === 'User');
  }) as TranscriptEntry[];
};

export const saveInterviewSession = async (sessionData: InterviewSession) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be authenticated to save interview session');
  }

  const sessionRecord = {
    ...sessionData,
    user_id: user.id,
    transcript: sessionData.transcript as any, // Cast to Json type
  };

  const { data, error } = await supabase
    .from('interview_sessions')
    .insert([sessionRecord])
    .select()
    .single();

  if (error) {
    console.error('Error saving interview session:', error);
    throw error;
  }

  return data;
};

export const saveInterviewTranscript = async (
  sessionId: string,
  transcript: TranscriptEntry[],
  interviewType: string = 'general',
  duration?: number
) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user?.id || transcript.length < 2) {
    console.log('❌ Cannot save transcript: missing user or insufficient transcript data');
    return;
  }

  try {
    console.log(`💾 Saving transcript for session: ${sessionId}`);
    
    // Group transcript entries into Q&A pairs
    const qaPairs = [];
    let currentQuestion = '';
    let currentAnswer = '';

    for (const entry of transcript) {
      if (entry.speaker === 'AI' && entry.text && !entry.text.includes('Thank you for your time')) {
        // If we have a previous Q&A pair, save it
        if (currentQuestion && currentAnswer) {
          qaPairs.push({
            question: currentQuestion,
            answer: currentAnswer
          });
        }
        currentQuestion = entry.text;
        currentAnswer = '';
      } else if (entry.speaker === 'User' && entry.text) {
        currentAnswer = entry.text;
      }
    }

    // Add the last Q&A pair if it exists
    if (currentQuestion && currentAnswer) {
      qaPairs.push({
        question: currentQuestion,
        answer: currentAnswer
      });
    }

    console.log(`📝 Processing ${qaPairs.length} Q&A pairs`);

    // Save each Q&A pair to the interview_sessions table
    const sessionPromises = qaPairs.map((qa, index) => 
      supabase
        .from('interview_sessions')
        .insert({
          session_id: sessionId,
          user_id: user.id,
          interview_type: interviewType,
          question: qa.question,
          user_response: qa.answer,
          transcript: transcript as any, // Cast to Json type
          duration_minutes: duration,
          timestamp_end: new Date().toISOString(),
        })
    );

    await Promise.all(sessionPromises);

    console.log(`✅ Saved ${qaPairs.length} interview sessions to database`);
    
    return qaPairs.length;

  } catch (error) {
    console.error('❌ Error saving interview transcript:', error);
    throw error;
  }
};

export const triggerInterviewAnalysis = async (
  sessionId: string,
  transcript: TranscriptEntry[],
  interviewType: string = 'general',
  duration?: number
) => {
  try {
    console.log(`🧠 Triggering analysis for session: ${sessionId}`);
    
    // Get the current session to pass auth token
    const { data: { session } } = await supabase.auth.getSession()
    
    const { data, error } = await supabase.functions.invoke('interview-analysis', {
      body: {
        sessionId,
        transcript,
        interviewType,
        duration
      },
      headers: session?.access_token ? {
        Authorization: `Bearer ${session.access_token}`
      } : {}
    });

    if (error) {
      console.error('❌ Error triggering interview analysis:', error);
      throw new Error(`Analysis failed: ${error.message || 'Edge function returned an error'}`);
    }

    if (!data?.success) {
      console.error('❌ Analysis function returned error:', data);
      throw new Error(`Analysis failed: ${data?.error || 'Unknown error from analysis function'}`);
    }

    console.log('✅ Interview analysis completed:', data);
    return data;

  } catch (error) {
    console.error('❌ Failed to trigger interview analysis:', error);
    
    // Provide more specific error messages
    if (error.message?.includes('Edge Function returned a non-2xx status code')) {
      throw new Error('Interview analysis service is currently unavailable. Please try again later.');
    }
    
    throw error;
  }
};

// New function to trigger analysis for existing transcripts
export const triggerAnalysisForExistingTranscripts = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be authenticated');
  }

  try {
    console.log('🔍 Fetching existing interview sessions for analysis...');
    
    // Get all unique sessions that don't have analysis yet
    const { data: sessions, error } = await supabase
      .from('interview_sessions')
      .select('session_id, interview_type, transcript, duration_minutes, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching sessions:', error);
      throw error;
    }

    if (!sessions || sessions.length === 0) {
      console.log('ℹ️ No interview sessions found');
      return { message: 'No interview sessions found to analyze', count: 0 };
    }

    // Group by session_id to get unique sessions
    const uniqueSessions = sessions.reduce((acc, session) => {
      if (!acc.find(s => s.session_id === session.session_id)) {
        acc.push(session);
      }
      return acc;
    }, [] as typeof sessions);

    console.log(`📊 Found ${uniqueSessions.length} unique sessions to analyze`);

    // Check which sessions already have analysis
    const { data: existingAnalyses } = await supabase
      .from('interview_analyses')
      .select('id')
      .eq('user_id', user.id);

    const analysisCount = existingAnalyses?.length || 0;
    console.log(`📈 Found ${analysisCount} existing analyses`);

    // Process sessions that need analysis (limit to recent ones to avoid overwhelming)
    const sessionsToAnalyze = uniqueSessions.slice(0, 5); // Analyze up to 5 most recent sessions
    const analysisPromises = [];

    for (const session of sessionsToAnalyze) {
      if (session.transcript) {
        console.log(`🔄 Triggering analysis for session: ${session.session_id}`);
        
        // Safely parse the transcript JSON to TranscriptEntry[]
        const parsedTranscript = parseTranscriptFromJson(session.transcript);
        
        if (parsedTranscript.length > 0) {
          const analysisPromise = triggerInterviewAnalysis(
            session.session_id,
            parsedTranscript,
            session.interview_type || 'general',
            session.duration_minutes || undefined
          ).catch(error => {
            console.error(`❌ Failed to analyze session ${session.session_id}:`, error);
            return null; // Continue with other sessions even if one fails
          });
          
          analysisPromises.push(analysisPromise);
        } else {
          console.warn(`⚠️ Skipping session ${session.session_id}: invalid or empty transcript`);
        }
      }
    }

    const results = await Promise.all(analysisPromises);
    const successfulAnalyses = results.filter(result => result !== null);

    console.log(`✅ Successfully triggered ${successfulAnalyses.length} analyses`);

    // Dispatch event to refresh data
    window.dispatchEvent(new CustomEvent('refreshInterviewAnalyses'));

    return {
      message: `Successfully triggered analysis for ${successfulAnalyses.length} interview sessions`,
      count: successfulAnalyses.length,
      total: sessionsToAnalyze.length
    };

  } catch (error) {
    console.error('❌ Error triggering analysis for existing transcripts:', error);
    throw error;
  }
};

export const processInterviewEnd = async (
  sessionId: string,
  transcript: TranscriptEntry[],
  interviewType: string = 'general',
  duration?: number,
  audioUrl?: string
) => {
  try {
    console.log(`🎯 Processing interview end for session: ${sessionId}`);
    
    // Step 1: Save transcript to database
    const savedCount = await saveInterviewTranscript(sessionId, transcript, interviewType, duration);
    
    // Step 2: Trigger Cohere analysis (if we have enough data)
    if (savedCount && savedCount > 0) {
      await triggerInterviewAnalysis(sessionId, transcript, interviewType, duration);
    }

    // Step 3: If audio URL is available, we could save it here
    if (audioUrl) {
      // TODO: Implement audio storage logic if needed
      console.log(`🔊 Audio URL available: ${audioUrl}`);
    }

    console.log('✅ Interview processing completed successfully');
    
    return {
      success: true,
      sessionsCount: savedCount,
      message: `Interview completed with ${savedCount} Q&A pairs analyzed`
    };

  } catch (error) {
    console.error('❌ Error processing interview end:', error);
    throw error;
  }
};

export const getUserInterviewSessions = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be authenticated to fetch interview sessions');
  }

  const { data, error } = await supabase
    .from('interview_sessions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching interview sessions:', error);
    throw error;
  }

  return data || [];
};
