import { useState } from "react";
import { useAuth } from "../AuthContext/AuthContext";
import { useTranslation } from 'react-i18next';
import styles from "./SignIn.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSignIn, setIsSignIn] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const { setIsAuthenticated } = useAuth();
    const { t } = useTranslation();

    const allowSignups = process.env.REACT_APP_ALLOW_SIGNUPS === "true";

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            // Disable sign-ups in production environment:
            if (!isSignIn && !allowSignups) {
                setError(t("signIn.signUpsDisabled"));
                alert(t("signIn.signUpsDisabledMessage"));
                return;
            }

            const baseUrl = process.env.REACT_APP_API_BASE_URL

            // Send sign-in request with credentials & CSRF token
            const url = `${baseUrl}${isSignIn ? "/users/sign_in" : "/users"}` 
            // /users/sign_in -> Calls devise/sessions#create
            // /users -> Calls devise/registrations#create

            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include", // Ensures httpOnly session cookies are sent/received
                body: JSON.stringify({ user: { email, password } }),
            });

            if (response.ok) {
                setIsAuthenticated(true);
                // No navigate(): Landing reads isAuthenticated and redirects to /dashboard/current-workout
            } else {
                const errorData = await response.json();
                setError(errorData.error || (isSignIn  ? t("signIn.signInFailed") : t("signIn.signUpFailed")))
            }
        } catch (error) {
            console.error(error)
            setError( isSignIn  ? t("signIn.signInFailed") : t("signIn.signUpFailed") );
        }
    };

    return (
        <div className={styles.component}>
            <div className={styles.container}>
                <h2 className={styles.header}>Sets-n-Reps</h2>
                <p className={styles.sub_header}>
                    {isSignIn ? t("signIn.signInToAccount") : t("signIn.signUpWithEmail") }
                </p>
                { error && <p className={styles.error}>{error}</p>}
                <form onSubmit={handleSubmit} className={styles.auth_form}>
                    <input
                        type="email"
                        placeholder={t("signIn.placeHolderEmail")}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <div className={styles.pwInput_showPwBtn_container}>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder={t("signIn.placeHolderPW")}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            className={styles.showPasswordBtn}
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            <FontAwesomeIcon icon={ showPassword ? faEye : faEyeSlash } />
                        </button>
                    </div>
                    <button type="submit" className={styles.sign_in_button}>
                        {isSignIn ? t("signIn.signIn") : t("signIn.createAccount") }
                    </button>
                </form>
                <hr className={styles.signin_divider} />
                <button 
                    type="button" 
                    className={styles.toggle_form_button}
                    onClick={() => setIsSignIn(!isSignIn)}
                >
                    {isSignIn ? t("signIn.createAccount") : t("signIn.signIn") }
                </button>
            </div>
        </div>
    );
}
