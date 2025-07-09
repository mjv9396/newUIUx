import styles from "./Hero.module.css";

const Hero = () => {
  return (
    <div className={styles.header}>
      <div className={styles["header-content"]}>
        <h3>Contact Us</h3>
        <h5>
          Atmoon is ready to provide the right solution according to your
          needs
        </h5>
      </div>
    </div>
  );
};

export default Hero;
