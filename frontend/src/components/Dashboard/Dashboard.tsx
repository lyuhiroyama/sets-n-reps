import { Outlet } from "react-router-dom";
import LeftPanel from "../LeftPanel/LeftPanel";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
    return (
        <div className={styles.component}>
            <LeftPanel />
            <div className={styles.main_content_container} >
                <Outlet />
            </div>
        </div>
    );
}