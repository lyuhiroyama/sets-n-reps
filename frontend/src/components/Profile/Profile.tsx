import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import styles from "./Profile.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";

type UserType = {
    email: string;
    created_at: string;
};

export default function Profile() {
    const [user, setUser] = useState<UserType | null | undefined>(undefined);
    const { t, i18n } = useTranslation();

    // Language toggle helper
    const toggleLanguage = (event: React.ChangeEvent<HTMLSelectElement>) => {
        i18n.changeLanguage(event.target.value);
    };

    // Fetch user data
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const baseUrl = process.env.REACT_APP_API_BASE_URL;
                const response = await fetch(`${baseUrl}/users/check-auth`, {
                    credentials: "include",
                    headers: {
                        Accept: "application/json",
                    },
                });
                const data = await response.json();

                if (data.isAuthenticated) {
                    setUser(data.user);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error("Error fetching user data: ", error);
            }
        };

        fetchUser();
    }, []);

    // Display loading page while fetching user details:
    if (user === undefined) {
        return (
            <div className={styles.spinner_container}>
                <div className={styles.spinner} />
            </div>
        );
    }

    return (
        <div className={styles.component}>
            <h2>{t("profile.userProfile")}</h2>
            <div className={styles.profile_container}>
                <dl className={styles.profile_dl}>
                    <div className={styles.profile_set}>
                        <dt>{t("profile.email")}</dt>
                        <dd>{user?.email}</dd>
                    </div>
                    <div className={styles.profile_set}>
                        <dt>{t("profile.accountCreated")}</dt>
                        <dd>
                            {user?.created_at
                                ? new Date(user.created_at).toLocaleDateString(
                                    i18n.language === 'en' ? "en-US" : "ja-JP",
                                      {
                                          timeZone: "Asia/Tokyo",
                                          year: "numeric",
                                          month: "long",
                                          day: "numeric",
                                      }
                                  )
                                : ""}
                        </dd>
                    </div>
                </dl>
            </div>
            <h2>{t("profile.settings")}</h2>
            <div className={styles.settings_container}>
                <div className={styles.content_row}>
                    <div>{t("profile.language")}</div>
                    <div className={styles.dropdown_container}>
                        <select
                            value={i18n.language}
                            onChange={toggleLanguage}
                            className={styles.select}
                        >
                            <option value="en">English</option>
                            <option value="ja">日本語</option>
                        </select>
                        <div className={styles.faAngleDown_container}>
                            <FontAwesomeIcon icon={faAngleDown} />
                        </div>
                    </div>
                </div>
                <div className={styles.content_row}>
                    <div>{t("profile.autoFill")}</div>
                    <div className={styles.dropdown_container}>
                        <select
                            className={styles.select}
                        >
                            <option>{t("profile.on")}</option>
                            <option>{t("profile.off")}</option>
                        </select>
                        <div className={styles.faAngleDown_container}>
                            <FontAwesomeIcon icon={faAngleDown} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
