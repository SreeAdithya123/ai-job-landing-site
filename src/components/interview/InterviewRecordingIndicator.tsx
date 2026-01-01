import React from 'react';
import { Video, VideoOff, Download, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface InterviewRecordingIndicatorProps {
  isRecording: boolean;
  recordingDuration: number;
  hasRecording: boolean;
  onDownload?: () => void;
  showDownloadButton?: boolean;
}

const formatDuration = (seconds: number): string => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const InterviewRecordingIndicator: React.FC<InterviewRecordingIndicatorProps> = ({
  isRecording,
  recordingDuration,
  hasRecording,
  onDownload,
  showDownloadButton = true,
}) => {
  if (!isRecording && !hasRecording) {
    return null;
  }

  return (
    <div className="flex items-center gap-3">
      {isRecording && (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-red-900/50 border border-red-700/50 rounded-full">
          <Circle className="h-3 w-3 text-red-500 fill-red-500 animate-pulse" />
          <span className="text-red-300 text-sm font-medium">REC</span>
          <span className="text-red-300 text-sm font-mono">
            {formatDuration(recordingDuration)}
          </span>
        </div>
      )}

      {!isRecording && hasRecording && showDownloadButton && (
        <Button
          onClick={onDownload}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 border-slate-600 text-slate-300 hover:bg-slate-700/50"
        >
          <Download className="h-4 w-4" />
          <span>Download Recording</span>
        </Button>
      )}
    </div>
  );
};

export default InterviewRecordingIndicator;
