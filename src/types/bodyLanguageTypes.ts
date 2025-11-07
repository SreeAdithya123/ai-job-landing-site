export interface UPSCBodyLanguageMetrics {
  // Primary Scores
  overallScore: number;
  postureScore: number;
  eyeContactScore: number;
  handGestureScore: number;
  facialExpressionScore: number;
  
  // Detailed Metrics
  detailedMetrics: {
    // Sitting Posture Analysis
    backStraightness: number;        // 0-100: How straight the back is
    shoulderRelaxation: number;      // 0-100: Shoulder tension level
    shoulderAlignment: number;       // 0-100: Left-right shoulder balance
    leaningForward: number;          // 0-100: Appropriate forward lean
    handsOnThighs: boolean;          // Whether hands are properly placed
    
    // Eye Contact Analysis
    gazeDirection: string;           // "center", "left", "right", "down", "up"
    gazeStability: number;           // 0-100: How steady the gaze is
    blinkRate: number;               // Blinks per minute
    
    // Facial Expression Analysis
    smileDetection: number;          // 0-100: Natural smile presence
    eyebrowMovement: number;         // 0-100: Natural expression range
    jawTension: number;              // 0-100: Face relaxation
    
    // Hand Gesture Analysis
    fidgetingDetection: number;      // 0-100: Amount of nervous movements
    gestureCount: number;            // Number of purposeful gestures
    crossedArms: boolean;            // Whether arms are crossed
    steepledFingers: boolean;        // Positive steeple gesture
    excessiveMovement: boolean;      // Too much hand movement
    
    // Movement Analysis
    bodyStillness: number;           // 0-100: Appropriate stillness
    headStability: number;           // 0-100: Head movement control
    legMovement: number;             // 0-100: Leg fidgeting detection
    
    // Overall Assessment
    confidence: number;              // 0-100: Overall confidence level
    engagement: number;              // 0-100: Engagement with interviewer
    professionalism: number;         // 0-100: Professional demeanor
  };
  
  // Real-time Alerts
  alerts: string[];
  
  // Suggestions
  suggestions: string[];
}

export interface PoseLandmark {
  x: number;
  y: number;
  z: number;
  visibility?: number;
}
