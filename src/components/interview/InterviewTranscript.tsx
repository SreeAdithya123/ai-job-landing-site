
import React from 'react';
import { motion } from 'framer-motion';
import { TranscriptEntry } from '../../pages/UPSCInterviewer';

interface InterviewTranscriptProps {
  transcript: TranscriptEntry[];
  isInterviewActive: boolean;
  onClearTranscript: () => void;
}

const InterviewTranscript: React.FC<InterviewTranscriptProps> = ({
  transcript,
  isInterviewActive,
  onClearTranscript
}) => {
  if (transcript.length === 0) return null;

  return (
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
            className={`p-3 rounded-lg ${
              entry.speaker === 'AI' 
                ? 'bg-gradient-to-r from-primary/20 to-accent/20 border-l-4 border-primary' 
                : 'bg-slate-800/50 border-l-4 border-accent'
            }`}
          >
            <div className="flex justify-between items-start mb-1">
              <span className={`text-sm font-medium ${
                entry.speaker === 'AI' ? 'text-primary' : 'text-accent'
              }`}>
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
          onClick={onClearTranscript}
          className="text-sm text-slate-400 hover:text-slate-200 transition-colors"
        >
          Clear Transcript
        </button>
        <button className="text-sm text-primary hover:text-primary-light transition-colors">
          Download Transcript
        </button>
      </div>
    </div>
  );
};

export default InterviewTranscript;
