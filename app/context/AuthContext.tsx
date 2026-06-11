import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const TOKEN_KEY = "token";
const USER_KEY = "user";
const BASEURL =
  import.meta.env.VITE_BASE_URL ??
  (typeof window !== "undefined" ? window.location.origin : "http://localhost");

const AUTH_VALIDATE_PATH = "/protected";

type UserInfo = {
  name: string;
  email: string;
};

type AuthContextValue = {
  token: string | null;
  user: UserInfo | null;
  isAuthenticated: boolean;
  checking: boolean;
  login: (token: string, user: UserInfo) => void;
  logout: () => void;
  validateToken: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);

  const loadAuthFromStorage = () => {
    try {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      const storedUser = localStorage.getItem(USER_KEY);

      setToken(storedToken);
      setUser(storedUser ? JSON.parse(storedUser) : null);

      if (!storedToken) {
        setIsAuthenticated(false);
        setChecking(false);
      }

      return storedToken;
    } catch {
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      setChecking(false);
      return null;
    }
  };

  const validateToken = async (): Promise<boolean> => {

    const currentToken = localStorage.getItem(TOKEN_KEY);
    if (!currentToken) {
      setIsAuthenticated(false);
      setChecking(false);
      return false;
    }

    try {
      const res = await fetch(`${BASEURL}${AUTH_VALIDATE_PATH}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentToken}`,
        },
      });

      if (!res.ok) {
        setIsAuthenticated(false);
        setChecking(false);
        return false;
      }

      setIsAuthenticated(true);
      setChecking(false);
      return true;
    } catch {
      setIsAuthenticated(false);
      setChecking(false);
      return false;
    }
  };

  useEffect(() => {
    const storedToken = loadAuthFromStorage();
    if (storedToken) {
      void validateToken();
    }
  }, []);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === TOKEN_KEY) {
        const newToken = e.newValue;
        setToken(newToken);

        if (!newToken) {
          setIsAuthenticated(false);
          setUser(null);
          return;
        }

        void validateToken();
      }

      if (e.key === USER_KEY) {
        try {
          setUser(e.newValue ? JSON.parse(e.newValue) : null);
        } catch {
          setUser(null);
        }
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [token]);

  const login = (newToken: string, newUser: UserInfo) => {
    try {
      localStorage.setItem(TOKEN_KEY, newToken);
      localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    } catch {
      // ignore storage errors
    }

    setToken(newToken);
    setUser(newUser);
    setIsAuthenticated(true);
  };

  const logout = () => {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch {
      // ignore storage errors
    }

    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = useMemo(
    () => ({ token, user, isAuthenticated, checking, login, logout, validateToken }),
    [token, user, isAuthenticated, checking]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}