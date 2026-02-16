
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useConversation } from '@11labs/react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useSubscription } from '@/hooks/useSubscription';
import Layout from '../components/Layout';
import InterviewInterface from '../components/interview/InterviewInterface';
import InterviewTranscript from '../components/interview/InterviewTranscript';
import CreditCheckModal from '../components/CreditCheckModal';

export interface TranscriptEntry {
  speaker: 'AI' | 'User';
  text: string;
  timestamp: string;
}

const FriendlyInterviewer = () => {
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<string>('disconnected');
  const [showCreditModal, setShowCreditModal] = useState(false);
  const navigate = useNavigate();
  const { hasCredits, deductCredit } = useSubscription();

  const conversation = useConversation({
    onConnect: () => {
      console.log('✅ Successfully connected to ElevenLabs Conversational AI');
      setIsInterviewActive(true);
      setConnectionStatus('connected');
      toast({
        title: "Friendly Chat Started",
        description: "Connected to AI interviewer successfully",
      });
    },
    onDisconnect: () => {
      console.log('🔌 Disconnected from ElevenLabs Conversational AI');
      setIsInterviewActive(false);
      setConnectionStatus('disconnected');
      toast({
        title: "Chat Ended",
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
      setIsInterviewActive(false);
      setConnectionStatus('error');
      
      let errorMessage = 'Unknown error';
      if (typeof error === 'string') {
        errorMessage = error;
      } else if (error && typeof error === 'object') {
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
        title: "Chat Error",
        description: `Connection error: ${errorMessage}`,
        variant: "destructive",
      });
    }
  });

  const handleStartInterview = async () => {
    if (!hasCredits) {
      setShowCreditModal(true);
      return;
    }

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
      
      const { data: configData, error: configError } = await supabase.functions.invoke('get-elevenlabs-config');
      
      if (configError || !configData?.agentId) {
        console.error('❌ Failed to get agent ID:', configError);
        throw new Error('Failed to get agent configuration');
      }
      
      const conversationId = await conversation.startSession({
        signedUrl: data.signedUrl,
        connectionType: 'websocket',
      });
      
      console.log('✅ Friendly Chat started with conversation ID:', conversationId);
      setConnectionStatus('connected');
      
    } catch (error) {
      console.error('❌ Error starting friendly chat:', error);
      setIsInterviewActive(false);
      setConnectionStatus('error');
      
      const err = error as Error;
      if (err.name === 'NotAllowedError') {
        toast({
          title: "Microphone Access Required",
          description: "Please allow microphone access to start the chat.",
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
      console.log('🛑 Ending friendly chat session...');
      
      // Deduct credit when chat ends
      deductCredit({ interviewType: 'friendly' });
      
      await conversation.endSession();
      
      const currentTime = new Date().toLocaleTimeString();
      setTranscript(prev => [...prev, {
        speaker: 'AI',
        text: 'Thank you for the wonderful conversation! Take care.',
        timestamp: currentTime
      }]);
      
      console.log('✅ Friendly Chat ended successfully');
    } catch (error) {
      console.error('❌ Error ending chat:', error);
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
          {/* Header with Back Button */}
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
                  <Users className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-white">
                  Friendly AI Chat
                </h1>
              </div>
            </div>
            
            <div className="px-4 py-2 bg-slate-800/80 backdrop-blur-sm border border-slate-600 rounded-lg">
              <span className="text-slate-300 text-sm font-medium">AI Powered Chat</span>
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

          {/* Friendly Chat Status */}
          {isInterviewActive && (
            <div className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl p-6 mb-6">
              <div className="text-center">
                <p className="text-white text-lg">
                  Friendly Chat is <span className="bg-green-700 px-3 py-1 rounded-md text-green-300">Active</span>
                </p>
                <p className="text-slate-400 text-sm mt-2">
                  Have a casual conversation. The AI will chat with you naturally about your experiences.
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            {!isInterviewActive ? (
              <motion.button
                onClick={handleStartInterview}
                className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-medium text-lg transform hover:scale-105"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Users className="h-5 w-5" />
                <span>Start Friendly Chat</span>
              </motion.button>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="flex items-center space-x-4"
              >
                <div className="text-center mb-6">
                  <div className="inline-flex items-center space-x-2 px-4 py-2 bg-green-900/50 text-green-300 rounded-full border border-green-700/50">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">Friendly Chat in Progress</span>
                  </div>
                </div>
                
                <button
                  onClick={handleExitInterview}
                  className="flex items-center space-x-3 px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-medium"
                >
                  <UserCheck className="h-5 w-5" />
                  <span>End Chat</span>
                </button>
              </motion.div>
            )}
          </div>

          <InterviewTranscript
            transcript={transcript}
            isInterviewActive={isInterviewActive}
            onClearTranscript={handleClearTranscript}
          />

          {/* Interview Tips */}
          {isInterviewActive && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-8 bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl p-6"
            >
              <h3 className="font-semibold text-white mb-4">Friendly Chat Tips:</h3>
              <ul className="text-sm text-slate-300 space-y-2">
                <li>• Be yourself and speak naturally</li>
                <li>• Share your experiences openly</li>
                <li>• Ask questions if you're curious</li>
                <li>• Relax and enjoy the conversation</li>
              </ul>
            </motion.div>
          )}
        </div>

        {/* Credit Check Modal */}
        <CreditCheckModal open={showCreditModal} onOpenChange={setShowCreditModal} />
      </div>
    </Layout>
  );
};

export default FriendlyInterviewer;
