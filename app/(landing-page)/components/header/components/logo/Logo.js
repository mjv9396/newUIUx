import Image from "next/image";
import styles from "./Logo.module.css";
import logo from "../../../../../../public/logo.png";
import Link from "next/link";
export default function Logo({ className = "" }) {
  return (
    <Link href="/">
      <Image
        src={logo}
        alt="Atmoon Logo"
        className={styles.logo + " " + styles[className]}
      />
    </Link>
  );
}
