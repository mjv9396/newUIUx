import Link from "next/link";
import styles from "./ActionButtons.module.css";
export default function ActionButtons() {
  return (
    <>
      <Link href="/login" className={styles["navbar-link"]}>
        Sign in
      </Link>

      {/* <button
        className={styles["navbar-link"] + " " + styles["btn-registration"]}
        type="button"
      >
        Request Demo
      </button> */}
    </>
  );
}
