import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { API_BASE_URL } from "../../config/api";
import axios from "axios";

export interface User {
  id: string;
  email: string;
  name: string;
  role: "candidate" | "admin" | "review-admin" | "review-engineer";
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User>;
  signup: (data: {
    fullName: string;
    email: string;
    password: string;
    role?: string;
    resumeUrl?: string;
  }) => Promise<User>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Configure axios instance with credentials
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Enable sending HTTP-only cookies
  headers: {
    "Content-Type": "application/json",
  },
});

interface AuthContextProviderProps {
  children: ReactNode;
}

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is already logged in (via HTTP-only cookies) on app load
  const checkAuth = async () => {
    try {
      setIsLoading(true);
      console.log("[AUTH] Checking authentication status...");

      const response = await apiClient.get("/me");
      const userData = response.data.user;

      const userObj: User = {
        id: userData.id,
        email: userData.email,
        name: userData.fullName || userData.name,
        role: userData.role,
      };

      setUser(userObj);
      setIsAuthenticated(true);
      console.log("[AUTH] User is authenticated:", userObj);
    } catch (error) {
      console.log("[AUTH] User is not authenticated");
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    try {
      setIsLoading(true);
      console.log("[AUTH] Logging in with email:", email);

      const response = await apiClient.post("/api/users/signin", {
        email,
        password,
      });

      const userData = response.data.user;

      const userObj: User = {
        id: userData.id,
        email: userData.email,
        name: userData.fullName,
        role: userData.role,
      };

      setUser(userObj);
      setIsAuthenticated(true);
      console.log("[AUTH] Login successful:", userObj);

      return userObj;
    } catch (error) {
      console.error("[AUTH] Login failed:", error);
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (data: {
    fullName: string;
    email: string;
    password: string;
    role?: string;
    resumeUrl?: string;
  }): Promise<User> => {
    try {
      setIsLoading(true);
      console.log("[AUTH] Signing up with email:", data.email);

      const response = await apiClient.post("/api/users/signup", {
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        role: data.role || "candidate",
        resumeUrl: data.resumeUrl || "",
      });

      const userData = response.data.user;

      const userObj: User = {
        id: userData.id,
        email: userData.email,
        name: userData.fullName,
        role: userData.role,
      };

      setUser(userObj);
      setIsAuthenticated(true);
      console.log("[AUTH] Signup successful:", userObj);

      return userObj;
    } catch (error) {
      console.error("[AUTH] Signup failed:", error);
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      console.log("[AUTH] Logging out...");

      // Call logout endpoint to clear HTTP-only cookie on backend
      await apiClient.post("/api/users/logout");

      setUser(null);
      setIsAuthenticated(false);
      console.log("[AUTH] Logout successful");
    } catch (error) {
      console.error("[AUTH] Logout error:", error);
      // Clear local state even if logout endpoint fails
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    signup,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }
  return context;
}
