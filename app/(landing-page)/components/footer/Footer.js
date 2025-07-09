import Link from "next/link";
import styles from "./Footer.module.css";
import Image from "next/image";
import FooterContent from "../../../login/components/footer/Footer";
import facebook from "../../../../public/images/landingPage/facebook.png";
import insta from "../../../../public/images/landingPage/instagram.png";
import twitter from "../../../../public/images/landingPage/twitter.png";
import youtube from "../../../../public/images/landingPage/youtube.png";
import Logo from "../header/components/logo/Logo";

const Footer = () => {
  return (
    <div className={styles.wrapper}>
      <div className="container">
        <div className="row">
          <div className="col-md-4 col-sm-12 mb-3">
            <Logo className="landing" />
            <p className="mt-3">
              Atmoon simplifies payments with fast transactions, a
              user-friendly dashboard, easy integration, 100+ payment methods,
              and a reliable UPI stack, making payments easy for your business.
            </p>
            {/* <div className={styles.social}>
              <Link href="">
                <Image src={facebook} alt="facebook" />
              </Link>
              <Link href="">
                <Image src={insta} alt="instagram" />
              </Link>
              <Link href="">
                <Image src={twitter} alt="twitter" />
              </Link>
              <Link href="">
                <Image src={youtube} alt="youtube" />
              </Link>
            </div> */}
          </div>
          <div className="col-md-2 col-sm-12 mb-3">
            <h3>Quick Links</h3>
            <ul>
              <li>
                <Link href="#about">About us</Link>
              </li>
              <li>
                <Link href="#solutions">Solutions</Link>
              </li>
              {/* <li>
                <Link href="/pricing">Pricing</Link>
              </li> */}
              <li>
                <Link href="#contact">Contact</Link>
              </li>
            </ul>
          </div>
          <div className="col-md-2 col-sm-12 mb-3">
            <h3>Useful Links</h3>
            <ul>
              <li>
                <Link href="/privacy-policy">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms-and-conditions">Terms & Conditions</Link>
              </li>
              {/* <li>
                <Link href="/disclaimer">Disclaimer</Link>
              </li>
              <li>
                <Link href="/support">Support</Link>
              </li>
              <li>
                <Link href="/faq">FAQ</Link>
              </li> */}
            </ul>
          </div>
          <div className="col-md-4 col-sm-12 mb-3">
            <h3>Stay Updated with Atmoon! </h3>
            <p>
              Subscribe now to receive updates, news, and helpful information
              about Atmoon’s payment solutions. Stay informed and improve
              your business!
            </p>
            {/* <form action="">
              <input type="text" placeholder="Email Address" />
              <button>Subcribe</button>
            </form> */}
          </div>
        </div>
        <hr />
        <FooterContent className="landing" />
      </div>
    </div>
  );
};

export default Footer;
