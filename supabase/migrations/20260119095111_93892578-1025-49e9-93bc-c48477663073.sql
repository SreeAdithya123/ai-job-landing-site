-- Create aptitude test sessions table
CREATE TABLE public.aptitude_test_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('quantitative', 'logical', 'verbal')),
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  questions JSONB NOT NULL DEFAULT '[]'::jsonb,
  answers JSONB DEFAULT NULL,
  score INTEGER DEFAULT NULL,
  total_questions INTEGER NOT NULL DEFAULT 20,
  correct_answers INTEGER DEFAULT NULL,
  time_taken_seconds INTEGER DEFAULT NULL,
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.aptitude_test_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own test sessions"
ON public.aptitude_test_sessions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own test sessions"
ON public.aptitude_test_sessions FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own test sessions"
ON public.aptitude_test_sessions FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own test sessions"
ON public.aptitude_test_sessions FOR DELETE
USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_aptitude_test_sessions_updated_at
BEFORE UPDATE ON public.aptitude_test_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to get monthly aptitude test count
CREATE OR REPLACE FUNCTION public.get_monthly_aptitude_test_count(p_user_id UUID)
RETURNS INTEGER
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT COUNT(*)::INTEGER
  FROM public.aptitude_test_sessions
  WHERE user_id = p_user_id
    AND status = 'completed'
    AND created_at >= date_trunc('month', now())
    AND created_at < date_trunc('month', now()) + interval '1 month'
$$;

-- Create function to get aptitude test stats
CREATE OR REPLACE FUNCTION public.get_aptitude_stats(p_user_id UUID)
RETURNS TABLE(
  total_tests INTEGER,
  average_score NUMERIC,
  best_score INTEGER,
  total_questions_attempted INTEGER,
  correct_answers_total INTEGER,
  quantitative_avg NUMERIC,
  logical_avg NUMERIC,
  verbal_avg NUMERIC
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT 
    COUNT(*)::INTEGER as total_tests,
    ROUND(AVG(score)::NUMERIC, 1) as average_score,
    MAX(score)::INTEGER as best_score,
    COALESCE(SUM(total_questions)::INTEGER, 0) as total_questions_attempted,
    COALESCE(SUM(correct_answers)::INTEGER, 0) as correct_answers_total,
    ROUND(AVG(CASE WHEN category = 'quantitative' THEN score END)::NUMERIC, 1) as quantitative_avg,
    ROUND(AVG(CASE WHEN category = 'logical' THEN score END)::NUMERIC, 1) as logical_avg,
    ROUND(AVG(CASE WHEN category = 'verbal' THEN score END)::NUMERIC, 1) as verbal_avg
  FROM public.aptitude_test_sessions
  WHERE user_id = p_user_id AND status = 'completed'
$$;