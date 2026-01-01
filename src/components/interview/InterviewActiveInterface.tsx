
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useConversation } from '@11labs/react';
import { TranscriptEntry } from '../../pages/InterviewCopilot';
import InterviewInterface from './InterviewInterface';
import InterviewControls from './InterviewControls';
import InterviewTranscript from './InterviewTranscript';
import InterviewStatus from './InterviewStatus';
import InterviewRecordingIndicator from './InterviewRecordingIndicator';
import CameraPreview from './CameraPreview';

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
  // Recording props
  isRecording?: boolean;
  recordingDuration?: number;
  hasRecording?: boolean;
  videoStream?: MediaStream | null;
  onDownloadRecording?: () => void;
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
  // Recording props
  isRecording = false,
  recordingDuration = 0,
  hasRecording = false,
  videoStream = null,
  onDownloadRecording
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      {/* Full Screen Header */}
      <div className="bg-slate-800/30 backdrop-blur-md border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={onBack}
                className="flex items-center space-x-2 px-4 py-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg hover:bg-slate-700/50 transition-all duration-200 group"
              >
                <ArrowLeft className="h-4 w-4 text-slate-300 group-hover:text-white transition-colors" />
                <span className="text-slate-300 group-hover:text-white font-medium transition-colors">Back</span>
              </button>
              
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 bg-gradient-to-r ${details.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                  <span className="text-2xl">{details.icon}</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">{details.title}</h1>
                  <p className="text-slate-400 text-sm">{details.subtitle}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <InterviewRecordingIndicator
                isRecording={isRecording}
                recordingDuration={recordingDuration}
                hasRecording={hasRecording}
                onDownload={onDownloadRecording}
              />
              <div className={`px-3 py-1.5 rounded-full text-xs font-medium border ${
                connectionStatus === 'connected' 
                  ? 'bg-green-900/50 text-green-300 border-green-700/50' 
                  : connectionStatus === 'error'
                  ? 'bg-red-900/50 text-red-300 border-red-700/50'
                  : 'bg-slate-800/50 text-slate-300 border-slate-700/50'
              }`}>
                {connectionStatus === 'connected' ? 'Connected' : 
                 connectionStatus === 'error' ? 'Error' :
                 connectionStatus === 'connecting' ? 'Connecting...' :
                 connectionStatus === 'requesting-mic' ? 'Requesting Mic...' :
                 connectionStatus === 'fetching-config' ? 'Configuring...' : 'Ready'}
              </div>
              {userIsSpeaking && (
                <div className="px-3 py-1.5 bg-purple-900/50 text-purple-300 border border-purple-700/50 rounded-full text-xs font-medium animate-pulse">
                  Speaking...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Camera Preview */}
      {isInterviewActive && (
        <div className="max-w-7xl mx-auto w-full px-6 pt-6">
          <CameraPreview
            videoStream={videoStream}
            isRecording={isRecording}
            className="w-48 h-36 mx-auto"
          />
        </div>
      )}

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
