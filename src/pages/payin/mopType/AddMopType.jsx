import { useEffect, useRef, useState } from "react";
import styles from "../../../styles/common/Add.module.css";
import useFetch from "../../../hooks/useFetch";
import { endpoints } from "../../../services/apiEndpoints";
import { addMopType } from "../../../forms/payin";
import { validateMopTypeForm } from "../../../formValidations/mopTypeForm";

import Error from "../../errors/Error";
import Loading from "../../errors/Loading";
import usePost from "../../../hooks/usePost";
import { successMessage } from "../../../utils/messges";

const AddMopType = () => {
  const formRef = useRef(null);
  //fetch curreny, country and payment type
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
  const {
    fetchData: getAllPaymentType,
    data: allPaymentType,
    error: paymentTypeError,
    loading: paymentTypeLoading,
  } = useFetch();

  useEffect(() => {
    getAllCountry(endpoints.payin.countryList);
    getAllCurrency(endpoints.payin.currencyList);
    getAllPaymentType(endpoints.payin.paymentTypeList);
  }, []);

  // form handlers
  const [formData, setFormData] = useState(addMopType);
  const [errors, setErrors] = useState({});
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({});
  };

  // API handlers
  const { postData, data, error, loading } = usePost(
    endpoints.payin.addMopType
  );
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateMopTypeForm(formData);
    if (Object.keys(validationError).length > 0) {
      setErrors(validationError);
      return;
    }
    await postData(formData);
    e.target.reset();
  };

  useEffect(() => {
    if (data && !error) {
      successMessage("Mop Type Added Successfully");
      formRef.current.reset();
      setFormData(addMopType);
    }
  }, [error, data]);
  if (currencyError) <Error error="Error loading Currency" />;
  if (countryError) <Error error="Error loading Country" />;
  if (paymentTypeError) <Error error="Error loading Payment Type" />;
  if (currencyLoading || countryLoading || paymentTypeLoading)
    <Loading loading="Loading Currency, Country List or Payment Type" />;
  if (allCountry && allCurrency && allPaymentType)
    return (
      <div className={styles.listing}>
        <form onSubmit={handleSubmit} ref={formRef}>
          <div className="d-flex flex-wrap gap-3 align-items-center">
            <div className={styles.input}>
              <label htmlFor="mopName">
                Name <span className="required">*</span>
              </label>
              <input
                type="text"
                name="mopName"
                id="mopName"
                placeholder="Enter MOP Type Name"
                autoComplete="on"
                maxLength={256}
                onChange={handleChange}
                value={formData.mopName}
                required
              />
              {errors.mopName && (
                <span className="errors">{errors.mopName}</span>
              )}
            </div>
            <div className={styles.input}>
              <label htmlFor="mopCode">
                Code <span className="required">*</span>
              </label>
              <input
                type="text"
                name="mopCode"
                id="mopCode"
                placeholder="Enter MOP Type Code"
                autoComplete="on"
                maxLength={256}
                onChange={handleChange}
                value={formData.mopCode}
                required
              />
              {errors.mopCode && (
                <span className="errors">{errors.mopCode}</span>
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
              {errors.currencyNumber && (
                <span className="errors">{errors.currencyNumber}</span>
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
            <div className={styles.input}>
              <label htmlFor="paymentTypeCode">
                Payment Type Code <span className="required">*</span>
              </label>
              <select
                name="paymentTypeCode"
                id="paymentTypeCode"
                onChange={handleChange}
                required
                defaultValue=""
              >
                <option value="" disabled>
                  --Select Payment Type Code--
                </option>
                {allPaymentType.data.length > 0 ? (
                  allPaymentType.data.map((payment) => (
                    <option
                      key={payment.paymentTypeCode}
                      value={payment.paymentTypeCode}
                    >
                      {payment.paymentTypeName} ({payment.paymentTypeCode})
                    </option>
                  ))
                ) : (
                  <option>No payment type added</option>
                )}
              </select>
              {errors.paymentTypeCode && (
                <span className="errors">{errors.paymentTypeCode}</span>
              )}
            </div>
            <div className="d-flex justify-content-end gap-3 ">
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
                onClick={() => setFormData(addMopType)}
              >
                clear
              </button>
            </div>
          </div>
        </form>
      </div>
    );
};

export default AddMopType;
