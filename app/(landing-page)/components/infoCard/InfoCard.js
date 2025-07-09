import Image from "next/image";
import styles from "./InfoCard.module.css";

const InfoCard = ({ img, alt = "", title = "", description = "" }) => {
  return (
    <div className={styles.card}>
      <div className={styles.wrapper}>
        <Image src={img} alt="phone number" />
      </div>
      <div className={styles.info}>
        <h6>{title}</h6>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default InfoCard;
