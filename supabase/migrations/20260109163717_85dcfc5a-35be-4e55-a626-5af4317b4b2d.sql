-- 1) Ensure one subscription row per user for safe upserts
ALTER TABLE public.user_subscriptions
ADD CONSTRAINT user_subscriptions_user_id_unique UNIQUE (user_id);

-- 2) Allow admins to create subscription rows for other users (needed when user_subscriptions row is missing)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'user_subscriptions'
      AND policyname = 'Admins can insert any subscription'
  ) THEN
    CREATE POLICY "Admins can insert any subscription"
    ON public.user_subscriptions
    FOR INSERT
    TO authenticated
    WITH CHECK (public.has_role(auth.uid(), 'admin'));
  END IF;
END $$;

-- 3) Make admin_update_subscription create the row if missing (upsert)
CREATE OR REPLACE FUNCTION public.admin_update_subscription(
  p_target_user_id uuid,
  p_new_plan subscription_plan
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  new_credits integer;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Access denied: Admin role required';
  END IF;

  CASE p_new_plan
    WHEN 'beginner' THEN new_credits := 0;
    WHEN 'free' THEN new_credits := 2;
    WHEN 'plus' THEN new_credits := 5;
    WHEN 'pro' THEN new_credits := 10;
  END CASE;

  INSERT INTO public.user_subscriptions (
    user_id,
    plan,
    credits_remaining,
    credits_per_month,
    billing_cycle_start
  ) VALUES (
    p_target_user_id,
    p_new_plan,
    new_credits,
    new_credits,
    now()
  )
  ON CONFLICT (user_id)
  DO UPDATE SET
    plan = EXCLUDED.plan,
    credits_remaining = EXCLUDED.credits_remaining,
    credits_per_month = EXCLUDED.credits_per_month,
    billing_cycle_start = EXCLUDED.billing_cycle_start,
    updated_at = now();

  RETURN TRUE;
END;
$$;