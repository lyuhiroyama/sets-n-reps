import styles from "./MesoHeader.module.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays } from "@fortawesome/free-regular-svg-icons";
import { faGear } from "@fortawesome/free-solid-svg-icons";

type MesocycleLite = {
    name?: string;
    workouts?: WorkoutLite[]
}

type WorkoutLite = {
    day_of_week?: string
}

export default function MesoHeader({ mesocycle }: { mesocycle?: MesocycleLite }) {
    const mesoName = mesocycle?.name ?? "Mesocycle";
    const dayOfWeek = mesocycle?.workouts?.[0]?.day_of_week
            ? `Week 1・${mesocycle.workouts[0].day_of_week}`
            : "Week 1";

    return (
        <div className={styles.component}>
            <div className={styles.div_texts}>
                <span>{mesoName}</span>
                <h3>{dayOfWeek}</h3>
            </div>
            <div className={styles.div_icons}>
                <FontAwesomeIcon icon={faCalendarDays} />
                <FontAwesomeIcon icon={faGear} />
            </div>
        </div>
    )
}