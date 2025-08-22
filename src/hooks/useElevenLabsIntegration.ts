import { useCallback } from 'react';
import { processElevenLabsTranscript } from '@/services/elevenLabsTranscriptService';
import { toast } from '@/hooks/use-toast';

export const useElevenLabsIntegration = () => {
  const handleTranscriptComplete = useCallback(async (
    conversationId: string,
    transcriptContent: string
  ) => {
    try {
      console.log('🎯 Processing ElevenLabs transcript...', conversationId);
      
      const result = await processElevenLabsTranscript(conversationId, transcriptContent);
      
      toast({
        title: "Interview Analysis Complete",
        description: `Your interview has been analyzed with a score of ${result.analysis.score}/100`,
      });

      return result;
    } catch (error) {
      console.error('❌ Error processing transcript:', error);
      
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze your interview. Please try again.",
        variant: "destructive",
      });
      
      throw error;
    }
  }, []);

  const handleConversationEnd = useCallback(async (
    conversationId: string,
    finalTranscript: string
  ) => {
    if (!finalTranscript || finalTranscript.trim().length < 50) {
      console.warn('⚠️ Transcript too short for analysis');
      toast({
        title: "Interview Too Short",
        description: "Interview needs to be longer for meaningful analysis.",
        variant: "destructive",
      });
      return;
    }

    return handleTranscriptComplete(conversationId, finalTranscript);
  }, [handleTranscriptComplete]);

  return {
    handleTranscriptComplete,
    handleConversationEnd
  };
};