import React, { useEffect, useRef } from 'react';
import { Video, VideoOff } from 'lucide-react';

interface CameraPreviewProps {
  videoStream: MediaStream | null;
  isRecording: boolean;
  className?: string;
  showPlaceholder?: boolean;
}

const CameraPreview: React.FC<CameraPreviewProps> = ({
  videoStream,
  isRecording,
  className = '',
  showPlaceholder = true,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && videoStream) {
      videoRef.current.srcObject = videoStream;
    }
  }, [videoStream]);

  if (!videoStream && showPlaceholder) {
    return (
      <div className={`relative bg-slate-900/50 rounded-xl border border-slate-700 flex items-center justify-center ${className}`}>
        <div className="text-center p-4">
          <div className="w-16 h-16 mx-auto mb-3 bg-slate-800 rounded-full flex items-center justify-center">
            <VideoOff className="h-8 w-8 text-slate-500" />
          </div>
          <p className="text-slate-400 text-sm">Camera will activate when interview starts</p>
        </div>
      </div>
    );
  }

  if (!videoStream) {
    return null;
  }

  return (
    <div className={`relative rounded-xl overflow-hidden border-2 ${isRecording ? 'border-red-500/50' : 'border-slate-700'} ${className}`}>
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="w-full h-full object-cover transform scale-x-[-1]"
      />
      
      {/* Recording indicator overlay */}
      {isRecording && (
        <div className="absolute top-3 left-3 flex items-center gap-2 px-2 py-1 bg-red-600/90 rounded-md">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          <span className="text-white text-xs font-medium">Recording</span>
        </div>
      )}
      
      {/* Camera icon */}
      <div className="absolute bottom-3 right-3 p-2 bg-slate-900/70 rounded-full">
        <Video className="h-4 w-4 text-white" />
      </div>
    </div>
  );
};

export default CameraPreview;
