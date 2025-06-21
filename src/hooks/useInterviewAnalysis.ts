
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { saveInterviewAnalysis, getUserInterviewAnalyses, getLatestInterviewAnalysis, InterviewAnalysis } from '@/services/interviewAnalysisService';
import { toast } from '@/hooks/use-toast';

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
  return useQuery({
    queryKey: ['interview-analyses'],
    queryFn: getUserInterviewAnalyses,
  });
};

export const useLatestInterviewAnalysis = () => {
  return useQuery({
    queryKey: ['latest-interview-analysis'],
    queryFn: getLatestInterviewAnalysis,
    refetchInterval: 5000, // Poll every 5 seconds for new results
  });
};
