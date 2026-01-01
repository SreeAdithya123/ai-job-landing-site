import { supabase } from "@/integrations/supabase/client";

export const uploadRecording = async (
  blob: Blob,
  analysisId: string
): Promise<string | null> => {
  try {
    console.log('📤 Starting recording upload...', {
      blobSize: (blob.size / 1024 / 1024).toFixed(2) + 'MB',
      blobType: blob.type,
      analysisId
    });

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('❌ No authenticated user found for recording upload');
      return null;
    }

    // Ensure the file extension matches the blob type
    const extension = blob.type.includes('mp4') ? 'mp4' : 'webm';
    const fileName = `${user.id}/${analysisId}-${Date.now()}.${extension}`;
    
    console.log('📁 Uploading to path:', fileName);

    const { data, error } = await supabase.storage
      .from('interview-recordings')
      .upload(fileName, blob, {
        contentType: blob.type || 'video/webm',
        upsert: true, // Allow overwrite if exists
      });

    if (error) {
      console.error('❌ Storage upload error:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      return null;
    }

    console.log('✅ File uploaded successfully:', data);

    // Get the signed URL for playback (30 days validity)
    const { data: urlData, error: urlError } = await supabase.storage
      .from('interview-recordings')
      .createSignedUrl(fileName, 60 * 60 * 24 * 30);

    if (urlError) {
      console.error('❌ Error creating signed URL:', urlError);
      return null;
    }

    console.log('✅ Signed URL created successfully');
    return urlData?.signedUrl || null;
  } catch (error) {
    console.error('❌ Error in uploadRecording:', error);
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
