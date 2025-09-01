import { useState } from "react";
import styles from "./PlanAMesocycle.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faTrash } from "@fortawesome/free-solid-svg-icons"

export default function PlanAMesocycle() {
    const [days, setDays] = useState<number[]>([1, 2]);
    const [exercises, setExercises] = useState<string[][]>(Array(days.length).fill([]));
    const [showDialog, setShowDialog] = useState(false);

    const addDay = () => {
        if (days.length < 6) {
            setDays((prevDays) => [...prevDays, prevDays.length + 1]);
            setExercises((prevExercises) => [...prevExercises, []]);
        }
    };

    const addExercise = (dayIndex: number) => {
        setExercises((prevExercises) =>
            prevExercises.map((exerciseList, i) => 
                i === dayIndex && exerciseList.length < 5
                    ? [...exerciseList, ""]
                    : exerciseList
            )
        );
    };

    const handleDeleteDayCol = (index: number) => {
        setDays((prevDays) => prevDays.filter((_, i) => i !== index));
        setExercises((prevExercises) => prevExercises.filter((_, i) => i !== index));
    }

    const handleDeleteExercise = (dayIndex: number, exerciseIndex: number) => {
        setExercises((prevExercises) =>
            prevExercises.map((exerciseList, i) => 
                i === dayIndex
                    ? exerciseList.filter((_, j) => j !== exerciseIndex)
                    :exerciseList
            )
        );
    };

    const handleExerciseChange = (dayIndex: number, exerciseIndex: number, value: string) => {
        setExercises((prevExercises) =>
            prevExercises.map((exerciseList, i) =>
                i === dayIndex
                    ? exerciseList.map((exercise, j) =>
                        j === exerciseIndex ? value : exercise
                    )
                    : exerciseList
            )
        );
    };

    const handleCreateMesocycle = () => {
        setShowDialog(true);
    };

    const handleCloseDialog = () => {
        setShowDialog(false);
    };

    return (
        <div className={styles.component}>
            <div className={styles.top_container}>
                <h2>New meso plan</h2>
                <button onClick={handleCreateMesocycle}>Create mesocycle</button>
            </div>
            <div className={styles.main_container}>
                {days.map((_, index) => (
                    <div className={styles.day_column} key={index}>
                        <div className={styles.day_header}>
                            <div className={styles.dow_container}>
                                <select className={styles.dow_dropdown}>
                                    <option>Day of week (optional)</option>
                                    <option>Monday</option>
                                    <option>Tuesday</option>
                                    <option>Wednesday</option>
                                    <option>Thursday</option>
                                    <option>Friday</option>
                                    <option>Saturday</option>
                                    <option>Sunday</option>
                                </select>
                                <div className={styles.faAngleDown_container}>
                                    <FontAwesomeIcon icon={faAngleDown}/>
                                </div>
                            </div>
                            <button 
                                onClick={() => handleDeleteDayCol(index)}
                                className={styles.delete_btn}
                            >
                                <FontAwesomeIcon icon={faTrash} className={styles.faTrash_icon} />
                            </button>
                        </div>
                        {exercises[index].map((_, i) => (
                                <div key={`${index}-${i}`} className={styles.exercise_div}>
                                    <div className={styles.exercise_toprow}>
                                        <label>Exercise {i + 1}</label>
                                        <button onClick={() => handleDeleteExercise(index, i)} className={styles.delete_btn}>
                                            <FontAwesomeIcon icon={faTrash} className={styles.faTrash_icon} />
                                        </button>
                                    </div>
                                    <input
                                        value={exercises[index][i]}
                                        onChange={(e) => handleExerciseChange(index, i, e.target.value)}
                                        placeholder="Insert exercise"
                                        className={styles.exercise_input}
                                    />
                                </div>
                        ))}
                        {exercises[index].length < 5 && (
                            <button 
                            onClick={() => addExercise(index)}
                            className={styles.add_exercise_btn}
                            >
                                + Add exercise
                            </button>
                        )}
                    </div>
                ))}
                {days.length < 6 && (
                    <button
                    onClick={addDay}
                    className={styles.addDay_button}
                    >+ Add a day</button>
                )}
                
            </div>

            {/* Modal dialog */}
            {showDialog && (
                <div className={styles.dialog_background} onClick={handleCloseDialog}>
                    <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
                        <h2>Create mesocycle</h2>
                        <div className={styles.mesoname_div}>
                            <label>Mesocycle name</label>
                            <input></input>
                        </div>
                        <div className={styles.numweeks_div}>
                            <label>How many weeks will you train (including deload)?</label>
                            <div className={styles.numweeks_btn_div}>
                                <button>4</button>
                                <button>5</button>
                                <button>6</button>
                                <button>7</button>
                                <button>8</button>
                            </div>
                        </div>
                        <hr className={styles.modal_hr}/>
                        <div className={styles.dialog_bottom_div}>
                            <button onClick={handleCloseDialog} className={styles.cancel_btn}>Cancel</button>
                            <button className={styles.create_btn}>Create</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}