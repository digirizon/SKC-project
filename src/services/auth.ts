
import { supabase } from "@/integrations/supabase/client";
import { AuthResponse, Session, Provider, AuthError, OAuthResponse } from "@supabase/supabase-js"; // Added Provider, AuthError, OAuthResponse for clarity, though AuthResponse should cover them.

export const authService = {
  async signUp(email: string, password: string, name: string): Promise<AuthResponse> {
    return supabase.auth.signUp({
      email,
      password,
      options: {
         {
          full_name: name,
        },
      },
    });
  },

  async signIn(email: string, password: string): Promise<AuthResponse> {
    return supabase.auth.signInWithPassword({
      email,
      password,
    });
  },

  // Changed: Removed explicit Promise<AuthResponse> to let TypeScript infer the more specific type
  async signInWithGoogle() { 
    return supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: typeof window !== "undefined" ? window.location.origin : "",
      },
    });
  },

  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentSession(): Promise<Session | null> { // More specific return type
    const {  { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  },

  async getCurrentUser() { // Let TypeScript infer: Promise<User | null>
    const {  { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }
};

export default authService;
