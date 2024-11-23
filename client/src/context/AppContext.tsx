'use client'

import React, { createContext, useContext, useState } from "react";

interface AppContextType {
    sessionToken: string;
    setSessionToken: (token: string) => void;
    categories: any[];
    setCategories: (categories: any[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
}

interface AppProviderProps {
    children: React.ReactNode;
    initialToken: string;
    initialCategories: any[];
}

export default function AppProvider({
    children,
    initialToken,
    initialCategories
}: AppProviderProps) {
    const [sessionToken, setSessionToken] = useState(initialToken);
    const [categories, setCategories] = useState(initialCategories);

    return (
        <AppContext.Provider value={{
            sessionToken,
            setSessionToken,
            categories,
            setCategories
        }}>
            {children}
        </AppContext.Provider>
    )
}
