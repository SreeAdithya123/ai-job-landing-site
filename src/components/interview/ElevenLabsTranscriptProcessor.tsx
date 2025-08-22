import React, { useEffect } from 'react';
import { useElevenLabsIntegration } from '@/hooks/useElevenLabsIntegration';

interface ElevenLabsTranscriptProcessorProps {
  conversationId: string;
  isActive: boolean;
  transcript: string;
  onAnalysisComplete?: (result: any) => void;
}

const ElevenLabsTranscriptProcessor: React.FC<ElevenLabsTranscriptProcessorProps> = ({
  conversationId,
  isActive,
  transcript,
  onAnalysisComplete
}) => {
  const { handleConversationEnd } = useElevenLabsIntegration();

  useEffect(() => {
    // Process transcript when conversation ends and we have content
    if (!isActive && transcript && transcript.length > 50) {
      console.log('🎯 Processing transcript on conversation end...');
      
      handleConversationEnd(conversationId, transcript)
        .then((result) => {
          if (result && onAnalysisComplete) {
            onAnalysisComplete(result);
          }
        })
        .catch((error) => {
          console.error('❌ Failed to process transcript:', error);
        });
    }
  }, [isActive, transcript, conversationId, handleConversationEnd, onAnalysisComplete]);

  return null; // This is a processing component with no UI
};

export default ElevenLabsTranscriptProcessor;