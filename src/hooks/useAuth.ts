
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AuthContext } from "@/contexts/AuthContext";

export const useAuth = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  // Import the auth context
  const authContext = useContext(AuthContext);
  
  // If this hook is used outside of an auth provider, throw an error
  if (!authContext) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

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
      
      navigate('/games');
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
      
      navigate('/games');
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
    ...authContext,
    login, 
    signup, 
    isLoading 
  };
};
