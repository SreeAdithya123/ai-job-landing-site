
-- Create interviews table to store interview questions, answers, and feedback
CREATE TABLE public.interviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  feedback TEXT,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to ensure users can only see their own interviews
ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to SELECT their own interviews
CREATE POLICY "Users can view their own interviews" 
  ON public.interviews 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy that allows users to INSERT their own interviews
CREATE POLICY "Users can create their own interviews" 
  ON public.interviews 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy that allows users to UPDATE their own interviews
CREATE POLICY "Users can update their own interviews" 
  ON public.interviews 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy that allows users to DELETE their own interviews
CREATE POLICY "Users can delete their own interviews" 
  ON public.interviews 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create index for better query performance on user_id and timestamp
CREATE INDEX interviews_user_id_timestamp_idx ON public.interviews (user_id, timestamp DESC);
