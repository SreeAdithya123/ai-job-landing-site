-- Add recording_url column to interview_analyses table
ALTER TABLE public.interview_analyses 
ADD COLUMN IF NOT EXISTS recording_url TEXT;

-- Create storage bucket for interview recordings
INSERT INTO storage.buckets (id, name, public)
VALUES ('interview-recordings', 'interview-recordings', false)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for the recordings bucket
CREATE POLICY "Users can upload their own recordings"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'interview-recordings' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own recordings"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'interview-recordings' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own recordings"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'interview-recordings' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);