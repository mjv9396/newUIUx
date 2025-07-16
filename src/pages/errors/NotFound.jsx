import { Link } from "react-router-dom";
import styles from "../../styles/errors/Errors.module.css";
const NotFound = () => {
  return (
    <div className={styles.notfound}>
      <h6>404 - Page Not Found</h6>
      <p>The page you&lsquo;re looking for doesn&lsquo;t exist.</p>
      <Link to="/">Back to Home</Link>
    </div>
  );
};

export default NotFound;
