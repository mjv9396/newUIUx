import { useEffect, useState } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import styles from "../../../styles/common/List.module.css";
import { endpoints } from "../../../services/apiEndpoints";
import Error from "../../errors/Error";
import Loading from "../../errors/Loading";
import usePost from "../../../hooks/usePost";
import { GetUserRole } from "../../../services/cookieStore";
import { errorMessage } from "../../../utils/messges";

const BeneficiaryList = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 25;

  // Use POST hook for pagination
  const { postData, data, error, loading } = usePost(
    GetUserRole() === "ADMIN"
      ? endpoints.payout.beneficiary
      : endpoints.payout.merchantBeneficiary
  );

  // Fetch data on component mount and when page changes
  useEffect(() => {
    const requestData = {
      start: currentPage.toString(),
      size: pageSize.toString(),
    };
    postData(requestData);
  }, [currentPage]);

  // Pagination handlers
  const handlePrev = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    setCurrentPage(currentPage + 1);
  };

  const handleGoToPage = (e) => {
    e.preventDefault();
    if (
      e.target.goto.value < 1 ||
      !e.target.goto.value ||
      isNaN(parseInt(e.target.goto.value))
    ) {
      errorMessage("Please enter a valid page number");
      return;
    }
    if (e.target.goto.value > data?.data?.totalPages) {
      errorMessage("Page number exceeds total pages");
      return;
    }
    setCurrentPage(parseInt(e.target.goto.value - 1));
  };
  if (error) return <Error error={error} />;
  if (loading) return <Loading loading="" />;

  return (
    <DashboardLayout page="Payout Beneficiary" url="/dashboard/beneficiary">
      <div style={{ overflow: "auto" }} className={styles.listing}>
        {/* <div className={styles.filter}>
          <input type="search" placeholder="Search by beneficiary name" />
        </div> */}
        <div style={{
          maxHeight: "65vh",
          position: "relative",
        }} className={styles.table}>
          <table style={{
          maxHeight: "75vh",
        }} className="table table-responsive-sm">
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
              {data?.data?.content?.length > 0 ? (
                data.data.content.map((item) => (
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

          {/* Pagination */}
          {data?.data?.content?.length > 0 && (
            <div style={{
              position: "fixed",
              zIndex: 10,
              bottom: '10vh',
              right: '5vh',
            }} className={styles.pagination}>
              <span className={styles.total}>
                Total Records: {data?.data?.totalElements}
              </span>
              <form onSubmit={handleGoToPage} className="d-flex gap-2">
                <div className="d-flex align-items-center justify-content-center gap-2">
                  <input
                    type="text"
                    name="goto"
                    id="goto"
                    style={{ width: 50, height: 16 }}
                  />
                  <button
                    type="submit"
                    className={styles.btn}
                    style={{ width: "120px" }}
                  >
                    Go To Page
                  </button>
                </div>
              </form>
              <button
                className={styles.btn}
                id={styles.prev}
                onClick={handlePrev}
                disabled={currentPage === 0}
              >
                Prev
              </button>
              <span>
                {currentPage + 1}/{data?.data?.totalPages || 1}
              </span>
              <button
                className={styles.btn}
                id={styles.next}
                onClick={handleNext}
                disabled={currentPage === data?.data?.totalPages - 1 || 0}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BeneficiaryList;
