
import React from 'react';
import { ArrowLeft, MessageSquare } from 'lucide-react';

interface InterviewHeaderProps {
  onBackClick: () => void;
}

const InterviewHeader: React.FC<InterviewHeaderProps> = ({ onBackClick }) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center">
        <button 
          onClick={onBackClick} 
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
        <span className="text-slate-300 text-sm font-medium">Voice Interview</span>
      </div>
    </div>
  );
};

export default InterviewHeader;
