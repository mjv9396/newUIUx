import { Fragment } from "react";
import Footer from "../components/footer/Footer";
import Header from "../components/header/Header";
import Hero from "./component/hero/Hero";
import Touch from "./component/touch/Touch";
import Location from "./component/location/Location";

export default function Contact() {
  return (
    <Fragment>
      <Header />
      <Hero />
      <Touch />
      <Location />
      <Footer />
    </Fragment>
  );
}
