import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./PlanAMesocycle.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons"

export default function PlanAMesocycle() {
    const [days, setDays] = useState<number[]>([1, 2]);
    const [exercises, setExercises] = useState<string[][]>(
        Array.from({ length: days.length }, () => [])
    );      
    const [showDialog, setShowDialog] = useState(false);
    const [mesoName, setMesoName] = useState("");
    const [durationWeeks, setDurationWeeks] = useState<number | null>(null);
    const [daysOfWeek, setDaysOfWeek] = useState<string[]>(Array(days.length).fill(""));
    const navigate = useNavigate();
    

    const addDay = () => {
        if (days.length < 6) {
            setDays((prevDays) => [...prevDays, prevDays.length + 1]);
            setExercises((prevExercises) => [...prevExercises, []]);
            setDaysOfWeek(prev => [...prev, ""]);
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
        setDaysOfWeek(prev => prev.filter((_, i) => i !== index));
    }

    const handleDayOfWeekChange = (dayIndex: number, value: string) => {
        setDaysOfWeek(prev => prev.map((v,i) => (i === dayIndex ? value : v)));
    };

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

    const handleOpenDialog = () => {
        setShowDialog(true);
    };

    const handleCloseDialog = () => {
        setShowDialog(false);
    };

    const handleCreateMeso = async () => {
        if (
            !mesoName ||
            !durationWeeks ||
            !exercises.some(exList => exList.some(name => name.trim() !== "")) ||
            !daysOfWeek.every(d => d.trim() !== "")
        ) {
            alert("Please enter a mesocycle name, duration, at least one exercise, and a day of week for every day.");
            return;
        }

        // To determine rir with. Used in payload:
        function findRir(week: number, total: number) {
            if (week === total) return -1; // Store 'DL' as '-1' (rir col is integer)
            const startRir = Math.max(0, total - 2); // (e.g.) 4w meso -> start @2RIR
            
            // Decrement RIR by 1 each week, but never below 0:
            const decrementedRir = startRir - (week - 1);
            const rir = Math.max(0, decrementedRir);
            return rir;
        }

        const payload = {
            mesocycle: {
                name: mesoName,
                duration_weeks: durationWeeks,
                workouts_attributes: Array.from({ length: durationWeeks }, (_, weekIndex) =>
                    days.map((_, dayIndex) => ({
                        day_of_week: daysOfWeek[dayIndex] || null,
                        week_number: weekIndex + 1,
                        exercises_attributes: (exercises[dayIndex] || [])
                            .filter(name => name.trim().length > 0)
                            .map(name => ({
                                name,
                                exercise_sets_attributes: Array.from({ length: 5 }, (_, setIndex) => ({
                                    set_number: setIndex + 1,
                                    rir: findRir(weekIndex + 1, durationWeeks)
                                }))
                            }))
                    }))
                ).flat()
            }
        };
        const baseUrl = process.env.REACT_APP_API_BASE_URL;
        const response = await fetch(`${baseUrl}/api/mesocycles`, {
            method: "POST",
            headers: {"Content-Type": "application/json", "Accept": "application/json"},
            credentials: "include",
            body: JSON.stringify(payload)
        });
        if (response.ok) {
            const created = await response.json();
            setShowDialog(false);
            navigate(`/dashboard/mesocycles/${created.id}`, { state: created })
        } else {
            const err = await response.json().catch(() => ({}));
            console.error(err);
        }

    };

    return (
        <div className={styles.component}>
            <div className={styles.top_container}>
                <h2>New meso plan</h2>
                <button onClick={handleOpenDialog}>+ Create mesocycle</button>
            </div>
            <div className={styles.main_container}>
                {days.map((_, index) => (
                    <div className={styles.day_column} key={index}>
                        <div className={styles.day_header}>
                            <div className={styles.dow_container}>
                                <select 
                                    className={styles.dow_dropdown}
                                    value={daysOfWeek[index] || ""}
                                    onChange={(e) => handleDayOfWeekChange(index, e.target.value)}
                                >
                                    <option value="" disabled selected>Day of week</option>
                                    <option value="Monday">Monday</option>
                                    <option value="Tuesday">Tuesday</option>
                                    <option value="Wednesday">Wednesday</option>
                                    <option value="Thursday">Thursday</option>
                                    <option value="Friday">Friday</option>
                                    <option value="Saturday">Saturday</option>
                                    <option value="Sunday">Sunday</option>
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
                                        required
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
                        <button 
                            className={styles.close_dialog_btn}
                            onClick={handleCloseDialog}
                        >
                            <FontAwesomeIcon icon={faXmark} />
                        </button>
                        <h2>Create mesocycle</h2>
                        <div className={styles.mesoname_div}>
                            <label>Mesocycle name</label>
                            <input
                                value={mesoName}
                                onChange={(e) => setMesoName(e.target.value)}
                                required
                            />
                        </div>
                        <div className={styles.numweeks_div}>
                            <label>How many weeks will you train (including deload) ?</label>
                            <div className={styles.numweeks_btn_div}>
                                {[4,5,6,7,8].map(w => (
                                    <button
                                        type="button"
                                        key={w}
                                        onClick={() => setDurationWeeks(w)}
                                        className={durationWeeks === w ? styles.numweeks_btn_selected : ""}
                                    >
                                    {w}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <hr className={styles.modal_hr}/>
                        <div className={styles.dialog_bottom_div}>
                            <button onClick={handleCloseDialog} className={styles.cancel_btn}>Cancel</button>
                            <button onClick={handleCreateMeso} className={styles.create_btn}>Create</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}