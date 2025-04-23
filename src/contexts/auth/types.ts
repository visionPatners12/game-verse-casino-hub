
import { Session, User } from "@supabase/supabase-js";

export type SignUpData = {
  email: string;
  password: string;
  username: string;
  firstName: string;
  lastName: string;
  phone: string;
  country: string;
};

export type AuthContextType = {
  session: Session | null;
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: SignUpData) => Promise<void>;
  signOut: () => Promise<void>;
  isLoading: boolean;
};
