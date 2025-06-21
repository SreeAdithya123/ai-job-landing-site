
import React from 'react';

interface InterviewStatusProps {
  isInterviewActive: boolean;
}

const InterviewStatus: React.FC<InterviewStatusProps> = ({ isInterviewActive }) => {
  if (!isInterviewActive) return null;

  return (
    <div className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl p-6 mb-6">
      <div className="text-center">
        <p className="text-white text-lg">
          Interview is <span className="bg-green-700 px-3 py-1 rounded-md text-green-300">Active</span>
        </p>
        <p className="text-slate-400 text-sm mt-2">
          Speak naturally. The AI will ask you questions and respond to your answers.
        </p>
      </div>
    </div>
  );
};

export default InterviewStatus;
