"use client";
import Image from "next/image";
import styles from "./Testimonials.module.css";
import testimonial from "../../../../public/images/landingPage/testimonial.jpg";
import img1 from "../../../../public/images/landingPage/bakebun.png";
import img2 from "../../../../public/images/landingPage/busima.png";
import img3 from "../../../../public/images/landingPage/clicknbuy.png";
import img4 from "../../../../public/images/landingPage/creavo.png";
import img5 from "../../../../public/images/landingPage/dailymart.png";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 2000 },
    items: 3,
  },
  desktop: {
    breakpoint: { max: 2000, min: 1024 },
    items: 2,
  },
  tablet: {
    breakpoint: { max: 1024, min: 0 },
    items: 1,
  },
};
const Testimonials = () => {
  return (
    <div className={`row ${styles.testimonial}`}>
      <div className={`col-md-6 col-sm-12 ${styles.content}`}>
        <h3>What they say</h3>
        <p>
          We are pleased to offer our clients Atmoon's seamless, secure
          solutions for payments. From easy integration to reliable support,
          clients trust us to ease their payment processes.
        </p>
        <div className={`row ${styles.stats}`}>
          <Carousel
            responsive={responsive}
            infinite={true}
            autoPlay={true}
            autoPlaySpeed={3000}
            transitionDuration={300}
            arrows={false}
          >
            <div className={styles.card}>
              {/* <Image src={img1} alt="" />
              <h4>Mason Thomson</h4>
              <h6>Business Manager</h6> */}
              <p>
                ” We have found Atmoon's secure UPI payments to be very
                helpful for our e-commerce business. Fast, easy, and
                reliable—making transactions smooth for both us and our
                customers! “
              </p>
            </div>
            <div className={styles.card}>
              {/* <Image src={img2} alt="" />
              <h4>Amelia Thomson</h4>
              <h6>CEO</h6> */}
              <p>
                ” Atmoon's 24/7 customer support is excellent! They guided us
                through the entire integration process easily, making it simple
                and easy for our business. “
              </p>
            </div>
            <div className={styles.card}>
              {/* <Image src={img3} alt="" />
              <h4>Madison Palmer</h4>
              <h6>Founder</h6> */}
              <p>
                ” Atmoon makes payments instantly and keeps all transactions
                secure. It's fast and reliable, and it gives our business
                confidence that everything is safe and smooth. “
              </p>
            </div>
            <div className={styles.card}>
              {/* <Image src={img4} alt="" />
              <h4>Madison Palmer</h4>
              <h6>CEO</h6> */}
              <p>
                ” Atmoon's instant approval and user-friendly dashboard made
                integration easy for my business. The process is very simple,
                and the support team is always available to help. “
              </p>
            </div>
            <div className={styles.card}>
              {/* <Image src={img5} alt="" />
              <h4>Madison Palmer</h4>
              <h6>Managing Director</h6> */}
              <p>
                ”Atmoon is the most reliable payment gateway solution for
                online payments. It is secure, and reliable, making transactions
                easy and stress-free for our business! “
              </p>
            </div>
          </Carousel>
        </div>
      </div>
      <div className="col-md-6 col-sm-12 p-0">
        <Image src={testimonial} alt="" />
      </div>
    </div>
  );
};

export default Testimonials;
