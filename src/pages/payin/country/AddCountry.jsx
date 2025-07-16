import { useEffect, useState } from "react";
import styles from "../../../styles/common/Add.module.css";
import { addCountry } from "../../../forms/payin";
import { endpoints } from "../../../services/apiEndpoints";
import usePost from "../../../hooks/usePost";
import { validateCountryForm } from "../../../formValidations/countryForm";
import useFetch from "../../../hooks/useFetch";
import Error from "../../errors/Error";
import Loading from "../../errors/Loading";
import { successMessage } from "../../../utils/messges";
const AddCountry = () => {
  //fetch curreny and country
  const {
    fetchData: getAllCurrency,
    data: allCurrency,
    error: currencyError,
    loading: currencyLoading,
  } = useFetch();

  useEffect(() => {
    getAllCurrency(endpoints.payin.currencyList);
  }, []);

  // form handlers
  const [formData, setFormData] = useState(addCountry);
  const [errors, setErrors] = useState({});
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({});
  };
  // API handlers
  const { postData, data, error, loading } = usePost(
    endpoints.payin.addCountry
  );
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateCountryForm(formData);
    if (Object.keys(validationError).length > 0) {
      setErrors(validationError);
      return;
    }
    await postData(formData);
  };

  useEffect(() => {
    if (data && !error) {
      successMessage("Country Added Successfully");
      setFormData(addCountry);
    }
  }, [error, data]);
  if (currencyError) <Error error="Error loading Currency" />;
  if (currencyLoading) <Loading loading="Loading Currency List" />;
  if (allCurrency)
    return (
      <div className={styles.listing}>
        <form onSubmit={handleSubmit}>
          <div className="d-flex flex-wrap gap-3 ">
            <div className={styles.input}>
              <label htmlFor="countryName">
                Name <span className="required">*</span>
              </label>
              <input
                type="text"
                name="countryName"
                id="countryName"
                placeholder="Enter Country Name"
                autoComplete="on"
                maxLength={256}
                onChange={handleChange}
                value={formData.countryName}
              />
              {errors.countryName && (
                <span className="errors">{errors.countryName}</span>
              )}
            </div>
            <div className={styles.input}>
              <label htmlFor="isoCodeAlpha2">
                ISO Code(Alpha 2) <span className="required">*</span>
              </label>
              <input
                type="text"
                name="isoCodeAlpha2"
                id="isoCodeAlpha2"
                placeholder="Enter ISO Code"
                autoComplete="on"
                maxLength={256}
                onChange={handleChange}
                value={formData.isoCodeAlpha2}
              />
              {errors.isoCodeAlpha2 && (
                <span className="errors">{errors.isoCodeAlpha2}</span>
              )}
            </div>
            <div className={styles.input}>
              <label htmlFor="isoCodeAlpha3">
                ISO Code(Alpha 3) <span className="required">*</span>
              </label>
              <input
                type="text"
                name="isoCodeAlpha3"
                id="isoCodeAlpha3"
                placeholder="Enter ISO Code (Aplha 3)"
                autoComplete="on"
                maxLength={256}
                onChange={handleChange}
                value={formData.isoCodeAlpha3}
              />
              {errors.isoCodeAlpha3 && (
                <span className="errors">{errors.isoCodeAlpha3}</span>
              )}
            </div>
            <div className={styles.input}>
              <label htmlFor="unCode">
                Uni Code <span className="required">*</span>
              </label>
              <input
                type="text"
                name="unCode"
                id="unCode"
                placeholder="Enter UNI Code"
                autoComplete="on"
                maxLength={256}
                onChange={handleChange}
                value={formData.unCode}
              />
              {errors.unCode && <span className="errors">{errors.unCode}</span>}
            </div>
            <div className={styles.input}>
              <label htmlFor="currency">
                Currency Code <span className="required">*</span>
              </label>
              <select
                name="currency"
                id="currency"
                onChange={handleChange}
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
              {errors.currency && (
                <span className="errors">{errors.currency}</span>
              )}
            </div>
            <div className={styles.input}>
              <label htmlFor="isdCode">
                ISD Code <span className="required">*</span>
              </label>
              <input
                type="text"
                name="isdCode"
                id="isdCode"
                placeholder="Enter ISD Code"
                autoComplete="on"
                maxLength={256}
                onChange={handleChange}
                value={formData.isdCode}
              />
              {errors.isdCode && (
                <span className="errors">{errors.isdCode}</span>
              )}
            </div>
          </div>
          <div className="d-flex gap-3  justify-content-end">
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
              onClick={() => setFormData(addCountry)}
            >
              clear
            </button>
          </div>
        </form>
      </div>
    );
};

export default AddCountry;
