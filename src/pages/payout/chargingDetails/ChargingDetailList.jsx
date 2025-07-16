/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import styles from "../../../styles/common/Add.module.css";
import classes from "../../../styles/common/List.module.css";

import useFetch from "../../../hooks/useFetch";
import { endpoints } from "../../../services/apiEndpoints";
import Error from "../../errors/Error";
import Loading from "../../errors/Loading";
import usePost from "../../../hooks/usePost";
import { chargingDetaiList } from "../../../forms/payin";
import { addChargingDetailList } from "../../../forms/payout";
import { GetUserRole } from "../../../services/cookieStore";
import { successMessage } from "../../../utils/messges";

const ChargingDetailList = () => {
  // fetch merchant and acquirer
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

  useEffect(() => {
    getAllMerchant(endpoints.user.userList);
    getAllAcquirer(endpoints.payin.acquirerList);
  }, []);

  //form handlers
  const [formData, setFormData] = useState(chargingDetaiList);
  const [errors, setErrors] = useState({});
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // API handlers
  const { postData, data } = usePost(endpoints.payout.chargingDetailsList);
  const handleSubmit = async () => {
    if (formData.acquirer.trim() === "" && formData.userId.trim() === "")
      return;
    if (formData.acquirer.trim() === "") {
      setErrors({ ...errors, acquirer: "Select Acquirer" });
      return;
    }
    if (formData.userId.trim() === "") {
      setErrors({ ...errors, userId: "Select Merchant" });
      return;
    }
    setErrors({});
    await postData(formData);
  };

  useEffect(() => {
    handleSubmit();
  }, [formData]);

  // Edit Logic
  const [edit, setEdit] = useState({ status: false, index: "" });
  const [editFormData, setEditFormData] = useState(addChargingDetailList);
  const handleEdit = async (item, index) => {
    setEditFormData({ ...item, index });
    setEdit({ status: true, index });
  };
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };
  const {
    postData: editPayoutChargingDetail,
    data: editData,
    error: editError,
  } = usePost(endpoints.payout.addChargingDetails);
  const handleSuccess = async () => {
    await editPayoutChargingDetail(editFormData);
  };
  useEffect(() => {
    if (editData && !editError) {
      successMessage("Charging Details Edited Successfully");
      setFormData(addChargingDetailList);
      setEdit(false);
      handleSubmit();
    }
  }, [editData, editError]);
  if (merchantError) <Error error="Error loading Merchants" />;
  if (acquirerError) <Error error="Error loading Acquirers" />;
  if (merchantLoading || acquirerLoading)
    <Loading loading="Loading Merchant and Acquirer List" />;
  if (allAcquirer && allMerchant) {
    return (
      <div className={styles.listing}>
        <div className="row">
          <div className="col-md-6 col-sm-12 mb-2 position-relative">
            <label htmlFor="userId">
              Merchant <span className="required">*</span>
            </label>
            <select
              name="userId"
              id="userId"
              onChange={handleChange}
              defaultValue=""
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
          <div className="col-md-6 col-sm-12 mb-2 position-relative">
            <label htmlFor="acqCode">
              Acquirer <span className="required">*</span>
            </label>
            <select
              name="acquirer"
              id="acquirer"
              onChange={handleChange}
              defaultValue=""
            >
              <option value="" disabled>
                --Select Acquirer--
              </option>
              {allAcquirer.data.length > 0 ? (
                allAcquirer.data.map((item) => (
                  <option key={item.acqCode} value={item.acqCode}>
                    {item.acqName}
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
        </div>

        <>
          {data && (
            <div className={classes.table}>
              <div style={{ overflow: "auto" }}>
                <table className="table table-responsive-sm">
                  <thead>
                    <tr>
                      {GetUserRole() === "ADMIN" && (
                        <th style={{ minWidth: 75, position: "sticky", left: 0, zIndex: 12 }}>Edit</th>
                      )}
                      <th style={{ minWidth: 150, position: "sticky", left: 75, zIndex: 12 }}>Payout Charging Id</th>
                      <th>Merchant Id</th>
                      <th>Acquirer</th>
                      <th>Transfer Mode</th>
                      <th>Bank Min Tnx Amt</th>
                      <th>Bank Max Tnx Amt</th>
                      <th>Bank Preferences</th>
                      <th>Bank TDR</th>
                      <th>Merchant Min. Tnx Amt</th>
                      <th>Merchant Max Tnx Amt</th>
                      <th>Merchant Preferences</th>
                      <th>Merchant TDR</th>
                      <th>Vender Commission</th>
                      <th>GST</th>
                      <th>Slab Enabled</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.data.length > 0 ? (
                      data.data.map((item) => (
                        <tr key={item.payoutChargingId}>
                          {GetUserRole() === "ADMIN" && (
                            <td style={{ minWidth: 75, position: "sticky", left: 0, zIndex: 12 }}>
                              {(!edit.status ||
                                edit.index !== item.payoutChargingId) && (
                                <i
                                  className="bi bi-pencil-square text-info"
                                  onClick={() =>
                                    handleEdit(item, item.payoutChargingId)
                                  }
                                ></i>
                              )}
                              {edit.status &&
                                edit.index === item.payoutChargingId && (
                                  <>
                                    <span className="d-flex gap-3">
                                      <i
                                        className="bi bi-check-circle text-success"
                                        onClick={handleSuccess}
                                      ></i>
                                      <i
                                        className="bi bi-x-circle text-danger"
                                        onClick={() =>
                                          setEdit({
                                            status: false,
                                            index: "",
                                          })
                                        }
                                      ></i>
                                    </span>
                                  </>
                                )}
                            </td>
                          )}
                          <td style={{ minWidth: 150, position: "sticky", left: 75, zIndex: 12 }}>{item.payoutChargingId}</td>
                          <td>{item.userId}</td>
                          <td>{item.acquirer}</td>
                          <td>{item.transferMode}</td>
                          <td>
                            {edit.status &&
                            edit.index === item.payoutChargingId ? (
                              <input
                                type="text"
                                name="bankMinTxnAmount"
                                id="bankMinTxnAmount"
                                autoComplete="on"
                                onChange={handleEditChange}
                                maxLength={256}
                                defaultValue={item.bankMinTxnAmount}
                                pattern="^\d+(\.\d{1,2})?$"
                                title="Enter a valid number amount with up to 2 decimal places"
                              />
                            ) : (
                              item.bankMinTxnAmount
                            )}
                          </td>
                          <td>
                            {edit.status &&
                            edit.index === item.payoutChargingId ? (
                              <input
                                type="text"
                                name="bankMaxTxnAmount"
                                id="bankMaxTxnAmount"
                                autoComplete="on"
                                onChange={handleEditChange}
                                maxLength={256}
                                defaultValue={item.bankMaxTxnAmount}
                                pattern="^\d+(\.\d{1,2})?$"
                                title="Enter a valid number amount with up to 2 decimal places"
                              />
                            ) : (
                              item.bankMaxTxnAmount
                            )}
                          </td>
                          <td>
                            {edit.status &&
                            edit.index === item.payoutChargingId ? (
                              <select
                                name="bankPreference"
                                id="bankPreference"
                                defaultValue={item.bankPreference}
                                onChange={handleEditChange}
                              >
                                <option value="" disabled>
                                  --Select Bank Preference--
                                </option>
                                <option value="Percentage">Percentage</option>
                                <option value="Flat">Flat</option>
                              </select>
                            ) : (
                              item.bankPreference
                            )}
                          </td>
                          <td>
                            {edit.status &&
                            edit.index === item.payoutChargingId ? (
                              <input
                                type="text"
                                name="bankTdr"
                                id="bankTdr"
                                autoComplete="on"
                                onChange={handleEditChange}
                                maxLength={256}
                                defaultValue={item.bankTdr}
                              />
                            ) : (
                              item.bankTdr
                            )}
                          </td>
                          <td>
                            {edit.status &&
                            edit.index === item.payoutChargingId ? (
                              <input
                                type="text"
                                name="merchantMinTxnAmount"
                                id="merchantMinTxnAmount"
                                autoComplete="on"
                                onChange={handleEditChange}
                                maxLength={256}
                                defaultValue={item.merchantMinTxnAmount}
                                pattern="^\d+(\.\d{1,2})?$"
                                title="Enter a valid number amount with up to 2 decimal places"
                              />
                            ) : (
                              item.merchantMinTxnAmount
                            )}
                          </td>
                          <td>
                            {" "}
                            {edit.status &&
                            edit.index === item.payoutChargingId ? (
                              <input
                                type="text"
                                name="merchantMaxTxnAmount"
                                id="merchantMaxTxnAmount"
                                autoComplete="on"
                                onChange={handleEditChange}
                                maxLength={256}
                                defaultValue={item.merchantMaxTxnAmount}
                                pattern="^\d+(\.\d{1,2})?$"
                                title="Enter a valid number amount with up to 2 decimal places"
                              />
                            ) : (
                              item.merchantMaxTxnAmount
                            )}
                          </td>
                          <td>
                            {edit.status &&
                            edit.index === item.payoutChargingId ? (
                              <select
                                name="merchantPreference"
                                id="merchantPreference"
                                defaultValue={item.merchantPreference}
                                onChange={handleEditChange}
                              >
                                <option value="" disabled>
                                  --Select Merchant Preference--
                                </option>
                                <option value="Percentage">Percentage</option>
                                <option value="Flat">Flat</option>
                              </select>
                            ) : (
                              item.merchantPreference
                            )}
                          </td>
                          <td>
                            {edit.status &&
                            edit.index === item.payoutChargingId ? (
                              <input
                                type="text"
                                name="merchantTdr"
                                id="merchantTdr"
                                autoComplete="on"
                                onChange={handleEditChange}
                                maxLength={256}
                                defaultValue={item.merchantTdr}
                              />
                            ) : (
                              item.merchantTdr
                            )}
                          </td>
                          <td>
                            {edit.status &&
                            edit.index === item.payoutChargingId ? (
                              <input
                                type="text"
                                name="vendorCommision"
                                id="vendorCommision"
                                autoComplete="on"
                                onChange={handleEditChange}
                                maxLength={256}
                                defaultValue={item.vendorCommision}
                              />
                            ) : (
                              item.vendorCommision
                            )}
                          </td>
                          <td>
                            {edit.status &&
                            edit.index === item.payoutChargingId ? (
                              <input
                                type="text"
                                name="gst"
                                id="gst"
                                autoComplete="on"
                                onChange={handleEditChange}
                                maxLength={256}
                                defaultValue={item.gst}
                              />
                            ) : (
                              item.gst
                            )}
                          </td>
                          <td>
                            <div className="form-check form-switch">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id="flexSwitchCheckDefault"
                                defaultChecked={item.slabeEnable === "true"}
                                // onChange={() => handleChangeStatus(item)}
                              />
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={15}>No Data Available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      </div>
    );
  }
};

export default ChargingDetailList;
