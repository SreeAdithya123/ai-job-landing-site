import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings as SettingsIcon, ArrowLeft, Save, User, Mail, Calendar, Shield } from 'lucide-react';
import Layout from '../components/Layout';
import ProtectedRoute from '../components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const Settings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    setEmail(user.email || '');

    const fetchProfile = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('full_name, created_at')
        .eq('id', user.id)
        .single();

      if (data) {
        setFullName(data.full_name || '');
        setCreatedAt(data.created_at);
      }
      setLoading(false);
    };
    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName, updated_at: new Date().toISOString() })
      .eq('id', user.id);

    setSaving(false);
    if (error) {
      toast({ title: 'Error', description: 'Failed to update profile.', variant: 'destructive' });
    } else {
      toast({ title: 'Saved', description: 'Your profile has been updated.' });
    }
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="max-w-2xl mx-auto px-6 py-8 space-y-8">
          {/* Header */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 bg-muted border border-border rounded-xl hover:bg-muted/80 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-muted-foreground" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-xl flex items-center justify-center shadow-lg">
                <SettingsIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Settings</h1>
                <p className="text-muted-foreground text-sm">Manage your personal details</p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-muted-foreground text-center py-12">Loading...</div>
          ) : (
            <>
              {/* Personal Information */}
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-5">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" /> Personal Information
                </h2>

                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5" /> Email
                  </Label>
                  <Input id="email" value={email} disabled className="opacity-70" />
                  <p className="text-xs text-muted-foreground">Email cannot be changed here.</p>
                </div>

                <Button onClick={handleSave} disabled={saving} className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>

              {/* Account Info */}
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" /> Account Info
                </h2>
                <div className="text-sm space-y-2 text-muted-foreground">
                  <div className="flex justify-between">
                    <span>User ID</span>
                    <span className="font-mono text-xs truncate max-w-[200px]">{user?.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Member Since</span>
                    <span>{createdAt ? new Date(createdAt).toLocaleDateString() : '—'}</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default Settings;
