import { useEffect } from "react";
import useFetch from "../../hooks/useFetch";
import styles from "../../styles/common/List.module.css";
import { endpoints } from "../../services/apiEndpoints";
import Loading from "../errors/Loading";
import Error from "../errors/Error";
import DashboardLayout from "../../layouts/DashboardLayout";

const LoginHostory = () => {
  const { fetchData, data, error, loading } = useFetch();
  useEffect(() => {
    fetchData(endpoints.user.loginHistory);
  }, []);
  if (loading) return <Loading />;
  if (error) return <Error error={error} />;
  if (data)
    return (
      <DashboardLayout page="Merchant List" url="/dashboard/merchant-list">
        <div className={styles.listing}>
          <div className={styles.filter}>
            <input type="search" placeholder="Search by buisness name" />
          </div>
          <div
            className={styles.table}
            style={{ maxHeight: "70vh", overflowY: "auto" }}
          >
            <table className="table table-responsive-sm">
              <thead>
                <tr>
                  <th>SNo</th>
                  <th>User Id</th>
                  <th>Time</th>
                  <th>Business Name</th>
                  <th>Email</th>
                  <th>IP Address</th>
                  <th>OS</th>
                  <th>Browser</th>
                  <th>Country</th>
                </tr>
              </thead>
              <tbody>
                {data.data.length > 0 ? (
                  data.data.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      <td>{item.userId}</td>
                      <td>{item.timeStamp}</td>
                      <td>{item.businessName}</td>
                      <td>{item.emailId}</td>
                      <td>{item.ip}</td>
                      <td>{item.os}</td>
                      <td>{item.browser}</td>
                      <td>{item.country}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9}>No data available</td>
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
      </DashboardLayout>
    );
};

export default LoginHostory;
