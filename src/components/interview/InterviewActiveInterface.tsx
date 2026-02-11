
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useConversation } from '@11labs/react';
import { TranscriptEntry } from '../../pages/InterviewCopilot';
import InterviewInterface from './InterviewInterface';
import InterviewControls from './InterviewControls';
import InterviewTranscript from './InterviewTranscript';
import InterviewStatus from './InterviewStatus';
import InterviewTimer from './InterviewTimer';

interface InterviewActiveInterfaceProps {
  selectedType: string;
  connectionStatus: string;
  userIsSpeaking: boolean;
  isInterviewActive: boolean;
  transcript: TranscriptEntry[];
  conversation: ReturnType<typeof useConversation>;
  onBack: () => void;
  onStartInterview: () => void;
  onExitInterview: () => void;
  onClearTranscript: () => void;
  timeRemaining?: string;
}

const InterviewActiveInterface: React.FC<InterviewActiveInterfaceProps> = ({
  selectedType,
  connectionStatus,
  userIsSpeaking,
  isInterviewActive,
  transcript,
  conversation,
  onBack,
  onStartInterview,
  onExitInterview,
  onClearTranscript,
  timeRemaining
}) => {
  const getInterviewDetails = () => {
    if (selectedType === 'general') {
      return {
        title: 'General AI Interview',
        subtitle: 'Behavioral & Situational Questions',
        icon: '💼',
        gradient: 'from-blue-500 to-blue-600'
      };
    }
    return {
      title: 'Coding AI Interview',
      subtitle: 'Technical & Programming Challenges',
      icon: '💻',
      gradient: 'from-green-500 to-green-600'
    };
  };

  const details = getInterviewDetails();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Full Screen Header */}
      <div className="bg-card/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={onBack}
                className="flex items-center space-x-2 px-4 py-2 bg-muted border border-border rounded-lg hover:bg-muted/80 transition-all duration-200 group"
              >
                <ArrowLeft className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                <span className="text-muted-foreground group-hover:text-foreground font-medium transition-colors">Back</span>
              </button>
              
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 bg-gradient-to-r ${details.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                  <span className="text-2xl">{details.icon}</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">{details.title}</h1>
                  <p className="text-muted-foreground text-sm">{details.subtitle}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {isInterviewActive && timeRemaining && (
                <InterviewTimer timeRemaining={timeRemaining} />
              )}
              <div className={`px-3 py-1.5 rounded-full text-xs font-medium border ${
                connectionStatus === 'connected' 
                  ? 'bg-green-500/10 text-green-600 border-green-500/30 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700/50' 
                  : connectionStatus === 'error'
                  ? 'bg-red-500/10 text-red-600 border-red-500/30 dark:bg-red-900/50 dark:text-red-300 dark:border-red-700/50'
                  : 'bg-muted text-muted-foreground border-border'
              }`}>
                {connectionStatus === 'connected' ? 'Connected' : 
                 connectionStatus === 'error' ? 'Error' :
                 connectionStatus === 'connecting' ? 'Connecting...' :
                 connectionStatus === 'requesting-mic' ? 'Requesting Mic...' :
                 connectionStatus === 'fetching-config' ? 'Configuring...' : 'Ready'}
              </div>
              {userIsSpeaking && (
                <div className="px-3 py-1.5 bg-purple-500/10 text-purple-600 border border-purple-500/30 dark:bg-purple-900/50 dark:text-purple-300 dark:border-purple-700/50 rounded-full text-xs font-medium animate-pulse">
                  Speaking...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Interview Content */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 space-y-6">
        <InterviewInterface conversation={conversation} userIsSpeaking={userIsSpeaking} />
        <InterviewStatus isInterviewActive={isInterviewActive} />
        <InterviewControls 
          isInterviewActive={isInterviewActive} 
          onStartInterview={onStartInterview} 
          onExitInterview={onExitInterview} 
        />
        <InterviewTranscript 
          transcript={transcript} 
          isInterviewActive={isInterviewActive} 
          onClearTranscript={onClearTranscript} 
        />
      </div>
    </div>
  );
};

export default InterviewActiveInterface;
