import DashboardLayout from "../../layouts/DashboardLayout";
import styles from "../../styles/dashboard/Dashboard.module.css";
import listStyles from "../../styles/common/List.module.css";
import { useEffect, useRef, useState, useCallback } from "react";
import usePost from "../../hooks/usePost";
import useFetch from "../../hooks/useFetch";
import { endpoints } from "../../services/apiEndpoints";
import { dateFormatter } from "../../utils/dateFormatter";

import { GetUserId, isAdmin, isMerchant } from "../../services/cookieStore";
import { errorMessage, successMessage } from "../../utils/messges";
import Filters from "../../ui/Filter";
import Dropdown from "../../ui/Dropdown";
import ExpandableFilterInput from "../../ui/TextInput";
import { PageSizes } from "../../utils/constants";
import { roundAmount } from "../../utils/roundAmount";

const VirtualDispute = () => {
  const [currentPage, setCurrentPage] = useState(0);

  // Fetch all merchants for dropdown
  const { fetchData: getAllMerchant, data: allMerchant } = useFetch();

  const [formData, setFormData] = useState({
    start: "0",
    size: "25",
    utrNumber: "",
  });

  // Date range picker state
  const [range, setRange] = useState([
    {
      startDate: new Date(), // Today
      endDate: new Date(), // Today
      key: "selection",
    },
  ]);
  const [merchantId, setMerchantId] = useState("");

  // Handle text input changes for filters
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setCurrentPage(0); // Reset pagination when filter changes
  };

  // Dispute Search API - use the correct endpoint
  const {
    postData: getDisputeData,
    data: disputeData,
    error: disputeError,
    loading: disputeLoading,
  } = usePost(endpoints.payin.disputeSearch);

  // Use dispute data as main data source
  const data = disputeData;
  const loading = disputeLoading;
  const error = disputeError;

  // Fetch merchants on component mount
  useEffect(() => {
    getAllMerchant(endpoints.user.userList);
  }, []);

  const fetchDisputeData = useCallback(async () => {
    // Validate that we have proper date objects
    const startDate = range[0]?.startDate;
    const endDate = range[0]?.endDate;

    const requestData = {
      start: currentPage,
      size: parseInt(formData.size) || 25,
      userId: isAdmin() ? merchantId || "" : GetUserId(),
      utrNumber: formData.utrNumber || "",
      dateFrom: dateFormatter(startDate),
      dateTo: dateFormatter(endDate),
    };

    await getDisputeData(requestData);
  }, [currentPage, merchantId, formData.utrNumber, formData.size, range]);

  // Fetch data when component mounts or filters change
  useEffect(() => {
    fetchDisputeData();
  }, [fetchDisputeData]);

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
    if (e.target.goto.value > (data?.data?.totalPages || 1)) {
      errorMessage("Page number exceeds total pages");
      return;
    }
    setCurrentPage(parseInt(e.target.goto.value - 1));
    setFormData({ ...formData, ["start"]: e.target.goto.value - 1 });
  };

  const tableRef = useRef(null);

  const handleDownloadReport = async () => {
    const table = document.getElementById("disputeList");
    let csvContent = "";

    // Loop through rows
    for (const row of table.rows) {
      const rowData = [];
      for (const cell of row.cells) {
        rowData.push(`"${cell.textContent}"`); // Quote for safety
      }
      csvContent += rowData.join(",") + "\n";
    }

    // Create a Blob and download
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dispute_report_${dateFormatter(new Date())}.csv`;
    a.click();
    URL.revokeObjectURL(url); // Clean up
  };

  return (
    <DashboardLayout page="Dispute Management" url="/dispute">
      <div className={styles.dashboard}>
        {/* Filter Controls using Dashboard styles */}
        <div className={styles.user}>
          {/* Text filters for UTR Number */}
          <div
            className="d-flex flex-wrap gap-2 align-items-center justify-content-end"
            style={{ minHeight: "40px" }}
          >
            {/* UTR Number filter */}
            <ExpandableFilterInput
              label={"UTR Number"}
              name={"utrNumber"}
              onChange={handleChange}
              value={formData.utrNumber || ""}
            />
          </div>

          {/* Main filters row */}
          <div
            className="d-flex flex-wrap gap-2 align-items-center justify-content-between"
            style={{ minHeight: "40px" }}
          >
            <div className="d-flex flex-wrap gap-2 align-items-center flex-grow-1">
              <Filters
                handleMerchantChange={setMerchantId}
                selectedMerchant={{
                  id: merchantId,
                  name:
                    (allMerchant?.data?.find(
                      (item) => item.userId === merchantId
                    )?.firstName ?? "All") +
                    " " +
                    (allMerchant?.data?.find(
                      (item) => item.userId === merchantId
                    )?.lastName ?? "Merchant"),
                }}
                isMerchantDisabled={isMerchant()}
                merchantOptions={allMerchant?.data}
                setDateRange={setRange}
                isCurrencyDisabled
              />

              {/* Page Size Filter */}
              <Dropdown
                data={PageSizes}
                placeholder="Number of Records"
                selected={{
                  id: formData.size,
                  name: formData.size || "25",
                }}
                handleChange={(e) => {
                  setFormData({ ...formData, size: e });
                  setCurrentPage(0);
                }}
                id="id"
                value="name"
              />
            </div>
          </div>
        </div>

        {/* Dispute Data Display */}
        <div className={listStyles.listing}>
          <div className={listStyles.table}>
            <div
              ref={tableRef}
              style={{ overflowX: "auto", flexGrow: 1, maxHeight: "65vh" }}
            >
              <button
                className={listStyles.download}
                onClick={handleDownloadReport}
                disabled={loading || error || !data?.data?.content?.length}
              >
                Export To CSV
              </button>
              <table id="disputeList" className="table table-responsive-sm">
                <thead>
                  <tr>
                    <th style={{ minWidth: "80px", maxWidth: "100px" }}>
                      Dispute ID
                    </th>
                    <th style={{ minWidth: "160px", maxWidth: "200px" }}>
                      UTR Number
                    </th>
                    <th style={{ minWidth: "130px", maxWidth: "160px" }}>
                      Virtual Account
                    </th>
                    <th style={{ minWidth: "120px", maxWidth: "180px" }}>
                      Business Name
                    </th>
                    <th style={{ minWidth: "100px", maxWidth: "140px" }}>
                      User Name
                    </th>
                    <th style={{ minWidth: "120px", maxWidth: "160px" }}>
                      Previous Balance
                    </th>
                    <th style={{ minWidth: "120px", maxWidth: "150px" }}>
                      Transaction Amount
                    </th>
                    <th style={{ minWidth: "120px", maxWidth: "160px" }}>
                      Updated Balance
                    </th>
                    <th style={{ minWidth: "110px", maxWidth: "140px" }}>
                      Penalty Charge
                    </th>
                    <th style={{ minWidth: "110px", maxWidth: "140px" }}>
                      Dispute Amount
                    </th>
                    <th style={{ minWidth: "90px", maxWidth: "120px" }}>
                      Dispute Type
                    </th>
                    <th style={{ minWidth: "150px", maxWidth: "250px" }}>
                      Dispute Reason
                    </th>
                    <th style={{ minWidth: "80px", maxWidth: "100px" }}>
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={12} className="text-start p-4">
                        <div className="d-flex align-items-center">
                          <div
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                          >
                            <span className="visually-hidden">Loading...</span>
                          </div>
                          Please wait while we fetch dispute data...
                        </div>
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={12} className="text-start p-4">
                        <div className="text-danger">
                          Error loading data:{" "}
                          {error.message || "Something went wrong"}
                        </div>
                      </td>
                    </tr>
                  ) : data &&
                    data?.data?.content &&
                    Array.isArray(data.data.content) &&
                    data.data.content.length > 0 ? (
                    data.data.content.map((dispute) => (
                      <tr
                        style={{ verticalAlign: "middle" }}
                        key={dispute.disputeId}
                      >
                        <td>{dispute.disputeId}</td>
                        <td>{dispute.utrNo || "-"}</td>
                        <td>{dispute.virtualAccNo || "-"}</td>
                        <td>{dispute.userBusinessName || "-"}</td>
                        <td>{dispute.userName || "-"}</td>
                        <td>
                          ₹
                          {roundAmount(dispute.previousAccountBalance) ||
                            "0.00"}
                        </td>
                        <td>
                          ₹{roundAmount(dispute.transactionAmount) || "0.00"}
                        </td>
                        <td>
                          ₹
                          {roundAmount(dispute.updatedAccountBalance) || "0.00"}
                        </td>
                        <td>₹{roundAmount(dispute.penaltyCharge) || "0.00"}</td>
                        <td>₹{roundAmount(dispute.disputeAmount) || "0.00"}</td>
                        <td>
                          <span
                            className={`badge ${
                              dispute.disputeType === "REFUND"
                                ? "bg-primary"
                                : dispute.disputeType === "CYBER_COMPLAINT"
                                ? "bg-warning"
                                : dispute.disputeType === "LIEN"
                                ? "bg-danger"
                                : "bg-secondary"
                            }`}
                          >
                            {dispute.disputeType || "N/A"}
                          </span>
                        </td>
                        <td style={{ maxWidth: "200px" }}>
                          <div
                            className="text-truncate"
                            title={dispute.disputeReason}
                          >
                            {dispute.disputeReason || "-"}
                          </div>
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              dispute.disputeStatus === "OPEN"
                                ? "bg-warning"
                                : dispute.disputeStatus === "RESOLVED"
                                ? "bg-success"
                                : dispute.disputeStatus === "CLOSED"
                                ? "bg-danger"
                                : "bg-secondary"
                            }`}
                          >
                            {dispute.disputeStatus || "N/A"}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={12} className="text-start p-4">
                        No dispute data found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination - only show when we have data and not loading */}
            {!loading && !error && data?.data && (
              <div className={listStyles.pagination}>
                <span className={styles.total}>
                  Total Records: {data?.data?.totalElements || 0}
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
                      className={listStyles.btn}
                      style={{ width: "120px" }}
                    >
                      Go To Page
                    </button>
                  </div>
                </form>
                <button
                  className={listStyles.btn}
                  id={listStyles.prev}
                  onClick={handlePrev}
                  disabled={currentPage === 0}
                >
                  Prev
                </button>
                <span>
                  {currentPage + 1}/{data?.data?.totalPages || 1}
                </span>
                <button
                  className={listStyles.btn}
                  id={listStyles.next}
                  onClick={handleNext}
                  disabled={
                    currentPage === (data?.data?.totalPages || 1) - 1 ||
                    (data?.data?.totalPages || 0) === 0
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

export default VirtualDispute;
