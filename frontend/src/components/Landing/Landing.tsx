import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext/AuthContext";
import SignIn from "../SignIn/SignIn";
import styles from "./Landing.module.css";

export default function Landing() {
    const { isAuthenticated } = useAuth();
  
    if (isAuthenticated === null) {
      return (
        <div className={styles.component}>
          <div className={styles.spinner} />
        </div>
      );
    }
  
    if (isAuthenticated) return <Navigate to="/dashboard/current-workout" replace />;
  
    return <SignIn />;
}