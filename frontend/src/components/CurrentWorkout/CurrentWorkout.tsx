import { useNavigate } from "react-router-dom";
import styles from "./CurrentWorkout.module.css";

export default function CurrentWorkout() {
    const navigate = useNavigate();
    const handlePlanMesoClick = () => {
        navigate("/dashboard/mesocycles");
    };

    return (
        <div className={styles.component}>
            <h2>You have no workouts yet</h2>
            <button onClick={handlePlanMesoClick}>+ Plan a mesocycle</button>
        </div>
    )
}