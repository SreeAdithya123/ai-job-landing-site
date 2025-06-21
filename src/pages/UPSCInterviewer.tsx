
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, MessageSquare, User, RotateCcw, LogOut, Mic, MicOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useConversation } from '@11labs/react';
import { supabase } from '@/integrations/supabase/client';
import Layout from '../components/Layout';

const UPSCInterviewer = () => {
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [transcript, setTranscript] = useState<Array<{
    speaker: 'AI' | 'User';
    text: string;
    timestamp: string;
  }>>([]);
  const [audioRecordings, setAudioRecordings] = useState<Array<{
    id: string;
    timestamp: string;
    audioData: string;
  }>>([]);
  const [interviewAnalysis, setInterviewAnalysis] = useState<{
    confidence: number;
    clarity: number;
    relevance: number;
    suggestions: string[];
  } | null>(null);

  const navigate = useNavigate();

  const conversation = useConversation({
    onMessage: (message) => {
      const currentTime = new Date().toLocaleTimeString();
      setTranscript(prev => [...prev, {
        speaker: message.source === 'ai' ? 'AI' : 'User',
        text: message.message,
        timestamp: currentTime
      }]);
      
      // Analyze user responses for dashboard updates
      if (message.source === 'user') {
        analyzeResponse(message.message);
      }
    },
    onConnect: () => {
      console.log('Voice conversation connected');
    },
    onDisconnect: () => {
      console.log('Voice conversation disconnected');
      saveInterviewData();
    },
    onError: (error) => {
      console.error('Conversation error:', error);
    },
    overrides: {
      agent: {
        prompt: {
          prompt: "You are a UPSC Civil Services interview panel member. Conduct a professional interview with appropriate questions about current affairs, governance, ethics, and the candidate's background. Be encouraging but challenging. Keep responses concise and professional."
        },
        firstMessage: "Good morning. I am your UPSC interview panel member. Please introduce yourself and tell me why you want to join the civil services.",
        language: "en"
      }
    }
  });

  const analyzeResponse = (userResponse: string) => {
    // Simple analysis logic - in real app, this would use AI
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
    // Save interview data to localStorage for dashboard access
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

    // Update dashboard stats
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
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Get signed URL from our edge function
      const { data, error } = await supabase.functions.invoke('elevenlabs-conversation', {
        body: {
          action: 'get_signed_url',
          agentId: 'agent_01jxyr90cgfbmsa93nmswvcfp7'
        }
      });

      if (error) {
        throw new Error(`Failed to get signed URL: ${error.message}`);
      }

      if (!data?.signed_url) {
        throw new Error('No signed URL received from server');
      }
      
      // Start ElevenLabs conversation with signed URL using origin parameter
      await conversation.startSession({
        origin: data.signed_url
      });
      
      setIsInterviewActive(true);
      
      // Add initial AI greeting to transcript
      const currentTime = new Date().toLocaleTimeString();
      setTranscript([{
        speaker: 'AI',
        text: 'Good morning. I am your UPSC interview panel member. Please take your seat and we shall begin with the interview process.',
        timestamp: currentTime
      }]);
      
      console.log('UPSC Voice Interview started');
    } catch (error) {
      console.error('Failed to start interview:', error);
      alert(`Failed to start voice interview: ${error.message}. Please check your microphone permissions and try again.`);
    }
  };

  const handleExitInterview = async () => {
    try {
      await conversation.endSession();
      setIsInterviewActive(false);
      
      // Add closing message to transcript
      const currentTime = new Date().toLocaleTimeString();
      setTranscript(prev => [...prev, {
        speaker: 'AI',
        text: 'Thank you for your time. The interview panel will deliberate on your responses. You may leave now.',
        timestamp: currentTime
      }]);
      
      console.log('UPSC Interview ended');
    } catch (error) {
      console.error('Failed to end interview:', error);
    }
  };

  const handleBackToInterviews = () => {
    navigate('/interview-copilot');
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <button onClick={handleBackToInterviews} className="flex items-center space-x-2 px-4 py-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg hover:bg-slate-700/50 transition-colors mr-6">
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
              <span className="text-slate-300 text-sm font-medium">Voice Interview</span>
            </div>
          </div>

          {/* Main Interview Interface */}
          <div className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-2xl p-8 mb-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* AI Interviewer Section */}
              <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-slate-600/50 rounded-xl p-8 flex flex-col items-center justify-center min-h-[400px]">
                <div className="relative mb-6">
                  {/* Voice indicator */}
                  <div className={`w-32 h-32 rounded-full bg-gradient-to-r from-slate-600 to-slate-500 p-1 ${conversation.isSpeaking ? 'animate-pulse' : ''}`}>
                    <div className="w-full h-full rounded-full bg-gradient-to-r from-primary/20 to-accent/20 p-3">
                      <div className="w-full h-full rounded-full bg-gradient-to-r from-primary/30 to-accent/30 flex items-center justify-center">
                        <MessageSquare className="h-12 w-12 text-white" />
                      </div>
                    </div>
                  </div>
                  {conversation.isSpeaking && (
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                      <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                        Speaking...
                      </div>
                    </div>
                  )}
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-2">AI Interviewer</h2>
                <p className="text-slate-400 text-sm">UPSC Panel Member</p>
                <div className="mt-4 text-center">
                  <span className={`text-sm ${conversation.status === 'connected' ? 'text-green-400' : 'text-slate-400'}`}>
                    {conversation.status === 'connected' ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
              </div>

              {/* User Section */}
              <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-slate-600/50 rounded-xl p-8 flex flex-col items-center justify-center min-h-[400px]">
                <div className="relative mb-6">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-r from-slate-600 to-slate-500 p-1">
                    <div className="w-full h-full rounded-full bg-slate-700 flex items-center justify-center overflow-hidden">
                      <User className="h-16 w-16 text-slate-400" />
                    </div>
                  </div>
                  {isInterviewActive && (
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                      <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                        <Mic className="h-3 w-3" />
                        <span>Recording</span>
                      </div>
                    </div>
                  )}
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-2">Candidate (You)</h2>
                <p className="text-slate-400 text-sm">UPSC Aspirant</p>
              </div>
            </div>
          </div>

          {/* Question Section */}
          <div className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl p-6 mb-6">
            <div className="text-center">
              <p className="text-white text-lg">
                Ready for your <span className="bg-slate-700 px-3 py-1 rounded-md text-slate-300">UPSC Civil Services</span> voice interview?
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center space-x-4">
            {!isInterviewActive ? (
              <>
                <motion.button 
                  className="flex items-center space-x-3 px-6 py-3 bg-slate-700/80 backdrop-blur-sm border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-600/80 transition-all duration-200" 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ duration: 0.6 }}
                >
                  <RotateCcw className="h-5 w-5" />
                  <span>Reset</span>
                </motion.button>
                
                <motion.button 
                  onClick={handleStartInterview} 
                  className="flex items-center space-x-3 px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-medium" 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <Mic className="h-5 w-5" />
                  <span>Start Voice Interview</span>
                </motion.button>
              </>
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
                    <span className="text-sm font-medium">Voice Interview in Progress</span>
                  </div>
                </div>
                
                <button 
                  onClick={handleExitInterview} 
                  className="flex items-center space-x-3 px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-medium"
                >
                  <MicOff className="h-5 w-5" />
                  <span>End Interview</span>
                </button>
              </motion.div>
            )}
          </div>

          {/* Live Transcript Section */}
          {transcript.length > 0 && (
            <div className="mt-8 bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Live Transcript</h3>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${isInterviewActive ? 'bg-green-400 animate-pulse' : 'bg-slate-500'}`}></div>
                  <span className="text-sm text-slate-400">
                    {isInterviewActive ? 'Recording' : 'Idle'}
                  </span>
                </div>
              </div>

              <div className="h-64 overflow-y-auto bg-slate-900/50 rounded-lg p-4 space-y-3">
                {transcript.map((entry, index) => (
                  <motion.div 
                    key={index} 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 0.3 }} 
                    className={`p-3 rounded-lg ${entry.speaker === 'AI' ? 'bg-gradient-to-r from-primary/20 to-accent/20 border-l-4 border-primary' : 'bg-slate-800/50 border-l-4 border-accent'}`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className={`text-sm font-medium ${entry.speaker === 'AI' ? 'text-primary' : 'text-accent'}`}>
                        {entry.speaker === 'AI' ? 'Interview Panel' : 'Candidate'}
                      </span>
                      <span className="text-xs text-slate-400">
                        {entry.timestamp}
                      </span>
                    </div>
                    <p className="text-sm text-slate-200">{entry.text}</p>
                  </motion.div>
                ))}
              </div>

              <div className="mt-4 flex justify-between items-center">
                <button 
                  onClick={() => setTranscript([])} 
                  className="text-sm text-slate-400 hover:text-slate-200 transition-colors"
                >
                  Clear Transcript
                </button>
                <button className="text-sm text-primary hover:text-primary-light transition-colors">
                  Download Transcript
                </button>
              </div>
            </div>
          )}

          {/* Real-time Analysis Display */}
          {interviewAnalysis && isInterviewActive && (
            <div className="mt-8 bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Real-time Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-slate-900/50 rounded-lg p-4">
                  <div className="text-sm text-slate-400">Confidence</div>
                  <div className="text-2xl font-bold text-green-400">{interviewAnalysis.confidence}%</div>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-4">
                  <div className="text-sm text-slate-400">Clarity</div>
                  <div className="text-2xl font-bold text-blue-400">{interviewAnalysis.clarity}%</div>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-4">
                  <div className="text-sm text-slate-400">Relevance</div>
                  <div className="text-2xl font-bold text-purple-400">{interviewAnalysis.relevance}%</div>
                </div>
              </div>
              {interviewAnalysis.suggestions.length > 0 && (
                <div className="bg-slate-900/50 rounded-lg p-4">
                  <div className="text-sm text-slate-400 mb-2">Suggestions</div>
                  <ul className="text-sm text-slate-200 space-y-1">
                    {interviewAnalysis.suggestions.map((suggestion, index) => (
                      <li key={index}>• {suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default UPSCInterviewer;
