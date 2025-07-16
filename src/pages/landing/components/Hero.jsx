import { Link } from "react-router-dom";
import styles from "../../../styles/landing/Hero.module.css";
const Hero = () => {
  return (
    <div className={styles.hero}>
      <h1>Landing Page Will Be Here</h1>
      <Link to="/login">Go To Login Page</Link>
    </div>
  );
};

export default Hero;
