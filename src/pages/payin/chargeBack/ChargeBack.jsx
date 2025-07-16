/* eslint-disable react-hooks/exhaustive-deps */
import { useLocation } from "react-router-dom";
import DashboardLayout from "../../../layouts/DashboardLayout";
import styles from "../../../styles/common/Add.module.css";
import { endpoints } from "../../../services/apiEndpoints";
import useFileUpload from "../../../hooks/useFileUpload";
import { errorMessage, successMessage } from "../../../utils/messges";

const ChargeBack = () => {
  const { state } = useLocation();
  const { uploadData, loading } = useFileUpload();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("orderId", state.data.orderId);
    formData.append("remark", e.target.remark.value | "");
    formData.append("type", e.target.type.value | "");
    formData.append(
      "image",
      e.target.image.files[0] ? e.target.image.files[0] : null
    );
    const response = await uploadData(endpoints.payin.addChargeBack, formData);
    if (response.statusCode === 201) {
      successMessage("Chargeback Added Successfully");
    } else {
      errorMessage(response?.data || "Charge back already issued.");
    }
  };

  return (
    <DashboardLayout page="Raise Dispute" url="/dashboard/dispute">
      <div className={styles.listing}>
        <h5>Transaction Details:</h5>
        <div className={styles.detail}>
          <table className="table table-borderless">
            <thead className="hidden">
              <tr>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Order Id</td>
                <td>{state?.data.orderId}</td>
                <td>Transaction Id</td>
                <td>{state?.data.txnId}</td>
              </tr>
              <tr>
                <td>Merchant Name</td>
                <td></td>
                <td>Product Description</td>
                <td>{state?.data.productDesc}</td>
              </tr>
              <tr>
                <td>Customer Email</td>
                <td>{state.data.custEmail}</td>
                <td>Customer Phone</td>
                <td>{state?.data.custPhone}</td>
              </tr>
              <tr>
                <td>Currency Code</td>
                <td>{state?.data.currencyCode}</td>
                <td>Amount</td>
                <td>{state.data.amount}</td>
              </tr>
              <tr>
                <td>Transaction Type</td>
                <td>{state?.data.transactionType}</td>
                <td>Transaction Status</td>
                <td>{state?.data.txnStatus}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className={styles.listing}>
        <form onSubmit={handleSubmit}>
          <h5>Raise Dispute</h5>
          <div className="d-flex flex-wrap gap-3">
            <div className={styles.input}>
              <label htmlFor="type">
                Select Type <span className="required">*</span>
              </label>
              <select name="type" id="type" defaultValue="">
                <option value="" disabled>
                  --Select Type--
                </option>
                <option value="CYBER_DISTRIBUTE">CYBER DISTRIBUTE</option>
                <option value="DISTRIBUTE">DISTRIBUTE</option>
              </select>
            </div>
            <div className={styles.input}>
              <label htmlFor="image">Screenshot / Image</label>
              <input type="file" name="image" id="image" accept="image/*" />
            </div>
          </div>
          <div className={styles.textarea}>
            <label htmlFor="remark">Remark</label>
            <textarea
              name="remark"
              id="remark"
              rows={5}
              maxLength={1000}
              placeholder="Enter remark for chargeback (max 1000 characters)"
              defaultValue="Services not rendered."
            />
          </div>
          <div className="d-flex gap-3 mt-3 justify-content-end">
            <button
              className={
                !loading ? styles.submit + " " + styles.active : styles.submit
              }
              type="submit"
            >
              Raise Dispute
            </button>
            <button className={styles.clear} type="reset">
              clear
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default ChargeBack;
