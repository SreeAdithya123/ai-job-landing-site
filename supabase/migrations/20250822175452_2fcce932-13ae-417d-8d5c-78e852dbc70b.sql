-- Create table for storing ElevenLabs transcripts
CREATE TABLE public.elevenlabs_transcripts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  interview_id TEXT NOT NULL,
  content TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  conversation_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.elevenlabs_transcripts ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own transcripts" 
ON public.elevenlabs_transcripts 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own transcripts" 
ON public.elevenlabs_transcripts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transcripts" 
ON public.elevenlabs_transcripts 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own transcripts" 
ON public.elevenlabs_transcripts 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_elevenlabs_transcripts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_elevenlabs_transcripts_updated_at
  BEFORE UPDATE ON public.elevenlabs_transcripts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_elevenlabs_transcripts_updated_at();

-- Create index for better performance
CREATE INDEX idx_elevenlabs_transcripts_user_id ON public.elevenlabs_transcripts(user_id);
CREATE INDEX idx_elevenlabs_transcripts_interview_id ON public.elevenlabs_transcripts(interview_id);
CREATE INDEX idx_elevenlabs_transcripts_created_at ON public.elevenlabs_transcripts(created_at DESC);