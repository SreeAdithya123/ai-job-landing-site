import { supabase } from "@/integrations/supabase/client";

export const uploadRecording = async (
  blob: Blob,
  analysisId: string
): Promise<string | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('No authenticated user found');
      return null;
    }

    const fileName = `${user.id}/${analysisId}-${Date.now()}.webm`;
    
    const { data, error } = await supabase.storage
      .from('interview-recordings')
      .upload(fileName, blob, {
        contentType: 'video/webm',
        upsert: false,
      });

    if (error) {
      console.error('Error uploading recording:', error);
      return null;
    }

    // Get the signed URL for playback
    const { data: urlData } = await supabase.storage
      .from('interview-recordings')
      .createSignedUrl(fileName, 60 * 60 * 24 * 7); // 7 days

    return urlData?.signedUrl || null;
  } catch (error) {
    console.error('Error in uploadRecording:', error);
    return null;
  }
};

export const updateAnalysisWithRecording = async (
  analysisId: string,
  recordingUrl: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('interview_analyses')
      .update({ recording_url: recordingUrl })
      .eq('id', analysisId);

    if (error) {
      console.error('Error updating analysis with recording URL:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in updateAnalysisWithRecording:', error);
    return false;
  }
};

export const getRecordingUrl = async (filePath: string): Promise<string | null> => {
  try {
    const { data } = await supabase.storage
      .from('interview-recordings')
      .createSignedUrl(filePath, 60 * 60); // 1 hour

    return data?.signedUrl || null;
  } catch (error) {
    console.error('Error getting recording URL:', error);
    return null;
  }
};
