
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useConversation } from '@11labs/react';
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
    },
    onDisconnect: () => {
      console.log('Disconnected from ElevenLabs Conversational AI');
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
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsInterviewActive(true);
      
      await conversation.startSession({
        agentId: import.meta.env.VITE_ELEVENLABS_AGENT_ID || 'your-agent-id'
      });
      
      console.log('UPSC Interview started with ElevenLabs AI');
    } catch (error) {
      console.error('Error starting interview:', error);
      setIsInterviewActive(false);
    }
  };

  const handleExitInterview = async () => {
    try {
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
