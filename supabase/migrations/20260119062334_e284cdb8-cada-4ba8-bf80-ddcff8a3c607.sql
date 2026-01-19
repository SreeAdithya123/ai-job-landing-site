-- Change credits to support decimals
ALTER TABLE public.user_subscriptions 
  ALTER COLUMN credits_remaining TYPE numeric(10,2) USING credits_remaining::numeric(10,2),
  ALTER COLUMN credits_per_month TYPE numeric(10,2) USING credits_per_month::numeric(10,2);

-- Add tracking fields for abuse detection
ALTER TABLE public.user_subscriptions
  ADD COLUMN IF NOT EXISTS early_disconnect_count integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_warned boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_suspended boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS pending_partial_credit numeric(5,2) DEFAULT 0;

-- Update deduct_credit function to support decimals and partial credits
CREATE OR REPLACE FUNCTION public.deduct_credit(
  p_user_id uuid, 
  p_interview_type text DEFAULT NULL, 
  p_duration_minutes integer DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  current_credits numeric(10,2);
  pending_credit numeric(5,2);
  actual_deduction numeric(5,2);
BEGIN
  SELECT credits_remaining, pending_partial_credit INTO current_credits, pending_credit
  FROM public.user_subscriptions
  WHERE user_id = p_user_id;
  
  IF current_credits IS NULL OR current_credits <= 0 THEN
    RETURN FALSE;
  END IF;
  
  -- Calculate actual deduction (1 - pending partial credit from previous early disconnect)
  actual_deduction := GREATEST(1 - COALESCE(pending_credit, 0), 0);
  
  -- Check if user has enough credits
  IF current_credits < actual_deduction THEN
    RETURN FALSE;
  END IF;
  
  UPDATE public.user_subscriptions
  SET credits_remaining = credits_remaining - actual_deduction,
      pending_partial_credit = 0
  WHERE user_id = p_user_id;
  
  INSERT INTO public.credit_usage (user_id, credits_used, interview_type, duration_minutes)
  VALUES (p_user_id, actual_deduction, p_interview_type, p_duration_minutes);
  
  RETURN TRUE;
END;
$$;

-- Create function to handle early disconnect refund
CREATE OR REPLACE FUNCTION public.handle_early_disconnect(p_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  disconnect_count integer;
  was_warned boolean;
  result jsonb;
BEGIN
  -- Get current disconnect count and warning status
  SELECT early_disconnect_count, is_warned INTO disconnect_count, was_warned
  FROM public.user_subscriptions
  WHERE user_id = p_user_id;
  
  disconnect_count := COALESCE(disconnect_count, 0) + 1;
  
  -- Refund 0.7 credit (store as pending for next interview)
  UPDATE public.user_subscriptions
  SET pending_partial_credit = 0.7,
      early_disconnect_count = disconnect_count,
      is_warned = CASE WHEN disconnect_count >= 3 AND NOT COALESCE(was_warned, false) THEN true ELSE is_warned END,
      is_suspended = CASE WHEN disconnect_count >= 3 AND COALESCE(was_warned, false) THEN true ELSE is_suspended END
  WHERE user_id = p_user_id;
  
  -- Build result
  result := jsonb_build_object(
    'refunded', 0.7,
    'disconnect_count', disconnect_count,
    'show_warning', disconnect_count >= 3 AND NOT COALESCE(was_warned, false),
    'is_suspended', disconnect_count >= 3 AND COALESCE(was_warned, false)
  );
  
  RETURN result;
END;
$$;

-- Create function to check if user is suspended
CREATE OR REPLACE FUNCTION public.is_user_suspended(p_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT COALESCE(is_suspended, false)
  FROM public.user_subscriptions
  WHERE user_id = p_user_id
$$;

-- Create function to get user suspension status (for admin)
CREATE OR REPLACE FUNCTION public.get_user_subscription_status(p_user_id uuid)
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT jsonb_build_object(
    'is_suspended', COALESCE(is_suspended, false),
    'is_warned', COALESCE(is_warned, false),
    'early_disconnect_count', COALESCE(early_disconnect_count, 0),
    'pending_partial_credit', COALESCE(pending_partial_credit, 0)
  )
  FROM public.user_subscriptions
  WHERE user_id = p_user_id
$$;

-- Admin function to unsuspend user
CREATE OR REPLACE FUNCTION public.admin_unsuspend_user(p_target_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Access denied: Admin role required';
  END IF;

  UPDATE public.user_subscriptions
  SET is_suspended = false,
      is_warned = false,
      early_disconnect_count = 0
  WHERE user_id = p_target_user_id;

  RETURN TRUE;
END;
$$;