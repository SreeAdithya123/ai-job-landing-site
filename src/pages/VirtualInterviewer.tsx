
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Video, Camera, Mic, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import Layout from '../components/Layout';
import { Button } from '@/components/ui/button';

const VirtualInterviewer = () => {
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const navigate = useNavigate();

  const handleStartInterview = async () => {
    try {
      // Request camera and microphone permissions
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      setIsVideoEnabled(true);
      setIsAudioEnabled(true);
      setIsInterviewActive(true);
      
      toast({
        title: "Virtual Interview Started",
        description: "Camera and microphone are now active",
      });
      
      // Clean up the stream since we're just checking permissions for now
      stream.getTracks().forEach(track => track.stop());
      
    } catch (error) {
      console.error('Error accessing media devices:', error);
      toast({
        title: "Permission Required",
        description: "Please allow camera and microphone access to start the virtual interview",
        variant: "destructive",
      });
    }
  };

  const handleEndInterview = () => {
    setIsInterviewActive(false);
    setIsVideoEnabled(false);
    setIsAudioEnabled(false);
    
    toast({
      title: "Interview Ended",
      description: "Virtual interview session has been completed",
    });
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
              <span className="text-slate-300 text-sm font-medium">Video Interview Experience</span>
            </div>
          </div>

          {/* Main Interview Area */}
          <div className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl p-8 mb-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">
                Experience Real Video Interviews
              </h2>
              <p className="text-slate-300 text-lg max-w-3xl mx-auto">
                Practice with our advanced virtual interviewer that analyzes your body language, 
                facial expressions, and communication skills in a realistic video interview setting.
              </p>
            </div>

            {/* Video Preview Area */}
            <div className="relative bg-slate-900/50 rounded-xl border border-slate-600 p-8 mb-8 min-h-[400px] flex items-center justify-center">
              {!isInterviewActive ? (
                <div className="text-center">
                  <Video className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Ready to Start</h3>
                  <p className="text-slate-400">Click "Start Virtual Interview" to begin your video interview session</p>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <Camera className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Virtual Interview Active</h3>
                  <p className="text-green-400">Camera and microphone are recording</p>
                </div>
              )}
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-center space-x-4">
              {!isInterviewActive ? (
                <Button
                  onClick={handleStartInterview}
                  className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-medium text-lg"
                  size="lg"
                >
                  <Video className="h-5 w-5" />
                  <span>Start Virtual Interview</span>
                </Button>
              ) : (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 px-4 py-2 bg-green-900/50 text-green-300 rounded-full border border-green-700/50">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">Interview in Progress</span>
                  </div>
                  
                  <Button
                    onClick={handleEndInterview}
                    variant="destructive"
                    size="lg"
                    className="flex items-center space-x-2"
                  >
                    <Video className="h-5 w-5" />
                    <span>End Interview</span>
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
              <h3 className="text-lg font-semibold text-white mb-2">Video Analysis</h3>
              <p className="text-slate-300 text-sm">
                Advanced facial expression and body language analysis during your interview
              </p>
            </div>

            <div className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl p-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
                <Mic className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Voice Assessment</h3>
              <p className="text-slate-300 text-sm">
                Real-time analysis of your tone, pace, and communication clarity
              </p>
            </div>

            <div className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl p-6">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center mb-4">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Personalized Feedback</h3>
              <p className="text-slate-300 text-sm">
                Detailed insights and recommendations to improve your interview performance
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
            <h3 className="font-semibold text-white mb-4">Virtual Interview Tips:</h3>
            <ul className="text-sm text-slate-300 space-y-2">
              <li>• Ensure good lighting and a clean background</li>
              <li>• Look directly at the camera to maintain eye contact</li>
              <li>• Speak clearly and at a moderate pace</li>
              <li>• Practice your posture and hand gestures</li>
              <li>• Test your camera and microphone before starting</li>
            </ul>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default VirtualInterviewer;
