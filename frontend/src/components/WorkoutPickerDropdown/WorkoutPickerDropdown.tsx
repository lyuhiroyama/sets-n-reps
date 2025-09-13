import { useEffect, useRef } from "react";
import styles from "./WorkoutPickerDropdown.module.css";

type MesocycleLite = {
    id: number;
    name?: string;
    duration_weeks: number;
    workouts?: Workout[];
};

type Workout = {
    id: number;
    day_of_week?: string;
    performed_on?: string | null;
};

type Week = { label: string; sublabel: string; days: Day[] };
type Day = { label: string; workoutId?: number; state?: "default" | "active" | "completed" };

export default function WorkoutPickerDropdown({
    isOpen,
    onClose,
    mesocycle,
    onSelect,
}: {
    isOpen: boolean;
    onClose: () => void;
    mesocycle?: MesocycleLite;
    onSelect: (weekIndex: number, day: Day) => void;
}) {
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) return;
        const handleClickOutsideDropdown = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) onClose();
        };
        document.addEventListener("mousedown", handleClickOutsideDropdown);
        return () => {
            document.removeEventListener("mousedown", handleClickOutsideDropdown);
        }
    }, [isOpen, onClose])

    if (!isOpen || !mesocycle ) return null;

    const weeks = buildWeeksFromMesocycle(mesocycle);
    
    return (
        <div 
            className={styles.component}
            ref={dropdownRef}
        >

            <div className={styles.main_content_div}>
                {weeks.map((week, weekIdx) => (
                    <div className={styles.week_col} key={`week-${weekIdx}`}>
                        <div className={styles.header_cell} key={`headerCell-${weekIdx}`}>
                            <h3 className={styles.week_label}>{week.label}</h3>
                            <div >{week.sublabel}</div>
                        </div>
                        <div className={styles.btn_col} key={`weekCol-${weekIdx}`}>
                            {week.days.map((day, dayIdx) => (
                                <button 
                                    key={`dayBtn-${dayIdx}`}
                                    className={[
                                        styles.btn_day,
                                        day.state === "active" ? styles.btn_day_active : "",
                                        day.state === "completed" ? styles.btn_day_completed : ""
                                    ].join(" ")}
                                    onClick={() => onSelect(weekIdx, day)}
                                >
                                    {day.label}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

        </div>
    )
}

function buildWeeksFromMesocycle(meso: MesocycleLite): Week[] {
    const weekCount = meso.duration_weeks;
    const workouts = meso.workouts ?? [];

    let dayEntries = workouts.map((w, i) => ({
        label: w.day_of_week || `day ${i + 1}`,
        workoutId: w.id,
        completed: Boolean(w.performed_on),
        absoluteIndex: i // To track the first uncomplete workout encountered ('active' workout)
    }));

    let activeSet = false; // A flag to ensure only first uncompleted workout encountered is marked 'active'.

    function getRir(weekIndex: number, totalWeeks: number): string {
        if (weekIndex === totalWeeks - 1) return "DL";

        const startingRir = totalWeeks - 2; // Because: 4 weeks->2RIR, 5weeks->3RIR, and so on.
        const currentRir = startingRir - weekIndex;
        return `${currentRir} RIR`
    }

    return Array.from({ length: weekCount }, (_, weekIndex) => ({
        label: String(weekIndex + 1),
        sublabel: getRir(weekIndex, weekCount),
        days: dayEntries.map(d => {
            if (d.completed) return { ...d, state: "completed" };
            if (!d.completed && !activeSet) {
                activeSet = true;
                return { ...d, state: "active" };
            }
            return { ...d, state: "default" };
        })
    }));
}
