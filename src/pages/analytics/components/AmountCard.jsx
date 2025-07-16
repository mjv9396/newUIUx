/* eslint-disable react/prop-types */
import styles from "../../../styles/cards/Amount.module.css";
import { formatToINRCurrency } from "../../../utils/formatToINRCurrency ";

const AmountCard = ({ img, amt = 0, name, type, className }) => {
  return (
    <div className={styles.card + " " + styles[type] + " " + styles[className]}>
      <span className="flex flex-column gap-5 justify-content-between">
        <h6>{formatToINRCurrency(amt)}</h6>
        <span>{name}</span>
      </span>
      <img src={img} alt="card-image" />
    </div>
  );
};

export default AmountCard;
