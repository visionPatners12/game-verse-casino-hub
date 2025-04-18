
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { ProfileData } from './types';
import { useAuth } from '@/hooks/useAuth';

export const useProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const { user } = useAuth();

  const getUserProfile = async () => {
    try {
      setLoading(true);
      console.log('Fetching user profile...');
      
      if (!user) {
        console.log('No authenticated user found, redirecting to login');
        navigate('/auth');
        return;
      }

      console.log('Current user ID:', user.id);
      
      const { data: userData, error } = await supabase
        .from('users')
        .select(`
          first_name,
          last_name,
          email,
          phone,
          country,
          username,
          avatar_url
        `)
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Error",
          description: "Could not load profile data",
          variant: "destructive",
        });
        return;
      }
      
      console.log('Profile loaded successfully:', userData);
      
      setProfile({
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        country: userData.country || '',
        username: userData.username || '',
        avatar_url: userData.avatar_url,
      });
    } catch (error) {
      console.error('Profile loading error:', error);
      toast({
        title: "Error",
        description: "Could not load profile data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!profile) return;

    try {
      setLoading(true);
      
      if (!user) {
        navigate('/auth');
        return;
      }

      const { error } = await supabase
        .from('users')
        .update({
          first_name: profile.first_name,
          last_name: profile.last_name,
          phone: profile.phone,
          country: profile.country,
          username: profile.username,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      
      getUserProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Could not update profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (field: keyof ProfileData, value: string) => {
    setProfile(prev => prev ? { ...prev, [field]: value } : null);
  };

  return {
    profile,
    loading,
    updateProfile,
    handleFieldChange,
    refreshProfile: getUserProfile
  };
};
