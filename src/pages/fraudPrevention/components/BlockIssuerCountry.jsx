/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import styles from "../../../styles/common/List.module.css";
import usePost from "../../../hooks/usePost";
import { endpoints } from "../../../services/apiEndpoints";
import useDelete from "../../../hooks/useDelete";
import AddRule from "./addRuleModal/AddRule";
import { successMessage } from "../../../utils/messges";
const BlockIssuerCountry = ({ type, userId }) => {
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
    await postData({ type, userId });
  };

  const [viewAddRule, setViewAddRule] = useState(false);
  const handleAddRule = () => {
    setViewAddRule(true);
  };
  return (
    <div>
      {viewAddRule && (
        <AddRule
          type={type}
          userId={userId}
          onSuccess={getList}
          placeholder="Enter Issue Country Name"
          onClick={() => setViewAddRule(!viewAddRule)}
        />
      )}
      <div className="d-flex justify-content-between align-align-items-center">
        <h6>Block Issuer Country List</h6>
        <button className={styles.btn} onClick={handleAddRule}>
          Add Country
        </button>
      </div>
      <div className={styles.listing}>
        <div className={styles.filter}>
          <input type="search" placeholder="Search by country name" />
        </div>
        <div className={styles.table}>
          <table className="table table-responsive-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>VALUE</th>
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
                  <td colSpan={5}>No data available</td>
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

export default BlockIssuerCountry;
