import { useEffect, useState } from "react";
import styles from "../../../styles/common/Add.module.css";
import { addPaymentType } from "../../../forms/payin";
import { endpoints } from "../../../services/apiEndpoints";
import usePost from "../../../hooks/usePost";
import useFetch from "../../../hooks/useFetch";
import Error from "../../errors/Error";
import Loading from "../../errors/Loading";
import { successMessage } from "../../../utils/messges";
import { validatePaymentTypeForm } from "../../../formValidations/paymentTypeForm";
const AddPaymentType = () => {
  //fetch curreny and country
  const {
    fetchData: getAllCurrency,
    data: allCurrency,
    error: currencyError,
    loading: currencyLoading,
  } = useFetch();
  const {
    fetchData: getAllCountry,
    data: allCountry,
    error: countryError,
    loading: countryLoading,
  } = useFetch();

  useEffect(() => {
    getAllCountry(endpoints.payin.countryList);
    getAllCurrency(endpoints.payin.currencyList);
  }, []);

  // form handlers
  const [formData, setFormData] = useState(addPaymentType);
  const [errors, setErrors] = useState({});
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({});
  };
  // API handlers
  const { postData, data, error, loading } = usePost(
    endpoints.payin.addPaymentType
  );
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validatePaymentTypeForm(formData);
    if (Object.keys(validationError).length > 0) {
      setErrors(validationError);
      return;
    }
    await postData(formData);
  };

  useEffect(() => {
    if (data && !error) {
      successMessage("Payment Added Successfully");
    }
  }, [error, data]);
  if (currencyError) <Error error="Error loading Currency" />;
  if (countryError) <Error error="Error loading Country" />;
  if (currencyLoading || countryLoading)
    <Loading loading="Loading Currency and Country List" />;
  if (allCountry && allCurrency)
    return (
      <div className={styles.listing}>
        <form onSubmit={handleSubmit}>
          <div className="d-flex flex-wrap gap-3 align-items-center">
            <div className={styles.input}>
              <label htmlFor="paymentTypeName">
                Name <span className="required">*</span>
              </label>
              <input
                type="text"
                name="paymentTypeName"
                id="paymentTypeName"
                placeholder="Enter Payment Type Name"
                autoComplete="on"
                maxLength={256}
                onChange={handleChange}
                value={formData.paymentTypeName}
                required
              />
              {errors.paymentTypeName && (
                <span className="errors">{errors.paymentTypeName}</span>
              )}
            </div>
            <div className={styles.input}>
              <label htmlFor="paymentTypeCode">
                Code <span className="required">*</span>
              </label>
              <input
                type="text"
                name="paymentTypeCode"
                id="paymentTypeCode"
                placeholder="Enter Payment Type Code"
                autoComplete="on"
                maxLength={256}
                onChange={handleChange}
                value={formData.paymentTypeCode}
                required
              />
              {errors.paymentTypeCode && (
                <span className="errors">{errors.paymentTypeCode}</span>
              )}
            </div>
            <div className={styles.input}>
              <label htmlFor="countryCode">
                Country Code <span className="required">*</span>
              </label>
              <select
                name="countryCode"
                id="countryCode"
                onChange={handleChange}
                required
                defaultValue=""
              >
                <option value="" disabled>
                  --Select Country Code--
                </option>
                {allCountry.data.length > 0 ? (
                  allCountry.data.map((country) => (
                    <option
                      key={country.isoCodeAlpha3}
                      value={country.isoCodeAlpha3}
                    >
                      {country.countryName} ({country.isoCodeAlpha3})
                    </option>
                  ))
                ) : (
                  <option>No country added</option>
                )}
              </select>
              {errors.countryCode && (
                <span className="errors">{errors.countryCode}</span>
              )}
            </div>
            <div className={styles.input}>
              <label htmlFor="currencyCode">
                Currency Code <span className="required">*</span>
              </label>
              <select
                name="currencyCode"
                id="currencyCode"
                onChange={handleChange}
                required
                defaultValue=""
              >
                <option value="" disabled>
                  --Select Currency Code--
                </option>
                {allCurrency.data.length > 0 ? (
                  allCurrency.data.map((currency) => (
                    <option
                      key={currency.currencyCode}
                      value={currency.currencyCode}
                    >
                      {currency.currencyName} ({currency.currencyCode})
                    </option>
                  ))
                ) : (
                  <option>No currency added</option>
                )}
              </select>
              {errors.currencyCode && (
                <span className="errors">{errors.currencyCode}</span>
              )}
            </div>
          </div>
          <div className="d-flex justify-content-end gap-3">
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
              onClick={() => setFormData(addPaymentType)}
            >
              clear
            </button>
          </div>
        </form>
      </div>
    );
};

export default AddPaymentType;
