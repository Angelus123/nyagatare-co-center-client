// context/AuthContext.tsx
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";

type User = {
  id: string;
  role: "ADMIN" | "OPERATOR" | "CLIENT";
  name: string;
  email: string;
} | null;

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User;
  checkAuth: () => Promise<void>;
  // logout: () => Promise<void>;
  getToken: () => Promise<string | null>; // <-- Add this line
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User>(null);
  const router = useRouter();

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No token found");
      }

      // Verify token with backend
  
      // const response = await fetch(`/api/auth/verify`, {
      //   method: "GET",
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //     "Content-Type": "application/json",
      //   },
      // });

      // if (response.ok) {
        const userData = JSON.parse(localStorage.getItem("user") || "{}");
        console.log("User data from localStorage:", userData);
        if (!userData || !userData.id) {
          throw new Error("Invalid user data");
        }
        setIsAuthenticated(true);
        setUser(userData);
      // } else {
      //   throw new Error("Token verification failed");
      // }
    } catch (error) {
      console.error("Authentication check failed:", error);
      // localStorage.removeItem("token");
      // localStorage.removeItem("user");
      setIsAuthenticated(false);
      setUser(null);
      // router.push("/login");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem("token");

      // Optional: Call backend logout endpoint if needed
      await fetch(`/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // Clear local storage and state
      // localStorage.removeItem("token");
      // localStorage.removeItem("user");
      setIsAuthenticated(false);
      setUser(null);
      // router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const getToken = async (): Promise<string | null> => {
    return localStorage.getItem("token");
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        checkAuth,
        // logout,
        getToken, // <-- Add this line
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
