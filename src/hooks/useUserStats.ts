
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { getUserInterviewAnalyses } from '@/services/interviewAnalysisService';

export const useUserStats = () => {
  const { user } = useAuth();
  
  const { data: analyses, isLoading } = useQuery({
    queryKey: ['interview-analyses'],
    queryFn: getUserInterviewAnalyses,
    enabled: !!user,
  });

  const isNewUser = !isLoading && (!analyses || analyses.length === 0);
  const totalSessions = analyses?.length || 0;
  const totalHours = analyses?.reduce((sum, analysis) => sum + (analysis.duration_minutes || 0), 0) / 60 || 0;
  const completedInterviews = analyses?.filter(analysis => analysis.overall_score).length || 0;
  const averageScore = analyses?.length 
    ? analyses.reduce((sum, analysis) => sum + (analysis.overall_score || 0), 0) / analyses.length 
    : 0;

  return {
    isNewUser,
    totalSessions,
    totalHours: Math.round(totalHours * 10) / 10,
    completedInterviews,
    averageScore: Math.round(averageScore),
    analyses: analyses || []
  };
};
