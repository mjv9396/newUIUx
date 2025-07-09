import ActionButtons from "./components/actionButtons/ActionButtons";
import Logo from "./components/logo/Logo";
import Menu from "./components/menu/Menu";
import styles from "./Header.module.css";
export default function Header() {
  return (
    <div className={styles.navbar}>
      <div className={styles["navbar-content"]}>
        <div className={styles["navbar-content-left"]}>
          <Logo className="landing" />
        </div>
        <div className={styles["navbar-content-right"]}>
          <Menu />
          <ActionButtons />
          {/* <Toggle /> */}
        </div>
      </div>
    </div>
  );
}
