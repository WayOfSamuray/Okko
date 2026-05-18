"use client";

import { createContext, useContext, useEffect, useState } from "react";

type User = {
  avatar: string | Blob | undefined;
  email: string;
  id?: string;
} | null;

type AuthContextType = {
  user: User;
  isAuth: boolean;
  setUser: (user: User) => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuth: false,
  setUser: () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      let res = await fetch("/api/auth/me", {
        credentials: "include",
      });

      if (res.status === 401) {
        const refreshRes = await fetch("/api/auth/refresh", {
          credentials: "include",
          method: "GET",
        });

        if (refreshRes.ok) {
          res = await fetch("/api/auth/me", {
            credentials: "include",
          });
        }
      }

      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check error:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
    } catch (e) {
      console.error("Logout error:", e);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuth: !!user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
