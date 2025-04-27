
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth as useAuthContext } from "@/contexts/AuthContext";

export const useAuth = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Use the auth context - note we're using the context's useAuth hook
  const authContext = useAuthContext();

  // These functions are kept for backwards compatibility but they simply 
  // delegate to the context functions now
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await authContext.signIn(email, password);
    } catch (error) {
      // Error already handled in context
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
    xbox_gamertag?: string;
    psn_username?: string;
    epic_username?: string;
    activision_username?: string;
  }) => {
    setIsLoading(true);
    try {
      await authContext.signUp(formData);
    } catch (error) {
      // Error already handled in context
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
