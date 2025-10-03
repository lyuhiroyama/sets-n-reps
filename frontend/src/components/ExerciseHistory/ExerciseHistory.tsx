import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./ExerciseHistory.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

type Mesocycle = {
    id: number;
    name: string;
    created_at: string;
    workouts: Workout[];
};

type Workout = {
    id: number;
    performed_on: string | null;
    week_number: number;
    exercises: Exercise[];
};

type Exercise = {
    name: string;
    exercise_sets: ExerciseSet[];
};

type ExerciseSet = {
    weight: number | null;
    rep_count: number | null;
    set_number: number;
    completed: boolean;
};

export default function ExerciseHistory({
    isHistoryOpen,
    onHistoryClose,
    exerciseName,
}: {
    isHistoryOpen: boolean;
    onHistoryClose: () => void;
    exerciseName: string;
}) {
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const { t } = useTranslation();

    // Store fetched mesos:
    const [mesos, setMesos] = useState<Mesocycle[] | undefined>(undefined);
    // Mainly for closing animation: apply closing class and delay DOM unmount so animation can run
    const [render, setRender] = useState(isHistoryOpen);

    // For slide-to-close feature
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);
    const minSwipeDistance = 50;

    // Fetch user's mesos
    useEffect(() => {
        const baseUrl = process.env.REACT_APP_API_BASE_URL;
        const fetchMesos = async () => {
            const response = await fetch(
                `${baseUrl}/api/mesocycles?exercise=${encodeURIComponent(
                    exerciseName
                )}`,
                {
                    credentials: "include",
                    headers: { Accept: "application/json" },
                }
            );

            if (response.ok) {
                const data = await response.json();
                setMesos(data);
            } else if (response.status === 401) {
                // if unauthorized
                navigate("/");
            }
        };
        fetchMesos();
    }, [navigate, exerciseName]);

    // Check if user has any exercise history to display
    const hasExerciseHistory = (
        mesos: Mesocycle[] | undefined,
        exerciseName: string
    ): boolean => {
        if (!mesos) return false;

        return mesos.some((meso) =>
            meso.workouts
                .filter((workout) => workout.performed_on !== null)
                .some((workout) => {
                    const validExercise = workout.exercises.find(
                        (e) => e.name === exerciseName
                    );
                    if (!validExercise?.exercise_sets?.length) return false;
                    return validExercise.exercise_sets.some(
                        (set) =>
                            set.weight !== null &&
                            set.rep_count !== null &&
                            set.completed === true
                    );
                })
        );
    };

    // For slide-to-close-dialog feature:
    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientY);
    };
    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientY);
    };
    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        // Calculate swipe distance
        const distance = touchEnd - touchStart;
        const isDownSwipeAndMinDistance = distance > minSwipeDistance;
        if (isDownSwipeAndMinDistance) {
            onHistoryClose();
        }
        // Reset values
        setTouchStart(null);
        setTouchEnd(null);
    };


    // Handle dialog mount/unmount timing for animations
    useEffect(() => {
        if (isHistoryOpen) {
            setRender(true);
            return;
        }
        if (render) {
            const t = window.setTimeout(() => {
                setRender(false);
            }, 150); // match CSS opening & closing animation
            return () => window.clearTimeout(t);
        }
    }, [isHistoryOpen, render]);

    // Closes dialog when clicking outside
    useEffect(() => {
        if (!render) return;
        const handleClickOutsideDropdown = (e: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target as Node)
            )
                onHistoryClose();
        };
        document.addEventListener("click", handleClickOutsideDropdown);
        return () => {
            document.removeEventListener("click", handleClickOutsideDropdown);
        };
    }, [render, onHistoryClose]);

    if (!render) return null;

    return (
        <div
            className={[
                styles.dialog_background,
                isHistoryOpen
                    ? styles.background_darkHue_animation
                    : styles.background_noHue_animation,
            ].join(" ")}
            onClick={onHistoryClose}
        >
            <div
                className={[
                    styles.dialog,
                    isHistoryOpen
                        ? styles.dialog_open_animation
                        : styles.dialog_close_animation,
                ].join(" ")}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className={styles.close_dialog_btn}
                    onClick={onHistoryClose}
                >
                    <FontAwesomeIcon icon={faXmark} />
                </button>
                <div 
                    className={styles.header_section}
                    // For slide-to-close feature:
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                >
                    <div className={styles.swipe_container}>
                        <div className={styles.swipe_bar}></div>
                    </div>
                    <div>{t("exerciseHistory.exerciseHistory")}</div>
                    <h3>{exerciseName}</h3>
                </div>
                <div className={styles.mesos_container}>
                    {!hasExerciseHistory(mesos, exerciseName) ? (
                        <div className={styles.no_history_message}>
                            <p>
                                {t("exerciseHistory.noHistoryMessage.part1")}
                                <br />
                                {t("exerciseHistory.noHistoryMessage.part2")}
                            </p>
                            <p>
                                {t("exerciseHistory.noHistoryMessage.part3")}
                                <span className={styles.span1}>
                                    {t(
                                        "exerciseHistory.noHistoryMessage.part4"
                                    )}
                                </span>
                                {t("exerciseHistory.noHistoryMessage.part5")}
                                <br />
                                {t("exerciseHistory.noHistoryMessage.part6")}
                                {t("exerciseHistory.noHistoryMessage.part7")}
                                <span className={styles.span2}>
                                    {t(
                                        "exerciseHistory.noHistoryMessage.part8"
                                    )}
                                </span>
                                {t("exerciseHistory.noHistoryMessage.part9")}
                            </p>
                        </div>
                    ) : (
                        mesos?.map((mesoObj) => {
                            // Check if iterator meso has any data to display. Skip otherwise.
                            const hasValidData = mesoObj.workouts
                                .filter(
                                    (workout) => workout.performed_on !== null
                                )
                                .some((workout) => {
                                    const validExercise =
                                        workout.exercises.find(
                                            (e) => e.name === exerciseName
                                        );
                                    if (!validExercise?.exercise_sets?.length)
                                        return false;
                                    return validExercise.exercise_sets.some(
                                        (set) =>
                                            set.weight !== null &&
                                            set.rep_count !== null &&
                                            set.completed === true
                                    );
                                });
                            if (!hasValidData) return null;

                            return (
                                <div
                                    key={mesoObj.id}
                                    className={styles.ul_container}
                                >
                                    <ul>{mesoObj.name}</ul>
                                    {mesoObj.workouts
                                        .filter(
                                            (workout) =>
                                                workout.performed_on !== null
                                        )
                                        .sort(
                                            (a, b) =>
                                                b.week_number - a.week_number
                                        )
                                        .map((workout) => {
                                            // Find target exercise within workout
                                            const validExercise =
                                                workout.exercises.find(
                                                    (e) =>
                                                        e.name === exerciseName
                                                );
                                            if (
                                                !validExercise?.exercise_sets
                                                    ?.length
                                            )
                                                return null;

                                            // Filter Exercises with invalid sets
                                            const validSets =
                                                validExercise.exercise_sets.filter(
                                                    (set) =>
                                                        set.weight !== null &&
                                                        set.rep_count !==
                                                            null &&
                                                        set.completed === true
                                                );
                                            if (!validSets.length) return null;

                                            /* Group sets by weight: 
                                            {
                                                "27.5": [exercise_set, exercise_set, exercise_set],
                                                "25" : [exercise_set, exercise_set]
                                            }
                                            */
                                            const exercise_setsByWeight: Record<
                                                string,
                                                ExerciseSet[]
                                            > = {};
                                            validSets.forEach(
                                                (exercise_set) => {
                                                    const weight =
                                                        exercise_set.weight?.toString() ||
                                                        "null";
                                                    if (
                                                        !exercise_setsByWeight[
                                                            weight
                                                        ]
                                                    ) {
                                                        exercise_setsByWeight[
                                                            weight
                                                        ] = [];
                                                    }
                                                    exercise_setsByWeight[
                                                        weight
                                                    ].push(exercise_set);
                                                }
                                            );

                                            return (
                                                <li key={workout.id}>
                                                    <div
                                                        className={
                                                            styles.history
                                                        }
                                                    >
                                                        {Object.entries(
                                                            exercise_setsByWeight
                                                        )
                                                            .map(
                                                                ([
                                                                    weight,
                                                                    exercise_sets,
                                                                ]) => {
                                                                    const displayReps =
                                                                        exercise_sets
                                                                            .sort(
                                                                                (
                                                                                    a,
                                                                                    b
                                                                                ) =>
                                                                                    a.set_number -
                                                                                    b.set_number
                                                                            )
                                                                            .map(
                                                                                (
                                                                                    exercise_set
                                                                                ) =>
                                                                                    exercise_set.rep_count
                                                                            )
                                                                            .join(
                                                                                ", "
                                                                            );

                                                                    const formattedWeight =
                                                                        (() => {
                                                                            const num =
                                                                                parseFloat(
                                                                                    weight
                                                                                );
                                                                            return num %
                                                                                1 ===
                                                                                0
                                                                                ? Math.floor(
                                                                                      num
                                                                                  )
                                                                                : num.toFixed(
                                                                                      1
                                                                                  );
                                                                        })();

                                                                    return `${formattedWeight} ᵏᵍ × ${displayReps}`;
                                                                }
                                                            )
                                                            .join(" / ")}
                                                    </div>
                                                    <div
                                                        className={
                                                            styles.week_number
                                                        }
                                                    >
                                                        Week{" "}
                                                        {workout.week_number}
                                                    </div>
                                                </li>
                                            );
                                        })}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
