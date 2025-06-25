
import { useQuery } from '@tanstack/react-query';
import { getInterviewQuestions } from '@/services/interviewQuestionsService';

export const useInterviewQuestions = (interviewAnalysisId: string) => {
  return useQuery({
    queryKey: ['interview-questions', interviewAnalysisId],
    queryFn: () => getInterviewQuestions(interviewAnalysisId),
    enabled: !!interviewAnalysisId,
  });
};
