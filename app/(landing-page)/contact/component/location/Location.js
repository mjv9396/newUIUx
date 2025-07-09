import styles from "./Location.module.css";

const Location = () => {
  return (
    <div className="container-fluid">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7004.094496112618!2d77.35876100000002!3d28.628346!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce5f84be111c5%3A0x13c7725a47435a!2sCyberSigma%20Consulting%20Services!5e0!3m2!1sen!2sin!4v1740382315382!5m2!1sen!2sin"
        className={styles.map}
        width="100%"
        height="500"
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
};

export default Location;
