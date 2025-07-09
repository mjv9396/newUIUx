import Link from "next/link";
import styles from "./Menu.module.css";
export default function Menu({ active }) {
  return (
    <ul className={styles["navbar-toggle-content"]}>
      <li className={styles["navbar-item"]}>
        <Link className={styles["navbar-link"]} href="/">
          Homepage
        </Link>
      </li>

      <li className={styles["navbar-item"]}>
        <Link
          className={
            active
              ? styles.active + " " + styles["navbar-link"]
              : styles["navbar-link"]
          }
          href="#about"
        >
          About us{" "}
        </Link>
      </li>

      <li className={styles["navbar-item"]}>
        <Link className={styles["navbar-link"]} href="#solutions">
          Solutions
        </Link>
      </li>

      <li className={styles["navbar-item"]}>
        <Link className={styles["navbar-link"]} href="#contact">
          Contact us
        </Link>
      </li>
    </ul>
  );
}
