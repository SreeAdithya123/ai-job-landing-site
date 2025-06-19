
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, PhoneCall, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AIAvatarProps {
  isActive?: boolean;
  isSpeaking?: boolean;
  responseLength?: number;
  onStartCall?: () => void;
  onEndCall?: () => void;
  avatarName?: string;
  avatarRole?: string;
}

const AIAvatar = ({ 
  isActive = false, 
  isSpeaking = false, 
  responseLength = 0,
  onStartCall,
  onEndCall,
  avatarName = "Dr. Priya Sharma",
  avatarRole = "UPSC Interview Panel Member"
}: AIAvatarProps) => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [lipSyncIntensity, setLipSyncIntensity] = useState(0);
  const animationRef = useRef<NodeJS.Timeout>();

  // Simulate lip-sync animation based on response length
  useEffect(() => {
    if (isSpeaking && responseLength > 0) {
      // Calculate animation duration based on response length (roughly 150 words per minute)
      const animationDuration = Math.max(2000, responseLength * 50); // minimum 2 seconds
      const intervalTime = 150; // Update every 150ms for smooth animation
      
      let elapsed = 0;
      animationRef.current = setInterval(() => {
        if (elapsed < animationDuration) {
          // Create realistic lip movement pattern
          const progress = elapsed / animationDuration;
          const intensity = Math.sin(progress * Math.PI * 8) * 0.5 + 0.5; // Oscillating pattern
          setLipSyncIntensity(intensity * 0.8 + 0.2); // Keep some minimum movement
          elapsed += intervalTime;
        } else {
          setLipSyncIntensity(0);
          clearInterval(animationRef.current);
        }
      }, intervalTime);
    } else {
      setLipSyncIntensity(0);
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    }

    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    };
  }, [isSpeaking, responseLength]);

  const handleStartCall = () => {
    setIsCallActive(true);
    onStartCall?.();
  };

  const handleEndCall = () => {
    setIsCallActive(false);
    setLipSyncIntensity(0);
    onEndCall?.();
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{avatarName}</h3>
        <p className="text-sm text-gray-600">{avatarRole}</p>
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mt-2 ${
          isCallActive 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-gray-100 text-gray-600 border border-gray-200'
        }`}>
          {isCallActive ? 'In Call' : 'Available'}
        </div>
      </div>

      {/* Avatar Container */}
      <div className="relative flex justify-center mb-6">
        <div className="relative">
          {/* Avatar Circle */}
          <motion.div
            className={`w-32 h-32 rounded-full bg-gradient-to-br from-blue-100 to-indigo-200 border-4 ${
              isCallActive ? 'border-green-400' : 'border-gray-300'
            } flex items-center justify-center overflow-hidden relative`}
            animate={{
              scale: isCallActive ? [1, 1.02, 1] : 1,
              borderColor: isCallActive ? ['#34d399', '#10b981', '#34d399'] : '#d1d5db'
            }}
            transition={{
              scale: { duration: 2, repeat: isCallActive ? Infinity : 0 },
              borderColor: { duration: 1.5, repeat: isCallActive ? Infinity : 0 }
            }}
          >
            {/* Avatar Face */}
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Eyes */}
              <div className="absolute top-8 flex space-x-4">
                <motion.div 
                  className="w-3 h-3 bg-gray-700 rounded-full"
                  animate={{
                    scaleY: isSpeaking ? [1, 0.3, 1] : 1
                  }}
                  transition={{
                    duration: 3,
                    repeat: isSpeaking ? Infinity : 0,
                    ease: "easeInOut"
                  }}
                />
                <motion.div 
                  className="w-3 h-3 bg-gray-700 rounded-full"
                  animate={{
                    scaleY: isSpeaking ? [1, 0.3, 1] : 1
                  }}
                  transition={{
                    duration: 3,
                    repeat: isSpeaking ? Infinity : 0,
                    ease: "easeInOut",
                    delay: 0.1
                  }}
                />
              </div>

              {/* Nose */}
              <div className="absolute top-12 w-1 h-2 bg-gray-400 rounded-full" />

              {/* Mouth with Lip Sync */}
              <motion.div
                className="absolute top-16 w-6 h-3 bg-red-300 rounded-full"
                animate={{
                  scaleY: 1 + lipSyncIntensity * 0.5,
                  scaleX: 1 + lipSyncIntensity * 0.2,
                }}
                transition={{
                  duration: 0.1,
                  ease: "easeOut"
                }}
              />

              {/* Hair */}
              <div className="absolute top-2 w-20 h-8 bg-gray-800 rounded-t-full" />
            </div>

            {/* Speaking Indicator */}
            <AnimatePresence>
              {isSpeaking && (
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-blue-400"
                  initial={{ opacity: 0, scale: 1 }}
                  animate={{ 
                    opacity: [0.7, 0.3, 0.7], 
                    scale: [1, 1.1, 1] 
                  }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              )}
            </AnimatePresence>
          </motion.div>

          {/* Status Indicator */}
          <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white ${
            isCallActive ? 'bg-green-500' : 'bg-gray-400'
          }`} />
        </div>
      </div>

      {/* Call Controls */}
      <div className="space-y-4">
        {!isCallActive ? (
          <Button
            onClick={handleStartCall}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <PhoneCall className="h-5 w-5 mr-2" />
            Start UPSC Interview
          </Button>
        ) : (
          <div className="space-y-3">
            <div className="flex space-x-2">
              <Button
                onClick={toggleMute}
                variant={isMuted ? "destructive" : "outline"}
                className="flex-1"
              >
                {isMuted ? <MicOff className="h-4 w-4 mr-2" /> : <Mic className="h-4 w-4 mr-2" />}
                {isMuted ? 'Unmute' : 'Mute'}
              </Button>
              <Button
                onClick={toggleAudio}
                variant={!isAudioEnabled ? "destructive" : "outline"}
                className="flex-1"
              >
                {isAudioEnabled ? <Volume2 className="h-4 w-4 mr-2" /> : <VolumeX className="h-4 w-4 mr-2" />}
                Audio
              </Button>
            </div>
            <Button
              onClick={handleEndCall}
              variant="destructive"
              className="w-full bg-red-500 hover:bg-red-600"
            >
              <Phone className="h-4 w-4 mr-2" />
              End Interview
            </Button>
          </div>
        )}
      </div>

      {/* Interview Status */}
      {isCallActive && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-blue-700 font-medium">Interview Active</span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-blue-600">Recording</span>
            </div>
          </div>
          {isSpeaking && (
            <div className="mt-2 text-xs text-blue-600">
              Interviewer is speaking...
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AIAvatar;
