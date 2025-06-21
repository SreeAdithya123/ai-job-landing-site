
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

export const setupWebhookListener = () => {
  console.log('Setting up webhook listener for interview analyses');
  
  // Listen for real-time updates to interview_analyses table
  const channel = supabase
    .channel('interview-analyses-updates')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'interview_analyses'
      },
      (payload) => {
        console.log('New interview analysis received via real-time:', payload);
        
        // Trigger a custom event that components can listen to
        window.dispatchEvent(new CustomEvent('newInterviewAnalysis', {
          detail: payload.new
        }));
      }
    )
    .subscribe((status) => {
      console.log('Webhook listener subscription status:', status);
    });

  return () => {
    console.log('Cleaning up webhook listener');
    supabase.removeChannel(channel);
  };
};

// Helper function to manually trigger a refresh of interview analyses
export const refreshInterviewAnalyses = () => {
  window.dispatchEvent(new CustomEvent('refreshInterviewAnalyses'));
};
