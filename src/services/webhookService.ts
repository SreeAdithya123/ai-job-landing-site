
import { supabase } from '@/integrations/supabase/client';

export const setupWebhookListener = () => {
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
        console.log('New interview analysis received:', payload);
        // The useQuery hooks will automatically refetch due to the polling interval
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};
