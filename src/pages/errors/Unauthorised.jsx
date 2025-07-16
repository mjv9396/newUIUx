import styles from "../../styles/common/Add.module.css";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Link } from "react-router-dom";

const Unauthorised = () => {
  return (
    <DashboardLayout page="Unauthorised" url="/unauthorised">
      <div className="flex flex-column align-items-center justify-content-center text-center">
        <h6 className="text-danger">403 - Unauthorised</h6>
        <p className="mt-2">You do not have permission to access this page.</p>
        <Link to="/dashboard" className={styles.submit + " " + styles.active}>
          Go to Dashboard
        </Link>
      </div>
    </DashboardLayout>
  );
};

export default Unauthorised;
