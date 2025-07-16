import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import styles from "../../styles/common/List.module.css";
import { endpoints } from "../../services/apiEndpoints";
import { useNavigate } from "react-router-dom";
import usePost from "../../hooks/usePost";
import { GetUserRole } from "../../services/cookieStore";
import { errorMessage } from "../../utils/messges";
const pagesize = 25;
const MerchantList = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [keyword, setKeyword] = useState("");
  const handleKeyword = (e) => setKeyword(e.target.value);
  const { loading, error, data, postData } = usePost(endpoints.user.userList);
  useEffect(() => {
    postData({ keyword: keyword, start: currentPage, size: pagesize });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, keyword]);

  const navigate = useNavigate();
  const handlePrev = () => {
    setCurrentPage((prev) => prev - 1);
  };
  const handleNext = () => {
    setCurrentPage((prev) => prev + 1);
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
    if (e.target.goto.value > data.data.totalPages) {
      errorMessage("Page number exceeds total pages");
      return;
    }
    setCurrentPage(parseInt(e.target.goto.value - 1));
  };

  return (
    <DashboardLayout page="Merchant List" url="/dashboard/merchant-list">
      <div className={styles.listing}>
        <div className={styles.filter}>
          <input
            type="search"
            placeholder="Search by merchant name"
            onChange={handleKeyword}
          />
        </div>
        <div className={styles.table} style={{ maxHeight: "60vh" }}>
          <table className="table table-responsive-sm">
            <thead>
              <tr>
                <th>APP ID</th>
                <th>Business Name</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Phone Number</th>
                <th style={{ minWidth: "100px" }}>Status</th>
                {GetUserRole() === "ADMIN" && (
                  <th style={{ minWidth: "80px" }}>Action</th>
                )}
              </tr>
            </thead>

            {data && (
              <tbody>
                {data && !loading && !error && data?.data.content.length > 0 ? (
                  data?.data.content.map((item) => (
                    <tr key={item.email}>
                      <td>{item.appId}</td>
                      <td>{item.businessName}</td>
                      <td>
                        {`${item.firstName || ""} ${
                          item.lastName || ""
                        }`.trim()}
                      </td>
                      <td>{item.email}</td>
                      <td>{item.phoneNumber}</td>
                      <td>{item.userAccountState}</td>
                      {GetUserRole() === "ADMIN" && (
                        <td>
                          <i
                            className="bi bi-pencil-square text-success"
                            onClick={() =>
                              navigate(`/update-merchant`, { state: item })
                            }
                          ></i>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={GetUserRole() === "ADMIN" ? 7 : 6}>
                      No Merchant available
                    </td>
                  </tr>
                )}
              </tbody>
            )}
            {loading && (
              <tbody>
                <tr>
                  <td
                    colSpan={GetUserRole() === "ADMIN" ? 7 : 6}
                    className="text-center"
                  >
                    Merchant List loading...
                  </td>
                </tr>
              </tbody>
            )}
            {error && (
              <tbody>
                <tr>
                  <td
                    colSpan={GetUserRole() === "ADMIN" ? 7 : 6}
                    className="text-center"
                  >
                    Error fetching Merchant List.
                  </td>
                </tr>
              </tbody>
            )}
          </table>
        </div>

        <div className={styles.pagination}>
          <span className={styles.total}>
            Total Records: {data?.data.totalElements}
          </span>
          <form
            onSubmit={handleGoToPage}
            className="d-flex gap-2 align-items-center"
          >
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
            {currentPage + 1}/{data?.data.totalPages || 0}
          </span>
          <button
            className={styles.btn}
            id={styles.next}
            onClick={handleNext}
            disabled={(currentPage + 1) * pagesize >= data?.data.totalElements}
          >
            Next
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MerchantList;
