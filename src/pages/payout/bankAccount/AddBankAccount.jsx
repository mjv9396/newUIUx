import { useEffect, useState } from "react";
import { addbeneficiary } from "../../../forms/payout";
import usePost from "../../../hooks/usePost";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { endpoints } from "../../../services/apiEndpoints";
import styles from "../../../styles/common/Add.module.css";
import { validateAddBeneficiaryForm } from "../../../formValidations/addBeneficiaryForm";

import { successMessage } from "../../../utils/messges";

const AddBankAccount = () => {
  // form handlers
  const [formData, setFormData] = useState(addbeneficiary);
  const [errors, setErrors] = useState({});
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({});
  };

  // API handlers
  const { postData, data, error, loading } = usePost(
    endpoints.payout.addbeneficiary
  );
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateAddBeneficiaryForm(formData);
    if (Object.keys(validationError).length > 0) {
      setErrors(validationError);
      return;
    }
    await postData(formData);
  };

  useEffect(() => {
    if (data && !error) {
      successMessage("Beneficiary Added Successfully");
      setFormData(addbeneficiary);
    }
  }, [error, data]);
  return (
    <DashboardLayout
      page="Beneficiary Save Bank Account"
      url="/dashboard/beneficiary-save-bank"
    >
      <div className={styles.listing}>
        <form onSubmit={handleSubmit}>
          <div className="d-flex flex-wrap gap-3 ">
            <div className={styles.input}>
              <label htmlFor="name">
                Name <span className="required">*</span>
              </label>
              <input
                type="text"
                name="name"
                id="name"
                placeholder="Enter Name"
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
                Mobile Number <span className="required">*</span>
              </label>
              <input
                type="number"
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
              <label htmlFor="accountNo">
                Account Number <span className="required">*</span>
              </label>
              <input
                type="number"
                name="accountNo"
                id="accountNo"
                placeholder="Enter Account Number"
                autoComplete="on"
                maxLength={256}
                onChange={handleChange}
                value={formData.accountNo}
                required
              />
              {errors.accountNo && (
                <span className="errors">{errors.accountNo}</span>
              )}
            </div>
            <div className={styles.input}>
              <label htmlFor="ifscCode">
                IFSC Code <span className="required">*</span>
              </label>
              <input
                type="text"
                name="ifscCode"
                id="ifscCode"
                placeholder="Enter IFSC code"
                autoComplete="on"
                maxLength={256}
                onChange={handleChange}
                value={formData.ifscCode}
                required
              />
              {errors.ifscCode && (
                <span className="errors">{errors.ifscCode}</span>
              )}
            </div>
          </div>
          <div className="d-flex gap-3 mt-3 justify-content-end">
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
              onClick={() => setFormData(addbeneficiary)}
            >
              clear
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default AddBankAccount;
