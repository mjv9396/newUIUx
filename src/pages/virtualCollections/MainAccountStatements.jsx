/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import styles from "../../styles/common/List.module.css";
import useFetch from "../../hooks/useFetch";
import { endpoints } from "../../services/apiEndpoints";
import { dateFormatter } from "../../utils/dateFormatter";
import { roundAmount } from "../../utils/roundAmount";
import { errorMessage } from "../../utils/messges";
import Filters from "../../ui/Filter";
import { isAdmin, isMerchant, GetUserId } from "../../services/cookieStore";

const MainAccountStatements = () => {
  const tableRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);

  // Date range state
  const [range, setRange] = useState([
    {
      startDate: new Date(new Date().setDate(new Date().getDate() - 7)), // 7 days ago
      endDate: new Date(), // Today
      key: "selection",
    },
  ]);

  // Form data for filters
  const [formData, setFormData] = useState({
    start: "0",
    size: "25",
    userId: "",
    dateFrom: dateFormatter(range[0].startDate),
    dateTo: dateFormatter(range[0].endDate),
  });

  // Fetch merchant list for admin
  const { fetchData: getAllMerchant, data: allMerchant } = useFetch();

  useEffect(() => {
    // Only fetch merchants if user is admin
    if (isAdmin()) {
      getAllMerchant(endpoints.user.userList);
    }
  }, []);

  // Fetch account statement data
  const { fetchData: getAccountStatement, data, error } = useFetch();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const requestData = {
        ...formData,
        start: currentPage.toString(),
        dateFrom: dateFormatter(range[0].startDate),
        dateTo: dateFormatter(range[0].endDate),
        userId: formData.userId, // Admin must select a merchant
      };

      await getAccountStatement(endpoints.payout.accountStatement, {
        method: "POST",
        body: JSON.stringify(requestData),
      });
    } catch (err) {
      console.error("Error fetching account statement:", err);
    } finally {
      setLoading(false);
    }
  };

  // Pagination handlers
  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (data && currentPage < data.data.totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleGoToPage = (e) => {
    e.preventDefault();
    const pageNumber = parseInt(e.target.goto.value);

    if (!pageNumber || pageNumber < 1 || isNaN(pageNumber)) {
      errorMessage("Please enter a valid page number");
      return;
    }

    if (data && pageNumber > data.data.totalPages) {
      errorMessage("Page number exceeds total pages");
      return;
    }

    setCurrentPage(pageNumber - 1);
  };

  // CSV Export handler
  const handleDownloadReport = async () => {
    const table = document.getElementById("mainAccountStatementList");
    let csvContent = "";

    // Loop through rows
    for (const row of table.rows) {
      const rowData = [];
      for (const cell of row.cells) {
        rowData.push(`"${cell.textContent}"`);
      }
      csvContent += rowData.join(",") + "\n";
    }

    // Create a Blob and download
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `main_account_statements_${dateFormatter(new Date())}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Update formData when currentPage changes
  useEffect(() => {
    setFormData((prev) => ({ ...prev, start: currentPage.toString() }));
  }, [currentPage]);

  // Fetch data when formData or range changes
  useEffect(() => {
    handleSubmit();
  }, [formData, range]);

  return (
    <DashboardLayout
      page="Main Account Statements"
      url="/dashboard/main-account-statements"
    >
      <div className="d-flex flex-wrap gap-3 align-items-center mt-3 justify-content-end">
        <Filters
          handleMerchantChange={(e) => {
            setFormData({ ...formData, userId: e });
            setCurrentPage(0);
          }}
          selectedMerchant={{
            id: formData.userId,
            name:
              (allMerchant?.data?.find(
                (item) => item.userId === formData.userId
              )?.firstName ?? "Select") +
              " " +
              (allMerchant?.data?.find(
                (item) => item.userId === formData.userId
              )?.lastName ?? "Merchant"),
          }}
          isMerchantDisabled={false} // Admin can always select merchants
          merchantOptions={allMerchant?.data}
          setDateRange={setRange}
          isCurrencyDisabled
        />
      </div>

      {!formData.userId && (
        <div className="alert alert-info mt-3" role="alert">
          <i className="bi bi-info-circle me-2"></i>
          Please select a merchant to view their account statements
        </div>
      )}

      {loading && (
        <div className={styles.table}>
          <p className="text-center">Please wait while we fetch your data</p>
        </div>
      )}

      {data && !loading && formData.userId && (
        <div className={styles.listing}>
          <div className={styles.table}>
            <button className={styles.download} onClick={handleDownloadReport}>
              Export To CSV
            </button>

            <div style={{ overflowX: "auto", maxHeight: "60vh" }}>
              <table
                className="table table-responsive-sm"
                id="mainAccountStatementList"
                ref={tableRef}
              >
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Business Name</th>
                    <th>Beneficiary ID</th>
                    <th>Remarks</th>
                    <th>Opening Balance</th>
                    <th>Credit Amount</th>
                    <th>Debit Amount</th>
                    <th>Closing Balance</th>
                    <th>Transaction Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data.data.content.length > 0 ? (
                    data.data.content.map((item, index) => (
                      <tr key={item.wasId || index}>
                        <td>{currentPage * data.data.size + index + 1}</td>
                        <td>{item.businessName || "N/A"}</td>
                        <td>{item.beneId || "N/A"}</td>
                        <td>{item.remarks || "N/A"}</td>
                        <td>{roundAmount(item.openingBalance) || 0.0}</td>
                        <td>{roundAmount(item.creditAmount) || 0.0}</td>
                        <td>{roundAmount(item.debitAmount) || 0.0}</td>
                        <td>{roundAmount(item.closingBalance) || 0.0}</td>
                        <td>{item.createdDate || "N/A"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9}>No data available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className={styles.pagination}>
            <span className={styles.total}>
              Total Records: {data.data.totalElements}
            </span>
            <form onSubmit={handleGoToPage} className="d-flex gap-2">
              <div className="d-flex align-items-center justify-content-center gap-2">
                <input
                  type="text"
                  name="goto"
                  id="goto"
                  style={{ width: 50, height: 16 }}
                />
                <button type="submit" className={styles.btn}>
                  Go
                </button>
              </div>
            </form>
            <div className="d-flex gap-2">
              <button
                className={styles.btn}
                onClick={handlePrevious}
                disabled={currentPage === 0}
              >
                Previous
              </button>
              <span className={styles.currentPage}>
                Page {currentPage + 1} of {data.data.totalPages}
              </span>
              <button
                className={styles.btn}
                onClick={handleNext}
                disabled={currentPage >= data.data.totalPages - 1}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className={styles.table}>
          <p className="text-center text-danger">
            Error loading data. Please try again.
          </p>
        </div>
      )}
    </DashboardLayout>
  );
};

export default MainAccountStatements;
