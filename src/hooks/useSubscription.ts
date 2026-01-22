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
    creditsPerMonth: 1,
    features: [
      '1 mock interview (10 min)',
      'AI questions & live transcript',
      'Basic evaluation',
      'Resume Builder (1 basic template)',
      'Resume Scanner (1 scan/month)',
      'AI Career Coach (10 messages/day)',
      'Material Generator (3/month)',
    ],
  },
  beginner: {
    name: 'Basic',
    price: 199,
    creditsPerMonth: 3,
    features: [
      '3 mocks/month (10 min each)',
      'AI questions, transcript & evaluation',
      'PDF export (1-page summary)',
      'Resume Builder (full + PDF export)',
      'Resume Scanner (5 scans + suggestions)',
      'AI Career Coach (200 messages/month)',
      'Recruiter Bot (50 messages/month)',
      'Material Generator (10/month)',
    ],
  },
  plus: {
    name: 'Plus',
    price: 399,
    creditsPerMonth: 6,
    features: [
      '6 mocks/month (10-15 min)',
      'Follow-up questions & detailed evaluation',
      'Full PDF report + session compare (2)',
      'Resume Builder (premium templates)',
      'Resume Scanner (15 scans + optimization)',
      'AI Career Coach (600 messages/month)',
      'Recruiter Bot (300 messages/month)',
      'Cold email/DM drafting',
      'Material Generator (30/month)',
      'Role-based Q bank + answers',
    ],
  },
  pro: {
    name: 'Pro',
    price: 599,
    creditsPerMonth: 15,
    features: [
      '15 mocks/month (up to 30 min)',
      'Best AI model (Groq) + strong evaluation',
      'Multi-page PDF + session compare (4)',
      'All premium resume templates',
      'Unlimited resume scans (fair-use)',
      'AI rewrite per job description',
      'ATS keyword matching',
      'Unlimited AI Career Coach (fair-use)',
      'Unlimited Recruiter Bot (fair-use)',
      'Offer negotiation assistant',
      'Unlimited materials + weekly roadmap',
      'Priority support',
    ],
    proFeatures: [
      'Best AI Model (Groq)',
      'Priority Support',
      'Unlimited Tools (fair-use)',
      'Offer Negotiation Assistant',
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
              credits_remaining: 1,
              credits_per_month: 1,
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
