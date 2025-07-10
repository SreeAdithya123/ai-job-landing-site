
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useConversation } from '@11labs/react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { processInterviewEnd } from '@/services/interviewSessionService';
import Layout from '../components/Layout';
import InterviewInterface from '../components/interview/InterviewInterface';
import InterviewTranscript from '../components/interview/InterviewTranscript';
import { Users, Target, BookOpen, Filter, ExternalLink } from 'lucide-react';

export interface TranscriptEntry {
  speaker: 'AI' | 'User';
  text: string;
  timestamp: string;
}

const MockInterview = () => {
  const [completedInterviews, setCompletedInterviews] = useState<Array<{
    id: string;
    type: string;
    date: string;
    duration: string;
    status: string;
  }>>([]);
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<string>('disconnected');
  const [showMockInterface, setShowMockInterface] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [interviewStartTime, setInterviewStartTime] = useState<Date | null>(null);

  const conversation = useConversation({
    onConnect: () => {
      console.log('✅ Successfully connected to ElevenLabs Conversational AI');
      setIsInterviewActive(true);
      setConnectionStatus('connected');
      toast({
        title: "Mock Interview Started",
        description: "Connected to AI interviewer successfully",
      });
    },
    onDisconnect: () => {
      console.log('🔌 Disconnected from ElevenLabs Conversational AI');
      setIsInterviewActive(false);
      setConnectionStatus('disconnected');
      toast({
        title: "Mock Interview Ended",
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
        title: "Mock Interview Error",
        description: `Connection error: ${errorMessage}`,
        variant: "destructive",
      });
    }
  });

  const handleStartMockInterview = async () => {
    try {
      console.log('🎤 Requesting microphone access...');
      setConnectionStatus('requesting-mic');
      setShowMockInterface(true);
      
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
        agentId: configData.agentId,
        signedUrl: data.signedUrl
      });
      
      console.log('✅ Mock Interview started with conversation ID:', conversationId);
      setConnectionStatus('connected');
      
    } catch (error) {
      console.error('❌ Error starting mock interview:', error);
      setIsInterviewActive(false);
      setConnectionStatus('error');
      setShowMockInterface(false);
      
      const err = error as Error;
      if (err.name === 'NotAllowedError') {
        toast({
          title: "Microphone Access Required",
          description: "Please allow microphone access to start the interview.",
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
      console.log('🛑 Ending mock interview session...');
      await conversation.endSession();
      
      const currentTime = new Date().toLocaleTimeString();
      setTranscript(prev => [...prev, {
        speaker: 'AI',
        text: 'Thank you for participating in the mock interview. Good luck with your future interviews!',
        timestamp: currentTime
      }]);
      
      console.log('✅ Mock Interview ended successfully');
      
      // Simulate saving the interview
      const newInterview = {
        id: Date.now().toString(),
        type: 'Mock Interview',
        date: new Date().toLocaleDateString(),
        duration: '20-45 min',
        status: 'Completed'
      };
      setCompletedInterviews(prev => [newInterview, ...prev]);
      setShowMockInterface(false);
      
    } catch (error) {
      console.error('❌ Error ending mock interview:', error);
      setIsInterviewActive(false);
      setConnectionStatus('disconnected');
      setShowMockInterface(false);
    }
  };

  const handleClearTranscript = () => {
    setTranscript([]);
  };

  const actionButtons = [
    {
      title: 'Start Job Readiness Assessment',
      description: 'Evaluate your current interview skills',
      icon: Target,
      color: 'bg-blue-500',
      action: null
    },
    {
      title: 'Start Mock Interview',
      description: 'Practice with AI interviewer',
      icon: Users,
      color: 'bg-orange-500',
      badge: 'Beta',
      action: handleStartMockInterview
    },
    {
      title: 'Start Practicing Questions',
      description: 'Drill common interview questions',
      icon: BookOpen,
      color: 'bg-green-500',
      action: null
    }
  ];

  // Show interview interface when mock interview is active
  if (showMockInterface) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-white">
                  AI Mock Interview
                </h1>
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

            {/* Mock Interview Status */}
            {isInterviewActive && (
              <div className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl p-6 mb-6">
                <div className="text-center">
                  <p className="text-white text-lg">
                    Mock Interview is <span className="bg-orange-700 px-3 py-1 rounded-md text-orange-300">Active</span>
                  </p>
                  <p className="text-slate-400 text-sm mt-2">
                    Answer questions naturally. The AI will provide feedback on your responses.
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-center space-x-4 mb-8">
              {!isInterviewActive ? (
                <motion.button
                  onClick={handleStartMockInterview}
                  className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-medium text-lg transform hover:scale-105"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Users className="h-5 w-5" />
                  <span>Start Mock Interview</span>
                </motion.button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center space-x-4"
                >
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center space-x-2 px-4 py-2 bg-orange-900/50 text-orange-300 rounded-full border border-orange-700/50">
                      <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium">Mock Interview in Progress</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleExitInterview}
                    className="flex items-center space-x-3 px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-medium"
                  >
                    <Users className="h-5 w-5" />
                    <span>End Interview</span>
                  </button>
                </motion.div>
              )}
            </div>

            <InterviewTranscript
              transcript={transcript}
              isInterviewActive={isInterviewActive}
              onClearTranscript={handleClearTranscript}
            />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Mock Interview</h1>
            <p className="text-gray-600">Practice interviews with AI-powered feedback and assessment</p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {actionButtons.map((button, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 cursor-pointer group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                onClick={button.action || undefined}
              >
                <div className={`w-12 h-12 ${button.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <button.icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg text-gray-900">{button.title}</h3>
                  {button.badge && (
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {button.badge}
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-sm mb-4">{button.description}</p>
                
                {button.action && (
                  <div className="flex items-center space-x-1 text-orange-600 text-sm font-medium">
                    <span>Click to start</span>
                    <ExternalLink className="h-4 w-4" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Sessions Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Past Sessions</h2>
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                  <option>All Status</option>
                  <option>Completed</option>
                  <option>In Progress</option>
                  <option>Scheduled</option>
                </select>
              </div>
            </div>
            
            {completedInterviews.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {completedInterviews.map((interview) => (
                  <div key={interview.id} className="px-6 py-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{interview.type}</h3>
                      <p className="text-sm text-gray-500">
                        {interview.date} • {interview.duration}
                      </p>
                    </div>
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      {interview.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No mock interview sessions yet.
                </h3>
                <p className="text-gray-500 mb-6">
                  Start your first mock interview to practice and improve your skills.
                </p>
                <button 
                  onClick={handleStartMockInterview}
                  className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
                >
                  Start Mock Interview
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MockInterview;
