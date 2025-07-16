import styles from "../../../styles/dashboard/Dashboard.module.css";

const DepositCard = ({ img, title = "" }) => {
  return (
    <div className={styles.depositCard}>
      <img src={img} alt="" />
      <h5>{title}</h5>
    </div>
  );
};

export default DepositCard;
