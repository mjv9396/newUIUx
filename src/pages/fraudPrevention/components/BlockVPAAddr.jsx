/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import styles from "../../../styles/common/List.module.css";
import usePost from "../../../hooks/usePost";
import { endpoints } from "../../../services/apiEndpoints";
import useDelete from "../../../hooks/useDelete";
import AddRule from "./addRuleModal/AddRule";
import { successMessage } from "../../../utils/messges";

const BlockVPAAddr = ({ type, userId }) => {
  const { postData, data } = usePost(endpoints.fraud.allRulesByUserAndType);
  const getList = async () => {
    await postData({ type, userId });
  };
  useEffect(() => {
    getList();
  }, []);

  const { deleteData } = useDelete();
  const handleDelete = async (id) => {
    await deleteData(endpoints.fraud.fraudPrevention + "/" + id);
    successMessage("data deleted successfully");
    getList();
  };

  const [viewAddRule, setViewAddRule] = useState(false);
  const handleAddRule = () => {
    setViewAddRule(true);
  };
  if (data)
    return (
      <div>
        {viewAddRule && (
          <AddRule
            type={type}
            userId={userId}
            onSuccess={getList}
            placeholder="Enter VPA Address(UPI ID)"
            onClick={() => setViewAddRule(!viewAddRule)}
          />
        )}
        <div className="d-flex justify-content-between align-items-center">
          <h6>Block VPA Address List</h6>
          <button className={styles.btn} onClick={handleAddRule}>
            Add VPA Address
          </button>
        </div>
        <div className={styles.listing}>
          <div className={styles.filter}>
            <input type="search" placeholder="Search by currency" />
          </div>
          <div className={styles.table}>
            <table className="table table-responsive-sm">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>VPA Address</th>
                  <th>Created Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {data && data.data.length > 0 ? (
                  data.data.map((item) => (
                    <tr key={item.fraudPreventionId}>
                      <td>{item.userId}</td>
                      <td>{item.value}</td>
                      <td>{item.createdDate}</td>
                      <td>
                        <i
                          className="bi bi-trash-fill text-danger"
                          onClick={() => handleDelete(item.fraudPreventionId)}
                        ></i>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4}>No data available</td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className={styles.pagination}>
              <button className={styles.btn} id={styles.prev}>
                Prev
              </button>
              <span>1/1</span>
              <button className={styles.btn} id={styles.next}>
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    );
};

export default BlockVPAAddr;
