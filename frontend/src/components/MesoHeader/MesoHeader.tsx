import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import WorkoutPickerDropdown from "../WorkoutPickerDropdown/WorkoutPickerDropdown"
import styles from "./MesoHeader.module.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays } from "@fortawesome/free-regular-svg-icons";
// import { faGear } from "@fortawesome/free-solid-svg-icons";

type MesocycleLite = {
    id: number;
    name?: string;
    duration_weeks: number;
    workouts?: WorkoutLite[]
}

type WorkoutLite = {
    id: number;
    day_of_week: string
    performed_on?: string | null;
    week_number: number;
}

export default function MesoHeader({ 
    mesocycle, 
    selectedWorkout 
}: { 
    mesocycle?: MesocycleLite;
    selectedWorkout?: WorkoutLite;
 }) {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const weekNumber = searchParams.get('week') ?? "1";

    const mesoName = mesocycle?.name;
    const dayOfWeek = (selectedWorkout?.day_of_week) ? (`Week ${weekNumber}・${selectedWorkout.day_of_week}`) : ("");

    // To apply red bottom-border to 'current' workout: Determine if opened workout is the first 'uncompleted' within meso
    const dayOrder = ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"];
    const orderHelper = (day?: string) => {
      const i = dayOrder.indexOf((day || "").toLowerCase());
      return i === -1 ? 7 : i;
    };

    const firstUncompletedWorkoutId = (mesocycle?.workouts
      ? [...mesocycle.workouts]
           .sort((a, b) =>
            (a.week_number || 0) - (b.week_number || 0) ||
            orderHelper(a.day_of_week) - orderHelper(b.day_of_week) ||
            a.id - b.id
      )
      .find(w => !w.performed_on)?.id
      : undefined
    );

    const isFirstUncompletedWorkoutOpen = (selectedWorkout?.id === firstUncompletedWorkoutId) && !selectedWorkout?.performed_on;

    // Don't display MesoHeader component until mesocycle name is retrieved
    if (!mesocycle) {
        return (
            <div></div>
        );
    }

    return (
        <div className={`
            ${styles.component}
            ${selectedWorkout?.performed_on ? styles.status_complete : ""}
	    ${isFirstUncompletedWorkoutOpen ? styles.status_current : ""}
        `}>
            <div className={styles.div_texts}>
                <span>{mesoName}</span>
                <h3>{dayOfWeek}</h3>
            </div>
            <div className={styles.div_icons}>
                <FontAwesomeIcon 
                    icon={faCalendarDays} 
                    className={styles.icon} 
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsOpen(o => !o)
                    }}
                />
                {/* <FontAwesomeIcon 
                    icon={faGear} 
                    className={styles.icon} 
                /> */}
            </div>
            <WorkoutPickerDropdown 
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    mesocycle={mesocycle}
                    onSelect={(weekIdx, day) => {
                        if (mesocycle?.id) navigate(
                            `/dashboard/mesocycles/${mesocycle.id}?workout=${day.workoutId}&week=${weekIdx + 1}`
                        );
                        setIsOpen(false);
                    }}
                    currentlyOpenWorkoutId={selectedWorkout?.id}
                    currentWeekIdx={Number(weekNumber)}
            />
        </div>
    )
}
