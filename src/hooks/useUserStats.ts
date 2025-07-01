
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { getUserInterviewAnalyses } from '@/services/interviewAnalysisService';
import { supabase } from '@/integrations/supabase/client';

interface Interview {
  id: string;
  question: string;
  answer: string;
  feedback: string | null;
  timestamp: string;
}

export const useUserStats = () => {
  const { user } = useAuth();
  
  const { data: analyses, isLoading: analysesLoading } = useQuery({
    queryKey: ['interview-analyses'],
    queryFn: getUserInterviewAnalyses,
    enabled: !!user,
  });

  const { data: interviews, isLoading: interviewsLoading } = useQuery({
    queryKey: ['interviews', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('interviews')
        .select('*')
        .eq('user_id', user.id)
        .order('timestamp', { ascending: false });

      if (error) throw error;
      return data as Interview[];
    },
    enabled: !!user?.id,
  });

  const isLoading = analysesLoading || interviewsLoading;
  
  // Calculate stats from interviews table
  const totalSessions = interviews?.length || 0;
  const isNewUser = !isLoading && totalSessions === 0;
  
  // Calculate total hours from interviews (estimate based on Q&A pairs)
  const totalHours = interviews ? 
    Math.round((interviews.length * 2) / 60 * 10) / 10 : // Assume 2 minutes per Q&A pair
    0;
  
  const completedInterviews = interviews?.length || 0;
  
  // For now, use analyses for scores if available, otherwise default to 0
  const averageScore = analyses?.length 
    ? Math.round(analyses.reduce((sum, analysis) => sum + (analysis.overall_score || 0), 0) / analyses.length)
    : 0;

  return {
    isNewUser,
    totalSessions,
    totalHours,
    completedInterviews,
    averageScore,
    analyses: analyses || [],
    interviews: interviews || []
  };
};
