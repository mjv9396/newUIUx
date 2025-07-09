import styles from "./Brands.module.css";
import img1 from "../../../public/images/landingPage/bakebun.png";
import img2 from "../../../public/images/landingPage/busima.png";
import img3 from "../../../public/images/landingPage/clicknbuy.png";
import img4 from "../../../public/images/landingPage/creavo.png";
import img5 from "../../../public/images/landingPage/dailymart.png";
import img6 from "../../../public/images/landingPage/egao.png";
import img7 from "../../../public/images/landingPage/fixcom.png";
import img8 from "../../../public/images/landingPage/fleu.png";
import img9 from "../../../public/images/landingPage/fluenca.png";
import img10 from "../../../public/images/landingPage/fomie.png";
import Image from "next/image";
import Subtitle from "@/app/ui/headings/Subtitle";
export default function Brands() {
  return (
    <div className={styles.brands}>
      <div className="d-flex w-50">
        <Subtitle
          label="Trusted by 25,000+ world-class brands and organizations of all sizes"
          className="landing"
        />
      </div>
      <div className="container d-flex justify-content-evenly flex-wrap gap-5 mt-5">
        <Image loading="lazy" src={img1} alt="bakebun" />
        <Image loading="lazy" src={img2} alt="busima" />
        <Image loading="lazy" src={img3} alt="clicknbuy" />
        <Image loading="lazy" src={img4} alt="creavo" />
        <Image loading="lazy" src={img5} alt="dailymart" />
        <Image loading="lazy" src={img6} alt="egao" />
        <Image loading="lazy" src={img7} alt="fixcom" />
        <Image loading="lazy" src={img8} alt="fleu" />
        <Image loading="lazy" src={img9} alt="fluenca" />
        <Image loading="lazy" src={img10} alt="fomie" />
      </div>
    </div>
  );
}
