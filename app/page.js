import { Fragment } from "react";
import Header from "./(landing-page)/components/header/Header";
import Hero from "./(landing-page)/index/hero/Hero";
import Connect from "./(landing-page)/index/connect/Connect";
import Run from "./(landing-page)/index/run/Run";
import Services from "./(landing-page)/index/services/Services";
import Testimonials from "./(landing-page)/index/testimonials/Testimonials";
import Contact from "./(landing-page)/index/contact/Contact";
import Footer from "./(landing-page)/components/footer/Footer";

export default function Home() {
  return (
    <Fragment>
      <Header />
      <Hero />
      {/* <Brands /> */}
      <Connect />
      <Run />
      <Services />
      <Testimonials />
      <Contact />
      <Footer />
    </Fragment>
  );
}
