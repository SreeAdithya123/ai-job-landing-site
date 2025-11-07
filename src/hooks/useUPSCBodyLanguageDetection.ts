import { useEffect, useRef, useState, useCallback } from 'react';
import { PoseLandmarker, FilesetResolver, DrawingUtils } from '@mediapipe/tasks-vision';
import { UPSCBodyLanguageMetrics } from '@/types/bodyLanguageTypes';
import { UPSCBodyLanguageAnalyzer } from '@/utils/bodyLanguageAnalyzer';

export const useUPSCBodyLanguageDetection = () => {
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [metrics, setMetrics] = useState<UPSCBodyLanguageMetrics | null>(null);
  const [error, setError] = useState<string | null>(null);

  const poseLandmarkerRef = useRef<PoseLandmarker | null>(null);
  const analyzerRef = useRef<UPSCBodyLanguageAnalyzer>(new UPSCBodyLanguageAnalyzer());
  const animationFrameRef = useRef<number>();
  const drawingUtilsRef = useRef<DrawingUtils | null>(null);
  const showOverlayRef = useRef<boolean>(true);

  // Initialize MediaPipe Pose Landmarker
  const initializePoseDetection = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );

      poseLandmarkerRef.current = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
          delegate: "GPU"
        },
        runningMode: "VIDEO",
        numPoses: 1,
        minPoseDetectionConfidence: 0.5,
        minPosePresenceConfidence: 0.5,
        minTrackingConfidence: 0.5
      });

      console.log("✅ UPSC Pose detection initialized successfully");
      setIsLoading(false);
    } catch (err) {
      console.error("❌ Failed to initialize pose detection:", err);
      setError("Failed to initialize pose detection. Please refresh and try again.");
      setIsLoading(false);
    }
  }, []);

  // Start detection on video stream
  const startDetection = useCallback(async (
    video: HTMLVideoElement,
    canvas: HTMLCanvasElement,
    showOverlay: boolean = true
  ) => {
    showOverlayRef.current = showOverlay;
    if (!poseLandmarkerRef.current) {
      console.error("Pose landmarker not initialized");
      return;
    }

    setIsActive(true);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (!drawingUtilsRef.current) {
      drawingUtilsRef.current = new DrawingUtils(ctx);
    }

    let lastVideoTime = -1;

    const detectPose = async () => {
      if (!poseLandmarkerRef.current || !video || video.readyState !== 4) {
        animationFrameRef.current = requestAnimationFrame(detectPose);
        return;
      }

      const currentTime = performance.now();

      if (video.currentTime !== lastVideoTime) {
        lastVideoTime = video.currentTime;

        try {
          const results = poseLandmarkerRef.current.detectForVideo(video, currentTime);

          // Clear canvas with proper dimensions
          ctx.save();
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          if (results.landmarks && results.landmarks.length > 0) {
            const landmarks = results.landmarks[0];

            // Only draw skeleton if overlay is enabled
            if (showOverlayRef.current) {
              // Scale landmarks to canvas size
              const scaledLandmarks = landmarks.map(landmark => ({
                x: landmark.x * canvas.width,
                y: landmark.y * canvas.height,
                z: landmark.z,
                visibility: landmark.visibility
              }));

              // Draw connections (skeleton) - bright green
              drawingUtilsRef.current?.drawConnectors(
                scaledLandmarks,
                PoseLandmarker.POSE_CONNECTIONS,
                { color: '#00FF00', lineWidth: 3 }
              );

              // Draw landmarks (keypoints) - bright red
              drawingUtilsRef.current?.drawLandmarks(
                scaledLandmarks,
                { color: '#FF0000', lineWidth: 2, radius: 5 }
              );
            }

            ctx.restore();

            // Always run analysis regardless of overlay visibility
            const analysis = analyzerRef.current.analyzePose(results);
            setMetrics(analysis);
          } else {
            ctx.restore();
          }
        } catch (err) {
          console.error("Detection error:", err);
          ctx.restore();
        }
      }

      animationFrameRef.current = requestAnimationFrame(detectPose);
    };

    detectPose();
  }, []);

  // Stop detection
  const stopDetection = useCallback(() => {
    setIsActive(false);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  }, []);

  useEffect(() => {
    initializePoseDetection();

    return () => {
      stopDetection();
    };
  }, [initializePoseDetection, stopDetection]);

  return {
    isActive,
    isLoading,
    metrics,
    error,
    startDetection,
    stopDetection,
  };
};
