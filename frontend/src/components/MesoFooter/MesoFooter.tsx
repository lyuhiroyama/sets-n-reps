import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import styles from "./MesoFooter.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

type WorkoutLite = {
    id: number;
    performed_on?: string | null;
}

export default function MesoFooter({ workout } : { workout?: WorkoutLite } ) {
    const [showConfirm, setShowConfirm] = useState(false);
    const [render, setRender] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        if (showConfirm) { setRender(true); return; }
        if (render) {
            const t = window.setTimeout(() => setRender(false), 150); // 150ms
            return () => window.clearTimeout(t);
        }
    }, [showConfirm, render]);

    const openConfirm = () => {
        if (!workout || workout.performed_on) return;
        setShowConfirm(true);
    };

    const handleFinish = async () => {
        if (!workout) return;
        try {
            // Could be simplified with external date libraries, but this avoids extra dependencies:
            const today = new Date();
            const yyyy = today.getFullYear();
            const mm = String(today.getMonth() + 1).padStart(2, "0");
            const dd = String(today.getDate()).padStart(2, "0");
            const performedOn = `${yyyy}-${mm}-${dd}`;

            const baseUrl = process.env.REACT_APP_API_BASE_URL;
            const res = await fetch(`${baseUrl}/api/workouts/${workout.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    workout: { performed_on: performedOn }
                })
            });
            if (res.ok) {
                window.location.reload(); 
            }
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <div className={styles.component}>
            <button 
                className={styles.finish_button}
                onClick={openConfirm}
                disabled={!!workout?.performed_on || !workout}
            >
                {t("mesoFooter.finishWorkout")}
            </button>

            {render && (
                <div
                    className={[
                        styles.dialog_background,
                        showConfirm ? styles.dialog_open_animation : styles.dialog_close_animation
                    ].join(" ")}
                    onClick={() => setShowConfirm(false)}
                >
                    <div
                        className={[
                            styles.dialog,
                            showConfirm ? styles.dialog_open_animation : styles.dialog_close_animation
                        ].join(" ")}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button 
                            className={styles.close_dialog_btn}
                            onClick={() => setShowConfirm(false)}
                        >
                            <FontAwesomeIcon icon={faXmark} />
                        </button>
                        <h4>{t("mesoFooter.dialogHeader")}</h4>
                        <div className={styles.dialog_buttons_container}>
                            <button 
                                onClick={() => setShowConfirm(false)} 
                                className={styles.dialog_cancel_btn}
                            >
                                {t("mesoFooter.dialogCancel")}
                            </button>
                            <button 
                                onClick={handleFinish} 
                                className={styles.dialog_confirm_btn}
                            >
                                {t("mesoFooter.dialogComplete")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}