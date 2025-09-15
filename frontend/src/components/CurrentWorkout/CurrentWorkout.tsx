import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CurrentWorkout.module.css";

export default function CurrentWorkout() {
    const navigate = useNavigate();
    const [activeMesoId, setActiveMesoId] = useState<number | null>(null);

    useEffect(() => {
        const baseUrl = process.env.REACT_APP_API_BASE_URL;
        // 'user/check-auth' -> verifies session & returns 'active_meso_id' if verified.
            // If user is signed in: 
            // { "isAuthenticated": true, "user": { "id": 1, "email": "x@y.com", "active_meso_id": 12, "...": "..." } }
            // If user is not signed in:
            // { "isAuthenticated" false } 
        const load = async () => {
            const res = await fetch(`${baseUrl}/users/check-auth`, { 
                credentials: "include",
                headers: { Accept: "application/json" }
            });
            if (!res.ok) {
                if (res.status === 401) navigate("/");
                setActiveMesoId(null);
                return;
            }
            const data = await res.json();
            setActiveMesoId(data?.user?.active_meso_id ?? null);
        };
        load();
    }, [navigate]);

    // Memo: useCallback doesn't run on component render:
    const goToCurrent = async () => {
        if (!activeMesoId) return;
        const baseUrl = process.env.REACT_APP_API_BASE_URL;
        const mesoRes = await fetch(`${baseUrl}/api/mesocycles/${activeMesoId}`, {
            credentials: "include",
            headers: { Accept: "application/json" }
        });
        if (!mesoRes.ok) return;
        const meso = await mesoRes.json();
        const workouts = meso.workouts ?? [];
        if (!workouts.length) {
            navigate("/dashboard/plan-a-mesocycle");
            return;
        }

        // Find next uncompleted workout, then redirect user there:

        // // Helper function: Index days of week to compare workouts against eachother
        const dayOrder = ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"];
        const orderHelper = (day?: string) => {
            const i = dayOrder.indexOf((day || "").toLowerCase());
            return i === -1 ? 7 : i;
        };
        const uncompletedWorkout = [...workouts]
            .filter((w: any) => !w.performed_on)
            .sort((a: any, b: any) =>
            (a.week_number || 0) - (b.week_number || 0) ||
            orderHelper(a.day_of_week) - orderHelper(b.day_of_week) ||
            a.id - b.id
            )[0] || workouts[workouts.length - 1];
        const week = uncompletedWorkout.week_number ?? 1;
        navigate(`/dashboard/mesocycles/${meso.id}?workout=${uncompletedWorkout.id}&week=${week}`);
    }


    const handlePlanMesoClick = () => {
        navigate("/dashboard/plan-a-mesocycle");
    };

    return activeMesoId ? (
        <div className={styles.component}>
            <h2>Go to current workout</h2>
            <button onClick={goToCurrent}>Current Workout</button>
        </div>
    ) : (
        <div className={styles.component}>
            <h2>You have no workouts yet</h2>
            <button onClick={handlePlanMesoClick}>+ Plan a mesocycle</button>
        </div>
    );
}
