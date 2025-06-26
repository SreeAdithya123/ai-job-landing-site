
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Video, Camera, Mic, Settings, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import Layout from '../components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useHeyGen } from '@/hooks/useHeyGen';

const VirtualInterviewer = () => {
  const [userInput, setUserInput] = useState('');
  const navigate = useNavigate();
  const { isActive, isLoading, startSession, stopSession, speak } = useHeyGen();

  const handleStartInterview = async () => {
    try {
      await startSession();
      
      // Initial greeting from the AI avatar
      setTimeout(() => {
        speak("Hello! I'm your virtual interviewer. I'm here to help you practice your interview skills. What type of position are you interviewing for today?");
      }, 2000);
      
    } catch (error) {
      console.error('Failed to start interview:', error);
    }
  };

  const handleEndInterview = async () => {
    try {
      await stopSession();
    } catch (error) {
      console.error('Failed to end interview:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!userInput.trim() || !isActive) return;
    
    const message = userInput.trim();
    setUserInput('');
    
    try {
      // Generate a response based on the user's input
      const interviewResponses = [
        `That's interesting. Can you tell me more about your experience with ${message.toLowerCase().includes('experience') ? 'that particular area' : 'similar challenges'}?`,
        `Thank you for sharing that. How do you think this experience has prepared you for this role?`,
        `I see. What would you say is your greatest strength when it comes to ${message.toLowerCase().includes('strength') ? 'problem-solving' : 'teamwork'}?`,
        `That's a good point. Can you give me a specific example of how you've handled a similar situation in the past?`,
        `Excellent. What questions do you have for me about the role or the company?`
      ];
      
      const randomResponse = interviewResponses[Math.floor(Math.random() * interviewResponses.length)];
      
      // Make the avatar speak the response
      await speak(randomResponse);
      
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header with Back Button */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center space-x-2 px-4 py-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg hover:bg-slate-700/50 transition-colors mr-6"
              >
                <ArrowLeft className="h-4 w-4 text-slate-300" />
                <span className="text-slate-300 font-medium">Back to Dashboard</span>
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <Video className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-white">
                  Virtual Interviewer
                </h1>
              </div>
            </div>
            
            <div className="px-4 py-2 bg-slate-800/80 backdrop-blur-sm border border-slate-600 rounded-lg">
              <span className="text-slate-300 text-sm font-medium">HeyGen AI Avatar Experience</span>
            </div>
          </div>

          {/* Main Interview Area */}
          <div className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl p-8 mb-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">
                Practice with AI Avatar Interviewer
              </h2>
              <p className="text-slate-300 text-lg max-w-3xl mx-auto">
                Experience realistic interview practice with our HeyGen-powered AI avatar that 
                speaks naturally and provides interactive feedback in real-time.
              </p>
            </div>

            {/* Avatar Preview Area */}
            <div className="relative bg-slate-900/50 rounded-xl border border-slate-600 p-8 mb-8 min-h-[400px] flex items-center justify-center">
              {!isActive ? (
                <div className="text-center">
                  <Video className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">AI Avatar Ready</h3>
                  <p className="text-slate-400 mb-4">Click "Start Interview" to begin your session with the HeyGen AI avatar</p>
                  <div className="flex items-center justify-center space-x-2 text-blue-400 text-sm">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>HeyGen Avatar Initialized</span>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <Camera className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">AI Avatar Active</h3>
                  <p className="text-green-400 mb-4">Your virtual interviewer is ready to interact</p>
                  
                  {/* Chat Interface */}
                  <div className="bg-slate-800/50 rounded-lg p-4 mb-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <Input
                        type="text"
                        placeholder="Type your response or question..."
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-1 bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
                        disabled={isLoading}
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={!userInput.trim() || isLoading}
                        className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-slate-400 text-xs">
                      Type your response and the AI avatar will respond naturally
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-center space-x-4">
              {!isActive ? (
                <Button
                  onClick={handleStartInterview}
                  disabled={isLoading}
                  className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-medium text-lg"
                  size="lg"
                >
                  <Video className="h-5 w-5" />
                  <span>{isLoading ? 'Starting...' : 'Start Interview'}</span>
                </Button>
              ) : (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 px-4 py-2 bg-green-900/50 text-green-300 rounded-full border border-green-700/50">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">HeyGen Avatar Active</span>
                  </div>
                  
                  <Button
                    onClick={handleEndInterview}
                    disabled={isLoading}
                    variant="destructive"
                    size="lg"
                    className="flex items-center space-x-2"
                  >
                    <Video className="h-5 w-5" />
                    <span>{isLoading ? 'Ending...' : 'End Interview'}</span>
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl p-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4">
                <Camera className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Realistic Avatar</h3>
              <p className="text-slate-300 text-sm">
                Powered by HeyGen's advanced AI technology for lifelike interactions and expressions
              </p>
            </div>

            <div className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl p-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
                <Mic className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Natural Speech</h3>
              <p className="text-slate-300 text-sm">
                High-quality voice synthesis that responds naturally to your conversation
              </p>
            </div>

            <div className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl p-6">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center mb-4">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Interactive Chat</h3>
              <p className="text-slate-300 text-sm">
                Real-time conversation with intelligent responses tailored to interview scenarios
              </p>
            </div>
          </div>

          {/* Tips Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl p-6"
          >
            <h3 className="font-semibold text-white mb-4">HeyGen Avatar Interview Tips:</h3>
            <ul className="text-sm text-slate-300 space-y-2">
              <li>• Speak naturally and treat the avatar as a real interviewer</li>
              <li>• Type your responses in the chat box for interactive dialogue</li>
              <li>• Listen carefully to the avatar's questions and feedback</li>
              <li>• Practice maintaining eye contact with the avatar</li>
              <li>• Use this as a safe space to build confidence before real interviews</li>
            </ul>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default VirtualInterviewer;
