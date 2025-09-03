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
    const [items, setItems] = useState<Mesocycle[]>([]);
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
    }, []);

    const handleNewClick = () => {
        navigate("/dashboard/plan-a-mesocycle");
    }

    const handleMesoClick = (mesoObj: Mesocycle) => {
        navigate(`/dashboard/mesocycles/${mesoObj.id}`);
    }
    
    return (
        <div className={styles.component}>
            <div className={styles.container}>
                <div className={styles.header_container}>
                    <h1>Mesocycles</h1>
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