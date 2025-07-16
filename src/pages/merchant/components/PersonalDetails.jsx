/* eslint-disable react/prop-types */
import styles from "../../../styles/merchant/Merchant.module.css";
const PersonalDetails = ({
  firstName,
  lastName,
  email,
  phoneNumber,
  username,
}) => {
  return (
    <div>
      <h6>Personal Details</h6>
      <div className="d-flex flex-wrap gap-3 mt-3">
        <div className={styles.input}>
          <label htmlFor="firstName">
            First Name <span className="required">*</span>
          </label>
          <input
            type="text"
            name="firstName"
            id="firstName"
            disabled
            readOnly
            value={firstName}
          />
        </div>
        <div className={styles.input}>
          <label htmlFor="lastName">
            Last Name <span className="required">*</span>
          </label>
          <input
            type="text"
            name="lastName"
            id="lastName"
            value={lastName}
            readOnly
            disabled
          />
        </div>
        <div className={styles.input}>
          <label htmlFor="email">
            Email <span className="required">*</span>
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            disabled
            readOnly
          />
        </div>
        <div className={styles.input}>
          <label htmlFor="phoneNumber">
            Phone Number <span className="required">*</span>
          </label>
          <input
            type="text"
            name="phoneNumber"
            id="phoneNumber"
            value={phoneNumber}
            disabled
            readOnly
          />
        </div>
        <div className={styles.input}>
          <label htmlFor="username">
            User Name <span className="required">*</span>
          </label>
          <input
            type="text"
            name="username"
            id="username"
            value={username}
            disabled
            readOnly
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalDetails;
