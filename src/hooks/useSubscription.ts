import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export type SubscriptionPlan = 'beginner' | 'free' | 'plus' | 'pro';

export interface Subscription {
  plan: SubscriptionPlan;
  credits_remaining: number;
  credits_per_month: number;
  billing_cycle_start: string;
  early_disconnect_count?: number;
  is_warned?: boolean;
  is_suspended?: boolean;
  pending_partial_credit?: number;
}

export interface PlanFeatures {
  name: string;
  price: number;
  creditsPerMonth: number;
  features: string[];
  proFeatures?: string[];
}

export const PLAN_DETAILS: Record<SubscriptionPlan, PlanFeatures> = {
  free: {
    name: 'Free',
    price: 0,
    creditsPerMonth: 0,
    features: [
      'No interview credits',
      'Basic feedback and scoring',
      'General interview questions',
      'Email support',
      'Progress tracking',
      'Upgrade required to start interviews',
    ],
  },
  beginner: {
    name: 'Beginner',
    price: 299,
    creditsPerMonth: 3,
    features: [
      '3 interviews per month',
      'Basic feedback and scoring',
      'General interview questions',
      'Email support',
      'Progress tracking',
    ],
  },
  plus: {
    name: 'Plus',
    price: 399,
    creditsPerMonth: 5,
    features: [
      '5 interviews per month',
      'Advanced AI feedback & analysis',
      'Industry-specific questions',
      'Video interview practice',
      'Performance analytics dashboard',
      'Priority support',
    ],
  },
  pro: {
    name: 'Pro',
    price: 599,
    creditsPerMonth: 10,
    features: [
      '10 interviews per month',
      'All Plus features included',
      'AI Career Coach',
      'Priority Support',
      'Advanced Analytics',
      'Resume Builder Access',
      'Mock panel interviews',
      'Custom question banks',
    ],
    proFeatures: [
      'AI Career Coach',
      'Priority Support',
      'Advanced Analytics',
      'Resume Builder Access',
    ],
  },
};

export const useSubscription = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: subscription, isLoading, error, refetch } = useQuery({
    queryKey: ['subscription', user?.id],
    queryFn: async (): Promise<Subscription | null> => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('plan, credits_remaining, credits_per_month, billing_cycle_start, early_disconnect_count, is_warned, is_suspended, pending_partial_credit')
        .eq('user_id', user.id)
        .single();

      if (error) {
        // If no subscription exists, create one (for existing users)
        if (error.code === 'PGRST116') {
          const { data: newSub, error: insertError } = await supabase
            .from('user_subscriptions')
            .insert({
              user_id: user.id,
              plan: 'free',
              credits_remaining: 0,
              credits_per_month: 0,
            })
            .select('plan, credits_remaining, credits_per_month, billing_cycle_start, early_disconnect_count, is_warned, is_suspended, pending_partial_credit')
            .single();

          if (insertError) throw insertError;
          return newSub as unknown as Subscription;
        }
        throw error;
      }

      return data as unknown as Subscription;
    },
    enabled: !!user,
  });

  const deductCreditMutation = useMutation({
    mutationFn: async ({ interviewType, durationMinutes }: { interviewType?: string; durationMinutes?: number }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase.rpc('deduct_credit', {
        p_user_id: user.id,
        p_interview_type: interviewType || null,
        p_duration_minutes: durationMinutes || null,
      });

      if (error) throw error;
      if (!data) throw new Error('No credits remaining');

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription', user?.id] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to deduct credit');
    },
  });

  const hasCredits = subscription ? subscription.credits_remaining > 0 : false;
  const isPro = subscription?.plan === 'pro';
  const isPlus = subscription?.plan === 'plus' || subscription?.plan === 'pro';
  const isBeginner = subscription?.plan === 'beginner' || subscription?.plan === 'free';
  const isFree = subscription?.plan === 'free';
  const isSuspended = subscription?.is_suspended ?? false;
  const planDetails = subscription ? PLAN_DETAILS[subscription.plan] : PLAN_DETAILS.beginner;

  return {
    subscription,
    isLoading,
    error,
    hasCredits,
    isPro,
    isPlus,
    isBeginner,
    isFree,
    isSuspended,
    planDetails,
    deductCredit: deductCreditMutation.mutate,
    isDeducting: deductCreditMutation.isPending,
    refetch,
  };
};
