/**
 * Authentication Hook
 * 
 * Utilité : Session management centralisée
 * Sécurité : Token + user context
 * UX Impact : Auth state cohérent dans toute l'app
 */

"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type User = {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, name?: string) => Promise<void>;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from session on mount
  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      // Check if token exists
      const token = localStorage.getItem("auth_token");
      if (!token) {
        setLoading(false);
        return;
      }

      // TODO: Validate token with API
      // For now, just check if exists
      const storedUser = localStorage.getItem("auth_user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Auth check failed:", error);
    } finally {
      setLoading(false);
    }
  }

  async function login(email: string, password: string) {
    try {
      // TODO: Replace with real API call
      // const res = await fetch("/api/auth/login", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ email, password })
      // });
      // const data = await res.json();

      // Mock login for now
      const mockUser: User = {
        id: "user_" + Date.now(),
        email,
        name: email.split("@")[0]
      };

      // Save to localStorage (temporary, should be httpOnly cookie)
      localStorage.setItem("auth_token", "mock_token_" + Date.now());
      localStorage.setItem("auth_user", JSON.stringify(mockUser));

      setUser(mockUser);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  }

  async function register(email: string, password: string, name?: string) {
    try {
      // TODO: Replace with real API call
      const mockUser: User = {
        id: "user_" + Date.now(),
        email,
        name: name || email.split("@")[0]
      };

      localStorage.setItem("auth_token", "mock_token_" + Date.now());
      localStorage.setItem("auth_user", JSON.stringify(mockUser));

      setUser(mockUser);
    } catch (error) {
      console.error("Register failed:", error);
      throw error;
    }
  }

  function logout() {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    setUser(null);
    window.location.href = "/";
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        register,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
