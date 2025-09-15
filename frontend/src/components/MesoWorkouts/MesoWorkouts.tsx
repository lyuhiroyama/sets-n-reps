import { useState, useEffect, useCallback } from "react";
import debounce from "lodash/debounce";
import styles from "./MesoWorkouts.module.css";

type WorkoutLite = {
    id: number;
    mesocycle_id: number;
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

export default function MesoWorkouts({ workout }: { workout?: WorkoutLite }) {
    const [sets, setSets] = useState<number>(5);
    const [exerciseSets, setExerciseSets] = useState<Record<string, ExerciseSet>>({});
    // -> (e.g.) {"1-1": { weight: 50, rep_count: 10 }}

    // Load existing workout data
    useEffect(() => {
        if (workout?.exercises) {
            const initialSets: Record<string, ExerciseSet> = {};
            workout.exercises.forEach(exercise => {
                exercise.exercise_sets?.forEach(set => {
                    const setKey = `${exercise.id}-${set.set_number}`;
                    const normalizedSet : ExerciseSet = {
                        ...set,
                        weight: set.weight == null ? null : Number(set.weight)
                    }
                    initialSets[setKey] = normalizedSet;
                });
            });
            console.log(initialSets)
            setExerciseSets(initialSets);
        }
    }, [workout]);

    // Memo:
    // You're using useCallback to ensure the debounced function keeps the same reference across renders, so that the debounce timer works correctly.
    // Intentionally ignoring warning for debounced function (exhaustive-deps) because ESLint can't track dependencies through debounce.
    const debouncedSave = useCallback(
        debounce(async (exerciseId: number, setNumber: number, data: Partial<ExerciseSet>) => {
            try {
                const baseUrl = process.env.REACT_APP_API_BASE_URL;
                const response = await fetch(
                        `${baseUrl}/api/mesocycles/${workout?.mesocycle_id}/workouts/${workout?.id}/exercises/${exerciseId}/exercise_sets/${setNumber}`
                    , {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({ 
                        exercise_set: {
                            ...data,
                            set_number: setNumber 
                        }
                    }),
                });

                if (!response.ok) {
                    console.error("Failed to save workout set data");
                }
            } catch (error) {
                console.error("Error saving workout set data: ", error);
            }
        }, 500),
        [workout?.mesocycle_id, workout?.id]
    );

    const saveSetData = (exerciseId: number, setNumber: number, data: Partial<ExerciseSet>) => {
        debouncedSave(exerciseId, setNumber, data);
    };

    // Handle input & checkbox changes
    const handleSetChange = (
        exerciseId: number,
        setNumber: number,
        field: keyof ExerciseSet,
        value: number | boolean | null
    ) => {
        const setKey = `${exerciseId}-${setNumber}`;
        const updatedSet = {
            // Overwrite sets data (updatedSet) with 'property overwrite' (look it up)
            ...exerciseSets[setKey],
            [field]: value,
        };
        setExerciseSets(prev => ({
            ...prev,
            [setKey]: updatedSet
        }));
        saveSetData(exerciseId, setNumber, { [field]: value });
    };

    if (!workout) return null;

    return (
        <div className={styles.component}>
            <ul className={styles.exercises_ul}>
                {workout.exercises?.map((exr) => (
                    <li className={styles.exercises_li} key={exr.id}>
                        <div className={styles.exercise_name}>{exr.name}</div>
                        <table className={styles.sets_table}>
                            <thead>
                                <tr>
                                    <th>Weight</th>
                                    <th>Reps</th>
                                    <th>Log</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.from({ length: sets }, (_, si) => {
                                    const setNumber = si + 1;
                                    const setKey = `${exr.id}-${setNumber}`;
                                    const setData = exerciseSets[setKey] || {
                                        weight: null,
                                        rep_count: null,
                                        completed: false
                                        
                                    };
                                    
                                    return (
                                        <tr key={setKey}>
                                            <td>
                                                <input 
                                                    type="number"
                                                    placeholder="kg"
                                                    value={setData.weight || ""}
                                                    onChange={(e) => handleSetChange(
                                                        exr.id,
                                                        setNumber,
                                                        "weight",
                                                        e.target.value ? Number(e.target.value) : null
                                                    )}
                                                />
                                            </td>
                                            <td>
                                                <input 
                                                    type="number"
                                                    placeholder={
                                                        setData.rir === -1
                                                        ? "DL"
                                                        : (setData.rir != null ? `${setData.rir} RIR` : "N/A")
                                                    }
                                                    value={setData.rep_count || ""}
                                                    onChange={(e) => handleSetChange(
                                                        exr.id,
                                                        setNumber,
                                                        "rep_count",
                                                        e.target.value ? Number(e.target.value) : null
                                                    )}
                                                />
                                            </td>
                                            <td>
                                                <input 
                                                    type="checkbox" 
                                                    checked={setData.completed ?? false}
                                                    onChange={(e) => handleSetChange(
                                                        exr.id,
                                                        setNumber,
                                                        "completed",
                                                        e.target.checked
                                                    )}
                                                />
                                            </td>
                                        </tr>
                                )})}
                            </tbody>
                        </table>
                    </li>
                ))}
            </ul>
        </div>
    );
}
