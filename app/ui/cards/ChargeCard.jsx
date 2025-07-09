import styles from "./Card.module.css";
const ChargeCard = ({ type, value = 0.0, symbol }) => {
  return (
    <div className={styles.card} id={styles.charge}>
      <h5>
        <span>{symbol} </span>
        {value}
      </h5>
      <h6>{type}</h6>
    </div>
  );
};

export default ChargeCard;
