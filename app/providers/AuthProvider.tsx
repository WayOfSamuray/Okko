"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { signOut, useSession } from "next-auth/react";

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

export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<User>(null);

  const { data: session, status } = useSession();

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
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    const syncOAuth = async () => {
      if (!session?.accessToken) return;

      await fetch("/api/auth/oauth-sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accessToken: session.accessToken,
          refreshToken: session.refreshToken,
        }),
      });

      await checkAuth();
    };

    syncOAuth();
  }, [session]);

  const logout = async () => {
    try {
      // очищаем твои JWT cookies
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      // очищаем NextAuth session
      await signOut({
        redirect: false,
      });

      setUser(null);
    } catch (e) {
      console.error("Logout error:", e);
    }
  };

  if (status === "loading") {
    return null;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuth: !!user,
        setUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);