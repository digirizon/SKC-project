import { supabase } from "@/integrations/supabase/client";
import { AuthResponse, Session, User, AuthError, OAuthResponse } from "@supabase/supabase-js";

export const authService = {
  async signUp(email: string, password: string, name: string): Promise<AuthResponse> {
    const authResponse = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          // You can add other metadata here if needed, like a default avatar_url
          // avatar_url: 'https://example.com/default-avatar.png', 
        },
      },
    });

    if (authResponse.data.user && !authResponse.error) {
      // User created in auth, now create a profile
      const { error: profileError } = await supabase
        .from("profiles")
        .insert({ 
          id: authResponse.data.user.id, 
          full_name: name,
          // username: name.toLowerCase().replace(/\s+/g, '_'), // Example username generation
          // avatar_url: authResponse.data.user.user_metadata.avatar_url || 'URL_TO_DEFAULT_AVATAR'
        });

      if (profileError) {
        console.error("Error creating profile after signup:", profileError);
        // Potentially handle this error, e.g., by informing the user or attempting cleanup
        // For now, we'll just log it. The auth signup itself was successful.
      }
    }
    return authResponse;
  },

  async signIn(email: string, password: string): Promise<AuthResponse> {
    return supabase.auth.signInWithPassword({
      email,
      password,
    });
  },

  async signInWithGoogle(): Promise<OAuthResponse> {
    return supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: typeof window !== "undefined" ? window.location.origin : "",
      },
    });
  },

  async signOut(): Promise<{ error: AuthError | null }> { 
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange(callback);
    return subscription;
  }
};

export default authService;
