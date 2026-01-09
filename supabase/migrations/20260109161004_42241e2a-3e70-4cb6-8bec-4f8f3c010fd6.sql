-- Add 'beginner' to the subscription_plan enum
ALTER TYPE public.subscription_plan ADD VALUE 'beginner' BEFORE 'free';