import Sidebar from "./components/sidebar/Sidebar";
import styles from "./layout.module.css";
const Layout = ({ children }) => {
  return (
    <div className={styles.layout}>
      <Sidebar />

      {children}
      {/* <Footer /> */}
    </div>
  );
};

export default Layout;
