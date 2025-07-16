/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { settlement } from "../../../forms/payin";
import usePost from "../../../hooks/usePost";
import { endpoints } from "../../../services/apiEndpoints";
import { validateSettlementForm } from "../../../formValidations/settlementForm";
import styles from "../../../styles/common/Add.module.css";
import useFetch from "../../../hooks/useFetch";
import { successMessage } from "../../../utils/messges";

const PayinSettlement = ({ userId }) => {
  const { fetchData, data: settlementData } = useFetch();

  //form handlers
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "settlementActive" && !checked) {
      setFormData(() =>
        settlement(
          userId,
          settlementData.data ? settlementData.data.settlementType : "D",
          false
        )
      );
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  useEffect(() => {
    if (settlementData && settlementData.data) {
      setFormData(() =>
        settlement(
          userId,
          settlementData.data.settlementType,
          settlementData.data.settlementActive
        )
      );
    } else {
      setFormData(() => settlement(userId, "D", false));
    }
  }, [settlementData]);
  // API handlers
  const { postData, data, error, loading } = usePost(
    endpoints.payin.settlement
  );
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateSettlementForm(formData);
    if (Object.keys(validationError).length > 0) {
      setErrors(validationError);
      return;
    }
    await postData(formData);
    e.target.reset;
  };

  useEffect(() => {
    fetchData(endpoints.payin.settlement + "/" + userId);
  }, [data]);

  useEffect(() => {
    if (data && !error) {
      successMessage("Settlement added successfully");
      formData.settlementActive
        ? setFormData(() => settlement(userId))
        : setFormData(() => settlement(userId, "", false));
    }
  }, [error, data]);
  if (settlementData) {
    return (
      <div>
        <h6>Payin Settlement Cycle</h6>
        <div className={styles.listing}>
          <div className="d-flex flex-column flex wrap gap-3">
            <div className="d-flex flex-column ">
              <span htmlFor="settlementActive">
                Settlement Status
                <span className="required">*</span>
              </span>
              <div className="form-check form-switch">
                <input
                  className="form-check-input form-control"
                  type="checkbox"
                  name="settlementActive"
                  id="flexSwitchCheckDefault"
                  defaultChecked={settlementData?.data?.settlementActive}
                  onChange={handleChange}
                  style={{ width: 50, height: 25 }}
                />
              </div>
            </div>

            <>
              {formData.settlementActive && (
                <div className="d-flex flex-wrap gap-4">
                  <span className="d-flex  align-items-center gap-1">
                    <input
                      type="radio"
                      name="settlementType"
                      onChange={handleChange}
                      value="D"
                      defaultChecked={
                        settlementData.data === null ||
                        settlementData.data?.settlementType === "D"
                      }
                    />
                    <span htmlFor="">
                      <b>Daily</b>
                    </span>
                  </span>
                  <span className="d-flex align-items-center gap-1">
                    <input
                      type="radio"
                      name="settlementType"
                      value="H"
                      onChange={handleChange}
                      defaultChecked={
                        settlementData.data?.settlementType === "H"
                      }
                    />
                    <b>Hourly</b>
                  </span>
                  <span className="d-flex align-items-center gap-1">
                    <input
                      type="radio"
                      value="A"
                      name="settlementType"
                      onChange={handleChange}
                      defaultChecked={
                        settlementData.data?.settlementType === "A"
                      }
                    />
                    <b>Amount</b>
                  </span>
                </div>
              )}
            </>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="d-flex flex-wrap gap-3 align-items-center mt-2 ">
              {formData.settlementActive && (
                <>
                  {formData.settlementType === "D" && (
                    <>
                      <div
                        className={styles.input}
                        style={{ minWidth: "18rem" }}
                      >
                        <label htmlFor="day">
                          day <span className="required">*</span>
                        </label>
                        <select
                          name="day"
                          id="day"
                          defaultValue=""
                          onChange={handleChange}
                        >
                          <option value="" disabled>
                            Select day
                          </option>
                          <option value="1">T+1</option>
                          <option value="2">T+2</option>
                          <option value="3">T+3</option>
                          <option value="4">T+4</option>
                          <option value="5">T+5</option>
                          <option value="6">T+6</option>
                          <option value="7">T+7</option>
                        </select>
                        {errors.day && (
                          <span className="errors">{errors.day}</span>
                        )}
                      </div>

                      <div
                        className={styles.input}
                        style={{ minWidth: "18rem" }}
                      >
                        <label htmlFor="settlementTime">
                          Settlement time <span className="required">*</span>
                        </label>
                        <select
                          name="settlementTime"
                          id="settlementTime"
                          defaultValue=""
                          onChange={handleChange}
                        >
                          <option value="" disabled>
                            Select time
                          </option>
                          <option value="00:00">00:00</option>
                          <option value="01:00">01:00</option>
                          <option value="02:00">02:00</option>
                          <option value="03:00">03:00</option>
                          <option value="04:00">04:00</option>
                          <option value="05:00">05:00</option>
                          <option value="06:00">06:00</option>
                          <option value="07:00">07:00</option>
                          <option value="08:00">08:00</option>
                          <option value="09:00">09:00</option>
                          <option value="10:00">10:00</option>
                          <option value="11:00">11:00</option>
                          <option value="12:00">12:00</option>
                          <option value="13:00">13:00</option>
                          <option value="14:00">14:00</option>
                          <option value="15:00">15:00</option>
                          <option value="16:00">16:00</option>
                          <option value="17:00">17:00</option>
                          <option value="18:00">18:00</option>
                          <option value="19:00">19:00</option>
                          <option value="20:00">20:00</option>
                          <option value="21:00">21:00</option>
                          <option value="22:00">22:00</option>
                          <option value="23:00">23:00</option>
                        </select>
                        {errors.settlementTime && (
                          <span className="errors">
                            {errors.settlementTime}
                          </span>
                        )}
                      </div>
                    </>
                  )}
                  {formData.settlementType === "H" && (
                    <div className={styles.input} style={{ minWidth: "18rem" }}>
                      <label htmlFor="hours">
                        On day settlement period{" "}
                        <span className="required">*</span>
                      </label>
                      <select
                        name="hours"
                        id="hours"
                        defaultValue=""
                        onChange={handleChange}
                      >
                        <option value="" disabled>
                          Select Every hour
                        </option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                        <option value="11">11</option>
                        <option value="12">12</option>
                      </select>
                      {errors.hours && (
                        <span className="errors">{errors.hourshours}</span>
                      )}
                    </div>
                  )}
                  {formData.settlementType === "A" && (
                    <div className={styles.input} style={{ minWidth: "18rem" }}>
                      <label htmlFor="amount">
                        On Day Amount Settlement Limit{" "}
                        <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        name="amount"
                        id="amount"
                        placeholder="Enter Amount"
                        autoComplete="on"
                        maxLength={256}
                        pattern="^\d+(\.\d{1,2})?$"
                        title="Enter a valid number amount with up to 2 decimal places"
                        onChange={handleChange}
                        value={formData.amount}
                        required
                      />
                      {errors.amount && (
                        <span className="errors">{errors.amount}</span>
                      )}
                    </div>
                  )}
                </>
              )}

              <div className="d-flex flex-column">
                <label htmlFor="" className=""></label>
              </div>
              <div className="d-flex gap-3  justify-content-end align-items-center">
                <button
                  className={
                    !loading
                      ? styles.submit + " " + styles.active
                      : styles.submit
                  }
                  type={loading ? "button" : "submit"}
                >
                  {settlementData.data
                    ? loading
                      ? "Updating..."
                      : "Update"
                    : loading
                    ? "Adding..."
                    : "Add"}
                </button>
                <button
                  className={styles.clear}
                  type="reset"
                  onClick={() => setFormData(settlement)}
                >
                  clear
                </button>
              </div>
            </div>
          </form>

          <h6 className="mt-4">Settlement Cycle Details</h6>
          <table className="table" style={{ fontSize: 14 }}>
            <thead>
              <tr>
                <th></th>
                <th></th>
              </tr>
            </thead>
            {settlementData.data ? (
              <tbody>
                <tr>
                  <td>Settlement Cycle ID</td>
                  <td>{settlementData.data?.settlementCycleId}</td>
                </tr>
                <tr>
                  <td>Settlement Type</td>
                  <td>{settlementData.data?.settlementType}</td>
                </tr>
                {settlementData.data?.settlementType === "D" && (
                  <tr>
                    <td>Settlement Day</td>
                    <td>{settlementData.data?.day}</td>
                  </tr>
                )}
                {settlementData.data?.settlementType === "D" && (
                  <tr>
                    <td>Settlement Time</td>
                    <td>{settlementData.data?.settlementTime}</td>
                  </tr>
                )}
                {settlementData.data?.settlementType === "H" && (
                  <tr>
                    <td>On day settlement period</td>
                    <td>{settlementData.data?.hours}</td>
                  </tr>
                )}
                {settlementData.data?.settlementType === "A" && (
                  <tr>
                    <td>Amount</td>
                    <td>{settlementData.data?.amount}</td>
                  </tr>
                )}
                <tr>
                  <td>Status</td>
                  <td>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="flexSwitchCheckDefault"
                        checked={settlementData.data.settlementActive}
                        // onChange={() => handleChangeStatus(item)}
                      />
                    </div>
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                <tr>
                  <td colSpan={2}>No settlement cycle added</td>
                </tr>
              </tbody>
            )}
          </table>
        </div>
      </div>
    );
  }
};

export default PayinSettlement;
