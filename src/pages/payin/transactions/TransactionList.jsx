/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { endpoints } from "../../../services/apiEndpoints";
import styles from "../../../styles/common/List.module.css";
import { serachPayoutTransaction } from "../../../forms/payout";
import usePost from "../../../hooks/usePost";
import { dateFormatter } from "../../../utils/dateFormatter";
import ViewModal from "./components/ViewModal";
import { GetUserRole } from "../../../services/cookieStore";
import useFetch from "../../../hooks/useFetch";
import GenerateReport from "../generateReport/GenerateReport";
import { errorMessage } from "../../../utils/messges";
import ExpandableFilterInput from "../../../ui/TextInput";
import Filters from "../../../ui/Filter";
import Dropdown from "../../../ui/Dropdown";
import { PageSizes } from "../../../utils/constants";

const PayinTransactionList = () => {
  const tableRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(0);

  //fetch merchant, acquirer, payment type, mop type and  curreny
  const { fetchData: getAllAcquirer, data: allAcquirer } = useFetch();

  const { fetchData: getAllMerchant, data: allMerchant } = useFetch();
  useEffect(() => {
    getAllMerchant(endpoints.user.userList);
    getAllAcquirer(endpoints.payin.acquirerList);
  }, []);
  const [range, setRange] = useState([
    {
      startDate: new Date(), // Yesterday
      endDate: new Date(), // Today
      key: "selection",
    },
  ]);

  // form handlers
  const [formData, setFormData] = useState(serachPayoutTransaction);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // API handlers
  const { postData, data, loading } = usePost(endpoints.payout.transaction);
  const handleSubmit = async () => {
    formData.dateFrom = dateFormatter(range[0].startDate);
    formData.dateTo = dateFormatter(range[0].endDate);
    await postData(formData);
  };

  const handleSearch = async (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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

  const [viewDetailModal, setViewDetailModal] = useState(false);
  const [currentValue, setCurrentValue] = useState(null);
  const handleViewDetail = (item) => {
    setViewDetailModal(true);
    setCurrentValue(item);
  };
  useEffect(() => {
    handleSubmit();
  }, [formData, range, currentPage]);
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
    a.download = `transaction_report_${dateFormatter(new Date())}.csv`;
    a.click();
    URL.revokeObjectURL(url); // Clean up
  };
  const [viewExportModal, setViewExportModal] = useState(false);

  return (
    <DashboardLayout page="Payin Transaction" url="/dashboard/transaction">
      {viewDetailModal && (
        <ViewModal
          data={currentValue}
          onClose={() => setViewDetailModal(!viewDetailModal)}
        />
      )}
      {viewExportModal && (
        <GenerateReport
          url={endpoints.payin.generateTransactionReport}
          allMerchant={allMerchant}
          onClose={() => setViewExportModal(!viewExportModal)}
        />
      )}
      <div className={styles.user}>
        <div className="d-flex flex-wrap gap-3 align-items-center justify-content-end mt-3">
          {/* for utr number  */}
          <ExpandableFilterInput
            label={"UTR"}
            name={"utrNumber"}
            onChange={handleChange}
            value={formData.utrNumber || ""}
          />

          {/* for order id  */}
          <ExpandableFilterInput
            label={"Order Id"}
            name={"orderId"}
            onChange={handleChange}
            value={formData.orderId || ""}
          />

          {/* for txn id  */}
          <ExpandableFilterInput
            label={"Txn Id"}
            name={"txnId"}
            onChange={handleChange}
            value={formData.txnId || ""}
          />

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
            isMerchantDisabled={false}
            merchantOptions={allMerchant?.data}
            setDateRange={setRange}
            isCurrencyDisabled
            selectedStatus={{
              id: formData.txnStatus,
              name:
                (
                  [
                    { id: "", name: "ALL" },
                    { id: "PENDING", name: "PENDING" },
                    { id: "REJECTED", name: "REJECTED" },
                    { id: "SUCCESS", name: "SUCCESS" },
                    { id: "FAILED", name: "FAILED" },
                  ].find((item) => item.id === formData.txnStatus) || {}
                ).name || "Select Status",
            }}
            handleStatusChange={(e) => {
              setFormData({ ...formData, txnStatus: e });
            }}
            isStatusDisabled={false}
            statusOptions={
              [
                { id: "", name: "ALL" },
                { id: "SUCCESS", name: "SUCCESS" },
                { id: "PENDING", name: "PENDING" },
                { id: "SENTTOBANK", name: "SENTTOBANK" },
                { id: "FAILED", name: "FAILED" },
              ] || []
            }
            isAcquirerDisabled={GetUserRole() !== "ADMIN"}
            selectedAcquirer={{
              id: formData.pgAcqCode,
              name:
                allAcquirer?.data?.find(
                  (item) => item.acqCode === formData.pgAcqCode
                )?.acqName ?? "Select Acquirer",
            }}
            handleAcquirerChange={(e) => {
              setFormData({ ...formData, pgAcqCode: e });
            }}
            acquirerOptions={allAcquirer?.data}
          />

          <Dropdown
            data={PageSizes}
            placeholder="Select Number of Transaction"
            selected={{
              id: formData.size,
              name: formData.size || "Select Number of Transaction",
            }}
            handleChange={(e) => {
              setFormData({ ...formData, size: e });
              setCurrentPage(0);
            }}
            id="id"
            value="name"
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
              <span className="d-flex justify-content-between">
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

              <div
                style={{ overflowX: "auto", maxHeight: "50vh" }}
                ref={tableRef}
              >
                <table
                  className="table table-responsive-sm"
                  id="settlementList"
                >
                  <thead>
                    <tr>
                      <th style={{ minWidth: 75 }}>View</th>
                      <th>Transaction ID</th>
                      <th>Order Id</th>
                      <th>Date</th>
                      <th>Business Name</th>
                      {GetUserRole() === "ADMIN" && <th>Acquirer</th>}
                      <th>Amount</th>
                      <th> Status</th>
                      <th>UTR</th>
                      <th>Customer Mail</th>
                      <th>Customer Phone</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data && data.data.content.length > 0 ? (
                      data.data.content.map((item) => (
                        <tr key={item.txnPayinId}>
                          <td>
                            <i
                              className="bi bi-eye-fill text-success"
                              onClick={() => handleViewDetail(item)}
                            ></i>
                          </td>
                          <td>{item.txnId}</td>
                          <td>{item.orderId}</td>
                          <td><span>
                            <i class="bi bi-calendar3"></i>{" "}
                            {
                              new Date(item.createdDate)
                                .toISOString()
                                .split("T")[0]
                            }<br/>
                            <i class="bi bi-clock"></i>{" "}
                            {new Date(item.createdDate).toLocaleTimeString(
                              "en-US",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                                hour12: true,
                              }
                            )}
                          </span></td>
                          <td>{item.businessName || "NA"}</td>
                          {GetUserRole() === "ADMIN" && (
                            <td>{item.pgAcqCode || "NA"}</td>
                          )}
                          <td>{item.amount || 0.0}</td>
                          <td>{item.txnStatus}</td>
                          <td>{item.utr || "-"}</td>
                          <td>{item.custEmail || "NA"}</td>
                          <td>{item.custPhone || "NA"}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={10}>No data available</td>
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
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PayinTransactionList;
