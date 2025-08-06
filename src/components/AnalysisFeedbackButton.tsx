
import React, { useState } from 'react';
import { Brain, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { analyzeInterview } from '@/services/unifiedAiService';

interface AnalysisFeedbackButtonProps {
  className?: string;
  sessionId?: string;
  transcript?: Array<{
    speaker: 'AI' | 'User';
    text: string;
    timestamp: string;
  }>;
  interviewType?: string;
  duration?: number;
}

const AnalysisFeedbackButton = ({ 
  className, 
  sessionId = 'demo-session',
  transcript = [],
  interviewType = 'General Interview',
  duration
}: AnalysisFeedbackButtonProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleTriggerAnalysis = async () => {
    if (transcript.length === 0) {
      toast({
        title: "No Transcript Available",
        description: "Please conduct an interview first to generate a transcript for analysis.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      console.log('🔄 Starting analysis using unified AI API...');
      
      const result = await analyzeInterview(sessionId, transcript, interviewType, duration);
      
      toast({
        title: "Analysis Completed",
        description: "Your interview analysis has been completed successfully.",
      });

      console.log('✅ Analysis completed successfully:', result);
      
      // Trigger a custom event to notify other components
      window.dispatchEvent(new CustomEvent('newInterviewAnalysis'));
      
    } catch (error) {
      console.error('❌ Error during analysis:', error);
      
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to analyze interview. Please try again.",
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
          <span>Analyze Interview</span>
        </>
      )}
    </Button>
  );
};

export default AnalysisFeedbackButton;
