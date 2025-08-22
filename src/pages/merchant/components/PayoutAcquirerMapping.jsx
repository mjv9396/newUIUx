/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import useFetch from "../../../hooks/useFetch";
import styles from "../../../styles/merchant/Merchant.module.css";
import { endpoints } from "../../../services/apiEndpoints";
import usePost from "../../../hooks/usePost";
import Error from "../../errors/Error";
import Loading from "../../errors/Loading";
import { mapAcquirerProfile } from "../../../forms/payout";
import { successMessage } from "../../../utils/messges";
import { validatePayoutAcquirerMappingForm } from "../../../formValidations/payoutAcquirerMappingForm";
const PayoutAcquirerMapping = ({ userId }) => {
  // fetch APIs for merchants, acquirer, payment type ,currency

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
  // fetch priority and amount limit
  const {
    postData: getPriorityAndLimit,
    data: priorityAndLimitData,
    error: priorityAndLimitError,
  } = usePost(endpoints.payout.getPriorityAndLimit);

  useEffect(() => {
    getAcquirerList(endpoints.payin.acquirerList);
  }, []);
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
          `${endpoints.payout.acquirerProfileByAcqCode}?acqCode=${value}`
        );
      }
    }
  };

  // Function to fetch priority and amount limit when both acquirer and profile are selected
  const fetchPriorityAndLimit = async (acqCode, acqProfileId) => {
    if (acqCode && acqProfileId) {
      try {
        await getPriorityAndLimit({ userId, acqCode, acqProfileId });
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
  const { postData, data, error } = usePost(endpoints.payout.acquirerMapping);
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

    const validationError = validatePayoutAcquirerMappingForm(formData);
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
  } = usePost(endpoints.payout.acquirerMappingList);

  const getAcquirerUserMapping = async () => {
    await getUserMappingList({ userId });
  };
  useEffect(() => {
    getAcquirerUserMapping();
  }, []);

  const {
    postData: statusChange,
    data: statusChangeData,
    error: statusChangeError,
  } = usePost(endpoints.payout.acquirerMapping);
  // Change status
  const handleChangeStatus = async (user) => {
    user.isActive = user.isActive === "true" ? "false" : "true";
    await statusChange(user);
  };
  useEffect(() => {
    if (statusChangeData && !statusChangeError) {
      successMessage("User Mapping updated successfully");
    }
  }, [statusChangeError, statusChangeData]); // Error handling
  if (acquirerListError) return <Error error="Error loading Acquirer" />;
  if (acquirerProfileListError)
    return <Error error="Error loading Acquirer Profile List" />;

  // Loading handling
  if (acquirerListLoading) return <Loading loading="Loading Acquirer List" />;

  if (acquirerList) {
    return (
      <>
        <div>
          <h6>Payout Acquirer Mapping</h6>
          <div className="d-flex flex-wrap gap-3 mt-3">
            <div className={styles.input}>
              <label htmlFor="acqCode">
                Acquirer <span className="required">*</span>
              </label>
              <select
                name="acqCode"
                id="acqCode"
                defaultValue=""
                value={formData.acqCode}
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
                value={formData.acqProfileId}
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
              <label htmlFor="transferMode">
                Transfer Mode <span className="required">*</span>
              </label>
              <select
                name="transferMode"
                id="transferMode"
                defaultValue=""
                value={formData.transferMode}
                onChange={handleChange}
                required
              >
                <option value="">--Select Transfer Mode--</option>
                <option value="IMPS">IMPS</option>
                <option value="IFT">IFT</option>
                <option value="NEFT">NEFT</option>
                <option value="RTGS">RTGS</option>
                <option value="UPI">UPI</option>
              </select>
              {errors.transferMode && (
                <span className="errors">{errors.transferMode}</span>
              )}
            </div>{" "}
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
            <h6>Payout Acquirer Mapping List</h6>
            <div className={styles.table}>
              <table className="table table-responsive-sm">
                {" "}
                <thead>
                  <tr>
                    <th>Acquirer Map Id</th>
                    <th>Merchant</th>
                    <th>Acquirer</th>
                    <th>Acquirer Profile</th>
                    <th>Transfer Code</th>
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
                        <td>{item.transferMode}</td>
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
                      <td colSpan={9}>No User Mapped</td>
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

export default PayoutAcquirerMapping;
