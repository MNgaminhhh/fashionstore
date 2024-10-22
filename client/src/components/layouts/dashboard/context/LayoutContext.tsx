import { useState, createContext, PropsWithChildren, useContext } from "react";

const TOP_NAVBAR_HEIGHT = 100;

interface LayoutContextProps {
    isCompact: boolean;
    topNavbarHeight: number;
    isSidebarCompact: boolean;
    isSidebarHovered: boolean;
    toggleSidebarCompact: () => void;
    setSidebarHovered: (value: boolean) => void;
}

const LayoutContext = createContext({} as LayoutContextProps);

export const useLayout = () => {
    const context = useContext(LayoutContext);
    if (!context) {
        throw new Error("useLayout must be used within a LayoutProvider");
    }
    return context;
};
export const LayoutProvider = ({ children }: PropsWithChildren) => {
    const [isSidebarHovered, setIsSidebarHovered] = useState(false);
    const [isSidebarCompact, setIsSidebarCompact] = useState(false);
    const toggleSidebarCompact = () => setIsSidebarCompact(!isSidebarCompact);
    const setSidebarHovered = (value: boolean) => setIsSidebarHovered(value);

    const isCompact = isSidebarCompact && !isSidebarHovered ? true : false;

    return (
        <LayoutContext.Provider
            value={{
                isCompact,
                topNavbarHeight: TOP_NAVBAR_HEIGHT,
                isSidebarCompact,
                isSidebarHovered,
                setSidebarHovered,
                toggleSidebarCompact,
            }}>
            {children}
        </LayoutContext.Provider>
    );
};
