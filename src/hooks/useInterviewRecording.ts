import { useState, useRef, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

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
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const pendingBlobRef = useRef<Blob | null>(null);

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
        pendingBlobRef.current = blob;
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

  const stopRecording = useCallback((): Promise<Blob | null> => {
    return new Promise((resolve) => {
      console.log('🛑 Stopping recording...');

      // Stop duration counter
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
        durationIntervalRef.current = null;
      }

      // If MediaRecorder is not active, resolve with existing blob
      if (!mediaRecorderRef.current || mediaRecorderRef.current.state === 'inactive') {
        setIsRecording(false);
        resolve(recordedBlob);
        return;
      }

      // Set up listener for when recording is fully stopped
      const currentRecorder = mediaRecorderRef.current;
      const originalOnStop = currentRecorder.onstop;
      
      currentRecorder.onstop = (event) => {
        console.log('📹 Recording stopped, processing chunks...');
        const mimeType = currentRecorder.mimeType || 'video/webm';
        const blob = new Blob(chunksRef.current, { type: mimeType });
        setRecordedBlob(blob);
        pendingBlobRef.current = blob;
        console.log('✅ Recording saved, size:', (blob.size / 1024 / 1024).toFixed(2), 'MB');
        
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
        resolve(blob);
      };

      currentRecorder.stop();
    });
  }, [videoStream, recordingDuration, recordedBlob]);

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
    pendingBlobRef.current = null;
  }, []);

  const getRecordingBlob = useCallback((): Blob | null => {
    return pendingBlobRef.current || recordedBlob;
  }, [recordedBlob]);

  return {
    isRecording,
    recordedBlob,
    recordingDuration,
    videoStream,
    startRecording,
    stopRecording,
    downloadRecording,
    clearRecording,
    getRecordingBlob,
  };
};

// Helper function to format duration
const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default useInterviewRecording;
