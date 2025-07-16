/* eslint-disable react-hooks/exhaustive-deps */
import DashboardLayout from "../../layouts/DashboardLayout";
import { GetUserRole, isMerchant } from "../../services/cookieStore";
import styles from "../../styles/common/List.module.css";
import useFetch from "../../hooks/useFetch";
import { useEffect, useRef, useState } from "react";
import { endpoints } from "../../services/apiEndpoints";
import usePost from "../../hooks/usePost";
import { remittanceReport } from "../../forms/payout";
import { dateFormatter } from "../../utils/dateFormatter";
import { DateRangePicker } from "react-date-range";
import { roundAmount } from "../../utils/roundAmount";
import { errorMessage } from "../../utils/messges";
import Filters from "../../ui/Filter";

const RemittanceReport = () => {
  const tableRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(0);
  //fetch merchant,

  const { fetchData: getAllMerchant, data: allMerchant } = useFetch();
  useEffect(() => {
    getAllMerchant(endpoints.user.userList);
  }, []);
  const [range, setRange] = useState([
    {
      startDate: new Date(), // Yesterday
      endDate: new Date(), // Today
      key: "selection",
    },
  ]);
  const [showPicker, setShowPicker] = useState(false);

  const handleSelect = (ranges) => {
    setRange([ranges.selection]);
    setShowPicker(false); // Hide picker after selecting dates
  };

  // form handlers
  const [formData, setFormData] = useState(remittanceReport);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // API handlers
  const { postData, data, loading } = usePost(
    endpoints.payout.remittanceReport
  );
  const handleSubmit = async () => {
    formData.dateFrom = dateFormatter(range[0].startDate);
    formData.dateTo = dateFormatter(range[0].endDate);
    await postData(formData);
  };

  const handlePrev = () => {
    setFormData({ ...formData, ["start"]: currentPage - 1 });
    setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    setFormData({ ...formData, ["start"]: currentPage + 1 });
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
    if (e.target.goto.value > data.data.totalPages) {
      errorMessage("Page number exceeds total pages");
      return;
    }
    setCurrentPage(parseInt(e.target.goto.value - 1));
    setFormData({ ...formData, ["start"]: e.target.goto.value - 1 });
  };

  const handleDownloadReport = async () => {
    const table = document.getElementById("settlementList");
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
    a.download = `remittance_report_${dateFormatter(new Date())}.csv`;
    a.click();
    URL.revokeObjectURL(url); // Clean up
  };

  useEffect(() => {
    handleSubmit();
  }, [formData, range]);
  return (
    <DashboardLayout
      page="Remittance Report"
      url="/dashboard/remittance-report"
    >
      <div className="d-flex flex-wrap gap-3 mt-3 justify-content-end">
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
                      )?.firstName ?? "All") +
                      " " +
                      (allMerchant?.data?.find(
                        (item) => item.userId === formData.userId
                      )?.lastName ?? "Merchant"),
                  }}
                  isMerchantDisabled={isMerchant()}
                  merchantOptions={allMerchant?.data}
                  setDateRange={setRange}
                  isCurrencyDisabled
                />
       
      </div>

      {loading && (
        <div className={styles.table}>
          <p className="text-center mt-3">
            Please wait while we fetching your data
          </p>
        </div>
      )}
      {data && !loading && (
        <div className={styles.listing}>
          <div className={styles.table}>
            <button className={styles.download} onClick={handleDownloadReport}>
              Export To CSV
            </button>
            <div style={{ overflow: "auto" }}>
              <div
                style={{ overflowX: "auto", maxHeight: "80vh" }}
                ref={tableRef}
              >
                <table
                  className="table table-responsive-sm"
                  id="settlementList"
                >
                  <thead>
                    <tr>
                      <th>Business Name</th>
                      <th>Created Date</th>
                      <th>Settlement Type</th>
                      <th>Settlement Date From</th>
                      <th>Settlement Date To</th>
                      <th>No. Of Txn</th>
                      <th>Previous Account Balance</th>
                      <th>Amount</th>
                      <th>Merchant TDR</th>
                      <th>GST</th>
                      <th>Payable Amount</th>
                      {GetUserRole() === "ADMIN" && (
                        <>
                          <th>Bank TDR</th>
                          <th>PG TDR</th>
                          <th>Vendor TDR</th>
                          <th>Rolling Reserve</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {data && data.data.content.length > 0 ? (
                      data.data.content.map((item) => (
                        <tr key={item.settlementDetailsId}>
                          <td>{item.businessName}</td>
                          <td>{dateFormatter(item.createdDate)}</td>
                          <td>{item.settlementType || "NA"}</td>
                          <td>
                            {item.dateTimeFrom ? item.dateTimeFrom : "NA"}
                          </td>
                          <td>{item.dateTimeTo ? item.dateTimeTo : "NA"}</td>
                          <td>{item.totalCount || 0.0}</td>
                          <td>
                            {item.previousAccountBalance
                              ? roundAmount(item.previousAccountBalance)
                              : 0.0}
                          </td>
                          <td>{roundAmount(item.amount)}</td>
                          <td>{roundAmount(item.merchantTdr) || 0.0}</td>
                          <td>{roundAmount(item.gst) || 0.0}</td>
                          <td>{roundAmount(item.netAmount) || "NA"}</td>
                          {GetUserRole() === "ADMIN" && (
                            <>
                              <td>
                                {item.bankTdr ? roundAmount(item.bankTdr) : 0.0}
                              </td>
                              <td>
                                {item.pgTdr ? roundAmount(item.pgTdr) : 0.0}
                              </td>
                              <td>
                                {item.vendorTdr
                                  ? roundAmount(item.vendorTdr)
                                  : 0.0}
                              </td>
                              <td>
                                {item.rollingResever
                                  ? roundAmount(item.rollingResever)
                                  : 0.0}
                              </td>
                            </>
                          )}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={GetUserRole() === "ADMIN" ? 15 : 11}>
                          No data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className={styles.pagination}>
              <span className={styles.total}>
                Total Records: {data.data.totalElements}
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
                {currentPage + 1}/{data.data.totalPages}
              </span>
              <button
                className={styles.btn}
                id={styles.next}
                onClick={handleNext}
                disabled={currentPage === data.data.totalPages - 1}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default RemittanceReport;
