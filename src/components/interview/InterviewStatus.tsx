
import React from 'react';

interface InterviewStatusProps {
  isInterviewActive: boolean;
}

const InterviewStatus: React.FC<InterviewStatusProps> = ({ isInterviewActive }) => {
  if (!isInterviewActive) return null;

  return (
    <div className="bg-card border border-border rounded-xl p-6 mb-6">
      <div className="text-center">
        <p className="text-foreground text-lg">
          Interview is <span className="bg-green-500/10 text-green-600 dark:text-green-300 px-3 py-1 rounded-md">Active</span>
        </p>
        <p className="text-muted-foreground text-sm mt-2">
          Speak naturally. The AI will ask you questions and respond to your answers.
        </p>
      </div>
    </div>
  );
};

export default InterviewStatus;
