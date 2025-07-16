import { useEffect, useState } from "react";
import styles from "../../../styles/common/Add.module.css";
import { endpoints } from "../../../services/apiEndpoints";
import usePost from "../../../hooks/usePost";
import useFetch from "../../../hooks/useFetch";
import Error from "../../errors/Error";
import Loading from "../../errors/Loading";
import { addChargingDetailList } from "../../../forms/payout";
import { validatePayoutChargingDetailForm } from "../../../formValidations/payoutChargingDetailForm";
import { successMessage } from "../../../utils/messges";
const AddChargingDetail = () => {
  //fetch merchant, acquirer, payment type, mop type and  curreny
  const {
    fetchData: getAllMerchant,
    data: allMerchant,
    error: merchantError,
    loading: merchantLoading,
  } = useFetch();
  const {
    fetchData: getAllAcquirer,
    data: allAcquirer,
    error: acquirerError,
    loading: acquirerLoading,
  } = useFetch();
  const {
    fetchData: getAllCurrency,
    data: allCurrency,
    error: currencyError,
    loading: currencyLoading,
  } = useFetch();

  useEffect(() => {
    getAllCurrency(endpoints.payin.currencyList);
    getAllMerchant(endpoints.user.userList);
    getAllAcquirer(endpoints.payin.acquirerList);
  }, []);

  //form handlers
  const [formData, setFormData] = useState(addChargingDetailList);
  const [errors, setErrors] = useState({});
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // API handlers
  const { postData, data, error, loading } = usePost(
    endpoints.payout.addChargingDetails
  );
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validatePayoutChargingDetailForm(formData);
    if (Object.keys(validationError).length > 0) {
      setErrors(validationError);
      return;
    }
    await postData(formData);
  };

  useEffect(() => {
    if (data && !error) {
      successMessage("Payout Charging Details added Successfully");
      setFormData(addChargingDetailList);
    }
  }, [error, data]);

  if (merchantError) <Error error="Error loading Merchants" />;
  if (acquirerError) <Error error="Error loading Acquirers" />;
  if (currencyError) <Error error="Error loading Currency" />;
  if (merchantLoading || acquirerLoading || currencyLoading)
    <Loading loading="Loading Merchant, Acquirer, Currency " />;
  if (allAcquirer && allMerchant && allCurrency)
    return (
      <div className={styles.listing}>
        <form onSubmit={handleSubmit}>
          <div className="d-flex flex-wrap gap-3 align-items-center">
            <div className={styles.input}>
              <label htmlFor="userId">
                Merchant <span className="required">*</span>
              </label>
              <select
                name="userId"
                id="userId"
                onChange={handleChange}
                defaultValue=""
                value={formData.userId}
              >
                <option value="" disabled>
                  --Select Merchant--
                </option>
                {allMerchant.data.length > 0 ? (
                  allMerchant.data.map((item) => (
                    <option key={item.userId} value={item.userId}>
                      {item.firstName} {item.lastName}
                    </option>
                  ))
                ) : (
                  <option>No merchant added</option>
                )}
              </select>
              {errors.userId && <span className="errors">{errors.userId}</span>}
            </div>

            <div className={styles.input}>
              <label htmlFor="acquirer">
                Acquirer <span className="required">*</span>
              </label>
              <select
                name="acquirer"
                id="acquirer"
                onChange={handleChange}
                defaultValue=""
                value={formData.acquirer}
              >
                <option value="" disabled>
                  --Select Acquirer--
                </option>
                {allAcquirer.data.length > 0 ? (
                  allAcquirer.data.map((item) => (
                    <option key={item.acqCode} value={item.acqCode}>
                      {item.acqName} {item.acqCode}
                    </option>
                  ))
                ) : (
                  <option>No acquirer added</option>
                )}
              </select>
              {errors.acquirer && (
                <span className="errors">{errors.acquirer}</span>
              )}
            </div>
            <div className={styles.input}>
              <label htmlFor="transferMode">
                Transfer Mode <span className="required">*</span>
              </label>
              <select
                name="transferMode"
                id="transferMode"
                onChange={handleChange}
                value={formData.transferMode}
              >
                <option value="">--Select Transfer Mode--</option>
                <option value="IMPS">IMPS</option>
                <option value="IFT">IFT</option>
                <option value="NEFT">NEFT</option>
                <option value="RTGS">RTGS</option>
                <option value="UPI">UPI</option>
              </select>
              {errors.transferMode && (
                <span className="errors">{errors.transactionType}</span>
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
                defaultValue=""
                value={formData.currencyCode}
              >
                <option value="" disabled>
                  --Select Currency--
                </option>
                {allCurrency.data.length > 0 ? (
                  allCurrency.data.map((item) => (
                    <option key={item.currencyCode} value={item.currencyCode}>
                      {item.currencyName} ({item.currencyCode})
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
          <div className="row">
            <strong>Bank TDR</strong>
          </div>
          <div className="d-flex flex-wrap gap-3 align-items-center mt-2">
            <div className={styles.input} id={styles.inputWidth}>
              <label htmlFor="bankMinTxnAmount">
                Bank Minimum Transaction Amount
                <span className="required">*</span>
              </label>
              <input
                type="text"
                name="bankMinTxnAmount"
                id="bankMinTxnAmount"
                placeholder="Enter Bank Minimum Transaction Amount"
                autoComplete="on"
                maxLength={256}
                onChange={handleChange}
                value={formData.bankMinTxnAmount}
                pattern="^\d+(\.\d{1,2})?$"
                title="Enter a valid number amount with up to 2 decimal places"
              />
              {errors.bankMinTxnAmount && (
                <span className="errors">{errors.bankMinTxnAmount}</span>
              )}
            </div>
            <div className={styles.input} id={styles.inputWidth}>
              <label htmlFor="bankMaxTxnAmount">
                Bank Maximum Transaction Amount
                <span className="required">*</span>
              </label>
              <input
                type="text"
                name="bankMaxTxnAmount"
                id="bankMaxTxnAmount"
                placeholder="Enter Bank Maximum Transaction Amount"
                autoComplete="on"
                maxLength={256}
                onChange={handleChange}
                value={formData.bankMaxTxnAmount}
                pattern="^\d+(\.\d{1,2})?$"
                title="Enter a valid number amount with up to 2 decimal places"
              />
              {errors.bankMaxTxnAmount && (
                <span className="errors">{errors.bankMaxTxnAmount}</span>
              )}
            </div>
            <div className={styles.input}>
              <label htmlFor="bankTdr">
                Bank TDR <span className="required">*</span>
              </label>
              <input
                type="text"
                name="bankTdr"
                id="bankTdr"
                placeholder="Enter Bank TDR"
                autoComplete="on"
                maxLength={256}
                onChange={handleChange}
                value={formData.bankTdr}
              />
              {errors.bankTdr && (
                <span className="errors">{errors.bankTdr}</span>
              )}
            </div>
            <div className={styles.input}>
              <label htmlFor="bankPreference">
                Bank Preference <span className="required">*</span>
              </label>
              <select
                name="bankPreference"
                id="bankPreference"
                defaultValue=""
                onChange={handleChange}
                value={formData.bankPreference}
              >
                <option value="" disabled>
                  --Select Bank Preference--
                </option>
                <option value="Percentage">Percentage</option>
                <option value="Flat">Flat</option>
              </select>
              {errors.bankPreference && (
                <span className="errors">{errors.bankPreference}</span>
              )}
            </div>
          </div>

          <div className="row mt-2">
            <strong>Merchant TDR</strong>
          </div>

          <div className="d-flex flex-wrap gap-3 mt-2">
            <div className={styles.input} id={styles.inputWidth}>
              <label htmlFor="merchantMinTxnAmount">
                Minimum Transaction Amount <span className="required">*</span>
              </label>
              <input
                type="text"
                name="merchantMinTxnAmount"
                id="merchantMinTxnAmount"
                placeholder="Enter Minimum Transaction Amount"
                autoComplete="on"
                maxLength={256}
                onChange={handleChange}
                value={formData.merchantMinTxnAmount}
                pattern="^\d+(\.\d{1,2})?$"
                title="Enter a valid number amount with up to 2 decimal places"
              />
              {errors.merchantMinTxnAmount && (
                <span className="errors">{errors.merchantMinTxnAmount}</span>
              )}
            </div>
            <div className={styles.input} id={styles.inputWidth}>
              <label htmlFor="merchantMaxTxnAmount">
                Maximum Transaction Amount <span className="required">*</span>
              </label>
              <input
                type="text"
                name="merchantMaxTxnAmount"
                id="merchantMaxTxnAmount"
                placeholder="Enter Maximum Transaction Amount"
                autoComplete="on"
                maxLength={256}
                onChange={handleChange}
                value={formData.merchantMaxTxnAmount}
                pattern="^\d+(\.\d{1,2})?$"
                title="Enter a valid number amount with up to 2 decimal places"
              />
              {errors.merchantMaxTxnAmount && (
                <span className="errors">{errors.merchantMaxTxnAmount}</span>
              )}
            </div>
            <div className={styles.input}>
              <label htmlFor="merchantTdr">
                TDR <span className="required">*</span>
              </label>
              <input
                type="text"
                name="merchantTdr"
                id="merchantTdr"
                placeholder="Enter Merchant TDR"
                autoComplete="on"
                maxLength={256}
                onChange={handleChange}
                value={formData.merchantTdr}
              />
              {errors.merchantTdr && (
                <span className="errors">{errors.merchantTdr}</span>
              )}
            </div>
            <div className={styles.input}>
              <label htmlFor="merchantPreference">
                Merchant Preference <span className="required">*</span>
              </label>
              <select
                name="merchantPreference"
                id="merchantPreference"
                defaultValue=""
                onChange={handleChange}
                value={formData.merchantPreference}
              >
                <option value="" disabled>
                  --Select Merchant Preference--
                </option>
                <option value="Percentage">Percentage</option>
                <option value="Flat">Flat</option>
              </select>
              {errors.merchantPreference && (
                <span className="errors">{errors.merchantPreference}</span>
              )}
            </div>
          </div>
          <div className="row mt-2">
            <strong>Other TDR</strong>
          </div>
          <div className="d-flex flex-wrap gap-3 mt-2">
            <div className={styles.input}>
              <label htmlFor="gst">
                GST <span className="required">*</span>
              </label>
              <input
                type="text"
                name="gst"
                id="gst"
                placeholder="Enter GST Number"
                autoComplete="on"
                maxLength={256}
                onChange={handleChange}
                value={formData.gst}
              />
              {errors.gst && <span className="errors">{errors.gst}</span>}
            </div>
            <div className={styles.input}>
              <label htmlFor="vendorCommision">
                Vendor Commission <span className="required">*</span>
              </label>
              <input
                type="text"
                name="vendorCommision"
                id="vendorCommision"
                placeholder="Enter Vender Commission"
                autoComplete="on"
                maxLength={256}
                onChange={handleChange}
                value={formData.vendorCommision}
              />
              {errors.vendorCommision && (
                <span className="errors">{errors.vendorCommision}</span>
              )}
            </div>
          </div>

          <div className="d-flex gap-3 mt-2 mb-2 justify-content-end">
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
              onClick={() => setFormData(addChargingDetailList)}
            >
              clear
            </button>
          </div>
        </form>
      </div>
    );
};

export default AddChargingDetail;
