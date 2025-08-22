import { useEffect, useState } from "react";
import { addVPA } from "../../../forms/payout";
import usePost from "../../../hooks/usePost";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { endpoints } from "../../../services/apiEndpoints";
import styles from "../../../styles/common/Add.module.css";
import { validateAddBeneficiaryForm } from "../../../formValidations/addBeneficiaryForm";

import { successMessage } from "../../../utils/messges";

const AddVPA = () => {
  // form handlers
  const [formData, setFormData] = useState(addVPA);
  const [errors, setErrors] = useState({});
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({});
  };

  // API handlers
  const { postData, data, error, loading } = usePost(endpoints.payout.addVPA);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateAddBeneficiaryForm(formData, true);
    if (Object.keys(validationError).length > 0) {
      setErrors(validationError);
      return;
    }
    await postData(formData);
  };

  useEffect(() => {
    if (data && !error) {
      successMessage("VPA Added Successfully");
      setFormData(addVPA);
    }
  }, [error, data]);
  return (
    <DashboardLayout
      page="Beneficiary VPA Save"
      url="/dashboard/beneficiary-vpa-save"
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
              onClick={() => setFormData(addVPA)}
            >
              clear
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default AddVPA;
