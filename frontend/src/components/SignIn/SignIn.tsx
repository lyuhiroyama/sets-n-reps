import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SignIn.module.css";

export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSignIn, setIsSignIn] = useState(true);
    const navigate = useNavigate();

    const allowSignups = process.env.REACT_APP_ALLOW_SIGNUPS === "true";

    // Check auth status via cookies. Redirect user to dashboard if session cookie still valid:
    useEffect(() => {
        const check = async () => {
          const baseUrl = process.env.REACT_APP_API_BASE_URL;
          const res = await fetch(`${baseUrl}/users/check-auth`, {
            credentials: "include",
            headers: { Accept: "application/json" }
          });
          const data = await res.json();
          if (res.ok && data.isAuthenticated) {
            navigate("/dashboard/current-workout");
          }
        };
        check();
      }, [navigate]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            // Disable sign-ups in production environment:
            if (!isSignIn && !allowSignups) {
                setError("Sign-ups are disabled.");
                alert("Developer has chosen to disable sign-ups. If you would like to demo this app, please feel free to reach out!");
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
                navigate("/dashboard/current-workout", { replace: true }); // Replace history to prevent back navigation to sign-in page
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
                <form onSubmit={handleSubmit} className={styles.auth_form}>
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
                <hr className={styles.signin_divider} />
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
