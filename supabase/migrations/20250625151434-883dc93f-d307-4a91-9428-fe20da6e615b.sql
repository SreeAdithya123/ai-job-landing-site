
-- Create the interview_questions table to store detailed question-by-question data
CREATE TABLE public.interview_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  interview_analysis_id UUID NOT NULL REFERENCES public.interview_analyses(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  user_answer TEXT NOT NULL,
  ai_feedback TEXT,
  fluency_score INTEGER,
  confidence_score INTEGER,
  question_score INTEGER,
  question_order INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to ensure users can only see their own questions
ALTER TABLE public.interview_questions ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to SELECT their own interview questions
CREATE POLICY "Users can view their own interview questions" 
  ON public.interview_questions 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.interview_analyses 
      WHERE interview_analyses.id = interview_questions.interview_analysis_id 
      AND interview_analyses.user_id = auth.uid()
    )
  );

-- Create policy that allows users to INSERT their own interview questions
CREATE POLICY "Users can create their own interview questions" 
  ON public.interview_questions 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.interview_analyses 
      WHERE interview_analyses.id = interview_questions.interview_analysis_id 
      AND interview_analyses.user_id = auth.uid()
    )
  );

-- Create policy that allows users to UPDATE their own interview questions
CREATE POLICY "Users can update their own interview questions" 
  ON public.interview_questions 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.interview_analyses 
      WHERE interview_analyses.id = interview_questions.interview_analysis_id 
      AND interview_analyses.user_id = auth.uid()
    )
  );

-- Create policy that allows users to DELETE their own interview questions
CREATE POLICY "Users can delete their own interview questions" 
  ON public.interview_questions 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.interview_analyses 
      WHERE interview_analyses.id = interview_questions.interview_analysis_id 
      AND interview_analyses.user_id = auth.uid()
    )
  );
