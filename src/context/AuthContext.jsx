import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { initializeApiAuth, clearApiAuth, setApiCredentials } from "../services/api";

const AuthContext = createContext(null);

// Role hierarchy and permissions
const ROLE_PERMISSIONS = {
  admin: [
    "email:connect", "email:disconnect", "email:sync", "email:status",
    "meetings:list", "meetings:detail", "meetings:join", "meetings:cancel_bot",
    "meetings:transcript", "meetings:insights", "meetings:speakers", "meetings:signals",
    "consent:grant", "consent:revoke", "consent:status",
    "settings:manage", "users:manage",
  ],
  rm: [
    "email:status",
    "meetings:list", "meetings:detail", "meetings:join",
    "meetings:transcript", "meetings:insights", "meetings:speakers", "meetings:signals",
    "consent:status",
  ],
  branch: [
    "email:status",
    "meetings:list", "meetings:detail",
    "meetings:transcript", "meetings:insights", "meetings:speakers", "meetings:signals",
    "consent:status",
  ],
  compliance: [
    "email:status",
    "meetings:list", "meetings:detail",
    "meetings:transcript", "meetings:insights",
    "consent:status",
  ],
};

// Dummy users for login (controlled JSON — RBAC source of truth)
const DUMMY_USERS = {
  "nirbhay.singh@rapyder.com": {
    password: "SINGH@bank532",
    user: {
      user_id: "a1b2c3d4-5678-90ab-cdef-1234567890ab",
      entity_id: "f451c4c9-6450-4545-acd6-062319803789",
      email: "nirbhay.singh@rapyder.com",
      display_name: "Nirbhay Pratap Singh",
      first_name: "Nirbhay",
      last_name: "Singh",
      role: "admin",
    },
  },
  "arya.subramani@rapyder.com": {
    password: "arya@123",
    user: {
      user_id: "c0e3ae3f-9de4-40fe-868c-2b5e76216e08",
      entity_id: "f451c4c9-6450-4545-acd6-062319803789",
      email: "arya.subramani@rapyder.com",
      display_name: "Arya Subramani",
      first_name: "Arya",
      last_name: "Subramani",
      role: "admin",
    },
  },
  "priya@firstai.com": {
    password: "priya@123",
    user: {
      user_id: "d1f4be4g-0ef5-51gf-979d-3c6f87327f19",
      entity_id: "f451c4c9-6450-4545-acd6-062319803789",
      email: "priya@firstai.com",
      display_name: "Priya Sharma",
      first_name: "Priya",
      last_name: "Sharma",
      role: "rm",
    },
  },
  "atin.mittal@rapyder.com": {
    password: "Rapyder@12345",
    user: {
      user_id: "e2g5cf5h-1fg6-62hg-080e-4d7g98438g20",
      entity_id: "f451c4c9-6450-4545-acd6-062319803789",
      email: "atin.mittal@rapyder.com",
      display_name: "Atin Mittal",
      first_name: "Atin",
      last_name: "Mittal",
      role: "admin",
    },
  },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("onelenz_user");
    return stored ? JSON.parse(stored) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem("onelenz_token"));

  // If user is already logged in (e.g. page refresh), eagerly fetch API token
  useEffect(() => {
    if (user && token) {
      initializeApiAuth();
    }
  }, []); // eslint-disable-line

  const login = useCallback((email, password) => {
    const entry = DUMMY_USERS[email];
    if (!entry || entry.password !== password) {
      return { success: false, error: "Invalid credentials" };
    }
    const fakeToken = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.dummy_token_" + Date.now();
    setUser(entry.user);
    setToken(fakeToken);
    localStorage.setItem("onelenz_user", JSON.stringify(entry.user));
    localStorage.setItem("onelenz_token", fakeToken);
    // Pass the logged-in user's credentials to the API layer
    setApiCredentials(email, password);
    // Eagerly fetch real API token in the background
    initializeApiAuth();
    return { success: true, user: entry.user, token: fakeToken };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("onelenz_user");
    localStorage.removeItem("onelenz_token");
    clearApiAuth();
  }, []);

  const hasPermission = useCallback((permission) => {
    if (!user) return false;
    const perms = ROLE_PERMISSIONS[user.role] || [];
    return perms.includes(permission);
  }, [user]);

  const hasRole = useCallback((role) => {
    if (!user) return false;
    return user.role === role;
  }, [user]);

  const isAuthenticated = !!user && !!token;

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout, hasPermission, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function RequireAuth({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return null; // App.js handles redirect
  return children;
}

export function RequirePermission({ permission, fallback = null, children }) {
  const { hasPermission } = useAuth();
  if (!hasPermission(permission)) return fallback;
  return children;
}
