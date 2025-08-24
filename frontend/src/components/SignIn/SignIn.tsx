import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SignIn.module.css";

export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSignIn, setIsSignIn] = useState(true);
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

            // (2) Send sign-in request with credentials & CSRF token
            const baseUrl = process.env.REACT_APP_API_BASE_URL
            const url = `${baseUrl}${isSignIn ? "/users/sign_in" : "/users"}`
            const response = await fetch(url, {
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
                setError(errorData.error || `${isSignIn  ? "Sign-in" : "Sign-up"} failed. Please check your email and password`)
            }
        } catch (error) {
            console.error(error)
            setError(`${isSignIn  ? "Sign-in" : "Sign-up"} failed. Please check your email and password`);
        }
    };

    return (
        <div className={styles.component}>
            <div className={styles.container}>
                <h2 className={styles.header}>Sets-n-Reps</h2>
                <p className={styles.sub_header}>
                    {isSignIn ? "Sign in to your account" : "Sign up with email" }
                </p>
                { error && <p className={styles.error}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className={styles.sign_in_button}>
                        {isSignIn ? "Sign in" : "Create account" }
                    </button>
                </form>
                <hr />
                <button 
                    type="button" 
                    className={styles.toggle_form_button}
                    onClick={() => setIsSignIn(!isSignIn)}
                >
                    {isSignIn ? "Create account" : "Sign in" }
                </button>
            </div>
        </div>
    );
}
