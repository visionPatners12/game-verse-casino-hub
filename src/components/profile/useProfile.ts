
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { ProfileData } from './types';
import { useAuth } from '@/contexts/AuthContext';

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
      
      // Check if the user exists in the users table, if not, create a profile
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
        console.log('No profile found, creating one for user:', user.id);
        
        // Create a default profile for the user
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: user.id,
            first_name: '',
            last_name: '',
            email: user.email || '',
            username: `user_${user.id.substring(0, 8)}`
          });
          
        if (insertError) {
          console.error('Error creating profile:', insertError);
          throw insertError;
        }
        
        // Fetch the newly created profile
        const { data: newUserData, error: newProfileError } = await supabase
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
          
        if (newProfileError) {
          console.error('Error fetching new profile:', newProfileError);
          throw newProfileError;
        }
        
        setProfile({
          first_name: newUserData.first_name || '',
          last_name: newUserData.last_name || '',
          email: newUserData.email || '',
          phone: newUserData.phone || '',
          country: newUserData.country || '',
          username: newUserData.username || '',
          avatar_url: newUserData.avatar_url,
        });
        
        console.log('New profile created successfully:', newUserData);
      } else {
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
      }
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

  useEffect(() => {
    if (user) {
      getUserProfile();
    }
  }, [user]);

  const updateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!profile) return;

    try {
      setLoading(true);
      
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
