import styles from "./Hero.module.css";
import phone from "../../../../public/images/landingPage/phone_img.png";
import Image from "next/image";
import Button from "@/app/ui/button/Button";
export default function Hero() {
  return (
    <div className={styles.header}>
      <div className={styles["header-content"]}>
        <div className={styles.content}>
          <h6>Payment Gateway</h6>
          <h3>
            Fast, Secure, and <br /> <span>Advanced Payment </span> Solutions.
          </h3>
          <p>
            Quick transactions, a smart dashboard, simple integration, 150+
            payment methods, and reliable UPI stack make Atmoon your first
            choice payment solution.
          </p>
        </div>
        <Button label="Discover more" className="landing" />
      </div>
      <Image src={phone} alt="phone-image" priority />{" "}
    </div>
  );
}
