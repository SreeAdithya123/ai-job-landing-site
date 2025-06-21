
import React from 'react';
import { MessageSquare, User, Mic } from 'lucide-react';

interface InterviewParticipantsProps {
  isSpeaking: boolean;
  isConnected: boolean;
  isInterviewActive: boolean;
}

const InterviewParticipants: React.FC<InterviewParticipantsProps> = ({
  isSpeaking,
  isConnected,
  isInterviewActive
}) => {
  return (
    <div className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-2xl p-8 mb-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* AI Interviewer Section */}
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-slate-600/50 rounded-xl p-8 flex flex-col items-center justify-center min-h-[400px]">
          <div className="relative mb-6">
            <div className={`w-32 h-32 rounded-full bg-gradient-to-r from-slate-600 to-slate-500 p-1 ${isSpeaking ? 'animate-pulse' : ''}`}>
              <div className="w-full h-full rounded-full bg-gradient-to-r from-primary/20 to-accent/20 p-3">
                <div className="w-full h-full rounded-full bg-gradient-to-r from-primary/30 to-accent/30 flex items-center justify-center">
                  <MessageSquare className="h-12 w-12 text-white" />
                </div>
              </div>
            </div>
            {isSpeaking && (
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
            <span className={`text-sm ${isConnected ? 'text-green-400' : 'text-slate-400'}`}>
              {isConnected ? 'Connected' : 'Disconnected'}
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
  );
};

export default InterviewParticipants;
