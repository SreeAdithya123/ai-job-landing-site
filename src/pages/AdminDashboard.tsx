import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAdminRole } from '@/hooks/useAdminRole';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import ProtectedRoute from '../components/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Shield, Users, Crown, Star, Zap, Search, RefreshCw, ShieldCheck, UserCog } from 'lucide-react';
import { SubscriptionPlan } from '@/hooks/useSubscription';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Database } from '@/integrations/supabase/types';

type AppRole = Database['public']['Enums']['app_role'];

interface UserData {
  user_id: string;
  email: string;
  full_name: string;
  plan: string;
  credits_remaining: number;
  credits_per_month: number;
  created_at: string;
}

interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAdmin, isLoading: isAdminLoading } = useAdminRole();
  const [searchTerm, setSearchTerm] = useState('');

  const { data: users, isLoading: usersLoading, refetch } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('admin_get_all_users');
      if (error) throw error;
      return data as UserData[];
    },
    enabled: isAdmin,
  });

  const { data: userRoles, isLoading: rolesLoading, refetch: refetchRoles } = useQuery({
    queryKey: ['admin-user-roles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as UserRole[];
    },
    enabled: isAdmin,
  });

  const addRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: AppRole }) => {
      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-user-roles'] });
      toast.success('Role added successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add role');
    },
  });

  const removeRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: AppRole }) => {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', role);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-user-roles'] });
      toast.success('Role removed successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to remove role');
    },
  });

  const updatePlanMutation = useMutation({
    mutationFn: async ({ userId, newPlan }: { userId: string; newPlan: SubscriptionPlan }) => {
      const { data, error } = await supabase.rpc('admin_update_subscription', {
        p_target_user_id: userId,
        p_new_plan: newPlan,
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('Subscription updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update subscription');
    },
  });

  const handlePlanChange = (userId: string, newPlan: SubscriptionPlan) => {
    updatePlanMutation.mutate({ userId, newPlan });
  };

  const handleAddRole = (userId: string, role: AppRole) => {
    addRoleMutation.mutate({ userId, role });
  };

  const handleRemoveRole = (userId: string, role: AppRole) => {
    removeRoleMutation.mutate({ userId, role });
  };

  const getUserRoles = (userId: string): AppRole[] => {
    return userRoles?.filter(r => r.user_id === userId).map(r => r.role) || [];
  };

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case 'pro':
        return <Crown className="h-4 w-4 text-amber-500" />;
      case 'plus':
        return <Star className="h-4 w-4 text-primary" />;
      case 'free':
        return <Zap className="h-4 w-4 text-green-500" />;
      default:
        return <Zap className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getPlanBadgeVariant = (plan: string) => {
    switch (plan) {
      case 'pro':
        return 'default';
      case 'plus':
        return 'secondary';
      case 'free':
        return 'outline';
      default:
        return 'destructive';
    }
  };

  const filteredUsers = users?.filter(user =>
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isAdminLoading) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="max-w-7xl mx-auto px-4 py-8">
            <Skeleton className="h-10 w-64 mb-8" />
            <Skeleton className="h-96 w-full" />
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  if (!isAdmin) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="max-w-7xl mx-auto px-4 py-8">
            <Card className="border-destructive/50">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Shield className="h-16 w-16 text-destructive mb-4" />
                <h2 className="text-2xl font-bold text-destructive mb-2">Access Denied</h2>
                <p className="text-muted-foreground mb-6">
                  You don't have permission to access the admin dashboard.
                </p>
                <Button onClick={() => navigate('/dashboard')}>
                  Go to Dashboard
                </Button>
              </CardContent>
            </Card>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-muted-foreground">Manage users and subscriptions</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => { refetch(); refetchRoles(); }}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <Card className="glass-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span className="text-2xl font-bold">{users?.length ?? 0}</span>
                </div>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Beginner Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-muted-foreground" />
                  <span className="text-2xl font-bold">
                    {users?.filter(u => u.plan === 'beginner' || !u.plan).length ?? 0}
                  </span>
                </div>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Free Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-green-500" />
                  <span className="text-2xl font-bold">
                    {users?.filter(u => u.plan === 'free').length ?? 0}
                  </span>
                </div>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Plus Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-primary" />
                  <span className="text-2xl font-bold">
                    {users?.filter(u => u.plan === 'plus').length ?? 0}
                  </span>
                </div>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Pro Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-amber-500" />
                  <span className="text-2xl font-bold">
                    {users?.filter(u => u.plan === 'pro').length ?? 0}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs for Subscriptions and Roles */}
          <Tabs defaultValue="subscriptions" className="space-y-4">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="subscriptions" className="flex items-center gap-2">
                <Crown className="h-4 w-4" />
                Subscriptions
              </TabsTrigger>
              <TabsTrigger value="roles" className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                User Roles
              </TabsTrigger>
            </TabsList>

            {/* Subscriptions Tab */}
            <TabsContent value="subscriptions">
              <Card className="glass-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Subscription Management</CardTitle>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 w-64"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {usersLoading ? (
                    <div className="space-y-4">
                      {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-16 w-full" />
                      ))}
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Roles</TableHead>
                          <TableHead>Plan</TableHead>
                          <TableHead>Credits</TableHead>
                          <TableHead>Joined</TableHead>
                          <TableHead>Change Plan</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers?.map((user) => {
                          const roles = getUserRoles(user.user_id);
                          return (
                            <TableRow key={user.user_id}>
                              <TableCell>
                                <div>
                                  <p className="font-medium">{user.full_name || 'No name'}</p>
                                  <p className="text-sm text-muted-foreground">{user.email}</p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-1 flex-wrap">
                                  {roles.length > 0 ? roles.map(role => (
                                    <Badge 
                                      key={role} 
                                      variant={role === 'admin' ? 'default' : role === 'moderator' ? 'secondary' : 'outline'}
                                      className="capitalize"
                                    >
                                      {role === 'admin' && <Shield className="h-3 w-3 mr-1" />}
                                      {role === 'moderator' && <ShieldCheck className="h-3 w-3 mr-1" />}
                                      {role}
                                    </Badge>
                                  )) : (
                                    <span className="text-muted-foreground text-sm">User</span>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  {getPlanIcon(user.plan || 'beginner')}
                                  <Badge variant={getPlanBadgeVariant(user.plan || 'beginner')} className="capitalize">
                                    {user.plan || 'beginner'}
                                  </Badge>
                                </div>
                              </TableCell>
                              <TableCell>
                                <span className="font-medium">
                                  {user.credits_remaining ?? 0} / {user.credits_per_month ?? 0}
                                </span>
                              </TableCell>
                              <TableCell>
                                {user.created_at 
                                  ? new Date(user.created_at).toLocaleDateString() 
                                  : 'N/A'}
                              </TableCell>
                              <TableCell>
                                <Select
                                  value={user.plan || 'beginner'}
                                  onValueChange={(value) => handlePlanChange(user.user_id, value as SubscriptionPlan)}
                                  disabled={updatePlanMutation.isPending}
                                >
                                  <SelectTrigger className="w-32">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="beginner">Beginner</SelectItem>
                                    <SelectItem value="free">Free</SelectItem>
                                    <SelectItem value="plus">Plus</SelectItem>
                                    <SelectItem value="pro">Pro</SelectItem>
                                  </SelectContent>
                                </Select>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  )}
                  {filteredUsers?.length === 0 && !usersLoading && (
                    <div className="text-center py-8 text-muted-foreground">
                      No users found matching your search.
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Roles Tab */}
            <TabsContent value="roles">
              <Card className="glass-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <UserCog className="h-5 w-5" />
                      Role Management
                    </CardTitle>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 w-64"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {usersLoading || rolesLoading ? (
                    <div className="space-y-4">
                      {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-16 w-full" />
                      ))}
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Current Roles</TableHead>
                          <TableHead>Admin</TableHead>
                          <TableHead>Moderator</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers?.map((user) => {
                          const roles = getUserRoles(user.user_id);
                          const isUserAdmin = roles.includes('admin');
                          const isUserModerator = roles.includes('moderator');
                          
                          return (
                            <TableRow key={user.user_id}>
                              <TableCell>
                                <div>
                                  <p className="font-medium">{user.full_name || 'No name'}</p>
                                  <p className="text-sm text-muted-foreground">{user.email}</p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-1 flex-wrap">
                                  {roles.length > 0 ? roles.map(role => (
                                    <Badge 
                                      key={role} 
                                      variant={role === 'admin' ? 'default' : role === 'moderator' ? 'secondary' : 'outline'}
                                      className="capitalize"
                                    >
                                      {role === 'admin' && <Shield className="h-3 w-3 mr-1" />}
                                      {role === 'moderator' && <ShieldCheck className="h-3 w-3 mr-1" />}
                                      {role}
                                    </Badge>
                                  )) : (
                                    <Badge variant="outline">User</Badge>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                {isUserAdmin ? (
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleRemoveRole(user.user_id, 'admin')}
                                    disabled={removeRoleMutation.isPending}
                                  >
                                    Remove Admin
                                  </Button>
                                ) : (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleAddRole(user.user_id, 'admin')}
                                    disabled={addRoleMutation.isPending}
                                  >
                                    <Shield className="h-3 w-3 mr-1" />
                                    Make Admin
                                  </Button>
                                )}
                              </TableCell>
                              <TableCell>
                                {isUserModerator ? (
                                  <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={() => handleRemoveRole(user.user_id, 'moderator')}
                                    disabled={removeRoleMutation.isPending}
                                  >
                                    Remove Mod
                                  </Button>
                                ) : (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleAddRole(user.user_id, 'moderator')}
                                    disabled={addRoleMutation.isPending}
                                  >
                                    <ShieldCheck className="h-3 w-3 mr-1" />
                                    Make Mod
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  )}
                  {filteredUsers?.length === 0 && !usersLoading && (
                    <div className="text-center py-8 text-muted-foreground">
                      No users found matching your search.
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default AdminDashboard;
