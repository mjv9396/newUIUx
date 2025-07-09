import Image from "next/image";
import styles from "./Services.module.css";
import phone from "../../../../public/images/landingPage/iphone_img.png";
import icon from "../../../../public/images/landingPage/wallet.png";

import Link from "next/link";
const Services = () => {
  return (
    <div className={styles.services} id="solutions">
      <h3>India's Best Payment Gateway </h3>
      {/* <h6>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus,
        luctus nec ullamcorper mattis, pulvinar dapibus leo.
      </h6> */}
      <div className={`container ${styles.wrapper}`}>
        <div className={styles.service1}>
          <div className={styles.imgwrapper}>
            <Image src={icon} alt="wallet" />
          </div>
          <h6>Provides 180+ payment option</h6>
          <p>
            Atmoon offers 180+ payment options like UPI, Cards, EMIs, Pay
            Later, Wallets, and Net Banking, providing an easy and
            customer-friendly checkout process.
          </p>
          <Link href="">Read More</Link>
        </div>
        <div className={styles.service2}>
          <div className={styles.imgwrapper}>
            <Image src={icon} alt="wallet" />
          </div>
          <h6>Maximize Transaction Success Rates</h6>
          <p>
            With direct integrations and AI/ML-powered dynamic routing,
            Atmoon delivers the highest success rates for all payment modes,
            ensuring reliable transactions. .
          </p>
          <Link href="">Read More</Link>
        </div>
        <div className={styles.main}>
          <Image src={phone} alt="phone-image" />
        </div>
        <div className={styles.service3}>
          <div className={styles.imgwrapper}>
            <Image src={icon} alt="wallet" />
          </div>
          <h6>Developer-Friendly Integrations</h6>
          <p>
            Easily integrate Atmoon using our wide range of SDKs, RESTful
            APIs, and plug-ins. Our platform supports all major programming
            languages for a seamless integration.
          </p>
          <Link href="">Read More</Link>
        </div>
        <div className={styles.service4}>
          <div className={styles.imgwrapper}>
            <Image src={icon} alt="wallet" />
          </div>
          <h6>Secure Transactions</h6>
          <p>
            Atmoon ensures secure, encrypted transactions, providing
            businesses and customers with a trusted and reliable payment gateway
            solution.
          </p>
          <Link href="">Read More</Link>
        </div>
      </div>
    </div>
  );
};

export default Services;
