import { useEffect, useState } from "react";
import useFetch from "../../../hooks/useFetch";
import styles from "../../../styles/common/List.module.css";
import { endpoints } from "../../../services/apiEndpoints";
import Loading from "../../errors/Loading";
import Error from "../../errors/Error";
import usePost from "../../../hooks/usePost";
import { successMessage } from "../../../utils/messges";
import { addPaymentType } from "../../../forms/payin";
const PaymentTypeList = () => {
  const { fetchData: getAllCurrency, data: allCurrency } = useFetch();
  const { fetchData: getAllCountry, data: allCountry } = useFetch();

  const { fetchData, data, error, loading } = useFetch();
  const {
    postData,
    data: paymentData,
    error: paymentError,
  } = usePost(endpoints.payin.addPaymentType);
  useEffect(() => {
    fetchData(endpoints.payin.paymentTypeList);
  }, []);

  // Change status
  const handleChangeStatus = async (payment) => {
    payment.isActive = payment.isActive === "true" ? "false" : "true";
    await postData(payment);
  };
  useEffect(() => {
    if (paymentData && !paymentError) {
      successMessage("Payment updated successfully");
    }
  }, [paymentError, paymentData]);
  const [edit, setEdit] = useState({ status: false, index: "" });
  const [formData, setFormData] = useState(addPaymentType);
  const handleEdit = async (
    {
      paymentTypeId,
      paymentTypeName,
      paymentTypeCode,
      countryCode,
      currencyCode,
      isActive,
    },
    index
  ) => {
    setFormData({
      ...formData,
      paymentTypeId,
      paymentTypeName,
      paymentTypeCode,
      countryCode,
      currencyCode,
      isActive,
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
    postData: editPaymentType,
    data: editData,
    error: editError,
  } = usePost(endpoints.payin.addPaymentType);
  const handleSuccess = async () => {
    await editPaymentType(formData);
  };
  useEffect(() => {
    if (editData && !editError) {
      successMessage("Payment Type Edited Successfully");
      setFormData(addPaymentType);
      setEdit(false);
      fetchData(endpoints.payin.paymentTypeList);
    }
  }, [editData, editError]);
  if (loading) return <Loading />;
  if (error) return <Error error={error} />;
  if (data)
    return (
      <>
        <div className={styles.listing}>
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
                  <th style={{ minWidth: 80 }}>Status</th>
                  <th style={{ minWidth: 50 }}>Edit</th>
                </tr>
              </thead>
              <tbody>
                {data.data.length > 0 ? (
                  data.data.map((item) => (
                    <tr key={item.paymentTypeId}>
                      <td>{item.paymentTypeId}</td>
                      <td>
                        {edit.status && edit.index === item.paymentTypeId ? (
                          <input
                            type="text"
                            name="paymentTypeName"
                            id="paymentTypeName"
                            autoComplete="on"
                            maxLength={256}
                            defaultValue={item.paymentTypeName}
                          />
                        ) : (
                          item.paymentTypeName
                        )}
                      </td>
                      <td>
                        {edit.status && edit.index === item.paymentTypeId ? (
                          <input
                            type="text"
                            name="paymentTypeCode"
                            id="paymentTypeCode"
                            autoComplete="on"
                            maxLength={256}
                            onChange={handleChange}
                            defaultValue={item.paymentTypeCode}
                          />
                        ) : (
                          item.paymentTypeCode
                        )}
                      </td>
                      <td>{item.countryName}</td>
                      <td>
                        {edit.status && edit.index === item.paymentTypeId ? (
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
                                  {country.countryName} ({country.countryCode})
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
                        {edit.status && edit.index === item.paymentTypeId ? (
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
                            onChange={() => handleChangeStatus(item)}
                          />
                        </div>
                      </td>
                      <td>
                        {(!edit.status ||
                          edit.index !== item.paymentTypeId) && (
                          <i
                            className="bi bi-pencil-square text-info"
                            onClick={() => handleEdit(item, item.paymentTypeId)}
                          ></i>
                        )}
                        {edit.status && edit.index === item.paymentTypeId && (
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
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8}>No Payment Added</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
};

export default PaymentTypeList;
