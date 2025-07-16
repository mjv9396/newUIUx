import { useEffect, useState } from "react";
import styles from "../../../styles/common/Add.module.css";
import { addCurrency } from "../../../forms/payin";
import { endpoints } from "../../../services/apiEndpoints";
import usePost from "../../../hooks/usePost";
import { validateCurrencyForm } from "../../../formValidations/currencyForm";
import { successMessage } from "../../../utils/messges";
const AddCurrency = () => {
  // form handlers
  const [formData, setFormData] = useState(addCurrency);
  const [errors, setErrors] = useState({});
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? `${checked}` : value,
    });
    setErrors({});
  };
  // API handlers
  const { postData, data, error, loading } = usePost(
    endpoints.payin.addCurrency
  );
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateCurrencyForm(formData);
    if (Object.keys(validationError).length > 0) {
      setErrors(validationError);
      return;
    }
    await postData(formData);
  };

  useEffect(() => {
    if (data && !error) {
      successMessage("Currency added successfully");
      setFormData(addCurrency);
    }
  }, [error, data]);
  return (
    <div className={styles.listing}>
      <form onSubmit={handleSubmit}>
        <div className="d-flex flex-wrap gap-3 align-items-center ">
          <div className={styles.input}>
            <div className={styles.input}>
              <label htmlFor="currencyName">
                Name <span className="required">*</span>
              </label>
              <input
                type="text"
                name="currencyName"
                id="currencyName"
                placeholder="Enter Currency Name"
                autoComplete="on"
                maxLength={256}
                onChange={handleChange}
                value={formData.currencyName}
              />
              {errors.currencyName && (
                <span className="errors">{errors.currencyName}</span>
              )}
            </div>
          </div>
          <div className={styles.input}>
            <label htmlFor="currencyCode">
              Code <span className="required">*</span>
            </label>
            <input
              type="text"
              name="currencyCode"
              id="currencyCode"
              placeholder="Enter Currency Code"
              autoComplete="on"
              maxLength={256}
              onChange={handleChange}
              value={formData.currencyCode}
            />
            {errors.currencyCode && (
              <span className="errors">{errors.currencyCode}</span>
            )}
          </div>
          <div className={styles.input}>
            <label htmlFor="currencyNumber">
              Number <span className="required">*</span>
            </label>
            <input
              type="text"
              name="currencyNumber"
              id="currencyNumber"
              placeholder="Enter Currency Number"
              autoComplete="on"
              maxLength={256}
              onChange={handleChange}
              value={formData.currencyNumber}
            />
            {errors.currencyNumber && (
              <span className="errors">{errors.currencyNumber}</span>
            )}
          </div>
          <div className={styles.input}>
            <label htmlFor="currencyDecimalPlace">
              Decimal Places <span className="required">*</span>
            </label>
            <input
              type="number"
              name="currencyDecimalPlace"
              id="currencyDecimalPlace"
              placeholder="Enter Currency Decimal Places"
              autoComplete="on"
              maxLength={256}
              onChange={handleChange}
              value={formData.currencyDecimalPlace}
            />
            {errors.currencyDecimalPlace && (
              <span className="errors">{errors.currencyDecimalPlace}</span>
            )}
          </div>
        </div>
        <div className="d-flex gap-3  justify-content-end align-items-center">
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
            onClick={() => setFormData(addCurrency)}
          >
            clear
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCurrency;
