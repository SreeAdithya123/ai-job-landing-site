
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Phone, PhoneOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

const UPSCInterviewer = () => {
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const navigate = useNavigate();

  const handleStartInterview = () => {
    setIsInterviewActive(true);
    // Here you can add the logic to start the actual interview/call
    console.log('UPSC Interview started');
  };

  const handleExitInterview = () => {
    setIsInterviewActive(false);
    // Here you can add the logic to disconnect the call
    console.log('UPSC Interview ended');
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
              UPSC Interviewer
            </h1>
          </div>

          {/* Main Content */}
          <div className="glass-card rounded-xl shadow-lg border border-gray-200 p-8">
            {/* Interviewer Image Division */}
            <div className="mb-8">
              <div className="w-full max-w-md mx-auto">
                <div className="aspect-square bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl border-2 border-dashed border-primary/30 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
                      <Phone className="h-8 w-8 text-white" />
                    </div>
                    <p className="text-muted-foreground text-sm">
                      Interviewer Image
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      (To be uploaded)
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
                  <Phone className="h-5 w-5" />
                  <span>Start Interview</span>
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
                      <span className="text-sm font-medium">Interview in Progress</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleExitInterview}
                    className="px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-medium text-lg transform hover:scale-105 flex items-center space-x-3 mx-auto"
                  >
                    <PhoneOff className="h-5 w-5" />
                    <span>Exit Interview</span>
                  </button>
                </motion.div>
              )}
            </div>

            {/* Interview Status Information */}
            {isInterviewActive && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg"
              >
                <h3 className="font-semibold text-blue-900 mb-2">Interview Tips:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Speak clearly and confidently</li>
                  <li>• Take your time to think before answering</li>
                  <li>• Maintain good posture and eye contact</li>
                  <li>• Be prepared to discuss current affairs</li>
                </ul>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UPSCInterviewer;
