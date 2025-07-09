import styles from "./Touch.module.css";
import phone from "../../../../../public/images/landingPage/phone-call.png";
import email from "../../../../../public/images/landingPage/mail.png";
import location from "../../../../../public/images/landingPage/location.png";
import Image from "next/image";

const Touch = () => {
  return (
    <div className={styles.contact}>
      <div className="container">
        <div className="row">
          <div className="col-md-6 col-sm-12 mb-3">
            <h6>Get in touch</h6>
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
                  405, 4th Floor, Majestic Signia, Block A, Sector 62, Noida,
                  Uttar Pradesh 201309
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-sm-12 mb-3">
            <h6>Send us a message</h6>
            <form action="">
              <div className="row">
                <div className="col-md-6 col-sm-12 mb-2">
                  <label htmlFor="">Name</label>
                  <input type="text" />
                </div>
                <div className="col-md-6 col-sm-12 mb-2">
                  <label htmlFor="">Company</label>
                  <input type="text" />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 col-sm-12 mb-2">
                  <label htmlFor="">Phone</label>
                  <input type="text" />
                </div>
                <div className="col-md-6 col-sm-12 mb-2">
                  <label htmlFor="">Email</label>
                  <input type="text" />
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <label htmlFor="">Subject</label>
                  <input type="text" />
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <label htmlFor="">Message</label>
                  <textarea rows={5} />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Touch;
