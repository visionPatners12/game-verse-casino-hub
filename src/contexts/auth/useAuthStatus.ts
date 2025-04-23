
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
        // First set up the auth state listener to catch any changes
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
        
        // Then check for an existing session
        const { data: sessionData, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Error getting session:", error);
          // Try to refresh session if there's an error
          try {
            const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
            if (refreshError) {
              console.error("Error refreshing session:", refreshError);
            } else if (refreshData.session) {
              console.log("Session successfully refreshed");
              setSession(refreshData.session);
              setUser(refreshData.session.user);
            }
          } catch (refreshErr) {
            console.error("Exception during session refresh:", refreshErr);
          }
        } else {
          console.log("Initial session check:", sessionData.session ? "Session exists" : "No session");
          setSession(sessionData.session);
          setUser(sessionData.session?.user ?? null);
        }
        
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

  // Add a session recovery mechanism that runs periodically
  useEffect(() => {
    const recoverSession = async () => {
      if (!session && !isLoading && initialSessionChecked.current) {
        try {
          console.log("Attempting to recover session...");
          const { data, error } = await supabase.auth.refreshSession();
          if (error) {
            console.log("Session recovery failed:", error.message);
          } else if (data.session) {
            console.log("Session recovered successfully");
            setSession(data.session);
            setUser(data.session.user);
          }
        } catch (err) {
          console.error("Error during session recovery:", err);
        }
      }
    };

    // Try to recover session once on mount
    recoverSession();

    // Also set up a periodic session check (every 5 minutes)
    const sessionCheckInterval = setInterval(recoverSession, 300000);
    
    return () => clearInterval(sessionCheckInterval);
  }, [session, isLoading]);

  return {
    session,
    user,
    isLoading,
    isAuthChangeFromExplicitAction
  };
}
