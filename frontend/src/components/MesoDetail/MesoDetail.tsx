import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import MesoDetailHeader from "../MesoHeader/MesoHeader";
import MesoWorkouts from "../MesoWorkouts/MesoWorkouts";
import MesoFooter from "../MesoFooter/MesoFooter";
import styles from "./MesoDetail.module.css";

type Mesocycle = {
    id: number;
    name: string;
    duration_weeks: number;
    workouts?: Workout[];
};

type Workout = {
    id: number;
    mesocycle_id: number;
    day_of_week: string;
    week_number: number;
    exercises?: Exercise[];
};

type Exercise = {
    id: number;
    name: string;
    notes?: string;
    exercise_sets?: ExerciseSet[];
};

type ExerciseSet = {
    id: number;
    set_number: number;
    weight: number | null;
    rir: number;
    rep_count: number | null;
    completed: boolean;
};

export default function MesoDetail() {
    // Preload data from location.state to reduce loading flash, if available.
    const location = useLocation();
    const initial = (location.state as Mesocycle | undefined) ?? null;
    const [mesocycle, setMesocycle] = useState<Mesocycle | null>(initial);

    const { id } = useParams();

    // To read query parameters, for when users select a specific workout of a meso:
    const searchParams = new URLSearchParams(location.search);
    const workoutId = searchParams.get("workout");
    // Find the selected workout or default to first one:
    const selectedWorkout =
        mesocycle?.workouts?.find((w) => w.id === Number(workoutId)) ??
        mesocycle?.workouts?.[0];

    const navigate = useNavigate();

    useEffect(() => {
        if (!id) return;
        const fetchMeso = async () => {
            const baseUrl = process.env.REACT_APP_API_BASE_URL;
            const res = await fetch(`${baseUrl}/api/mesocycles/${id}`, {
                credentials: "include",
                headers: { Accept: "application/json" },
            });
            if (res.ok) {
                const data = await res.json();
                setMesocycle(data);
            } else if (res.status === 401) {
                // if unauthorized
                navigate("/");
            }
        };
        fetchMeso();
    }, [id, location.search, navigate]);

    // Anytime a mesocycle is opened, active_meso_id gets set (This is for 'Current workout' page)
    useEffect(() => {
        if (!mesocycle?.id) return;
        const baseUrl = process.env.REACT_APP_API_BASE_URL;
        fetch(`${baseUrl}/api/user_preferences`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ user_preferences: { active_meso_id: mesocycle.id } })
        });
    }, [mesocycle?.id]);

    // Just to alter the top safe area on mobile portrait screens
    useEffect(() => {
        const themeColorMeta = document.querySelector('meta[name="theme-color"]');
        const originalColor = themeColorMeta?.getAttribute('content');
        
        themeColorMeta?.setAttribute('content', '#333333');  // Match MesoHeader .component background

        return () => {
            if (originalColor) {
                themeColorMeta?.setAttribute('content', originalColor);
            }
        };
    }, []);
    

    return (
        <div className={styles.component}>
            <MesoDetailHeader
                mesocycle={mesocycle ?? undefined}
                selectedWorkout={selectedWorkout}
            />
            {/* Pass the selected workout (or default to first)  */}
            <MesoWorkouts workout={selectedWorkout} />
            <MesoFooter workout={selectedWorkout}/>
        </div>
    );
}
