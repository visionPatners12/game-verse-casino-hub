
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth as useAuthContext } from "@/contexts/AuthContext";

export const useAuth = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Use the auth context - note we're using the context's useAuth hook
  const authContext = useAuthContext();

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Connexion réussie",
        description: "Bienvenue sur GameVerse Casino!",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (formData: {
    email: string;
    password: string;
    username: string;
    firstName: string;
    lastName: string;
    phone: string;
    country: string;
  }) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            username: formData.username,
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone,
            country: formData.country,
          },
        },
      });

      if (error) throw error;

      toast({
        title: "Compte créé",
        description: "Bienvenue sur GameVerse Casino! Vous pouvez maintenant vous connecter.",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { 
    user: authContext.user,
    session: authContext.session,
    signOut: authContext.signOut,
    signIn: authContext.signIn,
    signUp: authContext.signUp,
    isLoading: isLoading || authContext.isLoading,
    login, 
    signup 
  };
};
