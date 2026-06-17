import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authAPI } from "../utils/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("notes_token");
    const cachedUser = localStorage.getItem("notes_user");

    if (!token) {
      setLoading(false);
      return;
    }

    if (cachedUser) {
      try { setUser(JSON.parse(cachedUser)); } catch { /* ignore corrupt cache */ }
    }

    authAPI
      .me()
      .then((res) => {
        setUser(res.data.user);
        localStorage.setItem("notes_user", JSON.stringify(res.data.user));
      })
      .catch(() => {
        setUser(null);
        localStorage.removeItem("notes_token");
        localStorage.removeItem("notes_user");
      })
      .finally(() => setLoading(false));
  }, []);

  const persistSession = (token, user) => {
    localStorage.setItem("notes_token", token);
    localStorage.setItem("notes_user", JSON.stringify(user));
    setUser(user);
  };

  const signup = useCallback(async (data) => {
    setAuthError(null);
    try {
      const res = await authAPI.signup(data);
      persistSession(res.data.token, res.data.user);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to create account";
      setAuthError(msg);
      return { success: false, message: msg };
    }
  }, []);

  const login = useCallback(async (data) => {
    setAuthError(null);
    try {
      const res = await authAPI.login(data);
      persistSession(res.data.token, res.data.user);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to log in";
      setAuthError(msg);
      return { success: false, message: msg };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("notes_token");
    localStorage.removeItem("notes_user");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, authError, signup, login, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};