
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { saveInterviewAnalysis, getUserInterviewAnalyses, getLatestInterviewAnalysis, InterviewAnalysis } from '@/services/interviewAnalysisService';
import { toast } from '@/hooks/use-toast';
import { useEffect } from 'react';

export const useSaveInterviewAnalysis = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveInterviewAnalysis,
    onSuccess: () => {
      // Invalidate and refetch interview analyses
      queryClient.invalidateQueries({ queryKey: ['interview-analyses'] });
      queryClient.invalidateQueries({ queryKey: ['latest-interview-analysis'] });
      toast({
        title: "Analysis Saved",
        description: "Your interview analysis has been saved successfully.",
      });
    },
    onError: (error) => {
      console.error('Error saving interview analysis:', error);
      toast({
        title: "Error Saving Analysis",
        description: "Failed to save your interview analysis. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useInterviewAnalyses = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['interview-analyses'],
    queryFn: getUserInterviewAnalyses,
  });

  // Listen for real-time updates
  useEffect(() => {
    const handleNewAnalysis = () => {
      console.log('Refreshing interview analyses due to real-time update');
      queryClient.invalidateQueries({ queryKey: ['interview-analyses'] });
    };

    const handleRefreshRequest = () => {
      queryClient.invalidateQueries({ queryKey: ['interview-analyses'] });
    };

    window.addEventListener('newInterviewAnalysis', handleNewAnalysis);
    window.addEventListener('refreshInterviewAnalyses', handleRefreshRequest);

    return () => {
      window.removeEventListener('newInterviewAnalysis', handleNewAnalysis);
      window.removeEventListener('refreshInterviewAnalyses', handleRefreshRequest);
    };
  }, [queryClient]);

  return query;
};

export const useLatestInterviewAnalysis = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['latest-interview-analysis'],
    queryFn: getLatestInterviewAnalysis,
    refetchInterval: 10000, // Poll every 10 seconds for new results
  });

  // Listen for real-time updates
  useEffect(() => {
    const handleNewAnalysis = () => {
      console.log('Refreshing latest interview analysis due to real-time update');
      queryClient.invalidateQueries({ queryKey: ['latest-interview-analysis'] });
    };

    window.addEventListener('newInterviewAnalysis', handleNewAnalysis);

    return () => {
      window.removeEventListener('newInterviewAnalysis', handleNewAnalysis);
    };
  }, [queryClient]);

  return query;
};
