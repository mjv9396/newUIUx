import Image from "next/image";
import styles from "./Run.module.css";
import run from "../../../../public/images/landingPage/run.png";
const Run = () => {
  return (
    <div className={styles.run}>
      <div className="row">
        <div className="col-md-6 col-sm-12 p-0">
          <Image src={run} alt="" />
        </div>
        <div className={`col-md-6 col-sm-12 ${styles.content}`}>
          <h3>Our Strategy To Reach Your Easy Payment Solution </h3>
          <p>
            We focus on providing reliable, secure, and simple payment
            solutions. Our strategy involves continuous innovation, integrating
            new payment methods, optimizing speed, and upgrading security. We’re
            dedicated to ensuring a user-friendly experience for businesses,
            making payments effortless and efficient at every step.
          </p>
          <div className={`row ${styles.stats}`}>
            <div className="col-md-3 col-sm-12 mb-3">
              <div className={styles.card}>
                <h1>1M+</h1>
                <span>Active Members</span>
              </div>
            </div>
            <div className="col-md-3 col-sm-12 mb-3">
              <div className={styles.card}>
                <h1>98%</h1>
                <span>Satisfied Customers</span>
              </div>
            </div>
            <div className="col-md-3 col-sm-12 mb-3">
              <div className={styles.card}>
                <h1>4.9</h1>
                <span>User Rating</span>
              </div>
            </div>
            <div className="col-md-3 col-sm-12 mb-3">
              <div className={styles.card}>
                <h1>4+</h1>
                <span>Years of Experience</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Run;
