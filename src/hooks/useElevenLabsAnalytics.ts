import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface AnalyticsData {
  scoreProgression: Array<{
    date: string;
    score: number;
    interview: string;
  }>;
  strengthsWeaknesses: {
    strengths: Array<{ text: string; count: number }>;
    weaknesses: Array<{ text: string; count: number }>;
  };
  skillsPerformance: Array<{
    skill: string;
    average: number;
    latest: number;
  }>;
  interviewCategories: Array<{
    category: string;
    value: number;
    color: string;
  }>;
}

export const useElevenLabsAnalytics = () => {
  return useQuery({
    queryKey: ['elevenlabs-analytics'],
    queryFn: async (): Promise<AnalyticsData> => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User must be authenticated');
      }

      // Fetch interview analyses
      const { data: analyses, error } = await supabase
        .from('interview_analyses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching analytics data:', error);
        throw error;
      }

      // Process score progression
      const scoreProgression = analyses?.map(analysis => ({
        date: analysis.created_at || '',
        score: analysis.overall_score || 0,
        interview: analysis.interview_type || 'Interview'
      })) || [];

      // Process strengths and weaknesses
      const allStrengths: string[] = [];
      const allWeaknesses: string[] = [];

      analyses?.forEach(analysis => {
        if (analysis.strengths) {
          allStrengths.push(...analysis.strengths);
        }
        if (analysis.areas_for_improvement) {
          allWeaknesses.push(...analysis.areas_for_improvement);
        }
      });

      // Count occurrences
      const strengthCounts = allStrengths.reduce((acc, strength) => {
        acc[strength] = (acc[strength] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const weaknessCounts = allWeaknesses.reduce((acc, weakness) => {
        acc[weakness] = (acc[weakness] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const strengths = Object.entries(strengthCounts)
        .map(([text, count]) => ({ text, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      const weaknesses = Object.entries(weaknessCounts)
        .map(([text, count]) => ({ text, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // Process skills performance
      const latestAnalysis = analyses?.[analyses.length - 1];
      const skillsPerformance = [
        {
          skill: 'Communication',
          average: analyses?.reduce((sum, a) => sum + (a.communication_score || 0), 0) / (analyses?.length || 1),
          latest: latestAnalysis?.communication_score || 0
        },
        {
          skill: 'Technical',
          average: analyses?.reduce((sum, a) => sum + (a.technical_score || 0), 0) / (analyses?.length || 1),
          latest: latestAnalysis?.technical_score || 0
        },
        {
          skill: 'Confidence',
          average: analyses?.reduce((sum, a) => sum + (a.confidence_score || 0), 0) / (analyses?.length || 1),
          latest: latestAnalysis?.confidence_score || 0
        },
        {
          skill: 'Problem Solving',
          average: analyses?.reduce((sum, a) => sum + (a.problem_solving_score || 0), 0) / (analyses?.length || 1),
          latest: latestAnalysis?.problem_solving_score || 0
        }
      ];

      // Process interview categories
      const categoryCount = analyses?.reduce((acc, analysis) => {
        const type = analysis.interview_type || 'Other';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const interviewCategories = Object.entries(categoryCount).map(([category, value]) => ({
        category,
        value,
        color: '#8b5cf6' // Default color, could be dynamic
      }));

      return {
        scoreProgression,
        strengthsWeaknesses: { strengths, weaknesses },
        skillsPerformance,
        interviewCategories
      };
    },
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};