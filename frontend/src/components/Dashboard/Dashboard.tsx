import styles from "./Dashboard.module.css";
import LeftPanel from "../LeftPanel/LeftPanel";

export default function Dashboard() {
    return (
        <div className={styles.dashboard}>
            <LeftPanel />
            <div>contents here</div>
        </div>
    );
}