"use client";

import React, { createContext, useContext, useState } from "react";
import en from "../../../messages/en.json";

export type LocaleCode = "en";

interface LanguageContextType {
  locale: LocaleCode;
  t: (path: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  locale: "en",
  t: (path: string, fallback?: string) => fallback || path
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const t = (path: string, fallback?: string): string => {
    const keys = path.split(".");
    let current: any = en;
    for (const key of keys) {
      if (current && typeof current === "object" && key in current) {
        current = current[key];
      } else {
        return fallback || path;
      }
    }
    return typeof current === "string" ? current : fallback || path;
  };

  return (
    <LanguageContext.Provider value={{ locale: "en", t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  return useContext(LanguageContext);
}
