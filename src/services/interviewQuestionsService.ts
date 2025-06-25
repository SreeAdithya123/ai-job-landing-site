
import { supabase } from '@/integrations/supabase/client';

export interface InterviewQuestion {
  id?: string;
  interview_analysis_id: string;
  question_text: string;
  user_answer: string;
  ai_feedback?: string;
  fluency_score?: number;
  confidence_score?: number;
  question_score?: number;
  question_order?: number;
  created_at?: string;
}

export const saveInterviewQuestion = async (questionData: InterviewQuestion) => {
  const { data, error } = await supabase
    .from('interview_questions')
    .insert([questionData])
    .select()
    .single();

  if (error) {
    console.error('Error saving interview question:', error);
    throw error;
  }

  return data;
};

export const getInterviewQuestions = async (interviewAnalysisId: string) => {
  const { data, error } = await supabase
    .from('interview_questions')
    .select('*')
    .eq('interview_analysis_id', interviewAnalysisId)
    .order('question_order', { ascending: true });

  if (error) {
    console.error('Error fetching interview questions:', error);
    throw error;
  }

  return data || [];
};

export const saveInterviewQuestionsData = async (
  interviewAnalysisId: string, 
  questions: Array<{
    question: string;
    answer: string;
    feedback?: string;
    fluency?: number;
    confidence?: number;
    score?: number;
  }>
) => {
  const questionsToInsert = questions.map((q, index) => ({
    interview_analysis_id: interviewAnalysisId,
    question_text: q.question,
    user_answer: q.answer,
    ai_feedback: q.feedback,
    fluency_score: q.fluency,
    confidence_score: q.confidence,
    question_score: q.score,
    question_order: index + 1,
  }));

  const { data, error } = await supabase
    .from('interview_questions')
    .insert(questionsToInsert)
    .select();

  if (error) {
    console.error('Error saving interview questions batch:', error);
    throw error;
  }

  return data;
};
