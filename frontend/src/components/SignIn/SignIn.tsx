import styles from "./SignIn.module.css";

export default function SignIn() {
    return (
        <div className={styles.component}>
            <div className={styles.container}>
                <h2 className={styles.header}>Sets-n-Reps</h2>
                <p className={styles.sub_header}>Sign in to your account</p>
                <form>
                    <input type="text" placeholder="Email" />
                    <input type="password" placeholder="Password" />
                    <button type="submit" className={styles.sign_in_button}>Sign In</button>
                </form>
                <hr />
                <button type="button" className={styles.invite_code_button}>Have an invite code?</button>
            </div>
        </div>
    );
}
