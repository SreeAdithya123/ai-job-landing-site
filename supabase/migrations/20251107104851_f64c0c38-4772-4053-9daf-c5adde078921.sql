-- Add body_language_feedback column to interview_analyses table
ALTER TABLE public.interview_analyses 
ADD COLUMN IF NOT EXISTS body_language_feedback TEXT;