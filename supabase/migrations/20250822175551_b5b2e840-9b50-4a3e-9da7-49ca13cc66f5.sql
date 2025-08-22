-- Create function to store ElevenLabs transcript (needed for TypeScript compatibility)
CREATE OR REPLACE FUNCTION public.store_elevenlabs_transcript(
  p_user_id UUID,
  p_interview_id TEXT,
  p_content TEXT,
  p_timestamp TIMESTAMP WITH TIME ZONE,
  p_conversation_id TEXT DEFAULT NULL
) 
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  transcript_id UUID;
BEGIN
  INSERT INTO public.elevenlabs_transcripts (
    user_id,
    interview_id,
    content,
    timestamp,
    conversation_id
  ) VALUES (
    p_user_id,
    p_interview_id,
    p_content,
    p_timestamp,
    p_conversation_id
  ) RETURNING id INTO transcript_id;
  
  RETURN transcript_id;
END;
$$;