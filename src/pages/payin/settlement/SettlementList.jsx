/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import styles from "../../../styles/common/List.module.css";
import { endpoints } from "../../../services/apiEndpoints";
import DashboardLayout from "../../../layouts/DashboardLayout";
import usePost from "../../../hooks/usePost";
import { dateFormatter } from "../../../utils/dateFormatter";
import { settlementReport } from "../../../forms/payin";
import { DateRangePicker } from "react-date-range";
import { GetUserRole } from "../../../services/cookieStore";
import useFetch from "../../../hooks/useFetch";
import { roundAmount } from "../../../utils/roundAmount";
import GenerateReport from "../generateReport/GenerateReport";
import { errorMessage } from "../../../utils/messges";
import { PageSizes } from "../../../utils/constants";
const SettlementList = () => {
  const tableRef = useRef(null);

  //fetch merchant, acquirer, payment type, mop type and  curreny
  const { fetchData: getAllAcquirer, data: allAcquirer } = useFetch();
  const { fetchData: getAllMerchant, data: allMerchant } = useFetch();
  const [currentPage, setCurrentPage] = useState(0);
  useEffect(() => {
    getAllAcquirer(endpoints.payin.acquirerList);
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
  const [formData, setFormData] = useState(settlementReport);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // API handlers
  const { postData, data, loading } = usePost(endpoints.payin.settlementReport);
  const handleSubmit = async () => {
    formData.dateFrom = dateFormatter(range[0].startDate);
    formData.dateTo = dateFormatter(range[0].endDate);
    await postData(formData);
  };
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

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
  useEffect(() => {
    handleSubmit();
  }, [range, formData, currentPage]);

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
    a.download = `settlement_report_${dateFormatter(new Date())}.csv`;
    a.click();
    URL.revokeObjectURL(url); // Clean up
  };
  const [viewExportModal, setViewExportModal] = useState(false);
  if (data) {
    return (
      <>
        {viewExportModal && (
          <GenerateReport
            url={endpoints.payin.generateSettlementReport}
            allMerchant={allMerchant}
            onClose={() => setViewExportModal(!viewExportModal)}
          />
        )}
        <DashboardLayout page="Settlement Report" url="/dashboard/settlement">
          <form onSubmit={handleSubmit}>
            <div className="d-flex flex-wrap gap-3 align-items-center mb-2 mt-3">
              {(GetUserRole() === "ADMIN" || GetUserRole() === "RESELLER") && (
                <div className={styles.input} style={{ minWidth: "12rem" }}>
                  <label htmlFor="userId">
                    Merchant <span className="required">*</span>
                  </label>
                  <select
                    name="userId"
                    id="userId"
                    defaultValue=""
                    onChange={handleChange}
                  >
                    <option value="" disabled>
                      --Select Merchant--
                    </option>
                    {allMerchant?.data.length > 0 ? (
                      allMerchant?.data.map((item) => (
                        <option key={item.userId} value={item.userId}>
                          {item.firstName} {item.lastName}
                        </option>
                      ))
                    ) : (
                      <option>No merchant added</option>
                    )}
                  </select>
                </div>
              )}
              {GetUserRole() === "ADMIN" && (
                <div className={styles.input} style={{ minWidth: "12rem" }}>
                  <label htmlFor="pgAcqCode">
                    Acquirer <span className="required">*</span>
                  </label>
                  <select
                    name="pgAcqCode"
                    id="pgAcqCode"
                    defaultValue=""
                    onChange={handleChange}
                  >
                    <option value="" disabled>
                      --Select Acquirer Code--
                    </option>
                    {allAcquirer?.data.length > 0 ? (
                      allAcquirer?.data.map((acquirer) => (
                        <option key={acquirer.acqCode} value={acquirer.acqCode}>
                          {acquirer.acqName} ({acquirer.acqCode})
                        </option>
                      ))
                    ) : (
                      <option>No acquirer added</option>
                    )}
                  </select>
                </div>
              )}
              <div className={styles.input} style={{ minWidth: "12rem" }}>
                <label htmlFor="txnStatus">
                  Status <span className="required">*</span>
                </label>
                <select
                  name="txnStatus"
                  id="txnStatus"
                  defaultValue={formData.txnStatus}
                  onChange={handleChange}
                >
                  <option value="">All</option>
                  <option value="UNSETTLE">UNSETTLE</option>
                  <option value="SETTLE">SETTLE</option>
                </select>
              </div>
              <div className={styles.input} style={{ minWidth: "12rem" }}>
                <label htmlFor="userId">
                  Enter Date Range <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="dateFrom"
                  readOnly
                  value={`${range[0].startDate.toLocaleDateString()} - ${range[0].endDate.toLocaleDateString()}`}
                  onClick={() => setShowPicker(!showPicker)}
                  style={{
                    cursor: "pointer",
                  }}
                />
                {showPicker && (
                  <div
                    style={{
                      position: "absolute",
                      zIndex: 1000,
                    }}
                  >
                    <DateRangePicker ranges={range} onChange={handleSelect} />
                  </div>
                )}
              </div>
              <div className={styles.input} style={{ minWidth: "12rem" }}>
                <label htmlFor="pagesize">Number of settlements</label>
                <select name="size" id="size" onChange={handleChange}>
                  {PageSizes.map((size) => (
                    <option key={size.id} value={size.id}>
                      {size.name}
                    </option>
                  ))}
                  <option value="100000">100000</option>
                </select>
              </div>
            </div>
          </form>

          <>
            {" "}
            <div className={styles.listing}>
              {loading && (
                <div className={styles.table}>
                  <p className="text-center mt-3">
                    Please wait while we fetching your data
                  </p>
                </div>
              )}
              {data && !loading && (
                <>
                  <span className="d-flex justify-content-between mt-3">
                    <button
                      className={styles.download}
                      onClick={handleDownloadReport}
                    >
                      Export To CSV
                    </button>
                    <button
                      className={styles.download}
                      onClick={() => setViewExportModal(true)}
                    >
                      Generate Report
                    </button>
                  </span>
                  <div className={styles.table}>
                    <div
                      style={{
                        overflow: "auto",
                        maxHeight: "70vh",
                      }}
                      ref={tableRef}
                    >
                      <table
                        className="table table-responsive-sm"
                        id="settlementList"
                      >
                        <thead>
                          <tr>
                            {GetUserRole() === "ADMIN" && <th>Acquirer</th>}
                            <th>Business Name</th>
                            <th>Settlement Id</th>
                            <th>Order Id</th>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Payment Type</th>
                            <th>MOP Type</th>
                            <th>Txn Id</th>
                            <th>Status</th>
                            <th>UTR</th>
                            <th>Card Number</th>
                            <th>VPA</th>
                            <th>Currency Code</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Merchant TDR</th>
                            <th>GST</th>
                            <th>Net Amount</th>
                            {GetUserRole() === "ADMIN" && (
                              <>
                                <th>Bank TDR</th>
                                <th>PG TDR</th>
                                <th>Vendor TDR</th>
                              </>
                            )}
                            <th>Rolling Reserve</th>
                            <th>Generated Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.data.content.length > 0 ? (
                            data.data.content.map((item) => (
                              <tr key={item.settlementId}>
                                {GetUserRole() === "ADMIN" && (
                                  <td>{item.pgAcqName || "NA"}</td>
                                )}
                                <td>{item.businessName}</td>
                                <td>{item.settlementId}</td>
                                <td>{item.orderId}</td>
                                <td>{item.createdDate}</td>
                                <td>{roundAmount(item.amount)}</td>
                                <td>{item.paymentTypeCode}</td>
                                <td>{item.mopTypeCode}</td>
                                <td>{item.txnId}</td>
                                <td>{item.txnStatus}</td>
                                <td>{item.utr || "NA"}</td>
                                <td>{item.cardNumber || "NA"}</td>
                                <td>{item.vpa || "NA"}</td>
                                <td>{item.currencyCode}</td>
                                <td>{item.custEmail}</td>
                                <td>{item.custPhone}</td>
                                <td>{item.merchnatTdr || 0.0}</td>
                                <td>{roundAmount(item.gst)}</td>
                                <td>{roundAmount(item.netAmount)}</td>
                                {GetUserRole() === "ADMIN" && (
                                  <>
                                    <td>{roundAmount(item.bankTdr)}</td>
                                    <td>{roundAmount(item.pgtdr)}</td>
                                    <td>{roundAmount(item.vendortdr)}</td>
                                  </>
                                )}

                                <td>{item.rollingResever || 0.0}</td>
                                <td>{item.createdDate}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="22">No data found</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

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
                </>
              )}
            </div>
          </>
        </DashboardLayout>
      </>
    );
  }
};

export default SettlementList;
