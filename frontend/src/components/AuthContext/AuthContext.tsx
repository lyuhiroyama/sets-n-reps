import { createContext, useState, useEffect, useContext, ReactNode } from "react";

type AuthContextType = {
    isAuthenticated: boolean | null;
    setIsAuthenticated: (value: boolean) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        // Fetch once on startup
        const checkAuthentication = async () => {
            const baseUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:3000";
            const response = await fetch(`${baseUrl}/users/check-auth`, { 
                credentials: "include",
                headers: { "Accept": "application/json" }
            });
            const data = await response.json();

            if (response.ok) {
                setIsAuthenticated(data.isAuthenticated);
            } else {
                console.log(data.message)
                setIsAuthenticated(false);
            }
        };

        checkAuthentication();
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
}

// Helper hook to keep TS from complaining
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    
    return context;
}

