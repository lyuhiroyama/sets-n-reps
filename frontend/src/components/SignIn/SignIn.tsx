import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SignIn.module.css";

export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {

            // (1) Fetch CSRF token from Rails
            const tokenResponse = await fetch("http://localhost:3000/csrf-token", {
                credentials: "include" // Ensures httpOnly session cookies are sent/received
            });
            const tokenJSON = await tokenResponse.json();
            const csrfToken = tokenJSON.csrfToken;

            const response = await fetch("http://localhost:3000/users/sign_in", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "X-CSRF-Token": csrfToken
                },
                credentials: "include", // Ensures httpOnly session cookies are sent/received
                body: JSON.stringify({ user: { email, password } }),
            });

            if (response.ok) {
                navigate("/dashboard"); // Redirect to dashboard
            } else {
                const errorData = await response.json();
                setError(errorData.error || "Sign-in failed. Please check your email and password")
            }
        } catch (error) {
            console.error(error)
            setError("Sign-in failed. Please check your email and password.");
        }
    };

    return (
        <div className={styles.component}>
            <div className={styles.container}>
                <h2 className={styles.header}>Sets-n-Reps</h2>
                <p className={styles.sub_header}>Sign in to your account</p>
                { error && <p className={styles.error}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit" className={styles.sign_in_button}>
                        Sign In
                    </button>
                </form>
                <hr />
                <button type="button" className={styles.invite_code_button}>
                    Create account
                </button>
            </div>
        </div>
    );
}
