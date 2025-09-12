import { useState } from "react";
import debounce from "lodash/debounce"
import styles from "./MesoWorkouts.module.css";

type WorkoutLite = {
    id: number;
    exercises?: Exercise[];
}

type Exercise = {
    id: number;
    name: string;
    notes?: string;
}

export default function MesoWorkouts({ workout }: { workout?: WorkoutLite }) {
    const [sets, setSets] = useState<number>(5);
    
    if (!workout) return null;

    return (
        <div className={styles.component}>
            <ul className={styles.exercises_ul}>
                {workout.exercises?.map(exr => (
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
                                {Array.from({ length: sets}, (_, s) => (
                                    <tr key={`${exr.id}-set${s}`}>
                                        <td><input type="number"/></td>
                                        <td><input type="number"/></td>
                                        <td><input type="checkbox"/></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </li>
                ))}
            </ul>
        </div>
    )
}