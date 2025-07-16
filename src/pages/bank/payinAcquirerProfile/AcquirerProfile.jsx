import { useEffect, useState } from "react";
import styles from "../../../styles/common/List.module.css";
import { endpoints } from "../../../services/apiEndpoints";
import usePost from "../../../hooks/usePost";
import { successMessage } from "../../../utils/messges";
import { addAcquirerProfile } from "../../../forms/payin";
import useFetch from "../../../hooks/useFetch";
const AcquirerProfile = () => {
  const { fetchData: getAllCurrency, data: allCurrency } = useFetch();
  const { fetchData: getAllAcquirer, data: allAcquirer } = useFetch();
  const { postData, data, error, loading } = usePost(
    endpoints.payin.acquirerProfileList
  );
  useEffect(() => {
    postData();
  }, []);

  // Update acquirer profile logic
  // API handlers
  const {
    postData: updateAcquirer,
    data: updateAcquirerData,
    error: updateAcquirerError,
  } = usePost(endpoints.payin.addAcquirerProfile);
  // Change status
  const handleChangeStatus = async (item) => {
    item.isActive = item.isActive === "true" ? "false" : "true";
    await updateAcquirer(item);
  };

  useEffect(() => {
    if (updateAcquirerData && !updateAcquirerError) {
      successMessage("Profile updated successfully");
    }
  }, [updateAcquirerError, updateAcquirerData]);

  // Edit logic
  const [edit, setEdit] = useState({ status: false, index: "" });
  const [formData, setFormData] = useState(addAcquirerProfile);
  const handleEdit = async (
    {
      acqProfileId,
      firstName,
      lastName,
      phone,
      email,
      password,
      acqCode,
      acqName,
      currencyCode,
      merchantId,
      acqPassword,
      txnKey,
      userAccountState,
      userName,
      clientId,
      clientSecret,
      corporateCode,
      corporateProductCode,
      channelId,
      merchantVPA,
      merchantVirtualAccount,
      virtualIfsc,
      accessToken,
      paymentTxnToken,
      paymentStatusToken,
      debitAccount,
      dailyAmountLimit,
      isActive,
    },
    index
  ) => {
    setFormData({
      ...formData,
      acqProfileId,
      firstName,
      lastName,
      phone,
      email,
      password,
      acqCode,
      acqName,
      currencyCode,
      merchantId,
      acqPassword,
      txnKey,
      userAccountState,
      userName,
      clientId,
      clientSecret,
      corporateCode,
      corporateProductCode,
      channelId,
      merchantVPA,
      merchantVirtualAccount,
      virtualIfsc,
      accessToken,
      paymentTxnToken,
      paymentStatusToken,
      debitAccount,
      dailyAmountLimit,
      isActive,
    });
    await getAllCurrency(endpoints.payin.currencyList);
    await getAllAcquirer(endpoints.payin.acquirerList);
    setEdit({ status: true, index });
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const {
    postData: editPayinAcquirerProfile,
    data: editData,
    error: editError,
  } = usePost(endpoints.payin.addAcquirerProfile);
  const handleSuccess = async () => {
    await editPayinAcquirerProfile(formData);
  };
  useEffect(() => {
    if (editData && !editError) {
      successMessage("Acquirer Profile Edited Successfully");
      setFormData(addAcquirerProfile);
      setEdit(false);
      postData();
    }
  }, [editData, editError]);

  return (
    <div className={styles.listing}>
      <div className={styles.table}>
        <table className="table table-responsive-sm">
          <thead>
            <tr>
              <th style={{ minWidth: 75, position: "sticky", left: 0, zIndex: 12}}>Edit</th>
              <th style={{ minWidth: 100, position: "sticky", left: 75, zIndex: 12}}>First Name</th>
              <th>Last Name</th>
              <th>Acquirer</th>
              <th>Contact Number</th>
              <th>Email</th>
              <th>Currency Code</th>
              <th>Merchant ID</th>
              <th>Merchant VPA</th>
              <th>Merchant Virtual Account</th>
              <th>Acquirer Password</th>
              <th>Transaction Key</th>
              <th>Username</th>
              <th>Client ID</th>
              <th>Client Secret Key</th>
              <th>Corporate Code</th>
              <th>Corporate Product Code</th>
              <th>Channel ID</th>
              <th>Access Token</th> <th>Payment Txn Token</th>
              <th>Payment Status Code</th>
              <th>Daily Amount Limit</th>
              <th style={{ minWidth: 80 }}>Status</th>
            </tr>
          </thead>
          {data && (
            <tbody>
              {data.data.length > 0 ? (
                data.data.map((item) => (
                  <tr key={item.acqProfileId}>
                    <td style={{ minWidth: 75, position: "sticky", left: 0, zIndex: 12 }}>
                      {(!edit.status || edit.index !== item.acqProfileId) && (
                        <i
                          className="bi bi-pencil-square text-info"
                          onClick={() => handleEdit(item, item.acqProfileId)}
                        ></i>
                      )}
                      {edit.status && edit.index === item.acqProfileId && (
                        <>
                          <span className="d-flex gap-3">
                            <i
                              className="bi bi-check-circle text-success"
                              onClick={handleSuccess}
                            ></i>
                            <i
                              className="bi bi-x-circle text-danger"
                              onClick={() =>
                                setEdit({ status: false, index: "" })
                              }
                            ></i>
                          </span>
                        </>
                      )}
                    </td>
                    <td style={{ minWidth: 100, position: "sticky", left: 75, zIndex: 12 }}>
                      {edit.status && edit.index === item.acqProfileId ? (
                        <input
                          type="text"
                          name="firstName"
                          id="firstName"
                          autoComplete="on"
                          maxLength={256}
                          onChange={handleChange}
                          defaultValue={item.firstName}
                        />
                      ) : (
                        item.firstName
                      )}
                    </td>
                    <td>
                      {edit.status && edit.index === item.acqProfileId ? (
                        <input
                          type="text"
                          name="lastName"
                          id="lastName"
                          autoComplete="on"
                          onChange={handleChange}
                          maxLength={256}
                          defaultValue={item.lastName}
                        />
                      ) : (
                        item.lastName
                      )}
                    </td>
                    <td>
                      {edit.status && edit.index === item.acqProfileId ? (
                        <select
                          name="acqCode"
                          id="acqCode"
                          required
                          defaultValue={item.acqCode}
                          onChange={handleChange}
                        >
                          <option value="" disabled>
                            --Select Acquirer Name--
                          </option>
                          {allAcquirer.data.length > 0 ? (
                            allAcquirer.data.map((acquirer) => (
                              <option
                                key={acquirer.acqCode}
                                value={acquirer.acqCode}
                              >
                                {acquirer.acqName} ({acquirer.acqCode})
                              </option>
                            ))
                          ) : (
                            <option>No acquirer added</option>
                          )}
                        </select>
                      ) : (
                        item.acqName
                      )}
                    </td>
                    <td>
                      {edit.status && edit.index === item.acqProfileId ? (
                        <input
                          type="text"
                          name="phone"
                          id="phone"
                          autoComplete="on"
                          maxLength={256}
                          onChange={handleChange}
                          defaultValue={item.phone}
                        />
                      ) : (
                        item.phone
                      )}
                    </td>
                    <td>
                      {edit.status && edit.index === item.acqProfileId ? (
                        <input
                          type="text"
                          name="email"
                          id="email"
                          autoComplete="on"
                          maxLength={256}
                          onChange={handleChange}
                          defaultValue={item.email}
                        />
                      ) : (
                        item.email
                      )}
                    </td>
                    <td>
                      {edit.status && edit.index === item.acqProfileId ? (
                        <select
                          name="currency"
                          id="currency"
                          required
                          defaultValue={item.currency}
                          onChange={handleChange}
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
                                {currency.currencyName} ({currency.currencyCode}
                                )
                              </option>
                            ))
                          ) : (
                            <option>No currency added</option>
                          )}
                        </select>
                      ) : (
                        item.currencyCode
                      )}
                    </td>
                    <td>
                      {edit.status && edit.index === item.acqProfileId ? (
                        <input
                          type="text"
                          name="merchantId"
                          id="merchantId"
                          autoComplete="on"
                          maxLength={256}
                          onChange={handleChange}
                          defaultValue={item.merchantId}
                        />
                      ) : (
                        item.merchantId
                      )}
                    </td>
                    <td>
                      {edit.status && edit.index === item.acqProfileId ? (
                        <input
                          type="text"
                          name="merchantVPA"
                          id="merchantVPA"
                          autoComplete="on"
                          maxLength={256}
                          onChange={handleChange}
                          defaultValue={item.merchantVPA}
                        />
                      ) : (
                        item.merchantVPA
                      )}
                    </td>
                    <td>
                      {edit.status && edit.index === item.acqProfileId ? (
                        <input
                          type="text"
                          name="merchantVirtualAccount"
                          id="merchantVirtualAccount"
                          autoComplete="on"
                          maxLength={256}
                          onChange={handleChange}
                          defaultValue={item.merchantVirtualAccount}
                        />
                      ) : (
                        item.merchantVirtualAccount
                      )}
                    </td>
                    <td>
                      {edit.status && edit.index === item.acqProfileId ? (
                        <input
                          type="text"
                          name="acqPassword"
                          id="acqPassword"
                          autoComplete="on"
                          maxLength={256}
                          onChange={handleChange}
                          defaultValue={item.acqPassword}
                        />
                      ) : (
                        item.acqPassword
                      )}
                    </td>
                    <td style={{ maxWidth: 200, wordBreak: "break-all" }}>
                      {edit.status && edit.index === item.acqProfileId ? (
                        <input
                          type="text"
                          name="txnKey"
                          id="txnKey"
                          autoComplete="on"
                          maxLength={256}
                          onChange={handleChange}
                          defaultValue={item.txnKey}
                        />
                      ) : (
                        item.txnKey
                      )}
                    </td>
                    <td>
                      {edit.status && edit.index === item.acqProfileId ? (
                        <input
                          type="text"
                          name="userName"
                          id="userName"
                          autoComplete="on"
                          maxLength={256}
                          onChange={handleChange}
                          defaultValue={item.userName}
                        />
                      ) : (
                        item.userName
                      )}
                    </td>
                    <td>
                      {edit.status && edit.index === item.acqProfileId ? (
                        <input
                          type="text"
                          name="clientId"
                          id="clientId"
                          autoComplete="on"
                          maxLength={256}
                          onChange={handleChange}
                          defaultValue={item.clientId}
                        />
                      ) : (
                        item.clientId
                      )}
                    </td>
                    <td>
                      {edit.status && edit.index === item.acqProfileId ? (
                        <input
                          type="text"
                          name="clientSecret"
                          id="clientSecret"
                          autoComplete="on"
                          maxLength={256}
                          onChange={handleChange}
                          defaultValue={item.clientSecret}
                        />
                      ) : (
                        item.clientSecret
                      )}
                    </td>
                    <td>
                      {edit.status && edit.index === item.acqProfileId ? (
                        <input
                          type="text"
                          name="corporateCode"
                          id="corporateCode"
                          autoComplete="on"
                          maxLength={256}
                          onChange={handleChange}
                          defaultValue={item.corporateCode}
                        />
                      ) : (
                        item.corporateCode
                      )}
                    </td>
                    <td>
                      {edit.status && edit.index === item.acqProfileId ? (
                        <input
                          type="text"
                          name="corporateProductCode"
                          id="corporateProductCode"
                          autoComplete="on"
                          maxLength={256}
                          onChange={handleChange}
                          defaultValue={item.corporateProductCode}
                        />
                      ) : (
                        item.corporateProductCode
                      )}
                    </td>
                    <td>
                      {edit.status && edit.index === item.acqProfileId ? (
                        <input
                          type="text"
                          name="channelId"
                          id="channelId"
                          autoComplete="on"
                          maxLength={256}
                          onChange={handleChange}
                          defaultValue={item.channelId}
                        />
                      ) : (
                        item.channelId
                      )}
                    </td>
                    <td style={{ maxWidth: 200, wordBreak: "break-all" }}>
                      {edit.status && edit.index === item.acqProfileId ? (
                        <input
                          type="text"
                          name="accessToken"
                          id="accessToken"
                          autoComplete="on"
                          maxLength={256}
                          onChange={handleChange}
                          defaultValue={item.accessToken}
                        />
                      ) : (
                        item.accessToken
                      )}
                    </td>
                    <td style={{ maxWidth: 200, wordBreak: "break-all" }}>
                      {edit.status && edit.index === item.acqProfileId ? (
                        <input
                          type="text"
                          name="paymentTxnToken"
                          id="paymentTxnToken"
                          autoComplete="on"
                          maxLength={256}
                          onChange={handleChange}
                          defaultValue={item.paymentTxnToken}
                        />
                      ) : (
                        item.paymentTxnToken
                      )}
                    </td>
                    <td style={{ maxWidth: 200, wordBreak: "break-all" }}>
                      {edit.status && edit.index === item.acqProfileId ? (
                        <input
                          type="text"
                          name="paymentStatusToken"
                          id="paymentStatusToken"
                          autoComplete="on"
                          maxLength={256}
                          onChange={handleChange}
                          defaultValue={item.paymentStatusToken}
                        />
                      ) : (
                        item.paymentStatusToken
                      )}
                    </td>
                    <td>
                      {edit.status && edit.index === item.acqProfileId ? (
                        <input
                          type="number"
                          name="dailyAmountLimit"
                          id="dailyAmountLimit"
                          autoComplete="on"
                          min="0"
                          step="0.01"
                          onChange={handleChange}
                          defaultValue={item.dailyAmountLimit}
                        />
                      ) : (
                        item.dailyAmountLimit
                      )}
                    </td>
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
                  <td colSpan={23}>No Acquirer Added</td>
                </tr>
              )}
            </tbody>
          )}
          {loading && (
            <tbody>
              {" "}
              <tr>
                <td colSpan={23}>Loading acquirer profile</td>
              </tr>
            </tbody>
          )}
          {error && (
            <tbody>
              {" "}
              <tr>
                <td colSpan={23}>Error fetching acquirer profile</td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
};

export default AcquirerProfile;
