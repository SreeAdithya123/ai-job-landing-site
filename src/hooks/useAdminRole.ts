import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useAdminRole = () => {
  const { user, loading: authLoading } = useAuth();

  const { data: isAdmin, isLoading: queryLoading } = useQuery({
    queryKey: ['admin-role', user?.id],
    queryFn: async () => {
      if (!user) {
        console.log('No user found for admin check');
        return false;
      }

      console.log('Checking admin role for user:', user.id, user.email);
      
      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .maybeSingle();

        if (error) {
          console.error('Error checking admin role:', error);
          return false;
        }

        const result = !!data;
        console.log('Admin role check result:', result, data);
        return result;
      } catch (err) {
        console.error('Exception checking admin role:', err);
        return false;
      }
    },
    enabled: !!user && !authLoading,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 2,
  });

  const isLoading = authLoading || queryLoading;

  return { isAdmin: isAdmin ?? false, isLoading };
};
