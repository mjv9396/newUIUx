import Link from "next/link";
import styles from "./Footer.module.css";
export default function Footer({ className = "" }) {
  return null;
  // <div
  //   className={
  //     className !== ""
  //       ? styles.footer + " " + styles[className]
  //       : styles.footer
  //   }
  // >
  //   <p>
  //     &#64;&nbsp;2024 Atmoon. All rights reserved &nbsp;&nbsp;|&nbsp;&nbsp;
  //     <Link href="/terms-and-conditions">Terms and Conditions</Link>
  //     &nbsp;&nbsp;|&nbsp;&nbsp;
  //     <Link href="/privacy-policy">Privacy Policy</Link>
  //   </p>
  // </div>
}
