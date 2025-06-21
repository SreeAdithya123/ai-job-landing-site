
-- Create a table for interview analyses
CREATE TABLE public.interview_analyses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  interview_type TEXT NOT NULL,
  duration_minutes INTEGER,
  overall_score INTEGER CHECK (overall_score >= 0 AND overall_score <= 100),
  communication_score INTEGER CHECK (communication_score >= 0 AND communication_score <= 100),
  technical_score INTEGER CHECK (technical_score >= 0 AND technical_score <= 100),
  confidence_score INTEGER CHECK (confidence_score >= 0 AND confidence_score <= 100),
  problem_solving_score INTEGER CHECK (problem_solving_score >= 0 AND problem_solving_score <= 100),
  strengths TEXT[],
  areas_for_improvement TEXT[],
  feedback TEXT,
  transcript_summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to ensure users can only see their own analyses
ALTER TABLE public.interview_analyses ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to SELECT their own analyses
CREATE POLICY "Users can view their own interview analyses" 
  ON public.interview_analyses 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy that allows users to INSERT their own analyses
CREATE POLICY "Users can create their own interview analyses" 
  ON public.interview_analyses 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy that allows users to UPDATE their own analyses
CREATE POLICY "Users can update their own interview analyses" 
  ON public.interview_analyses 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy that allows users to DELETE their own analyses
CREATE POLICY "Users can delete their own interview analyses" 
  ON public.interview_analyses 
  FOR DELETE 
  USING (auth.uid() = user_id);
