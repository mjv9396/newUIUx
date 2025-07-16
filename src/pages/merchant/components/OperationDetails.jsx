/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import styles from "../../../styles/merchant/Merchant.module.css";
import { useNavigate } from "react-router-dom";
import { endpoints } from "../../../services/apiEndpoints";
import usePost from "../../../hooks/usePost";
import { successMessage } from "../../../utils/messges";

const OperationDetails = ({
  userId,
  operationAddress,
  operationState,
  operationCity,
  operationPostalCode,
  ...rest
}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userId,
    operationAddress,
    operationState,
    operationCity,
    operationPostalCode,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const { postData, data, error } = usePost(endpoints.user.updateUser);

  const handleUpdateData = async () => {
    postData(formData);
  };
  useEffect(() => {
    if (data && !error) {
      const updatedState = { ...rest, ...formData };
      successMessage("details updated successfully");
      navigate("/update-merchant", { state: updatedState });
    }
  }, [error, data]);
  return (
    <div>
      <h6>Operation Details</h6>
      <div className="d-flex flex-wrap gap-3">
        <div className={styles.input}>
          <label htmlFor="operationAddress">Operation Address</label>
          <input
            type="text"
            name="operationAddress"
            id="operationAddress"
            placeholder="Enter Operational Address"
            autoComplete="on"
            maxLength={256}
            defaultValue={operationAddress}
            onChange={handleChange}
          />
        </div>
        <div className={styles.input}>
          <label htmlFor="operationState">Operational State</label>
          <input
            type="text"
            name="operationState"
            id="operationState"
            placeholder="Enter Operational State"
            autoComplete="on"
            maxLength={256}
            defaultValue={operationState}
            onChange={handleChange}
          />
        </div>
        <div className={styles.input}>
          <label htmlFor="mopName">Operational City</label>
          <input
            type="text"
            name="operationCity"
            id="operationCity"
            placeholder="Enter Operational City"
            autoComplete="on"
            maxLength={256}
            defaultValue={operationCity}
            onChange={handleChange}
          />
        </div>
        <div className={styles.input}>
          <label htmlFor="mopName">Operational Pincode</label>
          <input
            type="text"
            name="operationPostalCode"
            id="operationPostalCode"
            placeholder="Enter Operational Postal Code"
            autoComplete="on"
            maxLength={256}
            defaultValue={operationPostalCode}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="d-flex justify-content-end mt-3">
        <button className={styles.update} onClick={handleUpdateData}>
          Update
        </button>
      </div>
    </div>
  );
};

export default OperationDetails;
