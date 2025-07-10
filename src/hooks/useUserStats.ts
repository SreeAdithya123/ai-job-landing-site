
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { getUserInterviewAnalyses } from '@/services/interviewAnalysisService';
import { getUserInterviewSessions } from '@/services/interviewSessionService';

interface InterviewSession {
  id: string;
  session_id: string;
  question: string;
  user_response: string;
  interview_type: string;
  created_at: string;
  duration_minutes?: number;
}

export const useUserStats = () => {
  const { user } = useAuth();
  
  const { data: analyses, isLoading: analysesLoading } = useQuery({
    queryKey: ['interview-analyses'],
    queryFn: getUserInterviewAnalyses,
    enabled: !!user,
  });

  const { data: interviewSessions, isLoading: sessionsLoading } = useQuery({
    queryKey: ['interview-sessions', user?.id],
    queryFn: getUserInterviewSessions,
    enabled: !!user?.id,
  });

  const isLoading = analysesLoading || sessionsLoading;
  
  // Calculate stats from interview sessions with transcripts
  const totalSessions = interviewSessions?.length || 0;
  const isNewUser = !isLoading && totalSessions === 0;
  
  // Group sessions by session_id to get unique interview sessions
  const uniqueSessions = interviewSessions ? 
    interviewSessions.reduce((acc, session) => {
      if (!acc.find(s => s.session_id === session.session_id)) {
        acc.push(session);
      }
      return acc;
    }, [] as InterviewSession[]) : [];
  
  // Calculate total hours from unique sessions (use duration or estimate)
  const totalHours = uniqueSessions.reduce((total, session) => {
    return total + (session.duration_minutes || 15); // Default 15 minutes if no duration
  }, 0) / 60;
  
  const completedInterviews = uniqueSessions.length;
  
  // Use analyses for scores if available, otherwise default to 0
  const averageScore = analyses?.length 
    ? Math.round(analyses.reduce((sum, analysis) => sum + (analysis.overall_score || 0), 0) / analyses.length)
    : 0;

  return {
    isNewUser,
    totalSessions,
    totalHours: Math.round(totalHours * 10) / 10,
    completedInterviews,
    averageScore,
    analyses: analyses || [],
    interviewSessions: interviewSessions || []
  };
};
