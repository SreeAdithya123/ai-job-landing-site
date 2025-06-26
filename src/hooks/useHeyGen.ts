
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface HeyGenState {
  isActive: boolean;
  isLoading: boolean;
  error: string | null;
}

export const useHeyGen = () => {
  const [state, setState] = useState<HeyGenState>({
    isActive: false,
    isLoading: false,
    error: null,
  });

  const startSession = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const { data, error } = await supabase.functions.invoke('heygen-streaming', {
        body: { action: 'start' }
      });

      if (error) throw error;

      setState(prev => ({ ...prev, isActive: true, isLoading: false }));
      
      toast({
        title: "HeyGen Session Started",
        description: "AI Avatar is now active and ready to interact",
      });

      return data;
    } catch (error: any) {
      console.error('Error starting HeyGen session:', error);
      setState(prev => ({ ...prev, isLoading: false, error: error.message }));
      
      toast({
        title: "Failed to Start Session",
        description: error.message,
        variant: "destructive",
      });
      
      throw error;
    }
  }, []);

  const stopSession = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const { data, error } = await supabase.functions.invoke('heygen-streaming', {
        body: { action: 'stop' }
      });

      if (error) throw error;

      setState(prev => ({ ...prev, isActive: false, isLoading: false }));
      
      toast({
        title: "HeyGen Session Ended",
        description: "AI Avatar session has been stopped",
      });

      return data;
    } catch (error: any) {
      console.error('Error stopping HeyGen session:', error);
      setState(prev => ({ ...prev, isLoading: false, error: error.message }));
      
      toast({
        title: "Failed to Stop Session",
        description: error.message,
        variant: "destructive",
      });
      
      throw error;
    }
  }, []);

  const speak = useCallback(async (text: string) => {
    if (!text.trim()) return;
    
    try {
      const { data, error } = await supabase.functions.invoke('heygen-streaming', {
        body: { action: 'speak', text }
      });

      if (error) throw error;

      console.log('HeyGen speak response:', data);
      return data;
    } catch (error: any) {
      console.error('Error making avatar speak:', error);
      toast({
        title: "Failed to Make Avatar Speak",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  }, []);

  return {
    ...state,
    startSession,
    stopSession,
    speak,
  };
};
