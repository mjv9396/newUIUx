import { useEffect, useState } from "react";
import usePost from "../../../hooks/usePost";
import { endpoints } from "../../../services/apiEndpoints";
import styles from "../../../styles/common/Add.module.css";
import { addLoadMoney } from "../../../forms/payout";
import { validateLoadMoneyForm } from "../../../formValidations/loadMoneyForm";

import Error from "../../errors/Error";
import Loading from "../../errors/Loading";
import useFetch from "../../../hooks/useFetch";
import { GetUserRole } from "../../../services/cookieStore";
import { errorMessage, successMessage } from "../../../utils/messges";
const AddLoadMoney = () => {
  //fetch merchant, acquirer, payment type, mop type and  curreny
  const {
    fetchData: getAllMerchant,
    data: allMerchant,
    error: merchantError,
    loading: merchantLoading,
  } = useFetch();

  useEffect(() => {
    getAllMerchant(endpoints.user.userList);
  }, []);

  // form handlers
  const [formData, setFormData] = useState(addLoadMoney);
  const [errors, setErrors] = useState({});
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({});
  };

  // API handlers
  const { postData, data, error, loading } = usePost(
    endpoints.payout.addLoadMoney
  );
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateLoadMoneyForm(formData);
    if (Object.keys(validationError).length > 0) {
      setErrors(validationError);
      return;
    }
    await postData(formData);
  };

  useEffect(() => {
    if (data?.statusCode < 400 && !error) {
      successMessage("Load Money Added Successfully");
      setFormData(addLoadMoney);
    }
    if (data?.statusCode >= 400) {
      errorMessage(data?.data || "Error Adding Load Money, Please try again");
    }
  }, [error, data]);
  if (merchantError) <Error error="Error loading Merchants" />;
  if (merchantLoading) <Loading loading="Loading Merchant" />;
  if (allMerchant)
    return (
      <div className={styles.listing}>
        <form onSubmit={handleSubmit}>
          <div className="d-flex flex-wrap gap-3 ">
            {GetUserRole() === "ADMIN" && (
              <div className={styles.input}>
                <label htmlFor="userId">
                  Merchant <span className="required">*</span>
                </label>
                <select
                  name="userId"
                  id="userId"
                  onChange={handleChange}
                  defaultValue=""
                  required
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
                {errors.userId && (
                  <span className="errors">{errors.userId}</span>
                )}
              </div>
            )}
            <div className={styles.input}>
              <label htmlFor="transactionAmmount">
                Amount <span className="required">*</span>
              </label>
              <input
                type="number"
                name="transactionAmount"
                id="transactionAmount"
                placeholder="Enter Transaction Amount"
                autoComplete="on"
                min="1"
                max="10000000"
                step="0.01"
                onChange={handleChange}
                value={formData.transactionAmount}
                required
              />
              {errors.transactionAmount && (
                <span className="errors">{errors.transactionAmount}</span>
              )}
            </div>
            <div className={styles.input}>
              <label htmlFor="transactionReceiptId">
                Receipt ID <span className="required">*</span>
              </label>
              <input
                type="text"
                name="transactionReceiptId"
                id="transactionReceiptId"
                placeholder="Enter Transaction Receipt Id"
                autoComplete="on"
                maxLength={256}
                onChange={handleChange}
                value={formData.transactionReceiptId}
                required
              />
              {errors.transactionReceiptId && (
                <span className="errors">{errors.transactionReceiptId}</span>
              )}
            </div>
            <div className={styles.textarea}>
              <label htmlFor="remark">
                Remark <span className="required">*</span>
              </label>
              <textarea
                type="text"
                name="remark"
                id="remark"
                rows={2}
                style={{ width: "92%" }}
                placeholder="Enter Remark"
                autoComplete="on"
                onChange={handleChange}
                value={formData.remark}
              />
              {errors.remark && <span className="errors">{errors.remark}</span>}
            </div>
          </div>
          <div className="d-flex align-items-center gap-3  justify-content-end">
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
              onClick={() => setFormData(addLoadMoney)}
            >
              clear
            </button>
          </div>
        </form>
      </div>
    );
};

export default AddLoadMoney;
