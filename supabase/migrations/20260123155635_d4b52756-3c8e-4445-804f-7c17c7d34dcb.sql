-- Function to get all suspended users with their details
CREATE OR REPLACE FUNCTION public.admin_get_suspended_users()
RETURNS TABLE(
  user_id uuid, 
  email text, 
  full_name text, 
  plan text, 
  credits_remaining numeric, 
  early_disconnect_count integer,
  is_warned boolean,
  suspended_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
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
    COALESCE(us.plan::TEXT, 'free') as plan,
    COALESCE(us.credits_remaining, 0) as credits_remaining,
    COALESCE(us.early_disconnect_count, 0) as early_disconnect_count,
    COALESCE(us.is_warned, false) as is_warned,
    us.updated_at as suspended_at
  FROM public.profiles p
  INNER JOIN public.user_subscriptions us ON p.id = us.user_id
  WHERE us.is_suspended = true
  ORDER BY us.updated_at DESC;
END;
$$;

-- Function to permanently delete a user (removes all their data)
CREATE OR REPLACE FUNCTION public.admin_delete_user(p_target_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  -- Check if caller is admin
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Access denied: Admin role required';
  END IF;

  -- Delete from user_subscriptions
  DELETE FROM public.user_subscriptions WHERE user_id = p_target_user_id;
  
  -- Delete from user_roles
  DELETE FROM public.user_roles WHERE user_id = p_target_user_id;
  
  -- Delete from credit_usage
  DELETE FROM public.credit_usage WHERE user_id = p_target_user_id;
  
  -- Delete from interview_analyses (this will cascade to interview_questions)
  DELETE FROM public.interview_analyses WHERE user_id = p_target_user_id;
  
  -- Delete from interview_sessions
  DELETE FROM public.interview_sessions WHERE user_id = p_target_user_id;
  
  -- Delete from interviews
  DELETE FROM public.interviews WHERE user_id = p_target_user_id;
  
  -- Delete from elevenlabs_transcripts
  DELETE FROM public.elevenlabs_transcripts WHERE user_id = p_target_user_id;
  
  -- Delete from coding_interview_results
  DELETE FROM public.coding_interview_results WHERE user_id = p_target_user_id;
  
  -- Delete from aptitude_test_sessions
  DELETE FROM public.aptitude_test_sessions WHERE user_id = p_target_user_id;
  
  -- Delete from profiles
  DELETE FROM public.profiles WHERE id = p_target_user_id;

  RETURN TRUE;
END;
$$;