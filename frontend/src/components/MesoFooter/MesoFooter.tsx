import styles from "./MesoFooter.module.css";

type WorkoutLite = {
    id: number;
    performed_on?: string | null;
}

export default function MesoFooter({ workout } : { workout?: WorkoutLite } ) {
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
                onClick={handleFinish}
                disabled={!!workout?.performed_on || !workout}
            >
                Finish Workout
            </button>
        </div>
    )
}