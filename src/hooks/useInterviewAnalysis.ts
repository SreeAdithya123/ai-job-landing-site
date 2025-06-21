
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { saveInterviewAnalysis, InterviewAnalysis } from '@/services/interviewAnalysisService';
import { toast } from '@/hooks/use-toast';

export const useSaveInterviewAnalysis = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveInterviewAnalysis,
    onSuccess: () => {
      // Invalidate and refetch interview analyses
      queryClient.invalidateQueries({ queryKey: ['interview-analyses'] });
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
