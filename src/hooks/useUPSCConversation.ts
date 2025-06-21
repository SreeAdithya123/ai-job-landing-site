
import { useState } from 'react';
import { useConversation } from '@11labs/react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface TranscriptEntry {
  speaker: 'AI' | 'User';
  text: string;
  timestamp: string;
}

interface AudioRecording {
  id: string;
  timestamp: string;
  audioData: string;
}

interface InterviewAnalysis {
  confidence: number;
  clarity: number;
  relevance: number;
  suggestions: string[];
}

export const useUPSCConversation = () => {
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [audioRecordings, setAudioRecordings] = useState<AudioRecording[]>([]);
  const [interviewAnalysis, setInterviewAnalysis] = useState<InterviewAnalysis | null>(null);

  const { toast } = useToast();

  const conversation = useConversation({
    onMessage: (message) => {
      console.log('Message received:', message);
      const currentTime = new Date().toLocaleTimeString();
      setTranscript(prev => [...prev, {
        speaker: message.source === 'ai' ? 'AI' : 'User',
        text: message.message,
        timestamp: currentTime
      }]);
      
      if (message.source === 'user') {
        analyzeResponse(message.message);
      }
    },
    onConnect: () => {
      console.log('Voice conversation connected');
      toast({
        title: "Connected",
        description: "Voice interview session has started successfully.",
      });
    },
    onDisconnect: () => {
      console.log('Voice conversation disconnected');
      saveInterviewData();
      toast({
        title: "Disconnected",
        description: "Voice interview session has ended.",
      });
    },
    onError: (error) => {
      console.error('Conversation error:', error);
      const errorMessage = error && typeof error === 'object' && 'message' in error 
        ? String((error as any).message) 
        : error ? String(error) : 'Unknown error occurred';
      toast({
        title: "Connection Error",
        description: `Failed to maintain voice connection: ${errorMessage}`,
        variant: "destructive",
      });
      setIsInterviewActive(false);
    },
    overrides: {
      agent: {
        prompt: {
          prompt: "You are a UPSC Civil Services interview panel member. Conduct a professional interview with appropriate questions about current affairs, governance, ethics, and the candidate's background. Be encouraging but challenging. Keep responses concise and professional. Ask one question at a time and wait for the candidate's response."
        },
        firstMessage: "Good morning. I am your UPSC interview panel member. Please introduce yourself and tell me why you want to join the civil services.",
        language: "en"
      }
    }
  });

  const analyzeResponse = (userResponse: string) => {
    const words = userResponse.split(' ').length;
    const confidence = Math.min(100, (words / 50) * 100);
    const clarity = userResponse.includes('because') || userResponse.includes('therefore') ? 85 : 70;
    const relevance = userResponse.length > 100 ? 90 : 75;
    
    const suggestions = [];
    if (confidence < 70) suggestions.push("Try to elaborate more on your answers");
    if (clarity < 80) suggestions.push("Use more connecting words to improve clarity");
    if (relevance < 80) suggestions.push("Make your answers more relevant to the question");

    setInterviewAnalysis({
      confidence: Math.round(confidence),
      clarity: Math.round(clarity),
      relevance: Math.round(relevance),
      suggestions
    });
  };

  const saveInterviewData = () => {
    const interviewData = {
      id: Date.now().toString(),
      type: 'UPSC Interview',
      date: new Date().toLocaleDateString(),
      duration: '15-30 min',
      status: 'Completed',
      transcript,
      audioRecordings,
      analysis: interviewAnalysis,
      timestamp: new Date().toISOString()
    };

    const existingInterviews = JSON.parse(localStorage.getItem('interview_sessions') || '[]');
    existingInterviews.unshift(interviewData);
    localStorage.setItem('interview_sessions', JSON.stringify(existingInterviews));

    const existingStats = JSON.parse(localStorage.getItem('dashboard_stats') || '{}');
    const updatedStats = {
      ...existingStats,
      totalSessions: (existingStats.totalSessions || 0) + 1,
      hoursSpent: (existingStats.hoursSpent || 0) + 0.5,
      completedInterviews: (existingStats.completedInterviews || 0) + 1,
      successRate: interviewAnalysis ? Math.round((interviewAnalysis.confidence + interviewAnalysis.clarity + interviewAnalysis.relevance) / 3) : 85
    };
    localStorage.setItem('dashboard_stats', JSON.stringify(updatedStats));
  };

  const handleStartInterview = async () => {
    try {
      toast({
        title: "Initializing",
        description: "Setting up voice interview session...",
      });

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('Microphone access granted');
      
      stream.getTracks().forEach(track => track.stop());
      
      const { data, error } = await supabase.functions.invoke('elevenlabs-conversation', {
        body: {
          action: 'get_signed_url'
        }
      });

      if (error) {
        throw new Error(`Failed to get signed URL: ${error.message}`);
      }

      if (!data?.signed_url) {
        throw new Error('No signed URL received from server');
      }

      console.log('Got signed URL, starting conversation...');
      
      await conversation.startSession({
        signedUrl: data.signed_url
      });
      
      setIsInterviewActive(true);
      
      const currentTime = new Date().toLocaleTimeString();
      setTranscript([{
        speaker: 'AI',
        text: 'Good morning. I am your UPSC interview panel member. Please take your seat and we shall begin with the interview process.',
        timestamp: currentTime
      }]);
      
      console.log('UPSC Voice Interview started');
    } catch (error) {
      console.error('Failed to start interview:', error);
      const errorMessage = error && typeof error === 'object' && 'message' in error 
        ? String((error as any).message) 
        : error ? String(error) : 'Unknown error occurred';
      toast({
        title: "Failed to Start",
        description: `Could not start voice interview: ${errorMessage}`,
        variant: "destructive",
      });
      setIsInterviewActive(false);
    }
  };

  const handleExitInterview = async () => {
    try {
      toast({
        title: "Ending Session",
        description: "Closing voice interview session...",
      });

      await conversation.endSession();
      setIsInterviewActive(false);
      
      const currentTime = new Date().toLocaleTimeString();
      setTranscript(prev => [...prev, {
        speaker: 'AI',
        text: 'Thank you for your time. The interview panel will deliberate on your responses. You may leave now.',
        timestamp: currentTime
      }]);
      
      console.log('UPSC Interview ended');
    } catch (error) {
      console.error('Failed to end interview:', error);
      toast({
        title: "Error",
        description: "Failed to properly end the interview session.",
        variant: "destructive",
      });
    }
  };

  return {
    isInterviewActive,
    transcript,
    interviewAnalysis,
    conversation,
    setTranscript,
    handleStartInterview,
    handleExitInterview
  };
};
