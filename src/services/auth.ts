
import { supabase } from "@/integrations/supabase/client";
import { AuthResponse, Session, User, Provider, AuthError, OAuthResponse } from "@supabase/supabase-js";

export const authService = {
  async signUp(email: string, password: string, name: string): Promise<AuthResponse> {
    return supabase.auth.signUp({
      email,
      password,
      options: {
        data: { // Corrected: 'data' is the key for user metadata
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

  // Return type inferred to Promise<OAuthResponse>
  async signInWithGoogle() { 
    return supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: typeof window !== "undefined" ? window.location.origin : "",
      },
    });
  },

  async signOut(): Promise<{ error: AuthError | null }> { // Supabase signOut returns { error }
    return supabase.auth.signOut();
  },

  async getCurrentSession(): Promise<Session | null> {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error("Error getting session:", error);
      return null;
    }
    return data.session;
  },

  async getCurrentUser(): Promise<User | null> {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.error("Error getting user:", error);
      return null;
    }
    return data.user;
  },

  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    const {  { subscription } } = supabase.auth.onAuthStateChange(callback);
    return subscription;
  }
};

export default authService;
