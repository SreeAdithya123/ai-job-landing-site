
import React, { useState } from 'react';
import { Brain, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { triggerAnalysisForExistingTranscripts } from '@/services/interviewSessionService';

interface AnalysisFeedbackButtonProps {
  className?: string;
}

const AnalysisFeedbackButton = ({ className }: AnalysisFeedbackButtonProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleTriggerAnalysis = async () => {
    setIsAnalyzing(true);
    
    try {
      console.log('🔄 Starting analysis for existing transcripts...');
      
      const result = await triggerAnalysisForExistingTranscripts();
      
      toast({
        title: "Analysis Started",
        description: result.message,
      });

      console.log('✅ Analysis triggered successfully:', result);
      
    } catch (error) {
      console.error('❌ Error triggering analysis:', error);
      
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to start analysis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Button
      onClick={handleTriggerAnalysis}
      disabled={isAnalyzing}
      className={`bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:shadow-lg transition-all duration-200 font-medium ${className}`}
    >
      {isAnalyzing ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          <span>Analyzing...</span>
        </>
      ) : (
        <>
          <Brain className="h-4 w-4 mr-2" />
          <span>Analyze Transcripts</span>
        </>
      )}
    </Button>
  );
};

export default AnalysisFeedbackButton;
