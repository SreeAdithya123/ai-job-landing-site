import { PoseLandmarkerResult } from '@mediapipe/tasks-vision';
import { UPSCBodyLanguageMetrics, PoseLandmark } from '@/types/bodyLanguageTypes';

export class UPSCBodyLanguageAnalyzer {
  private previousLandmarks: PoseLandmark[] | null = null;
  private gestureHistory: number[] = [];
  private gazeHistory: string[] = [];
  private frameCount: number = 0;

  // MediaPipe Pose Landmark indices
  private readonly LANDMARKS = {
    NOSE: 0,
    LEFT_EYE: 2,
    RIGHT_EYE: 5,
    LEFT_EAR: 7,
    RIGHT_EAR: 8,
    LEFT_SHOULDER: 11,
    RIGHT_SHOULDER: 12,
    LEFT_ELBOW: 13,
    RIGHT_ELBOW: 14,
    LEFT_WRIST: 15,
    RIGHT_WRIST: 16,
    LEFT_HIP: 23,
    RIGHT_HIP: 24,
    LEFT_KNEE: 25,
    RIGHT_KNEE: 26,
  };

  analyzePose(results: PoseLandmarkerResult): UPSCBodyLanguageMetrics {
    if (!results.landmarks || results.landmarks.length === 0) {
      return this.getDefaultMetrics();
    }

    const landmarks = results.landmarks[0];
    this.frameCount++;

    // Analyze each aspect
    const postureAnalysis = this.analyzePosture(landmarks);
    const eyeContactAnalysis = this.analyzeEyeContact(landmarks);
    const handGestureAnalysis = this.analyzeHandGestures(landmarks);
    const facialAnalysis = this.analyzeFacialExpression(landmarks);
    const movementAnalysis = this.analyzeMovement(landmarks);

    // Calculate overall scores
    const postureScore = this.calculatePostureScore(postureAnalysis);
    const eyeContactScore = this.calculateEyeContactScore(eyeContactAnalysis);
    const handGestureScore = this.calculateHandGestureScore(handGestureAnalysis);
    const facialExpressionScore = this.calculateFacialScore(facialAnalysis);

    // Overall score weighted by importance for UPSC
    const overallScore = Math.round(
      (postureScore * 0.35) +
      (eyeContactScore * 0.25) +
      (handGestureScore * 0.20) +
      (facialExpressionScore * 0.20)
    );

    // Generate alerts and suggestions
    const alerts = this.generateAlerts(postureAnalysis, eyeContactAnalysis, handGestureAnalysis);
    const suggestions = this.generateSuggestions(postureScore, eyeContactScore, handGestureScore);

    this.previousLandmarks = landmarks;

    return {
      overallScore,
      postureScore,
      eyeContactScore,
      handGestureScore,
      facialExpressionScore,
      detailedMetrics: {
        ...postureAnalysis,
        ...eyeContactAnalysis,
        ...handGestureAnalysis,
        ...facialAnalysis,
        ...movementAnalysis,
        confidence: overallScore,
        engagement: Math.round((eyeContactScore + facialExpressionScore) / 2),
        professionalism: Math.round((postureScore + handGestureScore) / 2),
      },
      alerts,
      suggestions,
    };
  }

  private analyzePosture(landmarks: PoseLandmark[]) {
    const leftShoulder = landmarks[this.LANDMARKS.LEFT_SHOULDER];
    const rightShoulder = landmarks[this.LANDMARKS.RIGHT_SHOULDER];
    const leftHip = landmarks[this.LANDMARKS.LEFT_HIP];
    const rightHip = landmarks[this.LANDMARKS.RIGHT_HIP];
    const nose = landmarks[this.LANDMARKS.NOSE];

    // Calculate back straightness (angle between shoulders-hips vertical line)
    const shoulderMidY = (leftShoulder.y + rightShoulder.y) / 2;
    const hipMidY = (leftHip.y + rightHip.y) / 2;
    const verticalAlignment = Math.abs(shoulderMidY - hipMidY);
    const backStraightness = Math.max(0, 100 - (verticalAlignment * 200));

    // Shoulder alignment (should be level)
    const shoulderDiff = Math.abs(leftShoulder.y - rightShoulder.y);
    const shoulderAlignment = Math.max(0, 100 - (shoulderDiff * 500));

    // Shoulder relaxation (not too high/tense)
    const shoulderEarDistance = Math.abs(
      ((leftShoulder.y + rightShoulder.y) / 2) - ((landmarks[this.LANDMARKS.LEFT_EAR].y + landmarks[this.LANDMARKS.RIGHT_EAR].y) / 2)
    );
    const shoulderRelaxation = Math.min(100, shoulderEarDistance * 300);

    // Leaning forward (slight forward lean is good for attentiveness)
    const shoulderMidZ = (leftShoulder.z + rightShoulder.z) / 2;
    const noseZ = nose.z;
    const leanAmount = noseZ - shoulderMidZ;
    const leaningForward = leanAmount < -0.05 && leanAmount > -0.15 ? 90 : 60;

    // Check if hands are on thighs (wrists should be below hips and between hip width)
    const leftWrist = landmarks[this.LANDMARKS.LEFT_WRIST];
    const rightWrist = landmarks[this.LANDMARKS.RIGHT_WRIST];
    const handsOnThighs = (
      leftWrist.y > leftHip.y &&
      rightWrist.y > rightHip.y &&
      leftWrist.x > leftHip.x &&
      rightWrist.x < rightHip.x
    );

    return {
      backStraightness,
      shoulderAlignment,
      shoulderRelaxation,
      leaningForward,
      handsOnThighs,
    };
  }

  private analyzeEyeContact(landmarks: PoseLandmark[]) {
    const nose = landmarks[this.LANDMARKS.NOSE];
    const leftEye = landmarks[this.LANDMARKS.LEFT_EYE];
    const rightEye = landmarks[this.LANDMARKS.RIGHT_EYE];

    // Determine gaze direction based on nose position
    let gazeDirection = "center";
    if (nose.x < 0.35) gazeDirection = "right";
    else if (nose.x > 0.65) gazeDirection = "left";
    else if (nose.y < 0.35) gazeDirection = "up";
    else if (nose.y > 0.65) gazeDirection = "down";

    this.gazeHistory.push(gazeDirection);
    if (this.gazeHistory.length > 30) this.gazeHistory.shift();

    // Calculate gaze stability (should maintain center mostly)
    const centerGazeCount = this.gazeHistory.filter(g => g === "center").length;
    const gazeStability = Math.round((centerGazeCount / this.gazeHistory.length) * 100);

    // Estimate blink rate
    const eyeVisibility = ((leftEye.visibility || 0) + (rightEye.visibility || 0)) / 2;
    const blinkRate = 15; // Placeholder

    return {
      gazeDirection,
      gazeStability,
      blinkRate,
    };
  }

  private analyzeHandGestures(landmarks: PoseLandmark[]) {
    const leftWrist = landmarks[this.LANDMARKS.LEFT_WRIST];
    const rightWrist = landmarks[this.LANDMARKS.RIGHT_WRIST];
    const leftElbow = landmarks[this.LANDMARKS.LEFT_ELBOW];
    const rightElbow = landmarks[this.LANDMARKS.RIGHT_ELBOW];
    const leftShoulder = landmarks[this.LANDMARKS.LEFT_SHOULDER];
    const rightShoulder = landmarks[this.LANDMARKS.RIGHT_SHOULDER];

    // Detect fidgeting (rapid hand movements)
    let handMovement = 0;
    if (this.previousLandmarks) {
      const prevLeftWrist = this.previousLandmarks[this.LANDMARKS.LEFT_WRIST];
      const prevRightWrist = this.previousLandmarks[this.LANDMARKS.RIGHT_WRIST];
      
      handMovement = Math.sqrt(
        Math.pow(leftWrist.x - prevLeftWrist.x, 2) + Math.pow(leftWrist.y - prevLeftWrist.y, 2) +
        Math.pow(rightWrist.x - prevRightWrist.x, 2) + Math.pow(rightWrist.y - prevRightWrist.y, 2)
      );
    }

    this.gestureHistory.push(handMovement);
    if (this.gestureHistory.length > 30) this.gestureHistory.shift();

    const avgMovement = this.gestureHistory.reduce((a, b) => a + b, 0) / this.gestureHistory.length;
    const fidgetingDetection = Math.max(0, 100 - (avgMovement * 1000));

    // Count purposeful gestures
    const gestureCount = this.gestureHistory.filter(m => m > 0.01 && m < 0.05).length;

    // Detect crossed arms
    const crossedArms = (
      Math.abs(leftWrist.x - rightWrist.x) < 0.15 &&
      leftWrist.y < leftShoulder.y &&
      rightWrist.y < rightShoulder.y
    );

    // Detect steepled fingers
    const steepledFingers = (
      Math.abs(leftWrist.x - rightWrist.x) < 0.2 &&
      Math.abs(leftWrist.y - rightWrist.y) < 0.1 &&
      leftWrist.y < leftShoulder.y &&
      leftWrist.y > (leftShoulder.y + 0.2)
    );

    // Excessive movement flag
    const excessiveMovement = avgMovement > 0.05;

    return {
      fidgetingDetection,
      gestureCount,
      crossedArms,
      steepledFingers,
      excessiveMovement,
    };
  }

  private analyzeFacialExpression(landmarks: PoseLandmark[]) {
    const smileDetection = 70;
    const eyebrowMovement = 75;
    const jawTension = 80;

    return {
      smileDetection,
      eyebrowMovement,
      jawTension,
    };
  }

  private analyzeMovement(landmarks: PoseLandmark[]) {
    const nose = landmarks[this.LANDMARKS.NOSE];
    const leftKnee = landmarks[this.LANDMARKS.LEFT_KNEE];
    const rightKnee = landmarks[this.LANDMARKS.RIGHT_KNEE];

    let headMovement = 0;
    let legMovement = 0;

    if (this.previousLandmarks) {
      const prevNose = this.previousLandmarks[this.LANDMARKS.NOSE];
      const prevLeftKnee = this.previousLandmarks[this.LANDMARKS.LEFT_KNEE];
      const prevRightKnee = this.previousLandmarks[this.LANDMARKS.RIGHT_KNEE];

      headMovement = Math.sqrt(
        Math.pow(nose.x - prevNose.x, 2) + Math.pow(nose.y - prevNose.y, 2)
      );

      legMovement = Math.sqrt(
        Math.pow(leftKnee.x - prevLeftKnee.x, 2) + Math.pow(leftKnee.y - prevLeftKnee.y, 2) +
        Math.pow(rightKnee.x - prevRightKnee.x, 2) + Math.pow(rightKnee.y - prevRightKnee.y, 2)
      );
    }

    const bodyStillness = Math.max(0, 100 - (headMovement * 500));
    const headStability = Math.max(0, 100 - (headMovement * 800));
    const legMovementScore = Math.max(0, 100 - (legMovement * 300));

    return {
      bodyStillness,
      headStability,
      legMovement: legMovementScore,
    };
  }

  private calculatePostureScore(analysis: any): number {
    return Math.round(
      (analysis.backStraightness * 0.4) +
      (analysis.shoulderAlignment * 0.25) +
      (analysis.shoulderRelaxation * 0.20) +
      (analysis.leaningForward * 0.15)
    );
  }

  private calculateEyeContactScore(analysis: any): number {
    return Math.round(analysis.gazeStability * 0.85 + 15);
  }

  private calculateHandGestureScore(analysis: any): number {
    let score = analysis.fidgetingDetection * 0.6;
    if (analysis.crossedArms) score -= 20;
    if (analysis.steepledFingers) score += 10;
    if (analysis.excessiveMovement) score -= 15;
    return Math.max(0, Math.min(100, Math.round(score + 30)));
  }

  private calculateFacialScore(analysis: any): number {
    return Math.round(
      (analysis.smileDetection * 0.4) +
      (analysis.eyebrowMovement * 0.3) +
      (analysis.jawTension * 0.3)
    );
  }

  private generateAlerts(posture: any, eyeContact: any, gestures: any): string[] {
    const alerts: string[] = [];

    if (posture.backStraightness < 60) {
      alerts.push("⚠️ Slouching detected - Sit upright with back straight");
    }
    if (posture.shoulderAlignment < 70) {
      alerts.push("⚠️ Uneven shoulders - Keep shoulders level");
    }
    if (eyeContact.gazeDirection === "down") {
      alerts.push("⚠️ Looking down - Maintain eye contact");
    }
    if (gestures.crossedArms) {
      alerts.push("⚠️ Arms crossed - Keep hands on thighs or use open gestures");
    }
    if (gestures.excessiveMovement) {
      alerts.push("⚠️ Excessive hand movement - Reduce fidgeting");
    }
    if (gestures.fidgetingDetection < 50) {
      alerts.push("⚠️ Fidgeting detected - Keep hands still and composed");
    }

    return alerts;
  }

  private generateSuggestions(postureScore: number, eyeScore: number, gestureScore: number): string[] {
    const suggestions: string[] = [];

    if (postureScore < 70) {
      suggestions.push("💡 Sit at the back of the chair with your last vertebra touching the corner");
      suggestions.push("💡 Keep shoulders relaxed and down, not tensed up");
    }
    if (eyeScore < 70) {
      suggestions.push("💡 Maintain steady eye contact, distributing gaze among all panel members");
    }
    if (gestureScore < 70) {
      suggestions.push("💡 Place both hands relaxed on your thighs");
      suggestions.push("💡 Use controlled, purposeful hand gestures when emphasizing points");
    }

    if (postureScore >= 80 && eyeScore >= 80 && gestureScore >= 80) {
      suggestions.push("✅ Excellent body language! Maintain this composure");
    }

    return suggestions;
  }

  private getDefaultMetrics(): UPSCBodyLanguageMetrics {
    return {
      overallScore: 0,
      postureScore: 0,
      eyeContactScore: 0,
      handGestureScore: 0,
      facialExpressionScore: 0,
      detailedMetrics: {
        backStraightness: 0,
        shoulderRelaxation: 0,
        shoulderAlignment: 0,
        leaningForward: 0,
        handsOnThighs: false,
        gazeDirection: "center",
        gazeStability: 0,
        blinkRate: 0,
        smileDetection: 0,
        eyebrowMovement: 0,
        jawTension: 0,
        fidgetingDetection: 0,
        gestureCount: 0,
        crossedArms: false,
        steepledFingers: false,
        excessiveMovement: false,
        bodyStillness: 0,
        headStability: 0,
        legMovement: 0,
        confidence: 0,
        engagement: 0,
        professionalism: 0,
      },
      alerts: [],
      suggestions: [],
    };
  }
}
