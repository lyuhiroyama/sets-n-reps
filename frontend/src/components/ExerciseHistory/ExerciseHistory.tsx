import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ExerciseHistory.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

type Mesocycle = {
    id: number;
    name: string;
    created_at: string;
    workouts: Workout[]
};

type Workout = {
    id: number;
    performed_on: string | null;
    week_number: number;
    exercises: Exercise[]
}

type Exercise = {
    name: string;
    exercise_sets: ExerciseSet[];
}

type ExerciseSet = {
    weight: number | null;
    rep_count: number | null
    set_number: number;
    completed: boolean;
}

export default function ExerciseHistory({
    isHistoryOpen,
    onHistoryClose,
    exerciseName
}: {
    isHistoryOpen: boolean;
    onHistoryClose: () => void;
    exerciseName: string;
}) {
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    // Store fetched mesos:
    const [mesos, setMesos] = useState<Mesocycle[] | undefined>(undefined);
    // Mainly for closing animation: apply closing class and delay DOM unmount so animation can run
    const [render, setRender] = useState(isHistoryOpen);

    // Fetch user's mesos
    useEffect(() => {
        const baseUrl = process.env.REACT_APP_API_BASE_URL;
        const fetchMesos = async () => {
            const response = await fetch(`${baseUrl}/api/mesocycles?exercise=${encodeURIComponent(exerciseName)}`, {
                credentials: "include",
                headers: { Accept: "application/json" },
            });

            if (response.ok) {
                const data = await response.json();
                setMesos(data);
            } else if (response.status === 401) {
                // if unauthorized
                navigate("/");
            }
        };
        fetchMesos();
    }, [navigate, exerciseName]);

    // Handle dialog mount/unmount timing for animations
    useEffect(() => {
        if (isHistoryOpen) {
            setRender(true);
            return;
        }
        if (render) {
            const t = window.setTimeout(() => {
                setRender(false);
            }, 150); // match CSS opening & closing animation
            return () => window.clearTimeout(t);
        }
    }, [isHistoryOpen, render]);

    // Closes dialog when clicking outside
    useEffect(() => {
        if (!render) return;
        const handleClickOutsideDropdown = (e: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target as Node)
            )
                onHistoryClose();
        };
        document.addEventListener("click", handleClickOutsideDropdown);
        return () => {
            document.removeEventListener("click", handleClickOutsideDropdown);
        };
    }, [render, onHistoryClose]);

    if (!render) return null;

    return (
        <div
            className={[
                styles.dialog_background,
                isHistoryOpen
                    ? styles.background_darkHue_animation
                    : styles.background_noHue_animation,
            ].join(" ")}
            onClick={onHistoryClose}
        >
            <div
                className={[
                    styles.dialog,
                    isHistoryOpen
                        ? styles.dialog_open_animation
                        : styles.dialog_close_animation,
                ].join(" ")}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className={styles.close_dialog_btn}
                    onClick={onHistoryClose}
                >
                    <FontAwesomeIcon icon={faXmark} />
                </button>
                <div className={styles.header_section}>
                    <div>Exercise history</div>
                    <h3>{exerciseName}</h3>
                </div>
                <div className={styles.mesos_container}>
                    {mesos?.map((mesoObj) => {

                        // Check if iterator meso has any data to display. Skip otherwise.
                        const hasValidData = mesoObj.workouts
                            .filter(workout => workout.performed_on !== null)
                            .some(workout => {
                                const validExercise = workout.exercises.find(e => e.name === exerciseName)
                                if (!validExercise?.exercise_sets?.length) return false;
                                return validExercise.exercise_sets.some(set =>
                                    set.weight !== null && set.rep_count !== null && set.completed === true
                                );
                            });
                        if (!hasValidData) return null;

                        return (
                            <div key={mesoObj.id} className={styles.ul_container}>
                                <ul>{mesoObj.name}</ul>
                                {mesoObj.workouts
                                    .filter(workout => workout.performed_on !== null)
                                    .map(workout => {
                                        // Find target exercise within workout
                                        const validExercise = workout.exercises.find(e => e.name === exerciseName);
                                        if (!validExercise?.exercise_sets?.length) return null;

                                        // Filter Exercises with invalid sets
                                        const validSets = validExercise.exercise_sets.filter(set =>
                                            set.weight !== null && set.rep_count !== null && set.completed === true
                                        );
                                        if (!validSets.length) return null;
                                    


                                        /* Group sets by weight: 
                                        {
                                            "27.5": [exercise_set, exercise_set, exercise_set],
                                            "25" : [exercise_set, exercise_set]
                                        }
                                        */
                                        const exercise_setsByWeight: Record<string, ExerciseSet[]> = {};
                                        validSets.forEach(exercise_set => {
                                            const weight = exercise_set.weight?.toString() || "null";
                                            if (!exercise_setsByWeight[weight]) {
                                                exercise_setsByWeight[weight] = [];
                                            }
                                            exercise_setsByWeight[weight].push(exercise_set);
                                        })

                                        // Create <li> to render:
                                        const displayText = Object.entries(exercise_setsByWeight)
                                            .map(([weight, exercise_sets]) => {
                                                const displayReps = exercise_sets
                                                    .sort((a, b) => a.set_number - b.set_number)
                                                    .map(exercise_set => exercise_set.rep_count)
                                                    .join(", ");

                                                // Remove .0 if whole number. Keep one decimal if otherwise.
                                                const formattedWeight = (() => {
                                                    const num = parseFloat(weight);
                                                    return num % 1 === 0 ? Math.floor(num) : num.toFixed(1);
                                                })();

                                                return `${formattedWeight} ᵏᵍ × ${displayReps}`;
                                            })
                                                .join(" / ");
                                            return <li key ={workout.id}>{displayText}</li>
                                    })
                                }
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}
