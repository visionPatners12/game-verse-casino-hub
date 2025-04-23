
import { useState, useEffect, useRef } from "react";
import { Session, User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export function useAuthStatus() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const initialSessionChecked = useRef(false);
  const isAuthChangeFromExplicitAction = useRef(false);
  const navigate = useNavigate();

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

  return {
    session,
    user,
    isLoading,
    isAuthChangeFromExplicitAction
  };
}
