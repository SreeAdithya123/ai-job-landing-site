
import React from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Mic, MicOff } from 'lucide-react';

interface InterviewControlsProps {
  isInterviewActive: boolean;
  onStartInterview: () => void;
  onExitInterview: () => void;
}

const InterviewControls: React.FC<InterviewControlsProps> = ({
  isInterviewActive,
  onStartInterview,
  onExitInterview
}) => {
  return (
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
            onClick={onStartInterview} 
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
            onClick={onExitInterview} 
            className="flex items-center space-x-3 px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-medium"
          >
            <MicOff className="h-5 w-5" />
            <span>End Interview</span>
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default InterviewControls;
