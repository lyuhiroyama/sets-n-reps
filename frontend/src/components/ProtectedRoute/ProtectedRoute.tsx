import { ReactNode } from "react";
import { useAuth } from "../AuthContext/AuthContext";
import { Navigate } from "react-router-dom";
import styles from "./ProtectedRoute.module.css";


export default function ProtectedRoute({ children }: { children: ReactNode }) {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated === null) {
        return (
            <div className={styles.component}>
                <div className={styles.spinner} />
            </div>
        )
    }

    return isAuthenticated ? <>{children}</> : <Navigate to="/" />;
}
