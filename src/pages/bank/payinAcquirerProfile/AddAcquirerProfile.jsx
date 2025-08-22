import { useEffect, useState } from "react";
import styles from "../../../styles/common/Add.module.css";
import { addAcquirer, addAcquirerProfile } from "../../../forms/payin";
import { endpoints } from "../../../services/apiEndpoints";
import usePost from "../../../hooks/usePost";
import { validateAcquirerProfileForm } from "../../../formValidations/acquirerProfileForm";
import useFetch from "../../../hooks/useFetch";
import Error from "../../errors/Error";
import Loading from "../../errors/Loading";
import { successMessage } from "../../../utils/messges";
const AddAcquirerProfile = () => {
  //fetch curreny, country and payment type
  const {
    fetchData: getAllCurrency,
    data: allCurrency,
    error: currencyError,
    loading: currencyLoading,
  } = useFetch();
  const {
    fetchData: getAllAcquirer,
    data: allAcquirer,
    error: acquirerError,
    loading: acquirerLoading,
  } = useFetch();

  useEffect(() => {
    getAllAcquirer(endpoints.payin.acquirerList);
    getAllCurrency(endpoints.payin.currencyList);
  }, []);
  // form handlers
  const [formData, setFormData] = useState({
    ...addAcquirerProfile,
    dailyAmountLimit: "",
  });
  const [errors, setErrors] = useState({});
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") setFormData({ ...formData, [name]: checked });
    else setFormData({ ...formData, [name]: value });
    setErrors({});
  };
  // API handlers
  const { postData, data, error, loading } = usePost(
    endpoints.payin.addAcquirerProfile
  );
  const handleSubmit = async (e) => {
    e.preventDefault();
    let buildFormData = formData;
    const validationError = validateAcquirerProfileForm(formData);
    if (!formData.dailyAmountLimit) {
      validationError.dailyAmountLimit = "Daily Amount Limit is required";
    } else if (
      isNaN(formData.dailyAmountLimit) ||
      Number(formData.dailyAmountLimit) <= 0
    ) {
      validationError.dailyAmountLimit =
        "Daily Amount Limit must be a positive number";
    }
    if (Object.keys(validationError).length > 0) {
      setErrors(validationError);
      return;
    }
    buildFormData = {
      ...formData,
      merchantVPA: formData.isVPA
        ? formData.bankCode1 + "mobilenumber" + formData.virtualCode
        : "",
      merchantVirtualAccount: formData.isVirtualAccount
        ? formData.bankCode2 + "mobilenumber"
        : "",
      dailyAmountLimit: formData.dailyAmountLimit,
    };
    await postData(buildFormData);
  };
  useEffect(() => {
    if (data && !error) {
      successMessage("Acqurer Profile added successfully");
      setFormData({
        ...addAcquirerProfile,
        dailyAmountLimit: "",
      });
      setErrors({});
    }
  }, [error, data]);

  if (currencyError) <Error error="Error loading Currency" />;
  if (acquirerError) <Error error="Error loading Acquirer" />;
  if (currencyLoading || acquirerLoading)
    <Loading loading="Loading Currency or Acquirer List" />;
  if (allAcquirer && allCurrency)
    return (
      <div className={styles.listing}>
        <form onSubmit={handleSubmit}>
          <p className={styles.title}>Personal Details</p>
          <div className="d-flex flex-wrap gap-3 align-items-center mb-5 mt-2">
            <div className={styles.input}>
              <label htmlFor="acqCode">
                Acquirer <span className="required">*</span>
              </label>
              <select
                name="acqCode"
                id="acqCode"
                onChange={handleChange}
                defaultValue=""
              >
                <option value="" disabled>
                  --Select Acquirer Code--
                </option>
                {allAcquirer.data.length > 0 ? (
                  allAcquirer.data.map((acquirer) => (
                    <option key={acquirer.acqCode} value={acquirer.acqCode}>
                      {acquirer.acqName} ({acquirer.acqCode})
                    </option>
                  ))
                ) : (
                  <option>No acquirer added</option>
                )}
              </select>
              {errors.acqCode && (
                <span className="errors">{errors.acqCode}</span>
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
              <label htmlFor="firstName">
                First Name <span className="required">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                id="firstName"
                placeholder="Enter First Name"
                autoComplete="on"
                maxLength={256}
                onChange={handleChange}
                value={formData.firstName}
              />
              {errors.firstName && (
                <span className="errors">{errors.firstName}</span>
              )}
            </div>
            <div className={styles.input}>
              <label htmlFor="lastName">
                Last Name <span className="required">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                id="lastName"
                placeholder="Enter Last Name"
                autoComplete="on"
                maxLength={256}
                onChange={handleChange}
                value={formData.lastName}
              />
              {errors.lastName && (
                <span className="errors">{errors.lastName}</span>
              )}
            </div>
            <div className={styles.input}>
              <label htmlFor="phone">
                Contact Number <span className="required">*</span>
              </label>
              <input
                type="number"
                name="phone"
                id="phone"
                placeholder="Enter Contact Number"
                autoComplete="on"
                maxLength={256}
                onChange={handleChange}
                value={formData.phone}
              />
              {errors.phone && <span className="errors">{errors.phone}</span>}
            </div>
            <div className={styles.input}>
              <label htmlFor="email">
                Email <span className="required">*</span>
              </label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Enter Email Address"
                autoComplete="on"
                maxLength={256}
                onChange={handleChange}
                value={formData.email}
              />
              {errors.email && <span className="errors">{errors.email}</span>}
            </div>{" "}
            <div className={styles.input}>
              <label htmlFor="password">
                Password
                <span className="required">*</span>
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Enter Password"
                autoComplete="on"
                maxLength={256}
                onChange={handleChange}
                value={formData.password}
              />
              {errors.password && (
                <span className="errors">{errors.password}</span>
              )}
            </div>
            <div className={styles.input}>
              <label htmlFor="dailyAmountLimit">
                Daily Amount Limit <span className="required">*</span>
              </label>
              <input
                type="number"
                name="dailyAmountLimit"
                id="dailyAmountLimit"
                placeholder="Enter Daily Amount Limit"
                autoComplete="on"
                maxLength={256}
                onChange={handleChange}
                value={formData.dailyAmountLimit || ""}
              />
              {errors.dailyAmountLimit && (
                <span className="errors">{errors.dailyAmountLimit}</span>
              )}
            </div>
          </div>
          <p className={styles.title}>Bank Details</p>
          <div className="d-flex flex-wrap gap-3 align-items-center mb-5 mt-2">
            <div className={styles.input}>
              <label htmlFor="acqPassword">Acquirer Password</label>
              <input
                type="password"
                name="acqPassword"
                id="acqPassword"
                placeholder="Enter Acquirer Password"
                autoComplete="on"
                maxLength={256}
                onChange={handleChange}
                value={formData.acqPassword}
              />
              {errors.acqPassword && (
                <span className="errors">{errors.acqPassword}</span>
              )}
            </div>
            <div className={styles.input}>
              <label htmlFor="merchantId">Merchant ID/ Client ID</label>
              <input
                type="text"
                name="merchantId"
                id="merchantId"
                placeholder="Enter Merchant ID"
                autoComplete="on"
                maxLength={256}
                onChange={handleChange}
                value={formData.merchantId}
              />
              {errors.merchantId && (
                <span className="errors">{errors.merchantId}</span>
              )}
            </div>

            <div className={styles.input}>
              <label htmlFor="txnKey">Txn Key/Enc Key</label>
              <input
                type="text"
                name="txnKey"
                id="txnKey"
                placeholder="Enter Transaction Key"
                autoComplete="on"
                maxLength={256}
                onChange={handleChange}
                value={formData.txnKey}
              />
              {errors.txnKey && <span className="errors">{errors.txnKey}</span>}
            </div>
            <div className={styles.input}>
              <label htmlFor="userName">Username</label>
              <input
                type="text"
                name="userName"
                id="userName"
                placeholder="Enter username"
                autoComplete="on"
                maxLength={256}
                onChange={handleChange}
                value={formData.userName}
              />
              {errors.userName && (
                <span className="errors">{errors.userName}</span>
              )}
            </div>
            <div className={styles.input}>
              <label htmlFor="clientId">Client ID</label>
              <input
                type="text"
                name="clientId"
                id="clientId"
                placeholder="Enter client Id"
                autoComplete="on"
                maxLength={256}
                onChange={handleChange}
                value={formData.clientId}
              />
              {errors.clientId && (
                <span className="errors">{errors.clientId}</span>
              )}
            </div>
            <div className={styles.input}>
              <label htmlFor="clientSecret">Client Secret Key</label>
              <input
                type="text"
                name="clientSecret"
                id="clientSecret"
                placeholder="Enter client Secret Key"
                autoComplete="on"
                maxLength={256}
                onChange={handleChange}
                value={formData.clientSecret}
              />
              {errors.clientSecret && (
                <span className="errors">{errors.clientSecret}</span>
              )}
            </div>
            <div className={styles.input}>
              <label htmlFor="corporateCode">Corporate Code</label>
              <input
                type="text"
                name="corporateCode"
                id="corporateCode"
                placeholder="Enter Corporate Code"
                autoComplete="on"
                maxLength={256}
                onChange={handleChange}
                value={formData.corporateCode}
              />
              {errors.corporateCode && (
                <span className="errors">{errors.corporateCode}</span>
              )}
            </div>
            <div className={styles.input}>
              <label htmlFor="txnKey">Corporate Product Code</label>
              <input
                type="text"
                name="corporateProductCode"
                id="corporateProductCode"
                placeholder="Enter Corporate Product Code"
                autoComplete="on"
                maxLength={256}
                onChange={handleChange}
                value={formData.corporateProductCode}
              />
              {errors.corporateProductCode && (
                <span className="errors">{errors.corporateProductCode}</span>
              )}
            </div>
            <div className={styles.input}>
              <label htmlFor="txnKey">Channel ID</label>
              <input
                type="text"
                name="channelId"
                id="channelId"
                placeholder="Enter Channer Id"
                autoComplete="on"
                maxLength={256}
                onChange={handleChange}
                value={formData.channelId}
              />
              {errors.channelId && (
                <span className="errors">{errors.channelId}</span>
              )}
            </div>
          </div>
          <div className="mb-5">
            <div className="d-flex flex-wrap gap-2 align-items-center mb-2 mt-1">
              <input
                type="checkbox"
                name="isVPA"
                id="isVPA"
                onChange={handleChange}
                value={formData.isVPA}
              />
              <p className={styles.title}>Merchant VPA</p>
            </div>
            {formData.isVPA && (
              <div className="d-flex flex-wrap align-items-center">
                <div className={styles.input}>
                  <label htmlFor="bankCode1">Bank Code</label>
                  <input
                    type="text"
                    name="bankCode1"
                    id="bankCode1"
                    placeholder="Enter Bank Code"
                    autoComplete="on"
                    maxLength={256}
                    onChange={handleChange}
                    value={formData.bankCode1}
                  />
                  {errors.bankCode1 && (
                    <span className="errors">{errors.bankCode1}</span>
                  )}
                </div>
                <code>+MobileNumber+</code>
                <div className={styles.input}>
                  <label htmlFor="virtualCode">Bank Virtual Code</label>
                  <input
                    type="text"
                    name="virtualCode"
                    id="virtualCode"
                    placeholder="Enter Virtual Code"
                    autoComplete="on"
                    maxLength={256}
                    onChange={handleChange}
                    value={formData.virtualCode}
                  />
                  {errors.virtualCode && (
                    <span className="errors">{errors.virtualCode}</span>
                  )}
                </div>
                <code>&nbsp;&nbsp;=&nbsp;&nbsp;</code>
                <p className={styles.title}>
                  {`${formData.bankCode1}<mobilenumber>${formData.virtualCode}`}
                </p>
              </div>
            )}
          </div>
          <div className="mb-5">
            <div className="d-flex align-items-center gap-2 mb-3">
              <input
                type="checkbox"
                name="isVirtualAccount"
                id="isVirtualAccount"
                onChange={handleChange}
                value={formData.isVirtualAccount}
              />
              <p className={styles.title}>Virtual Account</p>
            </div>
            {formData.isVirtualAccount && (
              <div className="d-flex flex-wrap align-items-center">
                <div className={styles.input} id={styles.inputWidth}>
                  <label htmlFor="bankCode2">Bank Code</label>
                  <input
                    type="text"
                    name="bankCode2"
                    id="bankCode2"
                    placeholder="Enter Bank Code"
                    autoComplete="on"
                    maxLength={256}
                    onChange={handleChange}
                    value={formData.bankCode2}
                  />
                </div>
                <code>+MobileNumber+</code>
                <code>&nbsp;&nbsp;=&nbsp;&nbsp;</code>
                <p className={styles.title}>
                  {`${formData.bankCode2}<mobilenumber>`}
                </p>
              </div>
            )}
          </div>
          {formData.isVirtualAccount && (
            <div className="d-flex mb-5">
              <div className={styles.input} id={styles.inputWidth}>
                <label htmlFor="txnKey">Virtual IFSC Code</label>
                <input
                  type="text"
                  name="virtualIfsc"
                  id="virtualIfsc"
                  placeholder="Enter Virtual IFSC Code"
                  autoComplete="on"
                  maxLength={256}
                  onChange={handleChange}
                  value={formData.virtualIfsc}
                />
              </div>
              {errors.virtualIfsc && (
                <span className="errors">{errors.virtualIfsc}</span>
              )}
            </div>
          )}
          <p className={styles.title}>Token Details</p>
          <div className="d-flex flex-wrap gap-3 align-items-center mb-3 mt-2">
            <div className={styles.input} id={styles.inputWidth}>
              <label htmlFor="accessToken">Access Token</label>
              <input
                type="text"
                name="accessToken"
                id="accessToken"
                placeholder="Enter Access Token"
                autoComplete="on"
                maxLength={256}
                onChange={handleChange}
                value={formData.accessToken}
              />
            </div>
            <div className={styles.input} id={styles.inputWidth}>
              <label htmlFor="paymentTxnToken">Payment Token</label>
              <input
                type="text"
                name="paymentTxnToken"
                id="paymentTxnToken"
                placeholder="Enter Payment Transaction Token"
                autoComplete="on"
                maxLength={256}
                onChange={handleChange}
                value={formData.paymentTxnToken}
              />
            </div>
            <div className={styles.input} id={styles.inputWidth}>
              <label htmlFor="paymentStatusToken">Payment Status Token</label>
              <input
                type="text"
                name="paymentStatusToken"
                id="paymentStatusToken"
                placeholder="Enter Payment Status Token"
                autoComplete="on"
                maxLength={256}
                onChange={handleChange}
                value={formData.paymentStatusToken}
              />
            </div>
          </div>
          <div className="d-flex justify-content-end gap-3 mt-2">
            <button
              className={
                !loading ? styles.submit + " " + styles.active : styles.submit
              }
              type={loading ? "button" : "submit"}
            >
              {loading ? "Adding..." : "Add"}
            </button>
            <button
              className={styles.clear}
              type="reset"
              onClick={() => setFormData(addAcquirer)}
            >
              clear
            </button>
          </div>
        </form>
      </div>
    );
};

export default AddAcquirerProfile;
