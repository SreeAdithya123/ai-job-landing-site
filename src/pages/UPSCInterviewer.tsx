import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useConversation } from '@11labs/react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Layout from '../components/Layout';
import InterviewInterface from '../components/interview/InterviewInterface';
import InterviewControls from '../components/interview/InterviewControls';
import InterviewTranscript from '../components/interview/InterviewTranscript';
import InterviewStatus from '../components/interview/InterviewStatus';

export interface TranscriptEntry {
  speaker: 'AI' | 'User';
  text: string;
  timestamp: string;
}

const UPSCInterviewer = () => {
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const navigate = useNavigate();

  const conversation = useConversation({
    onConnect: () => {
      console.log('Connected to ElevenLabs Conversational AI');
      setIsInterviewActive(true);
      toast({
        title: "Interview Started",
        description: "Connected to AI interviewer successfully",
      });
    },
    onDisconnect: () => {
      console.log('Disconnected from ElevenLabs Conversational AI');
      setIsInterviewActive(false);
    },
    onMessage: (message) => {
      console.log('Message received:', message);
      const currentTime = new Date().toLocaleTimeString();
      
      if (message.source === 'ai') {
        setTranscript(prev => [...prev, {
          speaker: 'AI',
          text: message.message,
          timestamp: currentTime
        }]);
      } else if (message.source === 'user') {
        setTranscript(prev => [...prev, {
          speaker: 'User',
          text: message.message,
          timestamp: currentTime
        }]);
      }
    },
    onError: (error) => {
      console.error('ElevenLabs Conversation error:', error);
      setIsInterviewActive(false);
      toast({
        title: "Interview Error",
        description: "There was an error with the AI interviewer. Please try again.",
        variant: "destructive",
      });
    },
    overrides: {
      agent: {
        prompt: {
          prompt: `You are a UPSC Civil Services interview panel member. Conduct a professional interview for the candidate. Ask relevant questions about current affairs, public administration, leadership, and the candidate's background. Maintain a formal but encouraging tone. Start with a greeting and ask the candidate to introduce themselves.`
        },
        firstMessage: "Good morning. I am your UPSC interview panel member. Please take your seat and introduce yourself to begin the interview process.",
        language: "en"
      }
    }
  });

  const handleStartInterview = async () => {
    try {
      console.log('Requesting microphone access...');
      await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('Microphone access granted');
      
      console.log('Fetching ElevenLabs configuration...');
      const { data, error } = await supabase.functions.invoke('get-elevenlabs-config');
      
      if (error) {
        throw new Error(`Configuration error: ${error.message}`);
      }
      
      if (!data || !data.agentId) {
        throw new Error('Failed to get ElevenLabs configuration');
      }
      
      console.log('Starting session with agent ID:', data.agentId);
      
      // Start the session with the agent ID
      const conversationId = await conversation.startSession({
        agentId: data.agentId
      });
      
      console.log('UPSC Interview started with conversation ID:', conversationId);
      
    } catch (error) {
      console.error('Error starting interview:', error);
      setIsInterviewActive(false);
      
      // More specific error handling
      if (error.name === 'NotAllowedError') {
        toast({
          title: "Microphone Access Required",
          description: "Please allow microphone access to start the interview.",
          variant: "destructive",
        });
      } else if (error.message?.includes('Configuration')) {
        toast({
          title: "Configuration Error",
          description: "Interview setup is incomplete. Please contact support.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Connection Error",
          description: "Failed to connect to the AI interviewer. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleExitInterview = async () => {
    try {
      await conversation.endSession();
      
      const currentTime = new Date().toLocaleTimeString();
      setTranscript(prev => [...prev, {
        speaker: 'AI',
        text: 'Thank you for your time. The interview panel will deliberate on your responses. You may leave now.',
        timestamp: currentTime
      }]);
      
      toast({
        title: "Interview Ended",
        description: "Thank you for participating in the UPSC interview simulation.",
      });
      
      console.log('UPSC Interview ended');
    } catch (error) {
      console.error('Error ending interview:', error);
      setIsInterviewActive(false);
    }
  };

  const handleBackToInterviews = () => {
    navigate('/interview-copilot');
  };

  const handleClearTranscript = () => {
    setTranscript([]);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <button 
                onClick={handleBackToInterviews} 
                className="flex items-center space-x-2 px-4 py-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg hover:bg-slate-700/50 transition-colors mr-6"
              >
                <ArrowLeft className="h-4 w-4 text-slate-300" />
                <span className="text-slate-300 font-medium">Back</span>
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-white">
                  UPSC Civil Services Interview
                </h1>
              </div>
            </div>
            
            <div className="px-4 py-2 bg-slate-800/80 backdrop-blur-sm border border-slate-600 rounded-lg">
              <span className="text-slate-300 text-sm font-medium">AI Powered Interview</span>
            </div>
          </div>

          <InterviewInterface conversation={conversation} />

          <InterviewStatus isInterviewActive={isInterviewActive} />

          <InterviewControls
            isInterviewActive={isInterviewActive}
            onStartInterview={handleStartInterview}
            onExitInterview={handleExitInterview}
          />

          <InterviewTranscript
            transcript={transcript}
            isInterviewActive={isInterviewActive}
            onClearTranscript={handleClearTranscript}
          />
        </div>
      </div>
    </Layout>
  );
};

export default UPSCInterviewer;
