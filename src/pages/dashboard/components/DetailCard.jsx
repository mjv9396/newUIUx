/* eslint-disable react/prop-types */
import styles from "../../../styles/dashboard/Dashboard.module.css";
import { formatToINRCurrency } from "../../../utils/formatToINRCurrency ";
const DetailCard = ({
  img = "",
  count = 0,
  amt = 0,
  name,
  type,
  className,
}) => {
  return (
    <div
      className={
        styles.detailcard + " " + styles[type] + " " + styles[className]
      }
    >
      <span className="flex flex-column gap-5 justify-content-between">
        <h5>{count}</h5>
        <h6>{formatToINRCurrency(amt)}</h6>
        <span>{name}</span>
      </span>
      <img src={img} alt="card-image" />
    </div>
  );
};

export default DetailCard;
