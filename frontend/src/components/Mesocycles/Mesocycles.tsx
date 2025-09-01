import { useNavigate } from "react-router-dom";
import styles from "./Mesocycles.module.css";

export default function Mesocycles() {
    const navigate = useNavigate();
    const handleNewClick = () => {
        navigate("/dashboard/plan-a-mesocycle");
    }
    
    return (
        <div className={styles.component}>
            <div className={styles.container}>
                <div className={styles.header_container}>
                    <h1>Mesocycles</h1>
                    <button onClick={handleNewClick}>+ NEW</button>
                </div>
            </div>
        </div>
    );
}