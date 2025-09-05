import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import MesoDetailHeader from "../MesoHeader/MesoHeader";
import styles from "./MesoDetail.module.css";

type Mesocycle = {
    id: number;
    name: string;
    duration_weeks: number;
    workouts?: Workout[];
}

type Workout = {
    id: number;
    day_of_week?: string;
    exercise_sets?: Exercise[];
}

type Exercise = {
    id: number;
    name: string;
    notes?: string;
    exercise_sets?: ExerciseSet[];
}

type ExerciseSet = {
    id: number;
    set_number: number;
    weight: number;
    rir: number;
    rep_count: number;
}

export default function MesoDetail() {
    // Preload data from location.state to reduce loading flash, if available.
    const location = useLocation();
    const initial = (location.state as Mesocycle | undefined) ?? null; 
    const [mesocycle, setMesocycle] = useState<Mesocycle | null>(initial);

    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if(!id) return;
        const fetchMeso = async () => {
            const baseUrl = process.env.REACT_APP_API_BASE_URL;
            const res = await fetch(`${baseUrl}/api/mesocycles/${id}`, {
                credentials: "include",
                headers: { Accept: "application/json" }
            });
            if (res.ok) {
                const data = await res.json();
                setMesocycle(data);
            } else if (res.status === 401) { // if unauthorized
                navigate("/");
            }
        }
        fetchMeso();
    }, [id, navigate])

    return (
        <div className={styles.component}>
            <MesoDetailHeader mesocycle={mesocycle ?? undefined} />
            {/* <Meso> */}
        </div>
    )
}