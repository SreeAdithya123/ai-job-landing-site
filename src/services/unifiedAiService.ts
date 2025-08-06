
import { supabase } from '@/integrations/supabase/client';

export type AIRequestType = 'interview-analysis' | 'career-coach' | 'material-generator' | 'recruiter-chat';

interface BaseAIRequest {
  type: AIRequestType;
  data: any;
}

interface InterviewAnalysisRequest extends BaseAIRequest {
  type: 'interview-analysis';
  data: {
    sessionId: string;
    transcript: Array<{
      speaker: 'AI' | 'User';
      text: string;
      timestamp: string;
    }>;
    interviewType: string;
    duration?: number;
  };
}

interface CareerCoachRequest extends BaseAIRequest {
  type: 'career-coach';
  data: {
    message: string;
  };
}

interface MaterialGeneratorRequest extends BaseAIRequest {
  type: 'material-generator';
  data: {
    text: string;
    type: 'summary' | 'notes' | 'flashcards' | 'qa';
  };
}

interface RecruiterChatRequest extends BaseAIRequest {
  type: 'recruiter-chat';
  data: {
    message: string;
  };
}

export type UnifiedAIRequest = InterviewAnalysisRequest | CareerCoachRequest | MaterialGeneratorRequest | RecruiterChatRequest;

export const callUnifiedAI = async (request: UnifiedAIRequest) => {
  try {
    console.log('Calling unified AI API with request:', request.type);
    
    const { data, error } = await supabase.functions.invoke('unified-ai-api', {
      body: request
    });

    if (error) {
      console.error('Unified AI API error:', error);
      throw new Error(error.message || 'Failed to process AI request');
    }

    if (!data.success) {
      throw new Error(data.error || 'AI request failed');
    }

    return data;
  } catch (error) {
    console.error('Error calling unified AI API:', error);
    throw error;
  }
};

export const analyzeInterview = async (
  sessionId: string,
  transcript: Array<{ speaker: 'AI' | 'User'; text: string; timestamp: string }>,
  interviewType: string,
  duration?: number
) => {
  return callUnifiedAI({
    type: 'interview-analysis',
    data: {
      sessionId,
      transcript,
      interviewType,
      duration
    }
  });
};

export const askCareerCoach = async (message: string) => {
  return callUnifiedAI({
    type: 'career-coach',
    data: {
      message
    }
  });
};

export const generateMaterial = async (text: string, type: 'summary' | 'notes' | 'flashcards' | 'qa') => {
  return callUnifiedAI({
    type: 'material-generator',
    data: {
      text,
      type
    }
  });
};

export const chatWithRecruiter = async (message: string) => {
  return callUnifiedAI({
    type: 'recruiter-chat',
    data: {
      message
    }
  });
};
