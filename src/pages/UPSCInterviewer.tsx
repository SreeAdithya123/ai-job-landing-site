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
import BodyLanguageMonitor from '../components/interview/BodyLanguageMonitor';
import AnalysisFeedbackButton from '../components/AnalysisFeedbackButton';
import { useBodyLanguageDetection } from '@/hooks/useBodyLanguageDetection';

export interface TranscriptEntry {
  speaker: 'AI' | 'User';
  text: string;
  timestamp: string;
}

const UPSCInterviewer = () => {
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<string>('disconnected');
  const [sessionId, setSessionId] = useState<string>('');
  const navigate = useNavigate();

  const {
    isActive: isBodyLanguageActive,
    metrics: bodyLanguageMetrics,
    startDetection,
    stopDetection,
    getAnalysisSummary,
  } = useBodyLanguageDetection();

  const conversation = useConversation({
    onConnect: () => {
      console.log('✅ Successfully connected to ElevenLabs Conversational AI');
      setIsInterviewActive(true);
      setConnectionStatus('connected');
      toast({
        title: "Interview Started",
        description: "Connected to AI interviewer successfully",
      });
    },
    onDisconnect: () => {
      console.log('🔌 Disconnected from ElevenLabs Conversational AI');
      setIsInterviewActive(false);
      setConnectionStatus('disconnected');
      toast({
        title: "Interview Ended",
        description: "Disconnected from AI interviewer",
      });
    },
    onMessage: (message) => {
      console.log('📨 Message received:', message);
      const currentTime = new Date().toLocaleTimeString();
      
      if (message.source === 'ai') {
        console.log('🤖 AI message:', message.message);
        setTranscript(prev => [...prev, {
          speaker: 'AI',
          text: message.message,
          timestamp: currentTime
        }]);
      } else if (message.source === 'user') {
        console.log('👤 User message:', message.message);
        setTranscript(prev => [...prev, {
          speaker: 'User',
          text: message.message,
          timestamp: currentTime
        }]);
      }
    },
    onError: (error) => {
      console.error('❌ ElevenLabs Conversation error:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      setIsInterviewActive(false);
      setConnectionStatus('error');
      
      // Handle different error types with proper type checking
      let errorMessage = 'Unknown error';
      if (typeof error === 'string') {
        errorMessage = error;
      } else if (error && typeof error === 'object') {
        // Use type assertion for error object
        const errorObj = error as any;
        if (errorObj.message && typeof errorObj.message === 'string') {
          errorMessage = errorObj.message;
        } else if (errorObj.reason && typeof errorObj.reason === 'string') {
          errorMessage = errorObj.reason;
        } else {
          errorMessage = String(error);
        }
      }
      
      toast({
        title: "Interview Error",
        description: `Connection error: ${errorMessage}`,
        variant: "destructive",
      });
    }
  });

  const handleStartInterview = async () => {
    try {
      console.log('🎤 Requesting microphone access...');
      setConnectionStatus('requesting-mic');
      
      await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('✅ Microphone access granted');
      
      setConnectionStatus('fetching-config');
      console.log('🔧 Fetching ElevenLabs configuration...');
      
      const { data, error } = await supabase.functions.invoke('get-elevenlabs-signed-url');
      
      if (error) {
        console.error('❌ Configuration error:', error);
        throw new Error(`Configuration error: ${error.message}`);
      }
      
      if (!data || !data.signedUrl) {
        console.error('❌ No signed URL received:', data);
        throw new Error('Failed to get ElevenLabs signed URL for authentication');
      }
      
      console.log('✅ Signed URL received for authenticated connection');
      setConnectionStatus('connecting');
      
      console.log('🚀 Starting authenticated session with signed URL');
      
      // Get the agent ID from environment variables for the startSession call
      const { data: configData, error: configError } = await supabase.functions.invoke('get-elevenlabs-config');
      
      if (configError || !configData?.agentId) {
        console.error('❌ Failed to get agent ID:', configError);
        throw new Error('Failed to get agent configuration');
      }
      
      // Start the session with both agentId and signedUrl as required by the SDK
      const conversationId = await conversation.startSession({
        agentId: configData.agentId,
        signedUrl: data.signedUrl
      });
      
      console.log('✅ UPSC Interview started with conversation ID:', conversationId);
      setSessionId(conversationId);
      setConnectionStatus('connected');
      
    } catch (error) {
      console.error('❌ Error starting interview:', error);
      console.error('Error stack:', (error as Error).stack);
      setIsInterviewActive(false);
      setConnectionStatus('error');
      
      // More specific error handling
      const err = error as Error;
      if (err.name === 'NotAllowedError') {
        toast({
          title: "Microphone Access Required",
          description: "Please allow microphone access to start the interview.",
          variant: "destructive",
        });
      } else if (err.message?.includes('Configuration')) {
        toast({
          title: "Configuration Error",
          description: "Interview setup is incomplete. Please contact support.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Connection Error",
          description: `Failed to connect: ${err.message || 'Unknown error'}`,
          variant: "destructive",
        });
      }
    }
  };

  const handleExitInterview = async () => {
    try {
      console.log('🛑 Ending interview session...');
      
      // Stop body language detection
      if (isBodyLanguageActive) {
        stopDetection();
      }

      await conversation.endSession();
      
      const currentTime = new Date().toLocaleTimeString();
      setTranscript(prev => [...prev, {
        speaker: 'AI',
        text: 'Thank you for your time. The interview panel will deliberate on your responses. You may leave now.',
        timestamp: currentTime
      }]);
      
      console.log('✅ UPSC Interview ended successfully');
      
      toast({
        title: "Interview Complete",
        description: "Body language analysis ready. Click 'Analyze Interview' to view detailed feedback.",
      });
    } catch (error) {
      console.error('❌ Error ending interview:', error);
      setIsInterviewActive(false);
      setConnectionStatus('disconnected');
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

          {/* Debug Status Display */}
          <div className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl p-4 mb-6">
            <div className="text-center">
              <p className="text-white text-sm">
                Connection Status: <span className="bg-blue-700 px-2 py-1 rounded text-blue-300">{connectionStatus}</span>
              </p>
              <p className="text-slate-400 text-xs mt-1">
                Check browser console for detailed logs
              </p>
            </div>
          </div>

          <InterviewInterface conversation={conversation} />

          {/* Body Language Monitor */}
          <BodyLanguageMonitor
            isActive={isInterviewActive}
            metrics={bodyLanguageMetrics}
            onStartDetection={startDetection}
            onStopDetection={stopDetection}
          />

          <InterviewStatus isInterviewActive={isInterviewActive} />

          <InterviewControls
            isInterviewActive={isInterviewActive}
            onStartInterview={handleStartInterview}
            onExitInterview={handleExitInterview}
          />

          {/* Analysis Button */}
          {!isInterviewActive && transcript.length > 0 && (
            <div className="flex justify-center">
              <AnalysisFeedbackButton
                sessionId={sessionId || 'upsc-interview-session'}
                transcript={transcript}
                interviewType="UPSC Civil Services Interview"
                bodyLanguageMetrics={bodyLanguageMetrics}
                className="w-full max-w-md"
              />
            </div>
          )}

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
