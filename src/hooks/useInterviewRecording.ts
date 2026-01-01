import { useState, useRef, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface RecordingState {
  isRecording: boolean;
  recordedBlob: Blob | null;
  recordingDuration: number;
  videoStream: MediaStream | null;
}

export const useInterviewRecording = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const startRecording = useCallback(async (): Promise<MediaStream | null> => {
    try {
      console.log('🎬 Requesting camera and microphone access for recording...');
      
      // Request both audio and video
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
        },
      });

      console.log('✅ Camera and microphone access granted');
      setVideoStream(stream);

      // Determine the best supported MIME type
      const mimeTypes = [
        'video/webm;codecs=vp9,opus',
        'video/webm;codecs=vp8,opus',
        'video/webm',
        'video/mp4',
      ];
      
      let selectedMimeType = '';
      for (const mimeType of mimeTypes) {
        if (MediaRecorder.isTypeSupported(mimeType)) {
          selectedMimeType = mimeType;
          break;
        }
      }

      if (!selectedMimeType) {
        throw new Error('No supported video recording format found');
      }

      console.log('📹 Using MIME type:', selectedMimeType);

      // Create MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: selectedMimeType,
        videoBitsPerSecond: 2500000, // 2.5 Mbps
      });

      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        console.log('📹 Recording stopped, processing chunks...');
        const blob = new Blob(chunksRef.current, { type: selectedMimeType });
        setRecordedBlob(blob);
        console.log('✅ Recording saved, size:', (blob.size / 1024 / 1024).toFixed(2), 'MB');
      };

      mediaRecorder.onerror = (event) => {
        console.error('❌ MediaRecorder error:', event);
        toast({
          title: "Recording Error",
          description: "An error occurred while recording. Please try again.",
          variant: "destructive",
        });
      };

      // Start recording
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);
      startTimeRef.current = Date.now();

      // Start duration counter
      durationIntervalRef.current = setInterval(() => {
        setRecordingDuration(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 1000);

      console.log('🎬 Recording started');
      
      toast({
        title: "Recording Started",
        description: "Your interview session is now being recorded.",
      });

      return stream;
    } catch (error) {
      console.error('❌ Error starting recording:', error);
      const err = error as Error;
      
      if (err.name === 'NotAllowedError') {
        toast({
          title: "Camera Access Required",
          description: "Please allow camera and microphone access to record the interview.",
          variant: "destructive",
        });
      } else if (err.name === 'NotFoundError') {
        toast({
          title: "Camera Not Found",
          description: "No camera device was found. Please connect a camera.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Recording Error",
          description: `Failed to start recording: ${err.message}`,
          variant: "destructive",
        });
      }
      
      return null;
    }
  }, []);

  const stopRecording = useCallback(() => {
    console.log('🛑 Stopping recording...');

    // Stop duration counter
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
      durationIntervalRef.current = null;
    }

    // Stop MediaRecorder
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }

    // Stop all tracks
    if (videoStream) {
      videoStream.getTracks().forEach((track) => {
        track.stop();
        console.log(`🛑 Stopped track: ${track.kind}`);
      });
    }

    setIsRecording(false);
    setVideoStream(null);

    toast({
      title: "Recording Stopped",
      description: `Interview recording saved (${formatDuration(recordingDuration)})`,
    });

    console.log('✅ Recording stopped successfully');
  }, [videoStream, recordingDuration]);

  const uploadRecording = useCallback(async (analysisId: string): Promise<string | null> => {
    if (!recordedBlob) {
      console.log('No recording to upload');
      return null;
    }

    try {
      setIsUploading(true);
      console.log('☁️ Uploading recording to storage...');

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('No authenticated user found');
        return null;
      }

      const fileName = `${user.id}/${analysisId}-${Date.now()}.webm`;
      
      const { data, error } = await supabase.storage
        .from('interview-recordings')
        .upload(fileName, recordedBlob, {
          contentType: 'video/webm',
          upsert: false,
        });

      if (error) {
        console.error('Error uploading recording:', error);
        toast({
          title: "Upload Failed",
          description: "Failed to upload recording. You can still download it locally.",
          variant: "destructive",
        });
        return null;
      }

      // Get the signed URL for playback (7 days validity)
      const { data: urlData } = await supabase.storage
        .from('interview-recordings')
        .createSignedUrl(fileName, 60 * 60 * 24 * 7);

      const recordingUrl = urlData?.signedUrl || null;

      if (recordingUrl) {
        // Update the analysis record with the recording URL
        await supabase
          .from('interview_analyses')
          .update({ recording_url: recordingUrl })
          .eq('id', analysisId);

        console.log('✅ Recording uploaded successfully');
        toast({
          title: "Recording Uploaded",
          description: "Your interview recording has been saved to the cloud.",
        });
      }

      return recordingUrl;
    } catch (error) {
      console.error('Error in uploadRecording:', error);
      toast({
        title: "Upload Error",
        description: "An error occurred while uploading the recording.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  }, [recordedBlob]);

  const downloadRecording = useCallback(() => {
    if (!recordedBlob) {
      toast({
        title: "No Recording",
        description: "No recording available to download.",
        variant: "destructive",
      });
      return;
    }

    const url = URL.createObjectURL(recordedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interview-recording-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Download Started",
      description: "Your interview recording is being downloaded.",
    });
  }, [recordedBlob]);

  const clearRecording = useCallback(() => {
    setRecordedBlob(null);
    setRecordingDuration(0);
    chunksRef.current = [];
  }, []);

  return {
    isRecording,
    recordedBlob,
    recordingDuration,
    videoStream,
    isUploading,
    startRecording,
    stopRecording,
    uploadRecording,
    downloadRecording,
    clearRecording,
  };
};

// Helper function to format duration
const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default useInterviewRecording;
