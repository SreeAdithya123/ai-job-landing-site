
import React from 'react';
import { MessageSquare, User } from 'lucide-react';

interface InterviewInterfaceProps {
  conversation: {
    isSpeaking: boolean;
    status: string;
  };
  userIsSpeaking?: boolean;
}

const InterviewInterface: React.FC<InterviewInterfaceProps> = ({ conversation, userIsSpeaking = false }) => {
  const isConnected = conversation.status === 'connected';
  const aiIsSpeaking = isConnected && conversation.isSpeaking && !userIsSpeaking;
  const userIsActuallySpeaking = isConnected && userIsSpeaking;

  return (
    <div className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-2xl p-8 mb-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* AI Interviewer Section */}
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-slate-600/50 rounded-xl p-8 flex flex-col items-center justify-center min-h-[400px]">
          <div className="relative mb-6">
            {/* Animated ripple effects when AI is speaking */}
            {aiIsSpeaking && (
              <>
                <div className="absolute inset-0 w-32 h-32 rounded-full bg-gradient-to-r from-primary/30 to-accent/30 animate-ping"></div>
                <div className="absolute inset-2 w-28 h-28 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 animate-pulse animation-delay-150"></div>
                <div className="absolute inset-4 w-24 h-24 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 animate-ping animation-delay-300"></div>
              </>
            )}
            
            {/* Outer ring with enhanced animation when AI is speaking */}
            <div className={`relative w-32 h-32 rounded-full bg-gradient-to-r from-slate-600 to-slate-500 p-1 transition-all duration-300 ${
              aiIsSpeaking 
                ? 'animate-pulse shadow-lg shadow-primary/50 scale-105' 
                : 'hover:scale-105'
            }`}>
              {/* Middle ring with glow effect */}
              <div className={`w-full h-full rounded-full bg-gradient-to-r from-primary/20 to-accent/20 p-3 transition-all duration-300 ${
                aiIsSpeaking ? 'bg-gradient-to-r from-primary/40 to-accent/40' : ''
              }`}>
                {/* Inner circle with breathing animation */}
                <div className={`w-full h-full rounded-full bg-gradient-to-r from-primary/30 to-accent/30 flex items-center justify-center transition-all duration-300 ${
                  aiIsSpeaking ? 'bg-gradient-to-r from-primary/60 to-accent/60 animate-pulse' : ''
                }`}>
                  <MessageSquare className={`h-12 w-12 text-white transition-all duration-300 ${
                    aiIsSpeaking ? 'scale-110 drop-shadow-lg' : ''
                  }`} />
                </div>
              </div>
            </div>
            
            {/* AI Speaking indicator with slide-in animation */}
            {aiIsSpeaking && (
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 animate-fade-in">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-3 py-1.5 rounded-full shadow-lg animate-pulse">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                    <span className="font-medium">AI Speaking...</span>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce animation-delay-150"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-2">AI Interviewer</h2>
          <p className="text-slate-400 text-sm">Technical Interview Expert</p>
          <div className="mt-4 flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
              isConnected 
                ? 'bg-green-400 animate-pulse shadow-sm shadow-green-400' 
                : 'bg-slate-500'
            }`}></div>
            <span className="text-xs text-slate-400">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>

        {/* User Section */}
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-slate-600/50 rounded-xl p-8 flex flex-col items-center justify-center min-h-[400px]">
          <div className="relative mb-6">
            {/* Animated ripple effects when user is speaking */}
            {userIsActuallySpeaking && (
              <>
                <div className="absolute inset-0 w-32 h-32 rounded-full bg-gradient-to-r from-blue-500/30 to-purple-500/30 animate-ping"></div>
                <div className="absolute inset-2 w-28 h-28 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 animate-pulse animation-delay-150"></div>
                <div className="absolute inset-4 w-24 h-24 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 animate-ping animation-delay-300"></div>
              </>
            )}

            {/* User avatar with animation when speaking */}
            <div className={`w-32 h-32 rounded-full bg-gradient-to-r from-slate-600 to-slate-500 p-1 transition-all duration-300 ${
              userIsActuallySpeaking 
                ? 'animate-pulse shadow-lg shadow-blue-500/50 scale-105' 
                : 'hover:scale-105'
            }`}>
              <div className={`w-full h-full rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-3 transition-all duration-300 ${
                userIsActuallySpeaking ? 'bg-gradient-to-r from-blue-500/40 to-purple-500/40' : 'bg-slate-700'
              } flex items-center justify-center overflow-hidden`}>
                <User className={`h-16 w-16 transition-all duration-300 ${
                  userIsActuallySpeaking ? 'text-white scale-110 drop-shadow-lg' : 'text-slate-400'
                }`} />
              </div>
            </div>

            {/* User Speaking indicator */}
            {userIsActuallySpeaking && (
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 animate-fade-in">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs px-3 py-1.5 rounded-full shadow-lg animate-pulse">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                    <span className="font-medium">You're Speaking...</span>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce animation-delay-150"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-2">Candidate (You)</h2>
          <p className="text-slate-400 text-sm">Interview Participant</p>
        </div>
      </div>
      
      {/* Live conversation indicator */}
      {isConnected && (
        <div className="mt-6 text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-800/50 text-slate-300 rounded-full border border-slate-600/50">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Live Interview Session</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewInterface;
