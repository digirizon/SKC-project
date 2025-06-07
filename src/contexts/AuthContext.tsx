import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import authService from "@/services/auth";

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  session: Session | null;
  loading: boolean;
  setIsLoggedIn: (value: boolean) => void;
  userEmail: string;
  setUserEmail: (value: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  user: null,
  session: null,
  loading: true,
  setIsLoggedIn: () => {},
  userEmail: "",
  setUserEmail: () => {}
});

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    authService.getCurrentSession().then((session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoggedIn(!!session);
      setUserEmail(session?.user?.email ?? "");
      setLoading(false);
    });

    // Listen for auth changes
    // Corrected: authService.onAuthStateChange returns the subscription directly
    const subscription = authService.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoggedIn(!!session);
      setUserEmail(session?.user?.email ?? "");
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn, 
      user, 
      session, 
      loading,
      setIsLoggedIn, 
      userEmail, 
      setUserEmail 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
export { AuthContext };
