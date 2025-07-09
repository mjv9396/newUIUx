import styles from "./Toggle.module.css";
export default function Toggle() {
  return (
    <div className={styles["navbar-toggler"]}>
      <span className={styles["navbar-toggler-icon"]}></span>
    </div>
  );
}
