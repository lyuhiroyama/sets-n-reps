import { Outlet } from "react-router-dom";
import LeftPanel from "../LeftPanel/LeftPanel";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
    return (
        <div className={styles.dashboard}>
            <LeftPanel />
            <div>
                <Outlet />
            </div>
        </div>
    );
}