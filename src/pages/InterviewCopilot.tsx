import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useConversation } from '@11labs/react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '../components/Layout';
import ProtectedRoute from '../components/ProtectedRoute';
import InterviewInterface from '../components/interview/InterviewInterface';
import InterviewControls from '../components/interview/InterviewControls';
import InterviewTranscript from '../components/interview/InterviewTranscript';
import InterviewStatus from '../components/interview/InterviewStatus';
import { Laptop, Code, Star, Phone, Settings, Plus, ExternalLink, Users, ArrowLeft, Sparkles, Zap, Target, Brain, LayoutDashboard } from 'lucide-react';

export interface TranscriptEntry {
  speaker: 'AI' | 'User';
  text: string;
  timestamp: string;
}

const InterviewCopilot = () => {
  const [selectedType, setSelectedType] = useState('general');
  const [completedInterviews, setCompletedInterviews] = useState<Array<{
    id: string;
    type: string;
    date: string;
    duration: string;
    status: string;
  }>>([]);
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [showInterviewInterface, setShowInterviewInterface] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<string>('disconnected');
  const [userIsSpeaking, setUserIsSpeaking] = useState(false);
  const navigate = useNavigate();
  const { signOut, user } = useAuth();

  // Function to save interview data to Supabase
  const saveInterviewData = async (transcript: TranscriptEntry[]) => {
    if (!user?.id || transcript.length < 2) return;

    try {
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

      // Save each Q&A pair to the interviews table
      for (const qa of qaPairs) {
        await supabase
          .from('interviews')
          .insert({
            user_id: user.id,
            question: qa.question,
            answer: qa.answer,
            feedback: null // Will be populated later by AI analysis if needed
          });
      }

      console.log(`✅ Saved ${qaPairs.length} interview Q&A pairs to database`);
      
      toast({
        title: "Interview Saved",
        description: `Your interview with ${qaPairs.length} questions has been saved to your history.`,
      });

    } catch (error) {
      console.error('❌ Error saving interview data:', error);
      toast({
        title: "Save Error",
        description: "Failed to save interview data. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const conversation = useConversation({
    onConnect: () => {
      console.log('✅ Successfully connected to ElevenLabs Conversational AI');
      setIsInterviewActive(true);
      setConnectionStatus('connected');
      toast({
        title: "Interview Started",
        description: "Connected to AI interviewer successfully"
      });
    },
    onDisconnect: () => {
      console.log('🔌 Disconnected from ElevenLabs Conversational AI');
      setIsInterviewActive(false);
      setConnectionStatus('disconnected');
      setUserIsSpeaking(false);
      
      // Save interview data when disconnecting
      if (transcript.length > 0) {
        saveInterviewData(transcript);
      }
      
      toast({
        title: "Interview Ended",
        description: "Disconnected from AI interviewer"
      });
    },
    onMessage: message => {
      console.log('📨 Message received:', message);
      const currentTime = new Date().toLocaleTimeString();
      if (message.source === 'ai') {
        console.log('🤖 AI message:', message.message);
        setUserIsSpeaking(false);
        setTranscript(prev => [...prev, {
          speaker: 'AI',
          text: message.message,
          timestamp: currentTime
        }]);
      } else if (message.source === 'user') {
        console.log('👤 User message:', message.message);
        setUserIsSpeaking(true);
        setTranscript(prev => [...prev, {
          speaker: 'User',
          text: message.message,
          timestamp: currentTime
        }]);

        setTimeout(() => {
          setUserIsSpeaking(false);
        }, 1000);
      }
    },
    onError: error => {
      console.error('❌ ElevenLabs Conversation error:', error);
      setIsInterviewActive(false);
      setConnectionStatus('error');
      setUserIsSpeaking(false);

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
        title: "Interview Error",
        description: `Connection error: ${errorMessage}`,
        variant: "destructive"
      });
    }
  });

  const interviewTypes = [{
    id: 'general',
    name: 'General Interview',
    icon: Laptop,
    description: 'Standard behavioral and situational questions',
    gradient: 'from-blue-500 to-blue-600',
    bgGradient: 'from-blue-500/10 to-blue-600/10'
  }, {
    id: 'coding',
    name: 'Coding Interview',
    icon: Code,
    description: 'Technical programming challenges and algorithms',
    gradient: 'from-green-500 to-green-600',
    bgGradient: 'from-green-500/10 to-green-600/10'
  }, {
    id: 'upsc',
    name: 'UPSC Interviewer',
    icon: Star,
    description: 'Civil services interview preparation and mock tests',
    gradient: 'from-purple-500 to-purple-600',
    bgGradient: 'from-purple-500/10 to-purple-600/10'
  }, {
    id: 'friendly',
    name: 'Friendly Interview',
    icon: Users,
    description: 'Casual conversation-style interview practice',
    gradient: 'from-pink-500 to-pink-600',
    bgGradient: 'from-pink-500/10 to-pink-600/10'
  }];

  const handleSelectInterview = (type: string) => {
    if (type === 'general' || type === 'coding') {
      setSelectedType(type);
      setShowInterviewInterface(true);
    } else if (type === 'upsc') {
      navigate('/upsc-interviewer');
    } else if (type === 'friendly') {
      navigate('/friendly-interviewer');
    }
  };

  const handleStartInterview = async () => {
    try {
      console.log('🎤 Requesting microphone access...');
      setConnectionStatus('requesting-mic');
      await navigator.mediaDevices.getUserMedia({
        audio: true
      });
      console.log('✅ Microphone access granted');
      setConnectionStatus('fetching-config');
      console.log('🔧 Fetching ElevenLabs configuration...');
      const {
        data,
        error
      } = await supabase.functions.invoke('get-elevenlabs-signed-url');
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
      const {
        data: configData,
        error: configError
      } = await supabase.functions.invoke('get-elevenlabs-config');
      if (configError || !configData?.agentId) {
        console.error('❌ Failed to get agent ID:', configError);
        throw new Error('Failed to get agent configuration');
      }
      const conversationId = await conversation.startSession({
        agentId: configData.agentId,
        signedUrl: data.signedUrl
      });
      console.log(`✅ ${selectedType} Interview started with conversation ID:`, conversationId);
      setConnectionStatus('connected');
    } catch (error) {
      console.error('❌ Error starting interview:', error);
      setIsInterviewActive(false);
      setConnectionStatus('error');
      const err = error as Error;
      if (err.name === 'NotAllowedError') {
        toast({
          title: "Microphone Access Required",
          description: "Please allow microphone access to start the interview.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Connection Error",
          description: `Failed to connect: ${err.message || 'Unknown error'}`,
          variant: "destructive"
        });
      }
    }
  };

  const handleExitInterview = async () => {
    try {
      console.log('🛑 Ending interview session...');
      
      // Save interview data before ending the session
      if (transcript.length > 0) {
        await saveInterviewData(transcript);
      }
      
      await conversation.endSession();
      const currentTime = new Date().toLocaleTimeString();
      setTranscript(prev => [...prev, {
        speaker: 'AI',
        text: 'Thank you for your time. The interview has concluded.',
        timestamp: currentTime
      }]);
      console.log('✅ Interview ended successfully');
    } catch (error) {
      console.error('❌ Error ending interview:', error);
      setIsInterviewActive(false);
      setConnectionStatus('disconnected');
      setUserIsSpeaking(false);
    }
  };

  const handleBackToInterviews = () => {
    setShowInterviewInterface(false);
    setIsInterviewActive(false);
    setConnectionStatus('disconnected');
    setTranscript([]);
    setUserIsSpeaking(false);
  };

  const handleClearTranscript = () => {
    setTranscript([]);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  // Show interview interface for general and coding interviews
  if (showInterviewInterface && (selectedType === 'general' || selectedType === 'coding')) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
          {/* Full Screen Header */}
          <div className="bg-slate-800/30 backdrop-blur-md border-b border-slate-700/50">
            <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={handleBackToInterviews} 
                    className="flex items-center space-x-2 px-4 py-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg hover:bg-slate-700/50 transition-all duration-200 group"
                  >
                    <ArrowLeft className="h-4 w-4 text-slate-300 group-hover:text-white transition-colors" />
                    <span className="text-slate-300 group-hover:text-white font-medium transition-colors">Back</span>
                  </button>
                  
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 bg-gradient-to-r ${selectedType === 'general' ? 'from-blue-500 to-blue-600' : 'from-green-500 to-green-600'} rounded-xl flex items-center justify-center shadow-lg`}>
                      {selectedType === 'general' ? <Laptop className="h-6 w-6 text-white" /> : <Code className="h-6 w-6 text-white" />}
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-white">
                        {selectedType === 'general' ? 'General AI Interview' : 'Coding AI Interview'}
                      </h1>
                      <p className="text-slate-400 text-sm">
                        {selectedType === 'general' ? 'Behavioral & Situational Questions' : 'Technical & Programming Challenges'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className={`px-3 py-1.5 rounded-full text-xs font-medium border ${
                    connectionStatus === 'connected' 
                      ? 'bg-green-900/50 text-green-300 border-green-700/50' 
                      : connectionStatus === 'error'
                      ? 'bg-red-900/50 text-red-300 border-red-700/50'
                      : 'bg-slate-800/50 text-slate-300 border-slate-700/50'
                  }`}>
                    {connectionStatus === 'connected' ? 'Connected' : 
                     connectionStatus === 'error' ? 'Error' :
                     connectionStatus === 'connecting' ? 'Connecting...' :
                     connectionStatus === 'requesting-mic' ? 'Requesting Mic...' :
                     connectionStatus === 'fetching-config' ? 'Configuring...' : 'Ready'}
                  </div>
                  {userIsSpeaking && (
                    <div className="px-3 py-1.5 bg-purple-900/50 text-purple-300 border border-purple-700/50 rounded-full text-xs font-medium animate-pulse">
                      Speaking...
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main Interview Content */}
          <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 space-y-6">
            <InterviewInterface conversation={conversation} userIsSpeaking={userIsSpeaking} />
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
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        {/* Full Screen Header */}
        <div className="bg-white/80 backdrop-blur-md border-b border-slate-200/50 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary-light to-accent bg-clip-text text-transparent">
                    AI Interview Studio
                  </h1>
                  <p className="text-slate-600 text-lg mt-1">Master your interview skills with advanced AI technology</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-2 px-6 py-3 bg-white/60 backdrop-blur-sm border border-slate-300/50 rounded-xl hover:bg-white/80 transition-all duration-200 shadow-sm">
                  <Settings className="h-5 w-5 text-slate-600" />
                  <span className="text-slate-700 font-medium">Settings</span>
                </button>
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="flex items-center space-x-2 px-6 py-3 bg-white/60 backdrop-blur-sm border border-slate-300/50 rounded-xl hover:bg-white/80 transition-all duration-200 shadow-sm"
                >
                  <LayoutDashboard className="h-5 w-5 text-slate-600" />
                  <span className="text-slate-700 font-medium">Dashboard</span>
                </button>
                <button 
                  onClick={handleSignOut} 
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 font-medium"
                >
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <h2 className="text-5xl font-bold text-slate-800 mb-4">
                Choose Your Interview Experience
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Practice with our AI-powered interview system designed to help you succeed. 
                Get real-time feedback, personalized questions, and detailed performance analytics.
              </p>
            </motion.div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-white/60 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-6 shadow-sm"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">AI-Powered</h3>
                <p className="text-slate-600 text-sm">Advanced AI technology provides realistic interview scenarios</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white/60 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-6 shadow-sm"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Real-time Feedback</h3>
                <p className="text-slate-600 text-sm">Get instant feedback on your responses and performance</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white/60 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-6 shadow-sm"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Performance Analytics</h3>
                <p className="text-slate-600 text-sm">Track your progress with detailed analytics and insights</p>
              </motion.div>
            </div>
          </div>

          {/* Interview Type Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {interviewTypes.map((type, index) => (
              <motion.div
                key={type.id}
                className={`relative p-8 bg-white/80 backdrop-blur-sm rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                  selectedType === type.id 
                    ? `border-transparent bg-gradient-to-br ${type.bgGradient} shadow-xl` 
                    : 'border-slate-200/50 hover:border-slate-300/50'
                }`}
                onClick={() => setSelectedType(type.id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg bg-gradient-to-r ${type.gradient}`}>
                  <type.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-xl mb-3 text-slate-800 text-center">{type.name}</h3>
                <p className="text-slate-600 text-center mb-6 leading-relaxed">{type.description}</p>
                
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectInterview(type.id);
                  }} 
                  className={`w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 bg-gradient-to-r ${type.gradient} text-white hover:shadow-lg`}
                >
                  <span>Start Interview</span>
                  <ArrowLeft className="h-4 w-4 rotate-180" />
                </button>
              </motion.div>
            ))}
          </div>

          {/* Sessions Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/50"
          >
            <div className="px-8 py-6 border-b border-slate-200/50 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Your Interview Sessions</h2>
                <p className="text-slate-600 mt-1">Track your progress and review past interviews</p>
              </div>
              <button className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-xl hover:shadow-lg transition-all duration-200 font-medium">
                <Plus className="h-5 w-5" />
                <span>New Session</span>
              </button>
            </div>
            
            {completedInterviews.length > 0 ? (
              <div className="divide-y divide-slate-200/50">
                {completedInterviews.map((interview) => (
                  <div key={interview.id} className="px-8 py-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                    <div>
                      <h3 className="font-semibold text-slate-800 text-lg">{interview.type}</h3>
                      <p className="text-slate-600">
                        {interview.date} • {interview.duration}
                      </p>
                    </div>
                    <span className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-full border border-green-200">
                      {interview.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-16 text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Brain className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold text-slate-800 mb-3">
                  Ready to start your first interview?
                </h3>
                <p className="text-slate-600 mb-8 max-w-md mx-auto leading-relaxed">
                  Begin your interview preparation journey with our AI-powered system and get instant feedback on your performance.
                </p>
                <button 
                  onClick={() => handleSelectInterview('general')} 
                  className="px-8 py-4 bg-gradient-to-r from-primary to-accent text-white rounded-xl hover:shadow-lg transition-all duration-200 font-semibold transform hover:scale-105"
                >
                  Start Your First Interview
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default InterviewCopilot;
