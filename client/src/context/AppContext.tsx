"use client";

import { jwtDecode } from "jwt-decode";
import React, { createContext, useContext, useState, useEffect } from "react";

interface AppContextType {
  sessionToken: string;
  setSessionToken: (token: string) => void;
  categories: any[];
  setCategories: (categories: any[]) => void;
  cart: any;
  setCart: (item: number | "0") => void;
  role: string;
  setRole: (role: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

interface AppProviderProps {
  children: React.ReactNode;
  initialToken: string;
  initialCart: any;
  initialCategories: any[];
}

export default function AppProvider({
  children,
  initialToken,
  initialCart,
  initialCategories,
}: AppProviderProps) {
  const [sessionToken, setSessionToken] = useState(initialToken);
  const [cart, setCart] = useState(initialCart);
  const [categories, setCategories] = useState(initialCategories);
  const [role, setRole] = useState<string>("");

  useEffect(() => {
    if (sessionToken) {
      try {
        const decoded: any = jwtDecode(sessionToken);
        if (decoded && decoded.role) {
          setRole(decoded.role);
        } else {
          setRole("");
        }
      } catch (error) {
        setRole("");
      }
    } else {
      setRole("");
    }
  }, [sessionToken]);

  return (
    <AppContext.Provider
      value={{
        sessionToken,
        setSessionToken,
        categories,
        setCategories,
        cart,
        setCart,
        role,
        setRole,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
