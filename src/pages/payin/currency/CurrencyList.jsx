/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import useFetch from "../../../hooks/useFetch";
import styles from "../../../styles/common/List.module.css";
import { endpoints } from "../../../services/apiEndpoints";
import Loading from "../../errors/Loading";
import Error from "../../errors/Error";
import usePost from "../../../hooks/usePost";

import { addCurrency } from "../../../forms/payin";
import { successMessage } from "../../../utils/messges";
const CurrencyList = () => {
  const { fetchData, data, error, loading } = useFetch();
  const {
    postData,
    data: currencyData,
    error: currencyError,
  } = usePost(endpoints.payin.addCurrency);

  useEffect(() => {
    fetchData(endpoints.payin.currencyList);
  }, [currencyData && !currencyError]);

  // Change status
  const handleChangeStatus = async (currency) => {
    currency.isActive = currency.isActive === "true" ? "false" : "true";
    await postData(currency);
  };
  useEffect(() => {
    if (currencyData && !currencyError) {
      successMessage("Currency updated successfully");
    }
  }, [currencyError, currencyData]);
  // Edit logic
  const [edit, setEdit] = useState({ status: false, index: "" });
  const [formData, setFormData] = useState(addCurrency);
  const handleEdit = async (
    {
      currencyId,
      currencyName,
      currencyCode,
      currencyNumber,
      currencyDecimalPlace,
    },
    index
  ) => {
    setFormData({
      ...formData,
      currencyId: currencyId,
      currencyName: currencyName,
      currencyCode: currencyCode,
      currencyNumber: currencyNumber,
      currencyDecimalPlace: currencyDecimalPlace,
    });
    setEdit({ status: true, index });
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const {
    postData: editCurrency,
    data: editData,
    error: editError,
  } = usePost(endpoints.payin.addCurrency);
  const handleSuccess = async () => {
    await editCurrency(formData);
  };
  useEffect(() => {
    if (editData && !editError) {
      successMessage("Currency Edited Successfully");
      setFormData(addCurrency);
      setEdit(false);
      fetchData(endpoints.payin.countryList);
    }
  }, [editData, editError]);
  if (loading) return <Loading />;
  if (error) return <Error error={error} />;
  if (data) {
    return (
      <>
        <div className={styles.listing}>
          <div className={styles.table}>
            <table className="table table-responsive-sm">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Name</th>
                  <th>Currency Code</th>
                  <th>Currency Number</th>
                  <th>Currency Decimal Place</th>
                  <th style={{ minWidth: 80 }}>Status</th>
                  <th style={{ minWidth: 50 }}></th>
                </tr>
              </thead>
              <tbody>
                {data.data.length > 0 ? (
                  data.data.map((item) => (
                    <tr key={item.currencyId}>
                      <td>{item.currencyId}</td>
                      <td>
                        {edit.status && edit.index === item.currencyId ? (
                          <input
                            type="text"
                            name="currencyName"
                            id="currencyName"
                            autoComplete="on"
                            maxLength={256}
                            onChange={handleChange}
                            defaultValue={item.currencyName}
                          />
                        ) : (
                          item.currencyName
                        )}
                      </td>
                      <td>
                        {edit.status && edit.index === item.currencyId ? (
                          <input
                            type="text"
                            name="currencyCode"
                            id="currencyCode"
                            autoComplete="on"
                            maxLength={256}
                            onChange={handleChange}
                            defaultValue={item.currencyCode}
                          />
                        ) : (
                          item.currencyCode
                        )}
                      </td>
                      <td>
                        {edit.status && edit.index === item.currencyId ? (
                          <input
                            type="text"
                            name="currencyNumber"
                            id="currencyNumber"
                            autoComplete="on"
                            maxLength={256}
                            onChange={handleChange}
                            defaultValue={item.currencyNumber}
                          />
                        ) : (
                          item.currencyNumber
                        )}
                      </td>

                      <td>{item.currencyDecimalPlace}</td>
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
                        {(!edit.status || edit.index !== item.currencyId) && (
                          <i
                            className="bi bi-pencil-square text-info"
                            onClick={() => handleEdit(item, item.currencyId)}
                          ></i>
                        )}
                        {edit.status && edit.index === item.currencyId && (
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
                    <td colSpan={6}>No Currency Added</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  }
};

export default CurrencyList;
