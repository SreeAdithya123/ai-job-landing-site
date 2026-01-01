import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConversation } from '@11labs/react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { processInterviewEnd } from '@/services/interviewSessionService';
import ProtectedRoute from '../components/ProtectedRoute';
import InterviewHeader from '../components/interview/InterviewHeader';
import InterviewHero from '../components/interview/InterviewHero';
import InterviewTypeCard from '../components/interview/InterviewTypeCard';
import InterviewSessionsPanel from '../components/interview/InterviewSessionsPanel';
import InterviewActiveInterface from '../components/interview/InterviewActiveInterface';
import { Laptop, Code, Star, Users } from 'lucide-react';
import { useInterviewRecording } from '@/hooks/useInterviewRecording';

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
  const [interviewStartTime, setInterviewStartTime] = useState<Date | null>(null);
  const [sessionId, setSessionId] = useState<string>('');
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const recording = useInterviewRecording();


  const conversation = useConversation({
    onConnect: () => {
      console.log('✅ Successfully connected to ElevenLabs Conversational AI');
      const newSessionId = `interview_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setSessionId(newSessionId);
      setInterviewStartTime(new Date());
      setIsInterviewActive(true);
      setConnectionStatus('connected');
      toast({
        title: "Interview Started",
        description: "Connected to AI interviewer successfully"
      });
    },
    onDisconnect: async () => {
      console.log('🔌 Disconnected from ElevenLabs Conversational AI');
      setIsInterviewActive(false);
      setConnectionStatus('disconnected');
      setUserIsSpeaking(false);
      
      // Process interview end when disconnecting
      if (transcript.length > 0 && sessionId) {
        try {
          const duration = interviewStartTime 
            ? Math.round((new Date().getTime() - interviewStartTime.getTime()) / 60000)
            : undefined;
          
          await processInterviewEnd(sessionId, transcript, selectedType, duration);
          
          toast({
            title: "Interview Completed",
            description: "Your interview has been saved and analyzed successfully."
          });
        } catch (error) {
          console.error('❌ Error processing interview end:', error);
          toast({
            title: "Save Error",
            description: "Interview ended but failed to save data.",
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "Interview Ended",
          description: "Disconnected from AI interviewer"
        });
      }
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
    if (type === 'coding') {
      navigate('/interview-copilot/coding');
    } else if (type === 'general') {
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
      console.log('🎤 Requesting microphone and camera access...');
      setConnectionStatus('requesting-mic');
      
      // Start recording (this also requests camera/mic permissions)
      const stream = await recording.startRecording();
      if (!stream) {
        throw new Error('Failed to start recording');
      }
      console.log('✅ Microphone and camera access granted, recording started');
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
      
      // Stop recording
      recording.stopRecording();
      
      // Process interview end before closing the session
      if (transcript.length > 0 && sessionId) {
        try {
          const duration = interviewStartTime 
            ? Math.round((new Date().getTime() - interviewStartTime.getTime()) / 60000)
            : undefined;
          
          await processInterviewEnd(sessionId, transcript, selectedType, duration);
          
          toast({
            title: "Interview Completed",
            description: "Your interview has been saved and analyzed successfully."
          });
        } catch (error) {
          console.error('❌ Error processing interview end:', error);
          toast({
            title: "Save Error",
            description: "Interview ended but failed to save data.",
            variant: "destructive"
          });
        }
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

  // Show interview interface for general interviews only (coding has its own page)
  if (showInterviewInterface && selectedType === 'general') {
    return (
      <ProtectedRoute>
        <InterviewActiveInterface
          selectedType={selectedType}
          connectionStatus={connectionStatus}
          userIsSpeaking={userIsSpeaking}
          isInterviewActive={isInterviewActive}
          transcript={transcript}
          conversation={conversation}
          onBack={handleBackToInterviews}
          onStartInterview={handleStartInterview}
          onExitInterview={handleExitInterview}
          onClearTranscript={handleClearTranscript}
          isRecording={recording.isRecording}
          recordingDuration={recording.recordingDuration}
          hasRecording={!!recording.recordedBlob}
          videoStream={recording.videoStream}
          onDownloadRecording={recording.downloadRecording}
        />
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <InterviewHeader onSignOut={handleSignOut} />

        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          <InterviewHero />

          {/* Interview Type Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {interviewTypes.map((type, index) => (
              <InterviewTypeCard
                key={type.id}
                type={type}
                isSelected={selectedType === type.id}
                onSelect={setSelectedType}
                onStart={handleSelectInterview}
                index={index}
              />
            ))}
          </div>

          {/* Sessions Section */}
          <InterviewSessionsPanel
            completedInterviews={completedInterviews}
            onStartFirstInterview={() => handleSelectInterview('general')}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default InterviewCopilot;
