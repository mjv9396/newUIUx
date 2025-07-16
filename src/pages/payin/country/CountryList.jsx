/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import useFetch from "../../../hooks/useFetch";
import styles from "../../../styles/common/List.module.css";
import { endpoints } from "../../../services/apiEndpoints";
import Loading from "../../errors/Loading";
import Error from "../../errors/Error";
import usePost from "../../../hooks/usePost";
import { addCountry } from "../../../forms/payin";
import { successMessage } from "../../../utils/messges";
const CountryList = () => {
  //fetch curreny and country
  const { fetchData: getAllCurrency, data: allCurrency } = useFetch();

  useEffect(() => {
    getAllCurrency(endpoints.payin.currencyList);
  }, []);
  const { fetchData, data, error, loading } = useFetch();
  const {
    postData,
    data: countryData,
    error: countryError,
  } = usePost(endpoints.payin.addCountry);

  useEffect(() => {
    fetchData(endpoints.payin.countryList);
  }, []);

  // Change status
  const handleChangeStatus = async (country) => {
    country.isActive = country.isActive === "true" ? "false" : "true";
    await postData(country);
  };
  useEffect(() => {
    if (countryData && !countryError) {
      successMessage("Country updated successfully");
    }
  }, [countryError, countryData]);

  // Edit logic
  const [edit, setEdit] = useState({ status: false, index: "" });
  const [formData, setFormData] = useState(addCountry);
  const handleEdit = async (
    {
      countryId,
      countryName,
      isoCodeAlpha2,
      isoCodeAlpha3,
      unCode,
      currency,
      isdCode,
      isActive,
    },
    index
  ) => {
    setFormData({
      ...formData,
      countryId,
      countryName,
      isoCodeAlpha2,
      isoCodeAlpha3,
      unCode,
      currency,
      isdCode,
      isActive,
    });
    await getAllCurrency(endpoints.payin.currencyList);
    setEdit({ status: true, index });
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const {
    postData: editCountry,
    data: editData,
    error: editError,
  } = usePost(endpoints.payin.addCountry);
  const handleSuccess = async () => {
    await editCountry(formData);
  };
  useEffect(() => {
    if (editData && !editError) {
      successMessage("Country Edited Successfully");
      setFormData(addCountry);
      setEdit(false);
      fetchData(endpoints.payin.countryList);
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
                  <th>ISO Code(Alpha2)</th>
                  <th>ISO Code(Alpha3)</th>
                  <th>Uni Code</th>
                  <th>Currency</th>
                  <th>ISD Code</th>
                  <th style={{ minWidth: 80 }}>Status</th>
                  <th style={{ minWidth: 50 }}>Edit</th>
                </tr>
              </thead>
              <tbody>
                {data.data.length > 0 ? (
                  data.data.map((item) => (
                    <tr key={item.countryId}>
                      <td>{item.countryId}</td>
                      <td>
                        {edit.status && edit.index === item.countryId ? (
                          <input
                            type="text"
                            name="countryName"
                            id="countryName"
                            autoComplete="on"
                            maxLength={256}
                            defaultValue={item.countryName}
                          />
                        ) : (
                          item.countryName
                        )}
                      </td>
                      <td>
                        {edit.status && edit.index === item.countryId ? (
                          <input
                            type="text"
                            name="isoCodeAlpha2"
                            id="isoCodeAlpha2"
                            autoComplete="on"
                            maxLength={256}
                            onChange={handleChange}
                            defaultValue={item.isoCodeAlpha2}
                          />
                        ) : (
                          item.isoCodeAlpha2
                        )}
                      </td>
                      <td>
                        {edit.status && edit.index === item.countryId ? (
                          <input
                            type="text"
                            name="isoCodeAlpha3"
                            id="isoCodeAlpha3"
                            autoComplete="on"
                            maxLength={256}
                            onChange={handleChange}
                            defaultValue={item.isoCodeAlpha3}
                          />
                        ) : (
                          item.isoCodeAlpha3
                        )}
                      </td>
                      <td>
                        {edit.status && edit.index === item.countryId ? (
                          <input
                            type="text"
                            name="unCode"
                            id="unCode"
                            autoComplete="on"
                            maxLength={256}
                            onChange={handleChange}
                            defaultValue={item.unCode}
                          />
                        ) : (
                          item.unCode
                        )}
                      </td>
                      <td>
                        {edit.status && edit.index === item.countryId ? (
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
                                  {currency.currencyName} (
                                  {currency.currencyCode})
                                </option>
                              ))
                            ) : (
                              <option>No currency added</option>
                            )}
                          </select>
                        ) : (
                          item.currency
                        )}
                      </td>
                      <td>
                        {edit.status && edit.index === item.countryId ? (
                          <input
                            type="text"
                            name="isdCode"
                            id="isdCode"
                            autoComplete="on"
                            maxLength={256}
                            onChange={handleChange}
                            defaultValue={item.isdCode}
                          />
                        ) : (
                          item.isdCode
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
                        {(!edit.status || edit.index !== item.countryId) && (
                          <i
                            className="bi bi-pencil-square text-info"
                            onClick={() => handleEdit(item, item.countryId)}
                          ></i>
                        )}
                        {edit.status && edit.index === item.countryId && (
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
                    <td colSpan={8}>No Country Added</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
};

export default CountryList;
