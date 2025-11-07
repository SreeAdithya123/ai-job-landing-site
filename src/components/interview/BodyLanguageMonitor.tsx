import React, { useEffect, useRef } from 'react';
import { Camera, Eye, Hand, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BodyLanguageMetrics } from '@/hooks/useBodyLanguageDetection';

interface BodyLanguageMonitorProps {
  isActive: boolean;
  metrics: BodyLanguageMetrics;
  onStartDetection: (video: HTMLVideoElement, canvas: HTMLCanvasElement) => void;
  onStopDetection: () => void;
}

const BodyLanguageMonitor: React.FC<BodyLanguageMonitorProps> = ({
  isActive,
  metrics,
  onStartDetection,
  onStopDetection,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (isActive && videoRef.current && canvasRef.current) {
      onStartDetection(videoRef.current, canvasRef.current);
    }
  }, [isActive, onStartDetection]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Video Feed */}
      <Card className="lg:col-span-2 bg-slate-800/50 border-slate-700 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Camera className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-white">Body Language Monitor</h3>
          </div>
          {isActive && (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-slate-400">Recording</span>
            </div>
          )}
        </div>

        <div className="relative bg-slate-900 rounded-lg overflow-hidden aspect-video">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            playsInline
            muted
          />
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            width={640}
            height={480}
          />
          
          {!isActive && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80">
              <div className="text-center">
                <Camera className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400">Start interview to enable body language detection</p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Metrics Panel */}
      <Card className="bg-slate-800/50 border-slate-700 p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Sparkles className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-white">Live Metrics</h3>
        </div>

        <div className="space-y-4">
          {/* Overall Confidence */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-400">Overall Confidence</span>
              <span className={`text-lg font-bold ${getScoreColor(metrics.confidenceLevel)}`}>
                {metrics.confidenceLevel}%
              </span>
            </div>
            <Progress 
              value={metrics.confidenceLevel} 
              className="h-2"
            />
          </div>

          {/* Posture */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-blue-500/20 rounded flex items-center justify-center">
                  <span className="text-xs">🧍</span>
                </div>
                <span className="text-sm text-slate-400">Posture</span>
              </div>
              <span className={`text-sm font-semibold ${getScoreColor(metrics.postureScore)}`}>
                {metrics.postureScore}%
              </span>
            </div>
            <Progress value={metrics.postureScore} className="h-1.5" />
          </div>

          {/* Eye Contact */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-green-500/20 rounded flex items-center justify-center">
                  <Eye className="h-3 w-3 text-green-400" />
                </div>
                <span className="text-sm text-slate-400">Eye Contact</span>
              </div>
              <span className={`text-sm font-semibold ${getScoreColor(metrics.eyeContactScore)}`}>
                {metrics.eyeContactScore}%
              </span>
            </div>
            <Progress value={metrics.eyeContactScore} className="h-1.5" />
          </div>

          {/* Gestures */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-purple-500/20 rounded flex items-center justify-center">
                  <Hand className="h-3 w-3 text-purple-400" />
                </div>
                <span className="text-sm text-slate-400">Gestures</span>
              </div>
              <span className={`text-sm font-semibold ${getScoreColor(metrics.gestureScore)}`}>
                {metrics.gestureScore}%
              </span>
            </div>
            <Progress value={metrics.gestureScore} className="h-1.5" />
          </div>

          {/* Detailed Metrics */}
          <div className="pt-4 border-t border-slate-700">
            <h4 className="text-xs font-semibold text-slate-400 mb-3">Detailed Analysis</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500">Shoulder Alignment</span>
                <span className="text-xs text-slate-300">{metrics.detailedMetrics.shoulderAlignment}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500">Head Stability</span>
                <span className="text-xs text-slate-300">{metrics.detailedMetrics.headTilt}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500">Body Stillness</span>
                <span className="text-xs text-slate-300">{metrics.detailedMetrics.bodyStillness}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500">Engagement</span>
                <span className="text-xs text-slate-300">{metrics.detailedMetrics.overallEngagement}%</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BodyLanguageMonitor;
