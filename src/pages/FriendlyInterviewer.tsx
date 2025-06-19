
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

const FriendlyInterviewer = () => {
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [transcript, setTranscript] = useState<Array<{
    speaker: 'AI' | 'User';
    text: string;
    timestamp: string;
  }>>([]);
  const navigate = useNavigate();

  const handleStartInterview = () => {
    setIsInterviewActive(true);
    // Add initial AI greeting to transcript
    const currentTime = new Date().toLocaleTimeString();
    setTranscript([{
      speaker: 'AI',
      text: 'Hello! I\'m your friendly AI interviewer. Let\'s have a casual conversation about your experiences and aspirations.',
      timestamp: currentTime
    }]);
    console.log('Friendly Interview started');
  };

  const handleExitInterview = () => {
    setIsInterviewActive(false);
    // Add closing message to transcript
    const currentTime = new Date().toLocaleTimeString();
    setTranscript(prev => [...prev, {
      speaker: 'AI',
      text: 'Thank you for the wonderful conversation! Take care.',
      timestamp: currentTime
    }]);
    console.log('Friendly Interview ended');
  };

  const handleBackToInterviews = () => {
    navigate('/interview-copilot');
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header with Back Button */}
          <div className="flex items-center mb-8">
            <button
              onClick={handleBackToInterviews}
              className="flex items-center space-x-2 px-4 py-2 glass-card border border-primary/20 rounded-lg hover:bg-white/90 transition-colors mr-4"
            >
              <ArrowLeft className="h-4 w-4 text-primary" />
              <span className="text-primary font-medium">Back to Interviews</span>
            </button>
            <h1 className="text-3xl font-bold text-foreground bg-gradient-to-r from-primary via-primary-light to-accent bg-clip-text text-transparent">
              Friendly Interviewer
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Main Interview Interface */}
            <div className="glass-card rounded-xl shadow-lg border border-gray-200 p-8">
              {/* Interviewer Image Division */}
              <div className="mb-8">
                <div className="w-full max-w-md mx-auto">
                  <div className="aspect-square bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl border-2 border-dashed border-primary/30 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="h-8 w-8 text-white" />
                      </div>
                      <p className="text-muted-foreground text-sm">
                        Friendly AI Interviewer
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        (Casual Conversation Mode)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="text-center">
                {!isInterviewActive ? (
                  <motion.button
                    onClick={handleStartInterview}
                    className="px-8 py-4 bg-gradient-to-r from-primary to-accent text-white rounded-lg hover:shadow-glow transition-all duration-200 font-medium text-lg transform hover:scale-105 flex items-center space-x-3 mx-auto"
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
                    className="space-y-4"
                  >
                    <div className="text-center mb-6">
                      <div className="inline-flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-800 rounded-full border border-green-200">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium">Friendly Chat in Progress</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={handleExitInterview}
                      className="px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-medium text-lg transform hover:scale-105 flex items-center space-x-3 mx-auto"
                    >
                      <UserCheck className="h-5 w-5" />
                      <span>End Chat</span>
                    </button>
                  </motion.div>
                )}
              </div>

              {/* Interview Tips */}
              {isInterviewActive && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg"
                >
                  <h3 className="font-semibold text-blue-900 mb-2">Friendly Chat Tips:</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Be yourself and speak naturally</li>
                    <li>• Share your experiences openly</li>
                    <li>• Ask questions if you're curious</li>
                    <li>• Relax and enjoy the conversation</li>
                  </ul>
                </motion.div>
              )}
            </div>

            {/* Right Column - Live Transcript */}
            <div className="glass-card rounded-xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Live Transcript</h3>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${isInterviewActive ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
                  <span className="text-sm text-muted-foreground">
                    {isInterviewActive ? 'Recording' : 'Idle'}
                  </span>
                </div>
              </div>

              <div className="h-96 overflow-y-auto bg-gray-50 rounded-lg p-4 space-y-3">
                {transcript.length === 0 ? (
                  <div className="text-center text-muted-foreground text-sm mt-20">
                    <Users className="h-12 w-12 mx-auto mb-4 text-primary/30" />
                    <p>Transcript will appear here when the interview starts</p>
                  </div>
                ) : (
                  transcript.map((entry, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`p-3 rounded-lg ${
                        entry.speaker === 'AI' 
                          ? 'bg-gradient-to-r from-primary/10 to-accent/10 border-l-4 border-primary' 
                          : 'bg-white border-l-4 border-accent'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className={`text-sm font-medium ${
                          entry.speaker === 'AI' ? 'text-primary' : 'text-accent'
                        }`}>
                          {entry.speaker === 'AI' ? 'Friendly AI' : 'You'}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {entry.timestamp}
                        </span>
                      </div>
                      <p className="text-sm text-foreground">{entry.text}</p>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Transcript Controls */}
              {transcript.length > 0 && (
                <div className="mt-4 flex justify-between items-center">
                  <button 
                    onClick={() => setTranscript([])}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Clear Transcript
                  </button>
                  <button className="text-sm text-primary hover:text-primary-hover transition-colors">
                    Download Transcript
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FriendlyInterviewer;
