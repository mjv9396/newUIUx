/* eslint-disable react/prop-types */
import styles from "../../../styles/cards/Count.module.css";
const CountCard = ({ count = 0, name = "", type }) => {
  return (
    <div className={styles.card + " " + styles[type]}>
      <span>{name}</span>
      <h6>{count}</h6>
    </div>
  );
};

export default CountCard;
