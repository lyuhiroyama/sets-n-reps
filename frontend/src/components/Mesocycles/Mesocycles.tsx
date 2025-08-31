import styles from "./Mesocycles.module.css"

export default function Mesocycles() {
    return (
        <div className={styles.component}>
            <div className={styles.container}>
                <div className={styles.header_container}>
                    <h1>Mesocycles</h1>
                    <button>+ NEW</button>
                </div>
            </div>
        </div>
    );
}