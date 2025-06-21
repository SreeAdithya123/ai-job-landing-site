import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useConversation } from '@11labs/react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Layout from '../components/Layout';
import InterviewInterface from '../components/interview/InterviewInterface';
import InterviewControls from '../components/interview/InterviewControls';
import InterviewTranscript from '../components/interview/InterviewTranscript';
import InterviewStatus from '../components/interview/InterviewStatus';
import { Laptop, Code, Star, Phone, Settings, Plus, ExternalLink, Users, ArrowLeft } from 'lucide-react';

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
      setUserIsSpeaking(false); // Stop user speaking animation on disconnect
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
        setUserIsSpeaking(false); // User stops speaking when AI responds
        setTranscript(prev => [...prev, {
          speaker: 'AI',
          text: message.message,
          timestamp: currentTime
        }]);
      } else if (message.source === 'user') {
        console.log('👤 User message:', message.message);
        setUserIsSpeaking(true); // User is speaking
        setTranscript(prev => [...prev, {
          speaker: 'User',
          text: message.message,
          timestamp: currentTime
        }]);
        
        // Stop user speaking animation after a short delay to show the message was captured
        setTimeout(() => {
          setUserIsSpeaking(false);
        }, 1000);
      }
    },
    onError: (error) => {
      console.error('❌ ElevenLabs Conversation error:', error);
      setIsInterviewActive(false);
      setConnectionStatus('error');
      setUserIsSpeaking(false); // Stop user speaking animation on error
      
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
        variant: "destructive",
      });
    }
  });

  const interviewTypes = [
    {
      id: 'general',
      name: 'General Interview',
      icon: Laptop,
      description: 'Standard behavioral and situational questions'
    },
    {
      id: 'coding',
      name: 'Coding Interview',
      icon: Code,
      description: 'Technical programming challenges and algorithms'
    },
    {
      id: 'upsc',
      name: 'UPSC Interviewer',
      icon: Star,
      description: 'Civil services interview preparation and mock tests'
    },
    {
      id: 'friendly',
      name: 'Friendly Interview',
      icon: Users,
      description: 'Casual conversation-style interview practice'
    }
  ];

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
      setUserIsSpeaking(false); // Stop user speaking animation
    }
  };

  const handleBackToInterviews = () => {
    setShowInterviewInterface(false);
    setIsInterviewActive(false);
    setConnectionStatus('disconnected');
    setTranscript([]);
    setUserIsSpeaking(false); // Reset user speaking state
  };

  const handleClearTranscript = () => {
    setTranscript([]);
  };

  // Show interview interface for general and coding interviews
  if (showInterviewInterface && (selectedType === 'general' || selectedType === 'coding')) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <button 
                onClick={handleBackToInterviews} 
                className="flex items-center space-x-2 px-4 py-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg hover:bg-slate-700/50 transition-colors mr-6"
              >
                <ArrowLeft className="h-4 w-4 text-slate-300" />
                <span className="text-slate-300 font-medium">Back</span>
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                  {selectedType === 'general' ? <Laptop className="h-5 w-5 text-white" /> : <Code className="h-5 w-5 text-white" />}
                </div>
                <h1 className="text-2xl font-bold text-white">
                  {selectedType === 'general' ? 'General AI Interview' : 'Coding AI Interview'}
                </h1>
              </div>
            </div>

            {/* Debug Status Display */}
            <div className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl p-4 mb-6">
              <div className="text-center">
                <p className="text-white text-sm">
                  Connection Status: <span className="bg-blue-700 px-2 py-1 rounded text-blue-300">{connectionStatus}</span>
                  {userIsSpeaking && <span className="ml-4 bg-purple-700 px-2 py-1 rounded text-purple-300">User Speaking</span>}
                </p>
                <p className="text-slate-400 text-xs mt-1">
                  Check browser console for detailed logs
                </p>
              </div>
            </div>

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
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2 bg-gradient-to-r from-primary via-primary-light to-accent bg-clip-text text-transparent">AI Interviewer</h1>
              <p className="text-muted-foreground">Real-time AI assistance during your interviews</p>
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 glass-card border border-primary/20 rounded-lg hover:bg-white/90 transition-colors">
              <Settings className="h-4 w-4 text-primary" />
              <span className="text-primary font-medium">Settings</span>
            </button>
          </div>

          {/* Interview Type Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {interviewTypes.map((type, index) => (
              <motion.div
                key={type.id}
                className={`p-6 glass-card rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-glow ${
                  selectedType === type.id 
                    ? 'border-primary bg-gradient-to-br from-primary/10 to-accent/10 shadow-glow-accent' 
                    : 'border-gray-200 hover:border-primary/30'
                }`}
                onClick={() => setSelectedType(type.id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                  selectedType === type.id 
                    ? 'bg-gradient-to-r from-primary to-accent text-white shadow-glow' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  <type.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-foreground">{type.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{type.description}</p>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectInterview(type.id);
                  }}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary to-accent text-white rounded-lg hover:shadow-glow transition-all duration-200 text-sm font-medium transform hover:scale-105"
                >
                  <span>Start Interview</span>
                  {(type.id === 'upsc' || type.id === 'friendly') && <ExternalLink className="h-4 w-4" />}
                </button>
              </motion.div>
            ))}
          </div>

          {/* Sessions Section */}
          <div className="glass-card rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-foreground">Your Sessions</h2>
              <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary to-accent text-white rounded-lg hover:shadow-glow transition-all duration-200 font-medium">
                <Plus className="h-4 w-4" />
                <span>New Session</span>
              </button>
            </div>
            
            {completedInterviews.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {completedInterviews.map((interview) => (
                  <div key={interview.id} className="px-6 py-4 flex items-center justify-between hover:bg-white/50 transition-colors">
                    <div>
                      <h3 className="font-medium text-foreground">{interview.type}</h3>
                      <p className="text-sm text-muted-foreground">
                        {interview.date} • {interview.duration}
                      </p>
                    </div>
                    <span className="px-3 py-1 text-xs font-medium bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-full border border-green-200">
                      {interview.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Laptop className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                  You don't have any AI Interviewer™ sessions.
                </h3>
                <p className="text-muted-foreground mb-6">
                  Start your first session to get real-time AI assistance during interviews.
                </p>
                <button 
                  onClick={() => handleSelectInterview('general')}
                  className="px-6 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-lg hover:shadow-glow transition-all duration-200 font-medium transform hover:scale-105"
                >
                  Start Your First Session
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default InterviewCopilot;
