import { useEffect, useRef, useState, useCallback } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import styles from "../../styles/common/List.module.css";
import usePost from "../../hooks/usePost";
import useFetch from "../../hooks/useFetch";
import { endpoints } from "../../services/apiEndpoints";
import { dateFormatter } from "../../utils/dateFormatter";
import { roundAmount } from "../../utils/roundAmount";
import { errorMessage } from "../../utils/messges";
import Filters from "../../ui/Filter";
import Dropdown from "../../ui/Dropdown";
import ExpandableFilterInput from "../../ui/TextInput";
import { isAdmin, isMerchant, GetUserId } from "../../services/cookieStore";
import { PageSizes } from "../../utils/constants";

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
    dateFrom: dateFormatter(range[0].startDate),
    dateTo: dateFormatter(range[0].endDate),
    txnType: "",
    keyword: "",
    pgAcqCode: "",
    userId: "", // For admin to select merchant
    start: "0",
    size: "25",
  });

  // Fetch merchant list for admin
  const { fetchData: getAllMerchant, data: allMerchant } = useFetch();

  // Fetch acquirer list
  const { fetchData: getAllAcquirer, data: allAcquirer } = useFetch();

  // Main statement data fetching - using POST
  const {
    postData: fetchMainStatement,
    data: mainStatementData,
    error: mainStatementError,
    loading: mainStatementLoading,
  } = usePost(endpoints.payin.mainStatement);

  // Template data for table headers - empty data array
  const templateData = {
    data: {
      content: [], // Empty array for template
      totalElements: 0,
      totalPages: 1,
    },
  };

  useEffect(() => {
    // Fetch merchants if user is admin
    if (isAdmin()) {
      getAllMerchant(endpoints.user.userList);
    }

    // Fetch acquirer list
    getAllAcquirer(endpoints.payin.acquirerList);
  }, []);

  // Update formData when date range changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      dateFrom: dateFormatter(range[0].startDate),
      dateTo: dateFormatter(range[0].endDate),
    }));
  }, [range]);

  const handleSubmit = useCallback(async () => {
    setLoading(true);

    const requestData = {
      dateFrom: formData.dateFrom,
      dateTo: formData.dateTo,
      start: currentPage.toString(),
      size: formData.size,
      ...(formData.txnType && { txnType: formData.txnType }),
      ...(formData.keyword && { keyword: formData.keyword }),
      ...(formData.pgAcqCode && { pgAcqCode: formData.pgAcqCode }),
      ...(formData.userId && { userId: formData.userId }),
    };

    try {
      await fetchMainStatement(requestData);
    } catch (error) {
      errorMessage("Failed to fetch statement data");
    } finally {
      setLoading(false);
    }
  }, [formData, currentPage]);

  // Auto-call API when filters change
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSubmit();
    }, 300); // Debounce for 300ms

    return () => clearTimeout(timer);
  }, [handleSubmit]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setCurrentPage(0);
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentPage((prev) => prev - 1);
  }, []);

  const handleNext = useCallback(() => {
    setCurrentPage((prev) => prev + 1);
  }, []);

  const handleGoToPage = useCallback(
    (e) => {
      e.preventDefault();
      const pageValue = parseInt(e.target.goto.value);
      const totalPages =
        mainStatementData?.data?.totalPages ||
        templateData?.data?.totalPages ||
        1;

      if (e.target.goto.value < 1 || !e.target.goto.value || isNaN(pageValue)) {
        errorMessage("Please enter a valid page number");
        return;
      }
      if (pageValue > totalPages) {
        errorMessage("Page number exceeds total pages");
        return;
      }
      setCurrentPage(pageValue - 1);
      setFormData((prev) => ({ ...prev, start: (pageValue - 1).toString() }));
    },
    [mainStatementData, templateData]
  );

  const handleDownloadReport = useCallback(async () => {
    const table = document.getElementById("mainStatementList");
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
    a.download = `main_statement_report_${dateFormatter(new Date())}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  // Initial data load
  useEffect(() => {
    handleSubmit();
  }, []);

  const txnTypeOptions = [
    { id: "", name: "All Transaction Types" },
    { id: "C", name: "Credit (C)" },
    { id: "D", name: "Debit (D)" },
  ];

  return (
    <DashboardLayout
      page="Main Account Statements"
      url="/main-account-statements"
    >
      <div className={styles.dashboard}>
        {/* Filter Controls */}
        <div className={styles.user}>
          {/* All filters in one row */}
          <div
            className="d-flex flex-wrap gap-2 align-items-center justify-content-start"
            style={{ minHeight: "40px" }}
          >
            {/* Date Range and Merchant Filter */}
            <Filters
              handleMerchantChange={(userId) =>
                setFormData((prev) => ({ ...prev, userId }))
              }
              selectedMerchant={{
                id: formData.userId,
                name: formData.userId
                  ? (allMerchant?.data?.find(
                      (item) => item.userId === formData.userId
                    )?.firstName ?? "Selected") +
                    " " +
                    (allMerchant?.data?.find(
                      (item) => item.userId === formData.userId
                    )?.lastName ?? "Merchant")
                  : "All Merchants",
              }}
              isMerchantDisabled={isMerchant()}
              merchantOptions={allMerchant?.data || []}
              setDateRange={setRange}
              isCurrencyDisabled
            />

            {/* Transaction Type Filter */}
            <Dropdown
              data={txnTypeOptions}
              placeholder="Transaction Type"
              selected={{
                id: formData.txnType,
                name:
                  txnTypeOptions.find((opt) => opt.id === formData.txnType)
                    ?.name || "All Transaction Types",
              }}
              handleChange={(value) =>
                setFormData((prev) => ({ ...prev, txnType: value }))
              }
              id="id"
              value="name"
            />

            {/* Acquirer Filter */}
            <Dropdown
              data={[
                { acqCode: "", acqName: "All Acquirers" },
                ...(allAcquirer?.data || []),
              ]}
              placeholder="Acquirer"
              selected={{
                id: formData.pgAcqCode,
                name:
                  allAcquirer?.data?.find(
                    (acq) => acq.acqCode === formData.pgAcqCode
                  )?.acqName || "All Acquirers",
              }}
              handleChange={(value) =>
                setFormData((prev) => ({ ...prev, pgAcqCode: value }))
              }
              id="acqCode"
              value="acqName"
            />

            {/* Keyword filter */}
            <ExpandableFilterInput
              label={"Keyword"}
              name={"keyword"}
              onChange={handleChange}
              value={formData.keyword || ""}
              placeholder={"Search keyword"}
            />

            {/* Page Size Filter */}
            <Dropdown
              data={PageSizes}
              placeholder="Records per page"
              selected={{
                id: formData.size,
                name: formData.size || "25",
              }}
              handleChange={(value) =>
                setFormData((prev) => ({ ...prev, size: value }))
              }
              id="id"
              value="name"
            />

            {/* Loading indicator when API is being called */}
            {(loading || mainStatementLoading) && (
              <div className="d-flex align-items-center text-primary">
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                ></span>
                Loading...
              </div>
            )}
          </div>
        </div>

        {/* Main Statement Data Display */}
        <div className={styles.listing}>
          <div className={styles.table}>
            <div
              ref={tableRef}
              style={{ overflowX: "auto", flexGrow: 1, maxHeight: "65vh" }}
            >
              <button
                className={styles.download}
                onClick={handleDownloadReport}
                disabled={
                  loading ||
                  mainStatementError ||
                  !(mainStatementData?.data?.content?.length || 0)
                }
              >
                Export To CSV
              </button>
              <table
                id="mainStatementList"
                className="table table-responsive-sm"
              >
                <thead>
                  <tr>
                    <th style={{ minWidth: "120px" }}>Date</th>
                    <th style={{ minWidth: "150px" }}>Transaction ID</th>
                    <th style={{ minWidth: "100px" }}>UTR Number</th>
                    <th style={{ minWidth: "120px" }}>Amount</th>
                    <th style={{ minWidth: "80px" }}>TXN Type</th>
                    <th style={{ minWidth: "150px" }}>Description</th>
                    <th style={{ minWidth: "100px" }}>Acquirer</th>
                    <th style={{ minWidth: "120px" }}>Status</th>
                    <th style={{ minWidth: "150px" }}>Remitter Name</th>
                    <th style={{ minWidth: "150px" }}>Remitter Account</th>
                    <th style={{ minWidth: "150px" }}>Beneficiary Name</th>
                    <th style={{ minWidth: "150px" }}>Beneficiary Account</th>
                    <th style={{ minWidth: "100px" }}>Reference</th>
                    <th style={{ minWidth: "120px" }}>Balance</th>
                    <th style={{ minWidth: "80px" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading || mainStatementLoading ? (
                    <tr>
                      <td colSpan={15} className="text-start p-4">
                        <div className="d-flex align-items-center">
                          <div
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                          >
                            <span className="visually-hidden">Loading...</span>
                          </div>
                          Please wait while we fetch your statement data...
                        </div>
                      </td>
                    </tr>
                  ) : mainStatementError ? (
                    <tr>
                      <td colSpan={15} className="text-start p-4">
                        <div className="text-danger">
                          Error loading data:{" "}
                          {mainStatementError.message || "Something went wrong"}
                        </div>
                      </td>
                    </tr>
                  ) : mainStatementData?.data?.content &&
                    Array.isArray(mainStatementData.data.content) &&
                    mainStatementData.data.content.length > 0 ? (
                    mainStatementData.data.content.map((item, index) => (
                      <tr
                        style={{ verticalAlign: "middle" }}
                        key={item.id || index}
                      >
                        <td>
                          <span>
                            <i className="bi bi-calendar3"></i>{" "}
                            {new Date(item.transactionDate)
                              .toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              })
                              .replace(/\//g, "-")}
                            <br />
                            <i className="bi bi-clock"></i>{" "}
                            {new Date(item.transactionDate).toLocaleTimeString(
                              "en-IN",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                                hour12: true,
                              }
                            )}
                          </span>
                        </td>
                        <td>{item.transactionId || "-"}</td>
                        <td>{item.utrNumber || "-"}</td>
                        <td>{roundAmount(item.amount)}</td>
                        <td>
                          <span
                            className={`badge ${
                              item.txnType === "C" ? "bg-success" : "bg-danger"
                            }`}
                          >
                            {item.txnType === "C" ? "Credit" : "Debit"}
                          </span>
                        </td>
                        <td>{item.description || "-"}</td>
                        <td>{item.pgAcqCode || "-"}</td>
                        <td>
                          <span
                            className={`badge ${
                              item.status === "SUCCESS"
                                ? "bg-success"
                                : "bg-warning"
                            }`}
                          >
                            {item.status || "PENDING"}
                          </span>
                        </td>
                        <td>{item.remitterName || "-"}</td>
                        <td>{item.remitterAccount || "-"}</td>
                        <td>{item.beneficiaryName || "-"}</td>
                        <td>{item.beneficiaryAccount || "-"}</td>
                        <td>{item.reference || "-"}</td>
                        <td>{roundAmount(item.balance)}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() =>
                              console.log("View details for:", item)
                            }
                            style={{ fontSize: "0.8rem" }}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={15} className="text-center p-4">
                        <div>
                          <i
                            className="bi bi-inbox"
                            style={{ fontSize: "2rem", color: "#6c757d" }}
                          ></i>
                          <div className="mt-2 text-muted">
                            No statement data found
                          </div>
                          <small className="text-muted">
                            Try adjusting your filter criteria
                          </small>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {!loading &&
              !mainStatementError &&
              (mainStatementData?.data || templateData?.data) && (
                <div className={styles.pagination}>
                  <span className={styles.total}>
                    Total Records:{" "}
                    {mainStatementData?.data?.totalElements ||
                      templateData?.data?.totalElements ||
                      0}
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
                    {currentPage + 1}/
                    {mainStatementData?.data?.totalPages ||
                      templateData?.data?.totalPages ||
                      1}
                  </span>
                  <button
                    className={styles.btn}
                    id={styles.next}
                    onClick={handleNext}
                    disabled={
                      currentPage ===
                        (mainStatementData?.data?.totalPages ||
                          templateData?.data?.totalPages ||
                          1) -
                          1 ||
                      (mainStatementData?.data?.totalPages ||
                        templateData?.data?.totalPages ||
                        0) === 0
                    }
                  >
                    Next
                  </button>
                </div>
              )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MainAccountStatements;
