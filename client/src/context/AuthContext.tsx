import React, { createContext, useContext, useState, useEffect } from "react";
import type { User } from "../types";
import { api } from "../services/api";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("cm_token")
  );
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("cm_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem("cm_token", newToken);
    localStorage.setItem("cm_user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem("cm_token");
    localStorage.removeItem("cm_user");
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    if (!token) return;
    try {
      const res = await api.get<{ success: boolean; data: User }>("/auth/me");
      if (res.data?.data) {
        setUser(res.data.data);
        localStorage.setItem("cm_user", JSON.stringify(res.data.data));
      }
    } catch (err) {
      console.error("Failed to refresh user:", err);
      logout();
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem("cm_token");
      if (savedToken) {
        try {
          const res = await api.get<{ success: boolean; data: User }>("/auth/me");
          if (res.data?.data) {
            setUser(res.data.data);
            localStorage.setItem("cm_user", JSON.stringify(res.data.data));
          }
        } catch {
          logout();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

