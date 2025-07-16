/* eslint-disable react/prop-types */
import { useEffect } from "react";
import usePost from "../../../hooks/usePost";
import { endpoints } from "../../../services/apiEndpoints";
import styles from "../../../styles/merchant/Merchant.module.css";
import useDeleteWithBody from "../../../hooks/useDeleteWithbody";
import { successMessage } from "../../../utils/messges";

const IPWhitelist = ({ userId }) => {
  // fetch all whitelisted IP
  const {
    postData: getIPList,
    data: ipList,
    error: ipListError,
  } = usePost(endpoints.user.whitelistIPList);
  useEffect(() => {
    getIPList({ userId });
  }, []);

  // Add white list ip
  const { postData, data, error } = usePost(endpoints.user.addWhitelistIP);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await postData({
      userId: userId,
      ipAddress: e.target.ipAddress.value,
    });
    e.target.reset();
  };
  useEffect(() => {
    if (data && !error) {
      getIPList({ userId });
      successMessage("IP Added successfully");
    }
  }, [error, data]);
  const {
    deleteData,
    data: deleteDataResponse,
    error: deleteError,
  } = useDeleteWithBody();
  const handleDelete = async (id) => {
    await deleteData(endpoints.user.addWhitelistIP, { payoutWhitelistId: id });
  };
  useEffect(() => {
    if (deleteDataResponse && !deleteError) {
      successMessage("Data deleted successfully");
      getIPList({ userId });
    }
  }, [deleteDataResponse, deleteError]);
  return (
    <>
      <div>
        <h6>Payout IP Whitelist</h6>
        <form onSubmit={handleSubmit}>
          <div className="d-flex flex-wrap gap-3 mt-3">
            <div className={styles.input}>
              <label htmlFor="ipAddress">
                Enter IP Address
                <span className="required">*</span>
              </label>
              <input
                type="text"
                name="ipAddress"
                id="ipAddress"
                placeholder="Enter IP"
              />
            </div>
          </div>
          <div className="d-flex justify-content-end mt-3">
            <button className={styles.update}>Update</button>
          </div>
        </form>
      </div>
      {ipList && !ipListError && (
        <div className="mt-3">
          <h6>Payout Whitelist IP</h6>
          <div className={styles.table}>
            <table className="table table-responsive-sm">
              <thead>
                <tr>
                  <th>IP Address</th>
                  <th>Added Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {ipList.data.length > 0 ? (
                  ipList.data.map((item) => (
                    <tr key={item.ipAddress}>
                      <td>{item.ipAddress}</td>
                      <td>{item.createdDate}</td>
                      <td>
                        <i
                          className="bi bi-trash-fill text-danger"
                          onClick={() => handleDelete(item.payoutWhitelistId)}
                        ></i>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3}>No IP whitelisted</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

export default IPWhitelist;
