import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext/AuthContext";
import { useTranslation } from 'react-i18next';
import styles from "./LeftPanel.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faFolder, faUser } from "@fortawesome/free-regular-svg-icons";
import { faPlus, faArrowRightFromBracket, faXmark } from "@fortawesome/free-solid-svg-icons";

export default function LeftPanel() {
    const navigate = useNavigate();
    const { setIsAuthenticated } = useAuth();
    const [showSignOutDialog, setShowSignOutDialog] = useState(false);
    const [render, setRender] = useState(false);
    const { t } = useTranslation();
    
    useEffect(() => {
        if (showSignOutDialog) { setRender(true); return; }
        if (render) {
            const t = window.setTimeout(() => setRender(false), 150);
            return () => window.clearTimeout(t);
        }
    }, [showSignOutDialog, render]);

    const handleSignOut = async () => {
        try {
            const baseUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:3000";
            const response = await fetch(`${baseUrl}/users/sign_out`, { // Endpoint calls: devise/sessions#destroy
                method: "DELETE",
                credentials: "include"
            });

            if (response.ok) {
                setIsAuthenticated(false);
                // No navigate(): ProtectedRoute sees auth=false and redirects to "/"
            } else {
                console.error("Sign out failed");
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error(`Sign out failed: ${error}`);
            navigate("/");
        }
    };


    return (
        <div className={styles.left_panel}>
            <NavLink to="/dashboard/current-workout">
                <h2 className={styles.header}>Sets-n-Reps</h2>
            </NavLink>
            <ul className={styles.nav_list}>
                <li>
                    <NavLink 
                        to="/dashboard/current-workout"
                        className={({ isActive }: { isActive: boolean }) => isActive ? styles.active : ""}
                    >
                        <FontAwesomeIcon icon={faCalendar} /> 
                        <div className={styles.text_desktop}>{t("leftPanel.currentWorkout.long")}</div>
                        <div className={styles.text_mobile}>{t("leftPanel.currentWorkout.short")}</div>
                    </NavLink>
                </li>
                <li>
                    <NavLink 
                        to="/dashboard/mesocycles"
                        className={({ isActive }: { isActive: boolean }) => isActive ? styles.active : ""}
                    >
                        <FontAwesomeIcon icon={faFolder} /> 
                        <div className={styles.text_desktop}>{t("leftPanel.mesocycles.long")}</div>
                        <div className={styles.text_mobile}>{t("leftPanel.mesocycles.short")}</div>
                    </NavLink>
                </li>
                <li>
                    <NavLink 
                        to="/dashboard/plan-a-mesocycle"
                        className={({ isActive }: { isActive: boolean }) => isActive ? styles.active : ""}
                    >
                        <FontAwesomeIcon icon={faPlus} /> 
                        <div className={styles.text_desktop}>{t("leftPanel.planAMesocycle.long")}</div>
                        <div className={styles.text_mobile}>{t("leftPanel.planAMesocycle.short")}</div>
                    </NavLink>
                </li>
                <li>
                    <NavLink 
                        to="/dashboard/settings"
                        className={({ isActive }: { isActive: boolean }) => isActive ? styles.active : ""}
                    >
                        <FontAwesomeIcon icon={faUser} />
                        <div className={styles.text_desktop}>{t("leftPanel.profileAndSettings.long")}</div>
                        <div className={styles.text_mobile}>{t("leftPanel.profileAndSettings.short")}</div>
                    </NavLink>
                </li>
                <li>
                    <button onClick={() => setShowSignOutDialog(true)}>
                        <FontAwesomeIcon icon={faArrowRightFromBracket} /> 
                        <div>{t("leftPanel.signOut")}</div>
                    </button>
                </li>
            </ul>
            
            {render && (
                <div
                    className={[
                        styles.signout_dialog_background,
                        showSignOutDialog ? styles.signoutDialog_open_animation : styles.signoutDialog_close_animation
                    ].join(" ")}
                    onClick={() => setShowSignOutDialog(false)}
                >
                    <div
                        className={[
                            styles.signout_dialog,
                            showSignOutDialog ? styles.signoutDialog_open_animation : styles.signoutDialog_close_animation
                        ].join(" ")}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button 
                            className={styles.close_dialog_btn}
                            onClick={() => setShowSignOutDialog(false)}
                        >
                            <FontAwesomeIcon icon={faXmark} />
                        </button>
                        <h3>{t("leftPanel.dialogHeader")}</h3>
                        <div className={styles.signout_buttons_container}>
                            <button 
                                className={styles.dialog_cancel_btn} 
                                onClick={() => setShowSignOutDialog(false)}
                            >
                                {t("leftPanel.dialogCancel")}
                            </button>
                            <button 
                                className={styles.dialog_signout_btn} 
                                onClick={handleSignOut}
                            >
                                {t("leftPanel.dialogConfirm")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
