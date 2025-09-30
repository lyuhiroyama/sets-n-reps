import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Mesocycles.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faTrash } from "@fortawesome/free-solid-svg-icons";

type Mesocycle = {
    id: number;
    name: string;
    duration_weeks: number;
    created_at: string;
};

export default function Mesocycles() {
    const [items, setItems] = useState<Mesocycle[] | undefined>(undefined);
    const navigate = useNavigate();
    // Meso deletion related:
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteRender, setDeleteRender] = useState(false);
    const [mesoToDelete, setMesoToDelete] = useState<Mesocycle | null>(null);

    // Fetch mesos
    useEffect(() => {
        const fetchMesocycles = async () => {
            const baseUrl = process.env.REACT_APP_API_BASE_URL;
            const response = await fetch(`${baseUrl}/api/mesocycles`, {
                credentials: "include",
                headers: { Accept: "application/json" },
            });

            if (response.ok) {
                const data = await response.json();
                setItems(data);
            } else if (response.status === 401) {
                // if unauthorized
                navigate("/");
            }
        };
        fetchMesocycles();
    }, [navigate]);

    // Just to alter the top safe area on mobile portrait screens
    useEffect(() => {
        const themeColorMeta = document.querySelector(
            'meta[name="theme-color"]'
        );
        const originalColor = themeColorMeta?.getAttribute("content");

        themeColorMeta?.setAttribute("content", "#404040"); // Match .header_container background

        return () => {
            if (originalColor) {
                themeColorMeta?.setAttribute("content", originalColor);
            }
        };
    }, []);

    const handleNewClick = () => {
        navigate("/dashboard/plan-a-mesocycle");
    };

    const handleMesoClick = async (mesoObj: Mesocycle) => {
        const baseUrl = process.env.REACT_APP_API_BASE_URL;
        const mesoRes = await fetch(`${baseUrl}/api/mesocycles/${mesoObj.id}`, {
            credentials: "include",
            headers: { Accept: "application/json" },
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

        const dayOrder = [
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
            "sunday",
        ];
        const orderHelper = (day?: string) => {
            const i = dayOrder.indexOf((day || "").toLowerCase());
            return i === -1 ? 7 : i;
        };

        const current =
            [...workouts]
                .filter((w: any) => !w.performed_on)
                .sort(
                    (a: any, b: any) =>
                        (a.week_number || 0) - (b.week_number || 0) ||
                        orderHelper(a.day_of_week) -
                            orderHelper(b.day_of_week) ||
                        a.id - b.id
                )[0] || workouts[workouts.length - 1];

        const week = current.week_number ?? 1;
        navigate(
            `/dashboard/mesocycles/${mesoObj.id}?workout=${current.id}&week=${week}`,
            { state: mesoObj }
        );
    };

    // Handle meso deletion dialog animation
    useEffect(() => {
        if (showDeleteConfirm) {
            setDeleteRender(true);
            return;
        }
        if (deleteRender) {
            const t = window.setTimeout(() => setDeleteRender(false), 150);
            return () => window.clearTimeout(t);
        }
    }, [showDeleteConfirm, deleteRender]);

    const handleDeleteClick = (e: React.MouseEvent, meso: Mesocycle) => {
        e.stopPropagation();
        setMesoToDelete(meso);
        setShowDeleteConfirm(true);
    };

    const handleConfirmDelete = async () => {
        if (!mesoToDelete) return;

        const baseUrl = process.env.REACT_APP_API_BASE_URL;
        const response = await fetch(
            `${baseUrl}/api/mesocycles/${mesoToDelete.id}`,
            {
                method: "DELETE",
                credentials: "include",
            }
        );

        if (response.ok) {
            setItems((prevItems) =>
                prevItems?.filter((item) => item.id !== mesoToDelete.id)
            );
            setShowDeleteConfirm(false);
        } else if (response.status === 401) {
            navigate("/");
        }
    };

    // Display loading page while determining if user has any mesocycles or not:
    if (items === undefined) {
        return (
            <div className={styles.spinner_container}>
                <div className={styles.spinner} />
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
                    {items.map((mesoObj) => (
                        <li
                            key={mesoObj.id}
                            onClick={() => handleMesoClick(mesoObj)}
                            className={styles.meso_li}
                        >
                            <div>
                                <div>{mesoObj.name}</div>
                                <div className={styles.li_duration}>
                                    {mesoObj.duration_weeks} weeks
                                </div>
                                <div className={styles.li_created}>
                                    Created{" "}
                                    {new Date(mesoObj.created_at).toLocaleString(
                                        "en-US",
                                        {
                                            timeZone: "Asia/Tokyo",
                                            year: "numeric",
                                            month: "numeric",
                                            day: "numeric",
                                        }
                                    )}
                                </div>
                            </div>
                            <button
                                className={styles.delete_button}
                                onClick={(e) => handleDeleteClick(e, mesoObj)}
                            >
                                <FontAwesomeIcon icon={faTrash} />
                            </button>
                        </li>
                    ))}
                    {items.length === 0 && (
                        <li className={styles.meso_li_na}>
                            No mesocycles created
                        </li>
                    )}
                </ul>
            </div>

            {/* Meso delete dialog */}
            {deleteRender && (
                <div
                    className={[
                        styles.dialog_background,
                        showDeleteConfirm
                            ? styles.dialog_open_animation
                            : styles.dialog_close_animation,
                    ].join(" ")}
                    onClick={() => setShowDeleteConfirm(false)}
                >
                    <div
                        className={[
                            styles.dialog,
                            showDeleteConfirm
                                ? styles.dialog_open_animation
                                : styles.dialog_close_animation,
                        ].join(" ")}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className={styles.close_dialog_btn}
                            onClick={() => setShowDeleteConfirm(false)}
                        >
                            <FontAwesomeIcon icon={faXmark} />
                        </button>
                        <h3>Delete meso <br/>"{mesoToDelete?.name}"?</h3>
                        <div className={styles.dialog_buttons_container}>
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className={styles.dialog_cancel_btn}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                className={styles.dialog_confirm_btn}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
