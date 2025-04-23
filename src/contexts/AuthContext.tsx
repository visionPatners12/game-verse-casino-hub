import { createContext, useContext, useEffect, useState, useRef } from "react";
import { Session, User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: SignUpData) => Promise<void>;
  signOut: () => Promise<void>;
  isLoading: boolean;
};

type SignUpData = {
  email: string;
  password: string;
  username: string;
  firstName: string;
  lastName: string;
  phone: string;
  country: string;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const initialSessionChecked = useRef(false);
  const isAuthChangeFromExplicitAction = useRef(false);

  useEffect(() => {
    const setupAuth = async () => {
      try {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, newSession) => {
            console.log("Auth state change event:", event);
            
            if (event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') {
              setSession(newSession);
              setUser(newSession?.user ?? null);
              return;
            }
            
            setSession(newSession);
            setUser(newSession?.user ?? null);
            
            if (initialSessionChecked.current) {
              if (event === 'SIGNED_IN' && isAuthChangeFromExplicitAction.current) {
                console.log("Explicit SIGNED_IN event - navigating to /games");
                navigate('/games');
                isAuthChangeFromExplicitAction.current = false;
              } else if (event === 'SIGNED_OUT') {
                console.log("SIGNED_OUT event - navigating to /auth");
                navigate('/auth');
              }
            }
          }
        );
        
        const { data: sessionData } = await supabase.auth.getSession();
        console.log("Initial session check:", sessionData.session ? "Session exists" : "No session");
        
        setSession(sessionData.session);
        setUser(sessionData.session?.user ?? null);
        initialSessionChecked.current = true;
        setIsLoading(false);
        
        return () => subscription.unsubscribe();
      } catch (error) {
        console.error("Error setting up auth:", error);
        setIsLoading(false);
      }
    };
    
    setupAuth();
  }, [navigate]);

  useEffect(() => {
    if (session?.user?.id) {
      const updateConnectionStatus = async () => {
        try {
          const { error } = await supabase
            .from('users')
            .update({ is_connected: true })
            .eq('id', session.user.id);
            
          if (error) {
            console.error('Error updating connection status:', error);
          } else {
            console.log(`User ${session.user.id} marked as connected`);
          }
        } catch (err) {
          console.error('Error in updateConnectionStatus:', err);
        }
      };
      
      updateConnectionStatus();

      const handleBeforeUnload = async () => {
        try {
          await supabase
            .from('users')
            .update({ is_connected: false })
            .eq('id', session.user.id);
        } catch (err) {
          console.error('Error marking user as disconnected:', err);
        }
      };

      window.addEventListener('beforeunload', handleBeforeUnload);
      
      const connectionInterval = setInterval(updateConnectionStatus, 60000); // Every minute

      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
        clearInterval(connectionInterval);
        handleBeforeUnload();
      };
    }
  }, [session?.user?.id]);

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
