import { useEffect } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import styles from "../../../styles/common/List.module.css";
import { endpoints } from "../../../services/apiEndpoints";
import Error from "../../errors/Error";
import Loading from "../../errors/Loading";
import useFetch from "../../../hooks/useFetch";
import { GetUserRole } from "../../../services/cookieStore";

const BeneficiaryList = () => {
  const { fetchData, data, error, loading } = useFetch();
  useEffect(() => {
    if (GetUserRole() === "ADMIN") fetchData(endpoints.payout.beneficiary);
    else if (GetUserRole() === "MERCHANT")
      fetchData(endpoints.payout.merchantBeneficiary);
  }, []);
  if (error) <Error error={error} />;
  if (loading) <Loading loading="" />;
  if (data)
    return (
      <DashboardLayout page="Payout Beneficiary" url="/dashboard/beneficiary">
        <div style={{overflow: "auto"}} className={styles.listing}>
          {/* <div className={styles.filter}>
            <input type="search" placeholder="Search by beneficiary name" />
          </div> */}
          <div  className={styles.table}>
            <table className="table table-responsive-sm">
              <thead>
                <tr>
                  <th>Beneficiary Name</th>
                  <th>Nick Name</th>
                  <th>Mobile</th>
                  <th>Email</th>
                  <th>Account Number</th>
                  <th>IFSC Code</th>
                  <th>Beneficiary Status</th>
                </tr>
              </thead>
              <tbody >
                {data.data.length > 0 ? (
                  data.data.map((item) => (
                    <tr key={item.beneficiaryId}>
                      <td>{item.name}</td>
                      <td>{item.nickname}</td>
                      <td>{item.mobile}</td>
                      <td>{item.email}</td>
                      <td>{item.accountNo}</td>
                      <td>{item.ifscCode}</td>
                      <td>{item.beneficiaryStatus}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7}>No data available</td>
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

export default BeneficiaryList;
