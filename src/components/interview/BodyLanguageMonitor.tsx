import React, { useEffect, useRef } from 'react';
import { Camera, Eye, Hand, Sparkles, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UPSCBodyLanguageMetrics } from '@/types/bodyLanguageTypes';

interface BodyLanguageMonitorProps {
  isActive: boolean;
  metrics: UPSCBodyLanguageMetrics | null;
  isLoading: boolean;
  error: string | null;
  onStartDetection: (video: HTMLVideoElement, canvas: HTMLCanvasElement) => void;
  onStopDetection: () => void;
}

const BodyLanguageMonitor: React.FC<BodyLanguageMonitorProps> = ({
  isActive,
  metrics,
  isLoading,
  error,
  onStartDetection,
  onStopDetection,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync canvas size with video display size
  useEffect(() => {
    const updateCanvasSize = () => {
      if (videoRef.current && canvasRef.current && containerRef.current) {
        const container = containerRef.current;
        canvasRef.current.width = container.clientWidth;
        canvasRef.current.height = container.clientHeight;
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

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

  return (
    <div className="space-y-6">
      {/* Error Alert */}
      {error && (
        <Alert className="bg-red-900/20 border-red-800">
          <AlertCircle className="h-4 w-4 text-red-400" />
          <AlertDescription className="text-red-300">{error}</AlertDescription>
        </Alert>
      )}

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

        <div ref={containerRef} className="relative bg-slate-900 rounded-lg overflow-hidden aspect-video">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            playsInline
            muted
          />
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ mixBlendMode: 'screen' }}
          />
          
          {!isActive && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80">
              <div className="text-center">
                <Camera className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400">
                  {isLoading ? 'Initializing pose detection...' : 'Start interview to enable body language detection'}
                </p>
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

        {metrics ? (
          <div className="space-y-4">
            {/* Overall Performance */}
            <div className="p-4 bg-slate-900/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">Overall Performance</span>
                <span className={`text-2xl font-bold ${getScoreColor(metrics.overallScore)}`}>
                  {metrics.overallScore}%
                </span>
              </div>
              <Progress 
                value={metrics.overallScore} 
                className="h-3"
              />
            </div>

            {/* Primary Metrics */}
            <div className="space-y-3">
              {/* Posture */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-slate-400">Sitting Posture</span>
                  <span className={`text-sm font-semibold ${getScoreColor(metrics.postureScore)}`}>
                    {metrics.postureScore}%
                  </span>
                </div>
                <Progress value={metrics.postureScore} className="h-2" />
              </div>

              {/* Eye Contact */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <Eye className="h-3 w-3 text-green-400" />
                    <span className="text-sm text-slate-400">Eye Contact</span>
                  </div>
                  <span className={`text-sm font-semibold ${getScoreColor(metrics.eyeContactScore)}`}>
                    {metrics.eyeContactScore}%
                  </span>
                </div>
                <Progress value={metrics.eyeContactScore} className="h-2" />
              </div>

              {/* Hand Gestures */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <Hand className="h-3 w-3 text-purple-400" />
                    <span className="text-sm text-slate-400">Hand Gestures</span>
                  </div>
                  <span className={`text-sm font-semibold ${getScoreColor(metrics.handGestureScore)}`}>
                    {metrics.handGestureScore}%
                  </span>
                </div>
                <Progress value={metrics.handGestureScore} className="h-2" />
              </div>

              {/* Facial Expression */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-slate-400">Facial Expression</span>
                  <span className={`text-sm font-semibold ${getScoreColor(metrics.facialExpressionScore)}`}>
                    {metrics.facialExpressionScore}%
                  </span>
                </div>
                <Progress value={metrics.facialExpressionScore} className="h-2" />
              </div>
            </div>

            {/* Alerts */}
            {metrics.alerts.length > 0 && (
              <div className="pt-3 border-t border-slate-700">
                <h4 className="text-xs font-semibold text-red-400 mb-2">⚠️ Alerts</h4>
                <div className="space-y-1">
                  {metrics.alerts.map((alert, index) => (
                    <p key={index} className="text-xs text-red-300">{alert}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Suggestions */}
            {metrics.suggestions.length > 0 && (
              <div className="pt-3 border-t border-slate-700">
                <h4 className="text-xs font-semibold text-blue-400 mb-2">💡 Suggestions</h4>
                <div className="space-y-1">
                  {metrics.suggestions.map((suggestion, index) => (
                    <p key={index} className="text-xs text-blue-300">{suggestion}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Detailed Metrics */}
            <div className="pt-3 border-t border-slate-700">
              <h4 className="text-xs font-semibold text-slate-400 mb-3">Detailed Analysis</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500">Back Straightness</span>
                  <span className="text-xs text-slate-300">{metrics.detailedMetrics.backStraightness}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500">Shoulder Alignment</span>
                  <span className="text-xs text-slate-300">{metrics.detailedMetrics.shoulderAlignment}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500">Gaze Stability</span>
                  <span className="text-xs text-slate-300">{metrics.detailedMetrics.gazeStability}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500">Fidgeting Control</span>
                  <span className="text-xs text-slate-300">{metrics.detailedMetrics.fidgetingDetection}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500">Professional Demeanor</span>
                  <span className="text-xs text-slate-300">{metrics.detailedMetrics.professionalism}%</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-slate-500 text-sm">
              {isActive ? 'Analyzing your body language...' : 'Start interview to see analysis'}
            </p>
          </div>
        )}
      </Card>
      </div>
    </div>
  );
};

export default BodyLanguageMonitor;
