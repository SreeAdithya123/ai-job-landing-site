import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface AptitudeStats {
  total_tests: number;
  average_score: number | null;
  best_score: number | null;
  total_questions_attempted: number;
  correct_answers_total: number;
  quantitative_avg: number | null;
  logical_avg: number | null;
  verbal_avg: number | null;
}

interface RecentTest {
  id: string;
  category: string;
  difficulty: string;
  score: number;
  correct_answers: number;
  total_questions: number;
  time_taken_seconds: number;
  completed_at: string;
}

export const useAptitudeStats = () => {
  const { user } = useAuth();

  const statsQuery = useQuery({
    queryKey: ['aptitude-stats', user?.id],
    queryFn: async (): Promise<AptitudeStats | null> => {
      if (!user) return null;

      const { data, error } = await supabase.rpc('get_aptitude_stats', {
        p_user_id: user.id
      });

      if (error) {
        console.error('Error fetching aptitude stats:', error);
        throw error;
      }

      // RPC returns an array, get the first row
      return data?.[0] || null;
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const recentTestsQuery = useQuery({
    queryKey: ['aptitude-recent-tests', user?.id],
    queryFn: async (): Promise<RecentTest[]> => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('aptitude_test_sessions')
        .select('id, category, difficulty, score, correct_answers, total_questions, time_taken_seconds, completed_at')
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .order('completed_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching recent tests:', error);
        throw error;
      }

      return (data || []) as RecentTest[];
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    stats: statsQuery.data,
    recentTests: recentTestsQuery.data || [],
    isLoading: statsQuery.isLoading || recentTestsQuery.isLoading,
    error: statsQuery.error || recentTestsQuery.error,
  };
};
