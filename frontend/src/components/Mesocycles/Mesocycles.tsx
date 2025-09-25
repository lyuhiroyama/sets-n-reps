import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Mesocycles.module.css";

type Mesocycle = {
    id: number;
    name: string;
    duration_weeks: number;
    created_at: string;
}

export default function Mesocycles() {
    const [items, setItems] = useState<Mesocycle[] | undefined>(undefined);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMesocycles = async () => {
            const baseUrl = process.env.REACT_APP_API_BASE_URL;
            const response = await fetch(`${baseUrl}/api/mesocycles`, {
                credentials: "include",
                headers: { Accept: "application/json" }
            });

            if (response.ok) {
                const data = await response.json();
                setItems(data);
            } else  if (response.status === 401) { // if unauthorized
                navigate("/");
            }
        };
        fetchMesocycles();
    }, [navigate]);

    // Just to alter the top safe area on mobile portrait screens
    useEffect(() => {
        const themeColorMeta = document.querySelector('meta[name="theme-color"]');
        const originalColor = themeColorMeta?.getAttribute('content');
        
        themeColorMeta?.setAttribute('content', '#404040');  // Match .header_container background

        return () => {
            if (originalColor) {
                themeColorMeta?.setAttribute('content', originalColor);
            }
        };
    }, []);

    const handleNewClick = () => {
        navigate("/dashboard/plan-a-mesocycle");
    }

    const handleMesoClick = async (mesoObj: Mesocycle) => {
        const baseUrl = process.env.REACT_APP_API_BASE_URL;
        const mesoRes = await fetch(`${baseUrl}/api/mesocycles/${mesoObj.id}`, {
            credentials: "include",
            headers: { Accept: "application/json" }
        });
        if (!mesoRes.ok) {
            if (mesoRes.status === 401) navigate("/");
            return;
        }

        const meso = await mesoRes.json();
        const workouts = meso.workouts ?? [];
        if (!workouts.length) {
            navigate(`/dashboard/mesocycles/${mesoObj.id}`, { state: mesoObj });
            return;
        }

        const dayOrder = ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"];
        const orderHelper = (day?: string) => {
            const i = dayOrder.indexOf((day || "").toLowerCase());
            return i === -1 ? 7 : i;
        };

        const current = [...workouts]
            .filter((w: any) => !w.performed_on)
            .sort((a: any, b: any) =>
                (a.week_number || 0) - (b.week_number || 0) ||
                orderHelper(a.day_of_week) - orderHelper(b.day_of_week) ||
                a.id - b.id
            )[0] || workouts[workouts.length - 1];

        const week = current.week_number ?? 1;
        navigate(`/dashboard/mesocycles/${mesoObj.id}?workout=${current.id}&week=${week}`, { state: mesoObj });
    };

    // Display loading page while determining if user has any mesocycles or not:
    if (items === undefined) {
        return (
            <div className={styles.spinner_container}>
                <div className={styles.spinner}/>
            </div>
        );
    }
    
    return (
        <div className={styles.component}>
            <div className={styles.container}>
                <div className={styles.header_container}>
                    <h2>Mesocycles</h2>
                    <button onClick={handleNewClick}>+ New</button>
                </div>
                <ul>
                    {items.map(mesoObj => (
                        <li key={mesoObj.id} onClick={() => handleMesoClick(mesoObj)} className={styles.meso_li}>
                            <div>{mesoObj.name}</div>
                            <div className={styles.li_duration}>{mesoObj.duration_weeks} weeks</div>
                            <div className={styles.li_created}>Created {new Date(mesoObj.created_at).toLocaleString("en-US", {
                                timeZone: "Asia/Tokyo",
                                year: "numeric",
                                month: "numeric",
                                day: "numeric",
                            })}</div>
                        </li>
                    ))}
                    {items.length === 0 && 
                        <li className={styles.meso_li_na}>No mesocycles created</li>
                    }
                </ul>
            </div>
        </div>
    );
}
