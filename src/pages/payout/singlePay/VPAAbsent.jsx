import { useEffect, useState } from "react";
import { endpoints } from "../../../services/apiEndpoints";
import useFetch from "../../../hooks/useFetch";
import styles from "../../../styles/common/Add.module.css";
import { validateAddVPAForm } from "../../../formValidations/vpaForm";
import usePost from "../../../hooks/usePost";

import { addNewVPA } from "../../../forms/payout";
import { successMessage } from "../../../utils/messges";

const VPAAbsent = () => {
  //fetch beneficiary
  const { fetchData: getAllBeneficiary, data: allBeneficiary } = useFetch();
  useEffect(() => {
    getAllBeneficiary(endpoints.payout.beneficiary);
  }, []);

  // form handlers
  const [formData, setFormData] = useState(addNewVPA);
  const [errors, setErrors] = useState({});
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({});
  };

  // API handlers
  const { postData, data, error, loading } = usePost(
    endpoints.payout.existingVPA
  );
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateAddVPAForm(formData);
    if (Object.keys(validationError).length > 0) {
      setErrors(validationError);
      return;
    }
    await postData(formData);
    e.preventDefault();
  };

  useEffect(() => {
    if (data && !error) {
      successMessage("VPA added Successfully");
      setFormData(addNewVPA);
    }
  }, [error, data]);

  if (allBeneficiary)
    return (
      <div className={styles.listing}>
        <form onSubmit={handleSubmit}>
          <div className="d-flex flex-wrap gap-3 ">
            <div className={styles.input}>
              <label htmlFor="nickname">
                Beneficiary Name <span className="required">*</span>
              </label>
              <input
                type="text"
                name="name"
                id="name"
                placeholder="Enter Beneficiary Name"
                autoComplete="on"
                maxLength={256}
                onChange={handleChange}
                value={formData.name}
                required
              />
              {errors.name && <span className="errors">{errors.name}</span>}
            </div>
            <div className={styles.input}>
              <label htmlFor="nickname">
                Nick Name <span className="required">*</span>
              </label>
              <input
                type="text"
                name="nickname"
                id="nickname"
                placeholder="Enter Nick Name"
                autoComplete="on"
                maxLength={256}
                onChange={handleChange}
                value={formData.nickname}
                required
              />
              {errors.nickname && (
                <span className="errors">{errors.nickname}</span>
              )}
            </div>
            <div className={styles.input}>
              <label htmlFor="mobile">
                Mobile <span className="required">*</span>
              </label>
              <input
                type="text"
                name="mobile"
                id="mobile"
                placeholder="Enter Mobile Number"
                autoComplete="on"
                maxLength={256}
                onChange={handleChange}
                value={formData.mobile}
                required
              />
              {errors.mobile && <span className="errors">{errors.mobile}</span>}
            </div>
            <div className={styles.input}>
              <label htmlFor="email">
                Email <span className="required">*</span>
              </label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Enter Email"
                autoComplete="on"
                maxLength={256}
                onChange={handleChange}
                value={formData.email}
                required
              />
              {errors.email && <span className="errors">{errors.email}</span>}
            </div>
            <div className={styles.input}>
              <label htmlFor="vpaAddress">
                VPA Address <span className="required">*</span>
              </label>
              <input
                type="text"
                name="vpaAddress"
                id="vpaAddress"
                placeholder="Enter VPA Address"
                autoComplete="on"
                maxLength={256}
                onChange={handleChange}
                value={formData.vpaAddress}
                required
              />
              {errors.vpaAddress && (
                <span className="errors">{errors.vpaAddress}</span>
              )}
            </div>
            <div className={styles.input}>
              <label htmlFor="transactionAmmount">
                Amount <span className="required">*</span>
              </label>
              <input
                type="text"
                name="transactionAmmount"
                id="transactionAmmount"
                placeholder="Enter Transaction Amount"
                autoComplete="on"
                maxLength={256}
                onChange={handleChange}
                value={formData.transactionAmmount}
                required
              />
              {errors.transactionAmmount && (
                <span className="errors">{errors.transactionAmmount}</span>
              )}
            </div>
            <div className={styles.input}>
              <label htmlFor="transactionBankTransferMode">
                Mode of Transaction <span className="required">*</span>
              </label>
              <select
                name="transactionBankTransferMode"
                id="transactionBankTransferMode"
                defaultValue=""
                onChange={handleChange}
              >
                <option value="" disabled>
                  --Select Mode of Transaction--
                </option>
                <option value="NEFT">NEFT</option>
                <option value="IFT">IFT</option>
                <option value="RTGS">RTGS</option>
                <option value="IMPS">IMPS</option>
                <option value="UPI">UPI</option>
              </select>
              {errors.transactionBankTransferMode && (
                <span className="errors">
                  {errors.transactionBankTransferMode}
                </span>
              )}
            </div>
            <div className="d-flex gap-3 mt-4 justify-content-end align-align-items-center">
              <button
                className={
                  !loading ? styles.submit + " " + styles.active : styles.submit
                }
                type="submit"
              >
                Add
              </button>
              <button
                className={styles.clear}
                type="reset"
                onClick={() => setFormData(addNewVPA)}
              >
                clear
              </button>
            </div>
          </div>
        </form>
      </div>
    );
};

export default VPAAbsent;
