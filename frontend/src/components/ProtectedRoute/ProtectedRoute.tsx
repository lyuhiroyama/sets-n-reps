import { ReactNode } from "react";
import { useAuth } from "../AuthContext/AuthContext";
import { Navigate } from "react-router-dom";


export default function ProtectedRoute({ children }: { children: ReactNode }) {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated === null) {
        return <div>Loading...</div>;
    }

    return isAuthenticated ? <>{children}</> : <Navigate to="/" />;
}
