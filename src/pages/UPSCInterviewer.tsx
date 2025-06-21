
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useUPSCConversation } from '@/hooks/useUPSCConversation';
import InterviewHeader from '@/components/interview/InterviewHeader';
import InterviewParticipants from '@/components/interview/InterviewParticipants';
import InterviewControls from '@/components/interview/InterviewControls';
import LiveTranscript from '@/components/interview/LiveTranscript';
import RealTimeAnalysis from '@/components/interview/RealTimeAnalysis';

const UPSCInterviewer = () => {
  const navigate = useNavigate();
  const {
    isInterviewActive,
    transcript,
    interviewAnalysis,
    conversation,
    setTranscript,
    handleStartInterview,
    handleExitInterview
  } = useUPSCConversation();

  const handleBackToInterviews = () => {
    navigate('/interview-copilot');
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <InterviewHeader onBackClick={handleBackToInterviews} />

          <InterviewParticipants 
            isSpeaking={conversation.isSpeaking}
            isConnected={conversation.status === 'connected'}
            isInterviewActive={isInterviewActive}
          />

          {/* Question Section */}
          <div className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl p-6 mb-6">
            <div className="text-center">
              <p className="text-white text-lg">
                Ready for your <span className="bg-slate-700 px-3 py-1 rounded-md text-slate-300">UPSC Civil Services</span> voice interview?
              </p>
            </div>
          </div>

          <InterviewControls 
            isInterviewActive={isInterviewActive}
            onStartInterview={handleStartInterview}
            onExitInterview={handleExitInterview}
          />

          <LiveTranscript 
            transcript={transcript}
            isInterviewActive={isInterviewActive}
            onClearTranscript={() => setTranscript([])}
          />

          <RealTimeAnalysis 
            analysis={interviewAnalysis}
            isInterviewActive={isInterviewActive}
          />
        </div>
      </div>
    </Layout>
  );
};

export default UPSCInterviewer;
