-- Create app role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check if user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles
-- Users can view their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

-- Admins can view all roles
CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can insert roles
CREATE POLICY "Admins can insert roles"
ON public.user_roles FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admins can update roles
CREATE POLICY "Admins can update roles"
ON public.user_roles FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can delete roles
CREATE POLICY "Admins can delete roles"
ON public.user_roles FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Create admin-only view for all subscriptions with user info
CREATE OR REPLACE FUNCTION public.admin_get_all_users()
RETURNS TABLE(
  user_id UUID,
  email TEXT,
  full_name TEXT,
  plan TEXT,
  credits_remaining INTEGER,
  credits_per_month INTEGER,
  created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if caller is admin
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Access denied: Admin role required';
  END IF;

  RETURN QUERY
  SELECT 
    p.id as user_id,
    p.email,
    p.full_name,
    us.plan::TEXT,
    us.credits_remaining,
    us.credits_per_month,
    p.created_at
  FROM public.profiles p
  LEFT JOIN public.user_subscriptions us ON p.id = us.user_id
  ORDER BY p.created_at DESC;
END;
$$;

-- Update admin_update_subscription to check admin role
CREATE OR REPLACE FUNCTION public.admin_update_subscription(
  p_target_user_id UUID,
  p_new_plan subscription_plan
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_credits INTEGER;
BEGIN
  -- Check if caller is admin
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Access denied: Admin role required';
  END IF;

  -- Determine credits based on plan
  CASE p_new_plan
    WHEN 'free' THEN new_credits := 2;
    WHEN 'plus' THEN new_credits := 5;
    WHEN 'pro' THEN new_credits := 10;
  END CASE;
  
  -- Update subscription
  UPDATE public.user_subscriptions
  SET 
    plan = p_new_plan,
    credits_remaining = new_credits,
    credits_per_month = new_credits,
    billing_cycle_start = now()
  WHERE user_id = p_target_user_id;
  
  RETURN FOUND;
END;
$$;