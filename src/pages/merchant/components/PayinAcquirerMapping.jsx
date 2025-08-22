/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import useFetch from "../../../hooks/useFetch";
import styles from "../../../styles/merchant/Merchant.module.css";
import { endpoints } from "../../../services/apiEndpoints";
import usePost from "../../../hooks/usePost";
import { mapAcquirerProfile } from "../../../forms/payin";
import { validateAcquirerMappingForm } from "../../../formValidations/acquirerMappingForm";
import Error from "../../errors/Error";
import Loading from "../../errors/Loading";
import { successMessage } from "../../../utils/messges";

const PayinAcquirerMapping = ({ userId }) => {
  // fetch acquirers
  const {
    fetchData: getAcquirerList,
    data: acquirerList,
    error: acquirerListError,
    loading: acquirerListLoading,
  } = useFetch();

  // fetch acquirer profile list based on acquirer code
  const {
    fetchData: getAcquirerProfileByCode,
    data: acquirerProfileList,
    error: acquirerProfileListError,
    loading: acquirerProfileListLoading,
  } = useFetch();

  // fetch Payment type
  const {
    fetchData: getPaymentTypeList,
    data: paymentTypeList,
    error: paymentTypeListError,
    loading: paymentTypeListLoading,
  } = useFetch();
  // fetch Payment type
  const {
    fetchData: getCurrencyList,
    data: currencyList,
    error: currencyListError,
    loading: currencyListLoading,
  } = useFetch();
  // fetch priority and amount limit
  const {
    postData: getPriorityAndLimit,
    data: priorityAndLimitData,
    error: priorityAndLimitError,
  } = usePost(endpoints.payin.getPriorityAndLimit);

  useEffect(() => {
    getPaymentTypeList(endpoints.payin.paymentTypeList);
    getAcquirerList(endpoints.payin.acquirerList);
    getCurrencyList(endpoints.payin.currencyList);
  }, []);

  const { postData: getMopTypeList, data: mopTypeList } = usePost(
    endpoints.payin.mopTypeList
  );
  const handleMopType = async (e) => {
    handleChange(e);
    await getMopTypeList({ paymentTypeCode: e.target.value });
  };
  // form handlers
  const [formData, setFormData] = useState(() => mapAcquirerProfile(userId));
  const [errors, setErrors] = useState({});
  const [canSubmit, setCanSubmit] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({});

    // Reset priority and amount limit when acquirer or profile changes
    if (name === "acqCode" || name === "acqProfileId") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        priority: "",
        amountLimit: "",
      }));
      setCanSubmit(false);

      // Fetch acquirer profiles when acquirer is selected
      if (name === "acqCode" && value) {
        getAcquirerProfileByCode(
          `${endpoints.payin.acquirerProfileByAcqCode}?acqCode=${value}`
        );
      }
    }
  };

  // Function to fetch priority and amount limit when both acquirer and profile are selected
  const fetchPriorityAndLimit = async (acqCode, acqProfileId) => {
    if (acqCode && acqProfileId) {
      try {
        await getPriorityAndLimit({
          userId,
          acqCode,
          acqProfileId,
        });
      } catch (error) {
        console.error("Failed to fetch priority and amount limit:", error);
      }
    }
  };

  // Watch for changes in acquirer code and profile ID
  useEffect(() => {
    if (formData.acqCode && formData.acqProfileId) {
      fetchPriorityAndLimit(formData.acqCode, formData.acqProfileId);
    }
  }, [formData.acqCode, formData.acqProfileId]);

  // Handle priority and limit response
  useEffect(() => {
    if (priorityAndLimitData && !priorityAndLimitError) {
      setFormData((prev) => ({
        ...prev,
        priority: priorityAndLimitData?.data?.nextPriority || "",
        amountLimit: priorityAndLimitData?.data?.amountLimit || "",
      }));
      setCanSubmit(true);
    } else if (priorityAndLimitError) {
      setErrors((prev) => ({
        ...prev,
        priority: "Could not get priority",
        amountLimit: "Could not get amount limit",
      }));
      setCanSubmit(false);
    }
  }, [priorityAndLimitData, priorityAndLimitError]);
  // API Handler
  const { postData, data, error } = usePost(endpoints.user.addAcqurerMapping);
  const handleUpdateProfile = async () => {
    // Check if priority and amount limit are available
    if (!canSubmit) {
      setErrors((prev) => ({
        ...prev,
        priority: "Could not get priority",
        amountLimit: "Could not get amount limit",
      }));
      return;
    }

    const validationError = validateAcquirerMappingForm(formData);
    if (Object.keys(validationError).length > 0) {
      setErrors(validationError);
      return;
    }
    await postData(formData);
  };
  useEffect(() => {
    if (data && !error) {
      successMessage("Acquirer Mapped successfully");
      setFormData(() => mapAcquirerProfile(userId));
      getAcquirerUserMapping();
    }
  }, [error, data]);

  // User Mapping List
  const {
    postData: getUserMappingList,
    data: userMappingList = [],
    error: userMappingListError,
  } = usePost(endpoints.user.acquirerMappingList);

  const getAcquirerUserMapping = async () => {
    await getUserMappingList({
      userId,
    });
  };
  useEffect(() => {
    getAcquirerUserMapping();
  }, []);

  const {
    postData: statusChange,
    data: statusChangeData,
    error: statusChangeError,
  } = usePost(endpoints.user.addAcqurerMapping);
  // Change status
  const handleChangeStatus = async (user) => {
    user.isActive = user.isActive === "true" ? "false" : "true";
    await statusChange(user);
  };
  useEffect(() => {
    if (statusChangeData && !statusChangeError) {
      successMessage("User Mapping updated successfully");
    }
  }, [statusChangeError, statusChangeData]);

  // Error handling
  if (acquirerListError) return <Error error="Error loading Acquirer" />;
  if (paymentTypeListError) return <Error error="Error loading Payment Type" />;
  if (currencyListError) return <Error error="Error loading Currency" />;
  if (acquirerProfileListError)
    return <Error error="Error loading Acquirer Profile List" />;

  // Loading handling
  if (acquirerListLoading || paymentTypeListLoading || currencyListLoading)
    return (
      <Loading loading="Loading Merchant, Acquirer, Payment Type and Currency List" />
    );

  if (acquirerList && paymentTypeList) {
    return (
      <>
        <div>
          <h6>Payin Acquirer Mapping</h6>
          <div className="d-flex flex-wrap gap-3 mt-3">
            <div className={styles.input}>
              <label htmlFor="acqCode">
                Acquirer <span className="required">*</span>
              </label>
              <select
                name="acqCode"
                id="acqCode"
                defaultValue=""
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  --Select acquirer--
                </option>
                {acquirerList.data.length > 0 ? (
                  acquirerList.data.map((item) => (
                    <option key={item.acqCode} value={item.acqCode}>
                      {item.acqName}
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
              <label htmlFor="acqProfileId">
                Acquirer Profile <span className="required">*</span>
              </label>
              <select
                name="acqProfileId"
                id="acqProfileId"
                defaultValue=""
                onChange={handleChange}
                required
                disabled={!formData.acqCode || acquirerProfileListLoading}
              >
                <option value="" disabled>
                  {!formData.acqCode
                    ? "--Please select acquirer first--"
                    : acquirerProfileListLoading
                    ? "--Loading profiles--"
                    : "--Select acquirer profile--"}
                </option>
                {acquirerProfileList?.data?.length > 0
                  ? acquirerProfileList.data.map((item) => (
                      <option key={item.acqProfileId} value={item.acqProfileId}>
                        {item.firstName} {item.lastName}
                      </option>
                    ))
                  : formData.acqCode &&
                    !acquirerProfileListLoading && (
                      <option>No acquirer profile added</option>
                    )}
              </select>
              {errors.acqProfileId && (
                <span className="errors">{errors.acqProfileId}</span>
              )}
            </div>
            <div className={styles.input}>
              <label htmlFor="paymentTypeCode">
                Payment Type <span className="required">*</span>
              </label>
              <select
                name="paymentTypeCode"
                id="paymentTypeCode"
                onChange={handleMopType}
                defaultValue=""
                required
              >
                <option value="" disabled>
                  --Select Payment type--
                </option>
                {paymentTypeList.data.length > 0 ? (
                  paymentTypeList.data.map((item) => (
                    <option
                      key={item.paymentTypeCode}
                      value={item.paymentTypeCode}
                    >
                      {item.paymentTypeName} ({item.paymentTypeCode})
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
            <div className={styles.input}>
              <label htmlFor="mopCode">
                MOP Type <span className="required">*</span>
              </label>
              <select
                name="mopCode"
                id="mopCode"
                defaultValue=""
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  --Select Mop Type--
                </option>
                {mopTypeList && mopTypeList.data.length > 0 ? (
                  mopTypeList.data.map((item) => (
                    <option key={item.mopCode} value={item.mopCode}>
                      {item.mopName} ({item.mopCode})
                    </option>
                  ))
                ) : (
                  <option>No mop type for selected payment Type</option>
                )}
              </select>
              {errors.mopCode && (
                <span className="errors">{errors.mopCode}</span>
              )}
            </div>
            {currencyList && (
              <div className={styles.input}>
                <label htmlFor="currencyCode">
                  Currency <span className="required">*</span>
                </label>
                <select
                  name="currencyCode"
                  id="currencyCode"
                  defaultValue=""
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    --Select currency list--
                  </option>
                  {currencyList.data.length > 0 ? (
                    currencyList.data.map((item) => (
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
            )}{" "}
            <div className={styles.input}>
              <label htmlFor="transactionType">
                Payment Transaction Type <span className="required">*</span>
              </label>
              <select
                name="transactionType"
                id="transactionType"
                onChange={handleChange}
                required
              >
                <option value="">--Select Transaction Type--</option>
                <option value="SALE">SALE</option>
                <option value="AUTH">AUTH</option>
              </select>
              {errors.transactionType && (
                <span className="errors">{errors.transactionType}</span>
              )}
            </div>
            <div className={styles.input}>
              <label htmlFor="priority">
                Priority <span className="required">*</span>
              </label>
              <input
                type="text"
                name="priority"
                id="priority"
                value={formData.priority}
                placeholder="Priority will be fetched automatically"
                disabled
                readOnly
              />
              {errors.priority && (
                <span className="errors">{errors.priority}</span>
              )}
            </div>
            <div className={styles.input}>
              <label htmlFor="amountLimit">
                Amount Limit <span className="required">*</span>
              </label>
              <input
                type="text"
                name="amountLimit"
                id="amountLimit"
                value={formData.amountLimit}
                placeholder="Amount limit will be fetched automatically"
                disabled
                readOnly
              />
              {errors.amountLimit && (
                <span className="errors">{errors.amountLimit}</span>
              )}
            </div>
          </div>
          <div className="d-flex justify-content-end mt-3">
            <button className={styles.update} onClick={handleUpdateProfile}>
              Update
            </button>
          </div>
        </div>
        {userMappingList && !userMappingListError && (
          <div>
            <h6>Payin Acquirer Mapping List</h6>
            <div className={styles.table}>
              <table className="table table-responsive-sm">
                {" "}
                <thead>
                  <tr>
                    <th>Acquirer Map Id</th>
                    <th>Merchant</th>
                    <th>Acquirer</th>
                    <th>Acquirer Profile</th>
                    <th>Payment Type</th>
                    <th>Mop Type</th>
                    <th>Transaction Type</th>
                    {/* <th>Priority</th>
                    <th>Amount Limit</th> */}
                    <th>Currency Code</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {userMappingList.data.length > 0 ? (
                    userMappingList.data.map((item) => (
                      <tr key={item.acqMapId}>
                        {" "}
                        <td>{item.acqMapId}</td>
                        <td>{item.userId}</td>
                        <td>{item.acqCode}</td>
                        <td>{item.acqProfileId}</td>
                        <td>{item.paymentTypeCode}</td>
                        <td>{item.mopCode}</td>
                        <td>{item.transactionType}</td>
                        {/* <td>{item.priority}</td>
                        <td>{item.amountLimit}</td> */}
                        <td>{item.currencyCode}</td>
                        <td>
                          <div className="form-check form-switch">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="flexSwitchCheckDefault"
                              defaultChecked={item.isActive === "true"}
                              onChange={() => handleChangeStatus(item)}
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={11}>No User Mapped</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </>
    );
  }
};

export default PayinAcquirerMapping;
