import { useState, useEffect } from "react";
import styles from "./Profile.module.css"

type UserType = {
    email: string;
    created_at: string;
}

export default function Profile() {
    const [user, setUser] = useState<UserType | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const baseUrl = process.env.REACT_APP_API_BASE_URL;
                const response = await fetch(`${baseUrl}/users/check-auth`, {
                    credentials: "include",
                    headers: {
                        "Accept": "application/json"
                    }
                });
                const data = await response.json();

                if (data.isAuthenticated) {
                    setUser(data.user);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error("Error fetching user data: ", error);
            }
        };

        fetchUser();
    }, []);

    return (
        <div className={styles.component}>
            <h2>User Profile</h2>
            <div className={styles.container}>
                <dl className={styles.profile_dl}>
                    <div className={styles.profile_set}>
                        <dt>Email</dt>
                        <dd>{user?.email}</dd>
                    </div>
                    <div className={styles.profile_set}>
                        <dt>Account created</dt>
                        <dd>
                            {user?.created_at
                            ? new Date(user.created_at).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })
                            : ""}
                        </dd>
                    </div>
                </dl>
            </div>
        </div>
    );
}