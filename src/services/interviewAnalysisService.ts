
import { supabase } from '@/integrations/supabase/client';

export interface InterviewAnalysis {
  id?: string;
  user_id?: string;
  interview_type: string;
  duration_minutes?: number;
  overall_score?: number;
  communication_score?: number;
  technical_score?: number;
  confidence_score?: number;
  problem_solving_score?: number;
  strengths?: string[];
  areas_for_improvement?: string[];
  feedback?: string;
  transcript_summary?: string;
  created_at?: string;
  updated_at?: string;
}

export const saveInterviewAnalysis = async (analysis: InterviewAnalysis) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be authenticated to save interview analysis');
  }

  const analysisData = {
    ...analysis,
    user_id: user.id,
  };

  const { data, error } = await supabase
    .from('interview_analyses')
    .insert([analysisData])
    .select()
    .single();

  if (error) {
    console.error('Error saving interview analysis:', error);
    throw error;
  }

  return data;
};

export const getUserInterviewAnalyses = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be authenticated to fetch interview analyses');
  }

  const { data, error } = await supabase
    .from('interview_analyses')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching interview analyses:', error);
    throw error;
  }

  return data || [];
};

export const getLatestInterviewAnalysis = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from('interview_analyses')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('Error fetching latest interview analysis:', error);
    return null;
  }

  return data;
};
