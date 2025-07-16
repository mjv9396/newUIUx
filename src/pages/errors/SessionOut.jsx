import { Link } from "react-router-dom";
import styles from "../../styles/errors/Errors.module.css";
import { clearCookieStorage } from "../../services/cookieStore";
const SessionOut = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.error}>
        <h6>Your session has been expired! </h6>
        <Link to="/" onClick={() => clearCookieStorage()}>
          Go to login
        </Link>
      </div>
    </div>
  );
};

export default SessionOut;
