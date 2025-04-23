
import { createContext, useContext } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AuthContextType, SignUpData } from "./auth/types";
import { useAuthStatus } from "./auth/useAuthStatus";
import { useAuthConnectionStatus } from "./auth/useAuthConnectionStatus";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const { session, user, isLoading, isAuthChangeFromExplicitAction } = useAuthStatus();
  
  // Set up connection status monitoring
  useAuthConnectionStatus(session);

  const signIn = async (email: string, password: string) => {
    try {
      isAuthChangeFromExplicitAction.current = true;
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
        title: "Erreur de connexion",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signUp = async (data: SignUpData) => {
    try {
      isAuthChangeFromExplicitAction.current = true;
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            username: data.username,
            first_name: data.firstName,
            last_name: data.lastName,
            phone: data.phone,
            country: data.country,
          },
        },
      });

      if (error) throw error;
      
      toast({
        title: "Compte créé",
        description: "Votre compte a été créé avec succès!",
      });
    } catch (error: any) {
      toast({
        title: "Erreur d'inscription",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt!",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, signIn, signUp, signOut, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
