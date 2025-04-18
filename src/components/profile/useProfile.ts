
import { useState, useEffect } from 'react';
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
      
      // Vérifier si l'utilisateur est connecté
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.error('Auth error:', authError);
        throw authError;
      }
      
      if (!user) {
        console.log('No authenticated user found, redirecting to auth page');
        navigate('/auth');
        return;
      }

      console.log('Authenticated user ID:', user.id);
      
      // Récupérer les données utilisateur de la table public.users
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (userError) {
        console.error('Error fetching user data:', userError);
        throw userError;
      }
      
      if (!userData) {
        console.error('No user data found for ID:', user.id);
        toast({
          title: "Erreur",
          description: "Impossible de charger les informations du profil",
          variant: "destructive",
        });
        return;
      }
      
      console.log('Successfully loaded user profile:', userData);
      
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
        title: "Erreur",
        description: "Impossible de charger les informations du profil",
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
          avatar_url: profile.avatar_url,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (updateError) {
        throw updateError;
      }

      toast({
        title: "Succès",
        description: "Profil mis à jour avec succès",
      });
      
      // Recharger les données du profil après la mise à jour
      getUserProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le profil",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserProfile();
  }, []);

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
