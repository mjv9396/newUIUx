/* eslint-disable react-hooks/exhaustive-deps */
import styles from "../../../styles/common/List.module.css";
import { useEffect, useState } from "react";
import useFetch from "../../../hooks/useFetch";
import { endpoints } from "../../../services/apiEndpoints";
import Loading from "../../errors/Loading";
import Error from "../../errors/Error";
import usePost from "../../../hooks/usePost";

import { successMessage } from "../../../utils/messges";
import { addMopType } from "../../../forms/payin";

const MopTypeList = () => {
  const { fetchData: getAllCurrency, data: allCurrency } = useFetch();
  const { fetchData: getAllCountry, data: allCountry } = useFetch();

  // fetch payment type
  const { fetchData: getAllPaymentType, data: allPaymentType = [] } =
    useFetch();
  const [paymentTypeCode, setPaymentTypeCode] = useState(null);

  useEffect(() => {
    getAllPaymentType(endpoints.payin.paymentTypeList);
  }, []);

  useEffect(() => {
    if (allPaymentType)
      setPaymentTypeCode(allPaymentType.data[0].paymentTypeCode);
  }, [allPaymentType]);

  // logic to fetch all mop type of selected payment type
  const {
    postData,
    data = [],
    error,
    loading,
  } = usePost(endpoints.payin.mopTypeList);

  const getMopType = async (formData) => {
    await postData(formData);
  };

  useEffect(() => {
    if (allPaymentType) getMopType({ paymentTypeCode: paymentTypeCode });
  }, [paymentTypeCode]);

  const handleChangePaymentType = (id) => {
    setPaymentTypeCode(id);
  };
  // Update acquirer profile logic
  // API handlers
  const {
    postData: updateMopType,
    data: updateMopTypeData,
    error: updateMopTypeError,
  } = usePost(endpoints.payin.addMopType);
  // Change status
  const handleChangeStatus = async (item, key) => {
    item.isActive = item[`${key}`] === "true" ? "false" : "true";
    await updateMopType(item);
  };

  useEffect(() => {
    if (updateMopTypeData && !updateMopTypeError) {
      successMessage("Mop Type Status updated successfully");
    }
  }, [updateMopTypeError, updateMopTypeData]);

  const [edit, setEdit] = useState({ status: false, index: "" });
  const [formData, setFormData] = useState(addMopType);
  const handleEdit = async (
    {
      mopId,
      mopName,
      mopCode,
      countryCode,
      currencyCode,
      paymentTypeCode,
      isActive,
      isDowntime,
    },
    index
  ) => {
    setFormData({
      ...formData,
      mopId,
      mopName,
      mopCode,
      countryCode,
      currencyCode,
      paymentTypeCode,
      isActive,
      isDowntime,
    });
    await getAllCountry(endpoints.payin.countryList);
    await getAllCurrency(endpoints.payin.currencyList);
    setEdit({ status: true, index });
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const {
    postData: editMopType,
    data: editData,
    error: editError,
  } = usePost(endpoints.payin.addMopType);
  const handleSuccess = async () => {
    await editMopType(formData);
  };
  useEffect(() => {
    if (editData && !editError) {
      successMessage("Mop Type Edited Successfully");
      setFormData(addMopType);
      setEdit(false);
      getMopType(paymentTypeCode);
    }
  }, [editData, editError]);

  if (loading) return <Loading />;
  if (error) return <Error error={error} />;
  if (allPaymentType) {
    return (
      <div className="accordion" id="accordionExample">
        {allPaymentType.data.length > 0 &&
          allPaymentType.data.map((payment, index) => (
            <div className="accordion-item" key={payment.paymentTypeId}>
              <h2 className="accordion-header">
                <button
                  className={
                    paymentTypeCode === payment.paymentTypeCode
                      ? "accordion-button"
                      : "accordion-button collapsed"
                  }
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#${payment.paymentTypeId}`}
                  aria-expanded="false"
                  aria-controls={payment.paymentTypeId}
                  onClick={() =>
                    handleChangePaymentType(payment.paymentTypeCode)
                  }
                >
                  Payment Type: {payment.paymentTypeName}(
                  {payment.paymentTypeCode})
                </button>
              </h2>
              <div
                id={payment.paymentTypeId}
                className={`accordion-collapse collapse ${
                  index === 0 ? "show" : ""
                }`}
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body">
                  <div className={styles.table}>
                    <table className="table table-responsive-sm">
                      <thead>
                        <tr>
                          <th>Id</th>
                          <th>Name</th>
                          <th>Code</th>
                          <th>Country Name</th>
                          <th>Country Code</th>
                          <th>Currency Name</th>
                          <th>Currency Code</th>
                          <th style={{ width: 80 }}>Status</th>
                          <th style={{ width: 80 }}>Down Time</th>
                          <th style={{ width: 50 }}>Edit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data && data.data.length > 0 ? (
                          data.data.map((item) => (
                            <tr key={item.mopId}>
                              <td>{item.mopId}</td>
                              <td>
                                {edit.status && edit.index === item.mopId ? (
                                  <input
                                    type="text"
                                    name="mopName"
                                    id="mopName"
                                    autoComplete="on"
                                    maxLength={256}
                                    defaultValue={item.mopName}
                                  />
                                ) : (
                                  item.mopName
                                )}
                              </td>
                              <td>
                                {edit.status && edit.index === item.mopId ? (
                                  <input
                                    type="text"
                                    name="mopCode"
                                    id="mopCode"
                                    autoComplete="on"
                                    maxLength={256}
                                    defaultValue={item.mopCode}
                                  />
                                ) : (
                                  item.mopCode
                                )}
                              </td>
                              <td>{item.countryName}</td>
                              <td>
                                {edit.status && edit.index === item.mopId ? (
                                  <select
                                    name="countryCode"
                                    id="countryCode"
                                    required
                                    defaultValue={item.countryCode}
                                    onChange={handleChange}
                                  >
                                    <option value="" disabled>
                                      --Select Country Code--
                                    </option>
                                    {allCountry.data.length > 0 ? (
                                      allCountry.data.map((country) => (
                                        <option
                                          key={country.countryCode}
                                          value={country.countryCode}
                                        >
                                          {country.countryName} (
                                          {country.countryCode})
                                        </option>
                                      ))
                                    ) : (
                                      <option>No country added</option>
                                    )}
                                  </select>
                                ) : (
                                  item.countryCode
                                )}
                              </td>
                              <td>{item.currencyName}</td>
                              <td>
                                {edit.status && edit.index === item.mopId ? (
                                  <select
                                    name="currencyCode"
                                    id="currencyCode"
                                    required
                                    defaultValue={item.currencyCode}
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
                                          {currency.currencyName} (
                                          {currency.currencyCode})
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
                                <div className="form-check form-switch">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="flexSwitchCheckDefault"
                                    defaultChecked={item.isActive === "true"}
                                    onChange={() =>
                                      handleChangeStatus(item, "isActive")
                                    }
                                  />
                                </div>
                              </td>
                              <td>
                                <div className="form-check form-switch">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="flexSwitchCheckDefault"
                                    defaultChecked={item.isDowntime === "true"}
                                    onChange={() =>
                                      handleChangeStatus(item, "isDowntime")
                                    }
                                  />
                                </div>
                              </td>
                              <td>
                                {(!edit.status ||
                                  edit.index !== item.mopId) && (
                                  <i
                                    className="bi bi-pencil-square text-info"
                                    onClick={() => handleEdit(item, item.mopId)}
                                  ></i>
                                )}
                                {edit.status && edit.index === item.mopId && (
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
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={9}>
                              No mop type for this payment type
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    );
  }
};

export default MopTypeList;
