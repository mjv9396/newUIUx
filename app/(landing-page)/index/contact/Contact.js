import styles from "./Contact.module.css";
import Image from "next/image";
import phone from "../../../../public/images/landingPage/phone-call.png";
import email from "../../../../public/images/landingPage/mail.png";
import location from "../../../../public/images/landingPage/location.png";

const Contact = () => {
  return (
    <div className={styles.contact} id="contact">
      <div className={`container ${styles.content}`}>
        <h3>Get Faster and More Secure Transactions</h3>
        <p>
          Request a demo to experience how Atmoon’s payment gateway can help
          you process payments quickly and securely, making transactions easier
          for your business.
        </p>
        <div className={styles.button}>
          <button>Request for Demo</button>
        </div>
      </div>
      <div className={styles.details}>
        <div className={styles.card}>
          <div className={styles.wrapper}>
            <Image src={phone} alt="phone number" />
          </div>
          <div className={styles.info}>
            <h6>Give Us A Call</h6>
            <p>+91 8076949229</p>
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.wrapper}>
            <Image src={email} alt="email Address" />
          </div>
          <div className={styles.info}>
            <h6>Email Address</h6>
            <p>support@Atmoon.in</p>
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.wrapper}>
            <Image src={location} alt="location" />
          </div>
          <div className={styles.info}>
            <h6>Office Location</h6>
            <p>
              405, 4th Floor, Majestic Signia, Plot No. A-27, Block A,
              Industrial Area, Sector 62, Noida, Uttar Pradesh 201309
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
