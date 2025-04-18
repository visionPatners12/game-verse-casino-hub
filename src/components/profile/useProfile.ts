import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { ProfileData } from './types';

export const useProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileData | null>(null);

  const getUserProfile = async () => {
    try {
      setLoading(true);
      console.log('Fetching user profile...');
      
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.error('Auth error:', authError);
        throw authError;
      }
      
      if (!user) {
        console.log('No authenticated user found, redirecting to login');
        navigate('/auth');
        return;
      }

      console.log('Current user ID:', user.id);
      
      const { data: userData, error: profileError } = await supabase
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
        .maybeSingle();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        throw profileError;
      }
      
      if (!userData) {
        console.error('No profile found for user:', user.id);
        toast({
          title: "Erreur",
          description: "Impossible de charger les données du profil",
          variant: "destructive",
        });
        return;
      }
      
      console.log('Profile loaded successfully:', userData);
      
      setProfile({
        first_name: userData.first_name,
        last_name: userData.last_name,
        email: userData.email,
        phone: userData.phone || '',
        country: userData.country || '',
        username: userData.username,
        avatar_url: userData.avatar_url,
      });
    } catch (error) {
      console.error('Profile loading error:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données du profil",
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
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        throw authError;
      }
      
      if (!user) {
        navigate('/auth');
        return;
      }

      console.log('Updating profile with data:', profile);
      
      const { error: updateError } = await supabase
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

      if (updateError) {
        throw updateError;
      }

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
