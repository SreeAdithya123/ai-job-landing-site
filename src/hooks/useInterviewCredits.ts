import { useState, useCallback, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const EARLY_DISCONNECT_THRESHOLD_MS = 3 * 60 * 1000; // 3 minutes
const MAX_INTERVIEW_DURATION_MS = 10 * 60 * 1000; // 10 minutes

interface EarlyDisconnectResult {
  refunded: number;
  disconnect_count: number;
}

export const useInterviewCredits = () => {
  const { user } = useAuth();
  const [interviewStartTime, setInterviewStartTime] = useState<Date | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(MAX_INTERVIEW_DURATION_MS);
  const [isAutoEnding, setIsAutoEnding] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const autoEndRef = useRef<NodeJS.Timeout | null>(null);

  // Deduct credit when starting interview
  const deductCreditForStart = useCallback(async (interviewType?: string): Promise<boolean> => {
    if (!user) {
      toast.error('Please sign in to start an interview');
      return false;
    }

    const { data, error } = await supabase.rpc('deduct_credit', {
      p_user_id: user.id,
      p_interview_type: interviewType || null,
      p_duration_minutes: null,
    });

    if (error) {
      console.error('Error deducting credit:', error);
      toast.error('Failed to deduct credit');
      return false;
    }

    if (!data) {
      toast.error('No credits remaining');
      return false;
    }

    return true;
  }, [user]);

  // Handle early disconnect (within 3 minutes) - refund partial credit
  const handleEarlyDisconnect = useCallback(async (): Promise<EarlyDisconnectResult | null> => {
    if (!user) return null;

    const { data, error } = await supabase.rpc('handle_early_disconnect', {
      p_user_id: user.id,
    });

    if (error) {
      console.error('Error handling early disconnect:', error);
      return null;
    }

    const result = data as unknown as EarlyDisconnectResult;

    if (result.refunded > 0) {
      toast.info(`0.7 credit saved for your next interview (ended early)`);
    }

    return result;
  }, [user]);

  // Start interview timer
  const startInterviewTimer = useCallback((onAutoEnd: () => void) => {
    setInterviewStartTime(new Date());
    setTimeRemaining(MAX_INTERVIEW_DURATION_MS);
    setIsAutoEnding(false);

    // Update timer every second
    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        const newTime = prev - 1000;
        if (newTime <= 0) {
          return 0;
        }
        return newTime;
      });
    }, 1000);

    // Auto-end after 10 minutes
    autoEndRef.current = setTimeout(() => {
      setIsAutoEnding(true);
      toast.info('Interview time limit reached (10 minutes)');
      onAutoEnd();
    }, MAX_INTERVIEW_DURATION_MS);
  }, []);

  // End interview and check duration
  const endInterview = useCallback(async (): Promise<{ wasEarlyDisconnect: boolean }> => {
    // Clear timers
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (autoEndRef.current) {
      clearTimeout(autoEndRef.current);
      autoEndRef.current = null;
    }

    if (!interviewStartTime) {
      setInterviewStartTime(null);
      setTimeRemaining(MAX_INTERVIEW_DURATION_MS);
      return { wasEarlyDisconnect: false };
    }

    const duration = new Date().getTime() - interviewStartTime.getTime();
    const wasEarlyDisconnect = duration < EARLY_DISCONNECT_THRESHOLD_MS && !isAutoEnding;

    if (wasEarlyDisconnect) {
      await handleEarlyDisconnect();
    }

    setInterviewStartTime(null);
    setTimeRemaining(MAX_INTERVIEW_DURATION_MS);
    setIsAutoEnding(false);

    return { wasEarlyDisconnect };
  }, [interviewStartTime, isAutoEnding, handleEarlyDisconnect]);

  // Format time remaining
  const formatTimeRemaining = useCallback((ms: number): string => {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (autoEndRef.current) clearTimeout(autoEndRef.current);
    };
  }, []);

  return {
    interviewStartTime,
    timeRemaining,
    formattedTimeRemaining: formatTimeRemaining(timeRemaining),
    isAutoEnding,
    deductCreditForStart,
    startInterviewTimer,
    endInterview,
  };
};
