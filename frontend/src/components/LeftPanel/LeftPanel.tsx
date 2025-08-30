import { NavLink, useNavigate } from "react-router-dom";
import styles from "./LeftPanel.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faFolder, faUser } from "@fortawesome/free-regular-svg-icons";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";

export default function LeftPanel() {
    const navigate = useNavigate();

    const handleSignOut = async () => {
        try {
            const baseUrl = process.env.REACT_APP_API_BASE_URL;
            const tokenResponse = await fetch(`${baseUrl}/csrf-token`, {
                credentials: "include" // Ensures httpOnly session cookies are sent/received
            });
            const tokenJSON = await tokenResponse.json();
            const csrfToken = tokenJSON.csrfToken;

            const response = await fetch(`${baseUrl}/users/sign_out`, { // Endpoint calls: devise/sessions#destroy
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-Token": csrfToken
                },
                credentials: "include"
            });

            if (response.ok) {
                navigate("/");
            } else {
                console.error("Sign out failed");
                navigate("/");
            }
        } catch (error) {
            console.error(`Sign out failed: ${error}`);
            navigate("/");
        }
    };


    return (
        <div className={styles.left_panel}>
            <NavLink to="/dashboard">
                <h2 className={styles.header}>Sets-n-Reps</h2>
            </NavLink>
            <ul className={styles.nav_list}>
                <li>
                    <NavLink 
                        to="/dashboard/current-workout"
                        className={({ isActive }: { isActive: boolean }) => isActive ? styles.active : ""}
                    >
                        <FontAwesomeIcon icon={faCalendar} /> Current workout
                    </NavLink>
                </li>
                <li>
                    <NavLink 
                        to="/dashboard/mesocycles"
                        className={({ isActive }: { isActive: boolean }) => isActive ? styles.active : ""}
                    >
                        <FontAwesomeIcon icon={faFolder} /> Mesocycles
                    </NavLink>
                </li>
                <li>
                    <NavLink 
                        to="/dashboard/profile"
                        className={({ isActive }: { isActive: boolean }) => isActive ? styles.active : ""}
                    >
                        <FontAwesomeIcon icon={faUser} /> Profile
                    </NavLink>
                </li>
                <li>
                    <button onClick={handleSignOut}>
                        <FontAwesomeIcon icon={faArrowRightFromBracket} /> Sign out
                    </button>
                </li>
            </ul>
        </div>
    );
}
