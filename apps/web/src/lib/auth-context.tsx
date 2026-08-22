"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type RoleType = "PUBLIC" | "PARTICIPANT" | "VENDOR_OWNER" | "VERIFIER_MODERATOR" | "SUPER_ADMIN";

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: RoleType;
  vendorId?: string;
  vendorName?: string;
  token?: string;
}

export const PRESET_DEMO_USERS: Record<RoleType, AuthUser> = {
  PUBLIC: {
    id: "public-guest",
    email: "visitor@reach.incorvo.in",
    fullName: "Public Guest",
    role: "PUBLIC",
  },
  PARTICIPANT: {
    id: "demo-part-01",
    email: "ananya.iyer@gmail.com",
    fullName: "Ananya Iyer",
    role: "PARTICIPANT",
    token: "demo_participant_jwt_token_2026",
  },
  VENDOR_OWNER: {
    id: "demo-vendor-01",
    email: "founder@novahealth.in",
    fullName: "NovaHealth Organics",
    role: "VENDOR_OWNER",
    vendorId: "demo-vendor-org-01",
    vendorName: "NovaHealth Organics",
    token: "demo_vendor_jwt_token_2026",
  },
  VERIFIER_MODERATOR: {
    id: "demo-mod-01",
    email: "moderator@reach.incorvo.in",
    fullName: "Priya Nair (Trust & Safety)",
    role: "VERIFIER_MODERATOR",
    token: "demo_moderator_jwt_token_2026",
  },
  SUPER_ADMIN: {
    id: "demo-admin-01",
    email: "admin@reach.incorvo.in",
    fullName: "Platform SuperAdmin",
    role: "SUPER_ADMIN",
    token: "demo_admin_jwt_token_2026",
  },
};

interface AuthContextType {
  user: AuthUser;
  switchRole: (role: RoleType) => void;
  login: (user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser>(PRESET_DEMO_USERS.PUBLIC);

  useEffect(() => {
    const savedRole = localStorage.getItem("incorvo_demo_role") as RoleType;
    if (savedRole && PRESET_DEMO_USERS[savedRole]) {
      setUser(PRESET_DEMO_USERS[savedRole]);
    }
  }, []);

  const switchRole = (role: RoleType) => {
    const targetUser = PRESET_DEMO_USERS[role];
    setUser(targetUser);
    localStorage.setItem("incorvo_demo_role", role);
    if (targetUser.token) {
      localStorage.setItem("incorvo_token", targetUser.token);
    } else {
      localStorage.removeItem("incorvo_token");
    }
  };

  const login = (newUser: AuthUser) => {
    setUser(newUser);
    if (newUser.token) {
      localStorage.setItem("incorvo_token", newUser.token);
    }
  };

  const logout = () => {
    setUser(PRESET_DEMO_USERS.PUBLIC);
    localStorage.removeItem("incorvo_token");
    localStorage.setItem("incorvo_demo_role", "PUBLIC");
  };

  return (
    <AuthContext.Provider value={{ user, switchRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
