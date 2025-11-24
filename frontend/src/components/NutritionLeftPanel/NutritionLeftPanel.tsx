import styles from "./NutritionLeftPanel.module.css";

export default function NutritionLeftPanel(){
    return (
        <div className={styles.component}>
            <ul className={styles.nav_list}>
                <li>Today</li>
                <li>Calender</li>
                <li>Targets</li>
                <li>Settings</li>
                <li>Sign out</li>
            </ul>
        </div>
    )
}