
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
  bodyLanguageMetrics?: {
    postureScore: number;
    eyeContactScore: number;
    gestureScore: number;
    confidenceLevel: number;
    detailedMetrics: {
      shoulderAlignment: number;
      headTilt: number;
      handMovement: number;
      bodyStillness: number;
      overallEngagement: number;
    };
  };
}

const AnalysisFeedbackButton = ({ 
  className, 
  sessionId = 'demo-session',
  transcript = [],
  interviewType = 'General Interview',
  duration,
  bodyLanguageMetrics
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
      console.log('Session ID:', sessionId);
      console.log('Transcript entries:', transcript.length);
      console.log('Has body language metrics:', !!bodyLanguageMetrics);
      
      const result = await analyzeInterview(
        sessionId, 
        transcript, 
        interviewType, 
        duration, 
        bodyLanguageMetrics
      );
      
      console.log('✅ Analysis completed successfully:', result);
      
      // Show success message with analysis ID if available
      const description = result.analysisId 
        ? `Your interview analysis has been saved successfully (ID: ${result.analysisId.slice(0, 8)}...)`
        : "Your interview analysis has been completed successfully.";
      
      toast({
        title: "Analysis Completed",
        description: description,
      });
      
      // Trigger a custom event to notify other components
      window.dispatchEvent(new CustomEvent('newInterviewAnalysis', { 
        detail: result 
      }));
      
    } catch (error) {
      console.error('❌ Error during analysis:', error);
      
      const errorMessage = error instanceof Error ? error.message : "Failed to analyze interview. Please try again.";
      
      // More specific error messages
      let description = errorMessage;
      if (errorMessage.includes('not authenticated') || errorMessage.includes('Authentication')) {
        description = "Please log in to save your analysis. Your session may have expired.";
      } else if (errorMessage.includes('Failed to save')) {
        description = "Analysis generated but couldn't be saved. Please check your connection and try again.";
      }
      
      toast({
        title: "Analysis Failed",
        description: description,
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
