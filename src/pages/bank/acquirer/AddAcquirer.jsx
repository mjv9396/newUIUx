import { useEffect, useState } from "react";
import styles from "../../../styles/common/Add.module.css";
import { addAcquirer } from "../../../forms/payin";
import { endpoints } from "../../../services/apiEndpoints";
import usePost from "../../../hooks/usePost";
import { validateAcquirerForm } from "../../../formValidations/acquirerForm";
import { successMessage } from "../../../utils/messges";
const AddAcquirer = () => {
  // form handlers
  const [formData, setFormData] = useState(addAcquirer);
  const [errors, setErrors] = useState({});
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({});
  };
  // API handlers
  const { postData, data, error, loading } = usePost(
    endpoints.payin.addAcquirer
  );
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateAcquirerForm(formData);
    if (Object.keys(validationError).length > 0) {
      setErrors(validationError);
      return;
    }
    await postData(formData);
  };

  useEffect(() => {
    if (data && !error) {
      successMessage("Acquirer added successfully");
    }
  }, [error, data]);
  return (
    <div className={styles.listing}>
      <form onSubmit={handleSubmit}>
        <div className="d-flex flex-wrap gap-3 align-items-center">
          <div className={styles.input}>
            <label htmlFor="acqName">
              Acquirer Name <span className="required">*</span>
            </label>
            <input
              type="text"
              name="acqName"
              id="acqName"
              placeholder="Enter Acquirer Name"
              autoComplete="on"
              maxLength={256}
              onChange={handleChange}
              value={formData.acqName}
            />
            {errors.acqName && <span className="errors">{errors.acqName}</span>}
          </div>
          <div className={styles.input}>
            <label htmlFor="acqCode">
              Acquirer Code <span className="required">*</span>
            </label>
            <input
              type="text"
              name="acqCode"
              id="acqCode"
              placeholder="Enter Acquirer Code"
              autoComplete="on"
              maxLength={256}
              onChange={handleChange}
              value={formData.acqCode}
            />
            {errors.acqCode && <span className="errors">{errors.acqCode}</span>}
          </div>
          <div className="d-flex gap-3 justify-content-end mt-4 align-items-center mx-2">
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
              onClick={() => setFormData(addAcquirer)}
            >
              clear
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddAcquirer;
