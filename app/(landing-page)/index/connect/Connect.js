import Image from "next/image";
import styles from "./Connect.module.css";
import connect from "../../../../public/images/landingPage/connecting.png";
import team from "../../../../public/images/landingPage/business-teamwork.png";
import business from "../../../../public/images/landingPage/analytics.png";
import cards from "../../../../public/images/landingPage/credit-cards.png";
import Subtitle from "@/app/ui/headings/Subtitle";
import InfoCard from "../../components/infoCard/InfoCard";
export default function Connect() {
  return (
    <div className={styles.connect} id="about">
      <div className="container row">
        <div className="col-md-6 col-sm-12 mb-3 py-4">
          <Subtitle label="Your Complete Finance Solution for Easy Transactions " />
          <p>
            Atmoon offers an advanced, secure, and fast finance platform
            designed for businesses of all sizes. It simplifies both payment
            acceptance and payouts with innovative solutions.
          </p>
          <div className={styles.card}>
            <div className={styles.imgwrapper}>
              <Image src={cards} alt="credit cards" />
            </div>
            <span>
              <h6>Accept Payments</h6>
              <p>
                You can easily accept payments for top products across websites,
                apps, plugins, social media, in-store, and even cross-border.
                With smart add-ons, we ensure ease of use and security.
              </p>
            </span>
          </div>
          <div className={styles.card}>
            <div className={styles.imgwrapper}>
              <Image src={business} alt="business growth" />
            </div>
            <span>
              <h6>Make Payouts</h6>
              <p>
                You can easily manage API and bulk payouts, automate vendor
                payments with an integrated solution, and make online tax
                payments in one simple click.
              </p>
            </span>
          </div>
          <div className={styles.card}>
            <div className={styles.imgwrapper}>
              <Image src={team} alt="business teamwork" />
            </div>
            <span>
              <h6>Financial Solution</h6>
              <p>
                Providing a comprehensive financial platform for managing
                payment and payout needs, we ensure a fast and secure
                transaction process.
              </p>
            </span>
          </div>
        </div>
        <div className="col-md-6 col-sm-12 p-0 m-0">
          <Image src={connect} alt="" />
        </div>
      </div>
    </div>
  );
}
