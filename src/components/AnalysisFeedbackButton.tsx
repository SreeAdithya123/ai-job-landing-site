import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { getUserInterviewSessions, triggerInterviewAnalysis } from '@/services/interviewSessionService';

interface AnalysisFeedbackButtonProps {
  className?: string;
}

const AnalysisFeedbackButton: React.FC<AnalysisFeedbackButtonProps> = ({ className = '' }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStatus, setAnalysisStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleAnalysisFeedback = async () => {
    try {
      setIsAnalyzing(true);
      setAnalysisStatus('idle');

      // Get user's interview sessions
      const sessions = await getUserInterviewSessions();
      
      if (!sessions || sessions.length === 0) {
        toast({
          title: "No Interview Data",
          description: "No interview sessions found to analyze. Complete an interview first.",
          variant: "destructive",
        });
        return;
      }

      // Group sessions by session_id to avoid analyzing the same interview multiple times
      const uniqueSessions = sessions.reduce((acc, session) => {
        const existing = acc.find(s => s.session_id === session.session_id);
        if (!existing) {
          acc.push(session);
        }
        return acc;
      }, [] as typeof sessions);

      if (uniqueSessions.length === 0) {
        toast({
          title: "No Sessions to Analyze",
          description: "No unique interview sessions found to analyze.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Analysis Started",
        description: `Starting analysis for ${uniqueSessions.length} interview session(s)...`,
      });

      let successCount = 0;
      let errorCount = 0;

      // Process each unique session
      for (const session of uniqueSessions) {
        try {
          // Get all transcript entries for this session
          const sessionTranscripts = sessions.filter(s => s.session_id === session.session_id);
          
          // Reconstruct transcript from session data
          const transcript = sessionTranscripts.map(s => [
            { speaker: 'AI' as const, text: s.question, timestamp: s.created_at || new Date().toISOString() },
            { speaker: 'User' as const, text: s.user_response, timestamp: s.created_at || new Date().toISOString() }
          ]).flat();

          console.log(`🧠 Triggering analysis for session: ${session.session_id}`);
          
          await triggerInterviewAnalysis(
            session.session_id,
            transcript,
            session.interview_type || 'general',
            session.duration_minutes
          );
          
          successCount++;
        } catch (error) {
          console.error(`❌ Failed to analyze session ${session.session_id}:`, error);
          errorCount++;
        }
      }

      // Update the analyses queries to refresh the dashboard
      queryClient.invalidateQueries({ queryKey: ['interview-analyses'] });
      queryClient.invalidateQueries({ queryKey: ['latest-interview-analysis'] });

      if (successCount > 0) {
        setAnalysisStatus('success');
        toast({
          title: "Analysis Complete",
          description: `Successfully analyzed ${successCount} interview session(s). Check your dashboard for detailed feedback!`,
        });
      }

      if (errorCount > 0) {
        setAnalysisStatus('error');
        toast({
          title: "Partial Success",
          description: `${successCount} sessions analyzed successfully, ${errorCount} failed. Please try again for failed sessions.`,
          variant: errorCount === uniqueSessions.length ? "destructive" : "default",
        });
      }

    } catch (error) {
      console.error('❌ Analysis feedback error:', error);
      setAnalysisStatus('error');
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to analyze interview transcripts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setAnalysisStatus('idle');
      }, 3000);
    }
  };

  const getButtonContent = () => {
    if (isAnalyzing) {
      return (
        <>
          <Loader className="h-4 w-4 animate-spin" />
          <span>Analyzing...</span>
        </>
      );
    }

    if (analysisStatus === 'success') {
      return (
        <>
          <CheckCircle className="h-4 w-4 text-green-600" />
          <span>Analysis Complete</span>
        </>
      );
    }

    if (analysisStatus === 'error') {
      return (
        <>
          <AlertCircle className="h-4 w-4 text-red-600" />
          <span>Analysis Failed</span>
        </>
      );
    }

    return (
      <>
        <Brain className="h-4 w-4" />
        <span>Analysis Feedback</span>
      </>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      <Button
        onClick={handleAnalysisFeedback}
        disabled={isAnalyzing}
        className={`
          flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium
          ${analysisStatus === 'success' 
            ? 'bg-green-100 text-green-800 hover:bg-green-200 border border-green-200' 
            : analysisStatus === 'error'
            ? 'bg-red-100 text-red-800 hover:bg-red-200 border border-red-200'
            : 'bg-gradient-to-r from-primary to-accent text-white hover:shadow-lg'
          }
          ${isAnalyzing ? 'cursor-not-allowed opacity-70' : 'hover:scale-105'}
        `}
      >
        {getButtonContent()}
      </Button>
    </motion.div>
  );
};

export default AnalysisFeedbackButton;