import { useState } from "react";
import { useNavigate } from "react-router-dom";
import WorkoutPickerDropdown from "../WorkoutPickerDropdown/WorkoutPickerDropdown"
import styles from "./MesoHeader.module.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays } from "@fortawesome/free-regular-svg-icons";
import { faGear } from "@fortawesome/free-solid-svg-icons";

type MesocycleLite = {
    id: number;
    name?: string;
    duration_weeks: number;
    workouts?: WorkoutLite[]
}

type WorkoutLite = {
    id: number;
    day_of_week?: string
    performed_on?: string | null;
}

export default function MesoHeader({ mesocycle }: { mesocycle?: MesocycleLite }) {
    const mesoName = mesocycle?.name ?? "Mesocycle";
    const dayOfWeek = mesocycle?.workouts?.[0]?.day_of_week
            ? `Week 1・${mesocycle.workouts[0].day_of_week}`
            : "Week 1";
    
            const [isOpen, setIsOpen] = useState(false);
            const navigate = useNavigate();

    return (
        <div className={styles.component}>
            <div className={styles.div_texts}>
                <span>{mesoName}</span>
                <h3>{dayOfWeek}</h3>
            </div>
            <div className={styles.div_icons}>
                <FontAwesomeIcon icon={faCalendarDays} className={styles.icon} onClick={() => setIsOpen(o => !o)} />
                <WorkoutPickerDropdown 
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    mesocycle={mesocycle}
                    onSelect={(weekIndex, dayIndex, day) => {
                        if (mesocycle?.id) navigate(`/dashboard/mesocycles/${mesocycle.id}`);
                        setIsOpen(false);
                    }}
                />
                <FontAwesomeIcon icon={faGear} className={styles.icon} />
            </div>
        </div>
    )
}