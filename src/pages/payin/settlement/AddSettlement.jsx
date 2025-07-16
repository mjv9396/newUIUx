import { useEffect, useState } from "react";
import useFetch from "../../../hooks/useFetch";
import styles from "../../../styles/common/Add.module.css";
import { settlement } from "../../../forms/payin";
import usePost from "../../../hooks/usePost";
import { endpoints } from "../../../services/apiEndpoints";
import { validateSettlementForm } from "../../../formValidations/settlementForm";
import { successMessage } from "../../../utils/messges";

const AddSettlement = () => {
  // fetch merchant and acquirer
  const { fetchData: getAllMerchant, data: allMerchant } = useFetch();
  useEffect(() => {
    getAllMerchant(endpoints.user.userList);
  }, []);
  //form handlers
  const [formData, setFormData] = useState(settlement);
  const [errors, setErrors] = useState({});
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

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
  };

  useEffect(() => {
    if (data && !error) {
      successMessage("Settlement added successfully");
      setFormData(settlement);
    }
  }, [error, data]);
  if (allMerchant)
    return (
      <div className={styles.listing}>
        <div className="row">
          <div className="col-md-6 col-sm-12 mb-2">
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
          <div className="col-md-6 col-sm-12 mb-2">
            <label htmlFor="acqCode">
              Select Type <span className="required">*</span>
            </label>
            <select
              name="settlementType"
              id="settlementType"
              onChange={handleChange}
              defaultValue=""
            >
              <option value="" disabled>
                --Select type--
              </option>
              <option value="D">Daily</option>
              <option value="H">Hourly</option>
              <option value="A">Amount</option>
            </select>
            {errors.acqCode && <span className="errors">{errors.acqCode}</span>}
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="d-flex flex-wrap gap-3 align-items-center ">
            {formData.settlementType === "D" && (
              <>
                <div className={styles.input}>
                  <label htmlFor="day">
                    day <span className="required">*</span>
                  </label>
                  <select name="day" id="day" defaultValue="">
                    <option value="" disabled>
                      Select day
                    </option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                  </select>
                  {errors.day && <span className="errors">{errors.day}</span>}
                </div>

                <div className={styles.input}>
                  <label htmlFor="settlementTime">
                    Settlement time <span className="required">*</span>
                  </label>
                  <select
                    name="settlementTime"
                    id="settlementTime"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select day
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
                    <span className="errors">{errors.settlementTime}</span>
                  )}
                </div>
              </>
            )}
            {formData.settlementType === "H" && (
              <div className={styles.input}>
                <label htmlFor="hours">
                  Hours <span className="required">*</span>
                </label>
                <select name="hours" id="hours" defaultValue="">
                  <option value="" disabled>
                    Select day
                  </option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                </select>
                {errors.hours && (
                  <span className="errors">{errors.hourshours}</span>
                )}
              </div>
            )}
            {formData.settlementType === "A" && (
              <div className={styles.input}>
                <label htmlFor="amount">
                  Amount <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="amount"
                  id="amount"
                  placeholder="Enter Amount"
                  autoComplete="on"
                  maxLength={256}
                  onChange={handleChange}
                  value={formData.amount}
                  required
                />
                {errors.amount && (
                  <span className="errors">{errors.amount}</span>
                )}
              </div>
            )}
            <div className="d-flex gap-3 mt-4 justify-content-end align-items-center">
              <button
                className={
                  !loading ? styles.submit + " " + styles.active : styles.submit
                }
                type="submit"
              >
                Add
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
      </div>
    );
};

export default AddSettlement;
