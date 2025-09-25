import { useState, useEffect, useCallback, useRef } from "react";
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
    const [exerciseSets, setExerciseSets] = useState<Record<string, ExerciseSet>>({});
    // -> (e.g.) {"1-1": { weight: 50, rep_count: 10 }}

    // Feature to save in sets. Prevents dropped updates when user rapidly inputs
    // Replaced previous setup: Single shared debounced (which caused "last call wins" situations)
    const pendingRef = useRef<Record<string, Partial<ExerciseSet>>>({});
    const debouncersRef = useRef<Record<string, ReturnType<typeof debounce>>>({});

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
            setExerciseSets(initialSets);
        }
    }, [workout]);

    // Memo:
    // You're using useCallback to ensure the debounced function keeps the same reference across renders, so that the debounce timer works correctly.
    // Intentionally ignoring warning for debounced function (exhaustive-deps) because ESLint can't track dependencies through debounce.
    const saveSetData = useCallback(
        (exerciseId: number, setNumber: number, data: Partial<ExerciseSet>) => {
            const setKey = `${exerciseId}-${setNumber}`;

            // merge pending changes
            pendingRef.current[setKey] = {
                ...pendingRef.current[setKey],
                ...data
            };

            if (!debouncersRef.current[setKey]) {
                debouncersRef.current[setKey] = debounce(async () => {
                    const payload = pendingRef.current[setKey];
                    delete pendingRef.current[setKey];

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
                                    ...payload,
                                    set_number: setNumber 
                                }
                            })
                        });
                        if (!response.ok) { console.error("Failed to save workout data") }
                    } catch (error) {
                        console.error("Error saving workout data: ", error);
                    }
                }, 500) // 500ms debounce
            }
            debouncersRef.current[setKey]();
        }, [workout?.mesocycle_id, workout?.id]
    );

    // Cleanup debouncers & Clear pending's when workout changes/unmounts
    useEffect(() => {
        return () => {
            Object.values(debouncersRef.current).forEach(d => d.cancel());
            debouncersRef.current = {};
            pendingRef.current = {};
        };
    }, [workout?.mesocycle_id, workout?.id]);

    // Handle input & checkbox updates
    const handleSetChange = (
        exerciseId: number,
        setNumber: number,
        field: keyof ExerciseSet,
        value: number | boolean | null
    ) => {
        // For weight updates (Overwrite subsequent sets' numbers):
        if (field === "weight" && value != null) {
            const subsequentSets = Array.from({ length: 5 - setNumber + 1},(_, i) => setNumber + i);

            subsequentSets.forEach(subsequentSetNum => {
                const subsequentSetKey = `${exerciseId}-${subsequentSetNum}`;

                setExerciseSets(prev => ({
                    ...prev,
                    [subsequentSetKey]: {
                        ...prev[subsequentSetKey],
                        weight: value as number
                    }
                }));
                saveSetData(exerciseId, subsequentSetNum, { weight: value as number });
            });
        }
        // For reps/checkbox updates: 
        else { 
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
        }
    };

    if (!workout) {
        return (
            <div className={styles.spinner_container}>
                <div className={styles.spinner}/>
            </div>
        );
    }

    return (
        <div className={styles.component}>
            <ul className={styles.exercises_ul}>
                {workout.exercises?.map((exr) => (
                    <li className={styles.exercises_li} key={exr.id}>
                        <div className={styles.exercise_name}>{exr.name}</div>
                        <table className={styles.sets_table}>
                            <thead>
                                <tr>
                                    <th className={styles.th_input}>Weight</th>
                                    <th className={styles.th_input}>Reps</th>
                                    <th className={styles.th_checkbox}>Log</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.from({ length: 5 }, (_, si) => {
                                    const setNumber = si + 1;
                                    const setKey = `${exr.id}-${setNumber}`;
                                    const setData = exerciseSets[setKey] || {
                                        weight: null,
                                        rep_count: null,
                                        completed: false
                                        
                                    };
                                    
                                    return (
                                        <tr key={setKey}>
                                            <td className={styles.td_input}>
                                                <input 
                                                    type="number"
                                                    inputMode="decimal"
						                            step="0.1"
                                                    placeholder="kg"
                                                    value={setData.weight ?? ""}
                                                    onChange={(e) => handleSetChange(
                                                        exr.id,
                                                        setNumber,
                                                        "weight",
                                                        e.target.value ? Number(e.target.value) : null
                                                    )}
                                                />
                                            </td>
                                            <td className={styles.td_input}>
                                                <input 
                                                    type="number"
                                                    inputMode="decimal"
						                            step="0.1"
                                                    placeholder={
                                                        setData.rir === -1
                                                        ? "DL"
                                                        : (setData.rir != null ? `${setData.rir} RIR` : "")
                                                    }
                                                    value={setData.rep_count ?? ""}
                                                    onChange={(e) => handleSetChange(
                                                        exr.id,
                                                        setNumber,
                                                        "rep_count",
                                                        e.target.value ? Number(e.target.value) : null
                                                    )}
                                                />
                                            </td>
                                            <td className={styles.td_checkbox}>
                                                <div className={styles.checkbox_wrapper}>
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
                                                </div>
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
