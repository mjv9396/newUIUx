import { useEffect, useState } from "react";
import styles from "../../../styles/common/List.module.css";
import { endpoints } from "../../../services/apiEndpoints";
import usePost from "../../../hooks/usePost";
import ResellerDetail from "./ResellerDetail";
const pagesize = 25;
const ResellerList = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [keyword, setKeyword] = useState("");
  const handleKeyword = (e) => setKeyword(e.target.value);
  const { data, postData } = usePost(endpoints.user.resellerlist);
  useEffect(() => {
    postData({ keyword: keyword, start: currentPage, size: pagesize });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, keyword]);
  const handlePrev = () => {
    setCurrentPage((prev) => prev - 1);
  };
  const handleNext = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const [viewModal, setViewModal] = useState(false);
  const [selectedReseller, setSelectedReseller] = useState(null);
  const handleViewModal = (item) => {
    setSelectedReseller(item);
    setViewModal(true);
  };
  return (
    <>
      {viewModal && (
        <ResellerDetail
          data={selectedReseller}
          onClose={() => setViewModal(false)}
        />
      )}
      <div className={styles.listing}>
        <div className={styles.filter}>
          <input
            type="search"
            placeholder="Search by reseller name"
            onChange={handleKeyword}
          />
        </div>
        <div className={styles.table}>
          <div style={{ overflowX: "auto" }}>
            <table className="table table-responsive-sm">
              <thead>
                <tr>
                  <th style={{ minWidth: 75 }}>View</th>
                  <th>APP ID</th>
                  <th>Business Name</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Phone Number</th>
                  <th style={{ minWidth: 100 }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {data?.data.content.length > 0 ? (
                  data?.data.content.map((item) => (
                    <tr key={item.email}>
                      <td>
                        <i
                          className="bi bi-eye-fill text-success"
                          onClick={() => handleViewModal(item)}
                        ></i>
                      </td>
                      <td>{item.appId}</td>
                      <td>{item.businessName}</td>
                      <td>{item.firstName}</td>
                      <td>{item.lastName}</td>
                      <td>{item.email}</td>
                      <td>{item.phoneNumber}</td>
                      <td>{item.userAccountState}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8}>No Reseller Found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className={styles.pagination}>
            <button
              className={styles.btn}
              id={styles.prev}
              onClick={handlePrev}
              disabled={currentPage === 0}
            >
              Prev
            </button>
            <span>
              Result
              {data?.data.totalElement === 0
                ? currentPage
                : currentPage * pagesize + 1}
              -
              {(currentPage + 1) * pagesize < data?.data.totalElements
                ? (currentPage + 1) * pagesize
                : data?.data.totalElements}
              of Total {data?.data.totalElements}
            </span>
            <button
              className={styles.btn}
              id={styles.next}
              onClick={handleNext}
              disabled={
                (currentPage + 1) * pagesize >= data?.data.totalElements
              }
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResellerList;
