import { useState, useEffect, useCallback } from "react";
import ExerciseHistory from "../ExerciseHistory/ExerciseHistory";
import styles from "./MesoWorkouts.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";

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

    // For loading spinner after user inputs:
    const [savingSetKeys, setSavingSetKeys] = useState<Set<string>>(new Set());
    // For exercise history dialog:
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    // To pass to ExerciseHistory.tsx
    const [exerciseName, setExerciseName] = useState<string>("");


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

    const saveSetData = useCallback(
        async (exerciseId: number, setNumber: number, data: Partial<ExerciseSet>) => {
            const setKey = `${exerciseId}-${setNumber}`;

                // For input loading spinner:
                setSavingSetKeys(prev => new Set(prev).add(setKey));
                // To ensure minimum spinning time (500ms)
                const spinnerStart = Date.now();

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
                        })
                    });
                    if (!response.ok) { console.error("Failed to save workout data") }
                } catch (error) {
                    console.error("Error saving workout data: ", error);
                } finally {
                    // Ensure spinner display for at least 500ms
                    const elapsed = Date.now() - spinnerStart;
                    const remainingTime = Math.max(0, 500 - elapsed);

                    // Remmove loading spinner after save attempt
                    setTimeout(() => {
                        setSavingSetKeys(prev => {
                            const next = new Set(prev);
                            next.delete(setKey);
                            return next;
                        });
                    }, remainingTime);
                    
                }
        }, [workout?.mesocycle_id, workout?.id]
    );

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

    // Loading spinner
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
                        <div className={styles.exercises_header_container}>
                            <div className={styles.exercise_name}>{exr.name}</div>
                            <FontAwesomeIcon 
                                icon={faCircleInfo}
                                className={styles.history_icon} 
                                onClick={() => {
                                    setExerciseName(exr.name)
                                    setIsHistoryOpen(o => !o)
                                }}
                            />
                        </div>
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
                                                    // To update input visual display:
                                                    onChange={(e) => {
                                                        const value = e.target.value ? Number(e.target.value) : null;
                                                        const setKey = `${exr.id}-${setNumber}`;
                                                        setExerciseSets(prev => ({
                                                            ...prev,
                                                            [setKey]: {
                                                                ...prev[setKey],
                                                                weight: value
                                                            }
                                                        }));
                                                    }} 
                                                    // Save updates when input loses focus:
                                                    onBlur={(e)=> { 
                                                        const value = e.target.value ? Number(e.target.value) : null;
                                                        handleSetChange(exr.id, setNumber, "weight", value);
                                                    }}
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
                                                    // To update input visual display:
                                                    onChange={(e) => {
                                                        const value = e.target.value ? Number(e.target.value) : null;
                                                        const setKey = `${exr.id}-${setNumber}`;
                                                        setExerciseSets(prev => ({
                                                            ...prev,
                                                            [setKey]: {
                                                                ...prev[setKey],
                                                                rep_count: value
                                                            }
                                                        }));
                                                    }} 
                                                    // Save updates when input loses focus:
                                                    onBlur={(e)=> { 
                                                        const value = e.target.value ? Number(e.target.value) : null;
                                                        handleSetChange(exr.id, setNumber, "rep_count", value);
                                                    }}
                                                />
                                            </td>
                                            <td className={styles.td_checkbox}>
                                                {savingSetKeys.has(setKey) && (
                                                    <div className={styles.spinner_small}></div>
                                                )}
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

            {/* Exercise history dialog */}
            <ExerciseHistory 
                isHistoryOpen={isHistoryOpen}
                onHistoryClose={() => setIsHistoryOpen(false)}
                exerciseName={exerciseName}
            />
        </div>
    );
}
