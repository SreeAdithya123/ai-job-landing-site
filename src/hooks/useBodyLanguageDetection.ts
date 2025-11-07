import { useState, useEffect, useRef, useCallback } from 'react';
import { Pose, Results } from '@mediapipe/pose';
import { Camera } from '@mediapipe/camera_utils';

export interface BodyLanguageMetrics {
  postureScore: number;
  eyeContactScore: number;
  gestureScore: number;
  confidenceLevel: number;
  detailedMetrics: {
    shoulderAlignment: number;
    headTilt: number;
    handMovement: number;
    bodyStillness: number;
    overallEngagement: number;
  };
  timestamps: number[];
}

export const useBodyLanguageDetection = () => {
  const [isActive, setIsActive] = useState(false);
  const [metrics, setMetrics] = useState<BodyLanguageMetrics>({
    postureScore: 0,
    eyeContactScore: 0,
    gestureScore: 0,
    confidenceLevel: 0,
    detailedMetrics: {
      shoulderAlignment: 0,
      headTilt: 0,
      handMovement: 0,
      bodyStillness: 0,
      overallEngagement: 0,
    },
    timestamps: [],
  });

  const poseRef = useRef<Pose | null>(null);
  const cameraRef = useRef<Camera | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Store pose history for analysis
  const poseHistoryRef = useRef<Results[]>([]);
  const handMovementRef = useRef<number[]>([]);
  const headPositionRef = useRef<{ x: number; y: number }[]>([]);

  const analyzePosture = useCallback((results: Results) => {
    if (!results.poseLandmarks) return;

    const landmarks = results.poseLandmarks;
    
    // Shoulder alignment (landmarks 11 and 12)
    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];
    const shoulderDiff = Math.abs(leftShoulder.y - rightShoulder.y);
    const shoulderAlignment = Math.max(0, 100 - shoulderDiff * 500);

    // Head position (landmark 0 - nose)
    const nose = landmarks[0];
    const headTilt = Math.abs(0.5 - nose.x) * 200;
    
    // Track head position for eye contact estimation
    headPositionRef.current.push({ x: nose.x, y: nose.y });
    if (headPositionRef.current.length > 30) {
      headPositionRef.current.shift();
    }

    // Calculate head stability (less movement = better eye contact)
    let headStability = 100;
    if (headPositionRef.current.length > 5) {
      const recentPositions = headPositionRef.current.slice(-10);
      const variance = recentPositions.reduce((acc, pos, idx) => {
        if (idx === 0) return 0;
        const prev = recentPositions[idx - 1];
        return acc + Math.sqrt(Math.pow(pos.x - prev.x, 2) + Math.pow(pos.y - prev.y, 2));
      }, 0);
      headStability = Math.max(0, 100 - variance * 500);
    }

    // Hand movement tracking (landmarks 15, 16 for wrists)
    const leftWrist = landmarks[15];
    const rightWrist = landmarks[16];
    const handMovement = (leftWrist.visibility + rightWrist.visibility) / 2;
    handMovementRef.current.push(handMovement);
    if (handMovementRef.current.length > 30) {
      handMovementRef.current.shift();
    }

    // Calculate gesture score based on hand visibility and movement
    const avgHandMovement = handMovementRef.current.reduce((a, b) => a + b, 0) / handMovementRef.current.length;
    const gestureScore = Math.min(100, avgHandMovement * 150);

    // Body stillness (less fidgeting)
    const bodyStillness = Math.min(100, headStability);

    // Overall engagement score
    const overallEngagement = (shoulderAlignment + headStability + gestureScore) / 3;

    // Calculate composite scores
    const postureScore = (shoulderAlignment + (100 - headTilt)) / 2;
    const eyeContactScore = headStability;
    const confidenceLevel = (postureScore + eyeContactScore + gestureScore) / 3;

    setMetrics(prev => ({
      postureScore: Math.round(postureScore),
      eyeContactScore: Math.round(eyeContactScore),
      gestureScore: Math.round(gestureScore),
      confidenceLevel: Math.round(confidenceLevel),
      detailedMetrics: {
        shoulderAlignment: Math.round(shoulderAlignment),
        headTilt: Math.round(100 - headTilt),
        handMovement: Math.round(gestureScore),
        bodyStillness: Math.round(bodyStillness),
        overallEngagement: Math.round(overallEngagement),
      },
      timestamps: [...prev.timestamps, Date.now()],
    }));

    // Store in history
    poseHistoryRef.current.push(results);
    if (poseHistoryRef.current.length > 100) {
      poseHistoryRef.current.shift();
    }
  }, []);

  const onResults = useCallback((results: Results) => {
    if (!canvasRef.current) return;

    const canvasCtx = canvasRef.current.getContext('2d');
    if (!canvasCtx) return;

    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    
    // Only draw landmarks, not the video background
    if (results.poseLandmarks) {
      analyzePosture(results);
    }

    canvasCtx.restore();
  }, [analyzePosture]);

  const startDetection = useCallback(async (videoElement: HTMLVideoElement, canvasElement: HTMLCanvasElement) => {
    try {
      videoRef.current = videoElement;
      canvasRef.current = canvasElement;

      // Initialize MediaPipe Pose
      const pose = new Pose({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
        }
      });

      pose.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        enableSegmentation: false,
        smoothSegmentation: false,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });

      pose.onResults(onResults);
      poseRef.current = pose;

      // Start camera
      const camera = new Camera(videoElement, {
        onFrame: async () => {
          if (poseRef.current && videoElement) {
            await poseRef.current.send({ image: videoElement });
          }
        },
        width: 640,
        height: 480
      });

      await camera.start();
      cameraRef.current = camera;
      setIsActive(true);

      console.log('✅ Body language detection started');
    } catch (error) {
      console.error('❌ Error starting body language detection:', error);
      throw error;
    }
  }, [onResults]);

  const stopDetection = useCallback(() => {
    if (cameraRef.current) {
      cameraRef.current.stop();
      cameraRef.current = null;
    }
    
    if (poseRef.current) {
      poseRef.current.close();
      poseRef.current = null;
    }

    setIsActive(false);
    console.log('🛑 Body language detection stopped');
  }, []);

  const getAnalysisSummary = useCallback(() => {
    return {
      ...metrics,
      totalFramesAnalyzed: poseHistoryRef.current.length,
      averageMetrics: {
        posture: metrics.postureScore,
        eyeContact: metrics.eyeContactScore,
        gestures: metrics.gestureScore,
        confidence: metrics.confidenceLevel,
      },
      detailedFeedback: generateDetailedFeedback(metrics),
    };
  }, [metrics]);

  const generateDetailedFeedback = (metrics: BodyLanguageMetrics) => {
    const feedback = [];

    if (metrics.postureScore < 60) {
      feedback.push('Maintain an upright posture with aligned shoulders.');
    } else if (metrics.postureScore >= 80) {
      feedback.push('Excellent posture maintained throughout.');
    }

    if (metrics.eyeContactScore < 60) {
      feedback.push('Try to maintain steadier eye contact with the camera.');
    } else if (metrics.eyeContactScore >= 80) {
      feedback.push('Great eye contact and head stability.');
    }

    if (metrics.gestureScore < 40) {
      feedback.push('Use more hand gestures to appear more engaged.');
    } else if (metrics.gestureScore > 80) {
      feedback.push('Good use of hand gestures to emphasize points.');
    }

    if (metrics.confidenceLevel < 60) {
      feedback.push('Work on appearing more confident through body language.');
    } else if (metrics.confidenceLevel >= 80) {
      feedback.push('Your body language conveys strong confidence.');
    }

    return feedback;
  };

  useEffect(() => {
    return () => {
      stopDetection();
    };
  }, [stopDetection]);

  return {
    isActive,
    metrics,
    startDetection,
    stopDetection,
    getAnalysisSummary,
  };
};
