import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../lib/api";
import { getInitData, initTelegramApp } from "../lib/telegram";
import { User } from "../types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  setUser: (u: User | null) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  setUser: () => {},
  refreshUser: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function refreshUser() {
    try {
      const { data } = await api.get("/users/me");
      setUser(data.user);
    } catch {
      setUser(null);
    }
  }

  useEffect(() => {
    initTelegramApp();
    (async () => {
      const initData = getInitData();
      const existingToken = localStorage.getItem("token");

      if (existingToken) {
        await refreshUser();
        setLoading(false);
        return;
      }

      if (initData) {
        try {
          const { data } = await api.post("/auth/telegram", { initData });
          localStorage.setItem("token", data.token);
          setUser(data.user);
        } catch (err) {
          console.error("Telegram autentifikatsiya xatosi:", err);
        }
      }
      setLoading(false);
    })();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, setUser, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
