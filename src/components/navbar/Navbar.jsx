/* eslint-disable react/prop-types */
import { Link, useNavigate } from "react-router-dom";
import styles from "../../styles/components/Navbar.module.css";
import { clearCookieStorage, GetUsername } from "../../services/cookieStore";
import { useState } from "react";
import logo from "../../assets/logo.jpg";
import { successMessage } from "../../utils/messges";
import useFetch from "../../hooks/useFetch";
import { endpoints } from "../../services/apiEndpoints";
const Navbar = ({ handleToggleSidebar }) => {
  const [toggle, setToggle] = useState(false);
  const navigate = useNavigate();

  const { fetchData: LogoutUser} = useFetch();

  const handleLogout = () => {
    LogoutUser(endpoints.logout);
    successMessage("Logout Successfully");
    navigate("/");
  };
  return (
    <div className={styles.nav}>
      <div className={styles.logo}>
        <img src={logo} alt="logo" loading="lazy" />{" "}
        <i
          className="bi bi-list"
          id={styles.toggleSidebar}
          onClick={handleToggleSidebar}
        ></i>
      </div>
      <div className={styles.user}>
        {/* <button>Download Documentation</button> */}
        <span className={styles.username}>Hi, {GetUsername() || "User"}</span>
        <i className="bi bi-box-arrow-left mx-2" onClick={handleLogout}></i>
      </div>
      <i
        className="bi bi-person-circle"
        id={styles.submenuToggle}
        onClick={() => setToggle(!toggle)}
      ></i>
      <ul
        className={
          toggle ? styles.submenu + " " + styles.active : styles.submenu
        }
      >
        <li>
          <Link>Get Documentation</Link>
        </li>
        <li onClick={handleLogout}>
          <Link to="#" role="button">
            Logout
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
