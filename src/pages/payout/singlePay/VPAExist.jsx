import { useEffect, useState } from "react";
import { validateAddExistingVPAForm } from "../../../formValidations/existingVPA";
import usePost from "../../../hooks/usePost";
import { endpoints } from "../../../services/apiEndpoints";
import styles from "../../../styles/common/Add.module.css";

import { existingVPA } from "../../../forms/payout";
import useFetch from "../../../hooks/useFetch";
import DashboardLayout from "../../../layouts/DashboardLayout";
import classes from "../../../styles/sendMoney/SendMoney.module.css";
import { roundAmount } from "../../../utils/roundAmount";
import { successMessage } from "../../../utils/messges";

const VPAExist = () => {
  const { fetchData: getAmount, data: amount } = useFetch();
  useEffect(() => {
    getAmount(endpoints.user.balance);
  }, []);
  //fetch beneficiary
  const { fetchData: getAllBeneficiary, data: allBeneficiary } = useFetch();
  useEffect(() => {
    getAllBeneficiary(endpoints.payout.beneficiary);
  }, []);

  // form handlers
  const [formData, setFormData] = useState(existingVPA);
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
    const validationError = validateAddExistingVPAForm(formData);
    if (Object.keys(validationError).length > 0) {
      setErrors(validationError);
      return;
    }
    await postData(formData);
    e.target.reset();
  };

  useEffect(() => {
    if (data && !error) {
      successMessage(data.data || "VPA added Successfully");
      setFormData(existingVPA);
    }
  }, [error, data]);
  if (allBeneficiary)
    return (
      <DashboardLayout
        page="Save Beneficiary Payout"
        url="/dashboard/save-beneficiary-payout"
      >
        <div className="container">
          <div className={styles.listing} style={{ width: "60vw" }}>
            <div className={classes.sendmoney}>
              <h6>
                <i className="bi bi-bank"></i> Available Balance
              </h6>
              <button>
                &#8377; {roundAmount(amount?.data?.accountBalance || 0)}
              </button>
            </div>
          </div>
          <div className={styles.listing} style={{ width: "60vw" }}>
            <form onSubmit={handleSubmit}>
              <div className="d-flex flex-wrap gap-3 ">
                <div className={styles.input}>
                  <label htmlFor="countryName">
                    Beneficiary <span className="required">*</span>
                  </label>
                  <select
                    name="beneficiaryId"
                    id="beneficiaryId"
                    onChange={handleChange}
                    defaultValue=""
                    required
                  >
                    <option value="" disabled>
                      --Select Beneficiary--
                    </option>
                    {allBeneficiary.data.length > 0 ? (
                      allBeneficiary.data.map((item) => (
                        <option
                          key={item.beneficiaryId}
                          value={item.beneficiaryId}
                        >
                          {item.name}
                        </option>
                      ))
                    ) : (
                      <option>No beneficiary avilable</option>
                    )}
                  </select>
                  {errors.beneficiaryId && (
                    <span className="errors">{errors.beneficiaryId}</span>
                  )}
                </div>
                <div className={styles.input}>
                  <label htmlFor="transactionAmmount">
                    Transaction Amount <span className="required">*</span>
                  </label>
                  <input
                    type="number"
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
                    required
                  >
                    <option value="" disabled>
                      --Select Mode of Transaction--
                    </option>
                    <option value="NEFT">NEFT</option>
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
                      !loading
                        ? styles.submit + " " + styles.active
                        : styles.submit
                    }
                    type="submit"
                  >
                    Transfer
                  </button>
                  <button
                    className={styles.clear}
                    type="reset"
                    onClick={() => setFormData(existingVPA)}
                  >
                    clear
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </DashboardLayout>
    );
};

export default VPAExist;
