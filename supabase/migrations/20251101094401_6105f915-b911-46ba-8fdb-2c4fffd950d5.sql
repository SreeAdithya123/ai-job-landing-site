-- Create table for coding interview results
CREATE TABLE IF NOT EXISTS public.coding_interview_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  problem_id TEXT NOT NULL,
  problem_title TEXT NOT NULL,
  problem_description TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  language TEXT NOT NULL CHECK (language IN ('python', 'cpp', 'c', 'java', 'javascript')),
  user_code TEXT NOT NULL,
  code_output TEXT,
  execution_time NUMERIC,
  is_correct BOOLEAN DEFAULT false,
  ai_feedback TEXT,
  score INTEGER CHECK (score >= 0 AND score <= 10),
  time_complexity TEXT,
  space_complexity TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.coding_interview_results ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own coding results"
  ON public.coding_interview_results
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own coding results"
  ON public.coding_interview_results
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own coding results"
  ON public.coding_interview_results
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own coding results"
  ON public.coding_interview_results
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_coding_results_user_id ON public.coding_interview_results(user_id);
CREATE INDEX idx_coding_results_created_at ON public.coding_interview_results(created_at DESC);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_coding_interview_results_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_coding_interview_results_updated_at_trigger
  BEFORE UPDATE ON public.coding_interview_results
  FOR EACH ROW
  EXECUTE FUNCTION update_coding_interview_results_updated_at();