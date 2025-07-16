/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { endpoints } from "../../../services/apiEndpoints";
import styles from "../../../styles/common/List.module.css";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { transactionList } from "../../../forms/payout";
import usePost from "../../../hooks/usePost";
import { dateFormatter } from "../../../utils/dateFormatter";
import useFetch from "../../../hooks/useFetch";
import { GetUserRole, isMerchant } from "../../../services/cookieStore";
import { roundAmount } from "../../../utils/roundAmount";
import { errorMessage } from "../../../utils/messges";
import ViewPayoutModal from "./components/ViewModal";
import Filters from "../../../ui/Filter";
import { all } from "axios";
import Dropdown from "../../../ui/Dropdown";
import ExpandableFilterInput from "../../../ui/TextInput";
// const pagesize = 25;
const TransactionList = () => {
  const tableRef = useRef(null);

  // const [currentPage, setCurrentPage] = useState(0);
  //fetch merchant, acquirer, payment type, mop type and  curreny
  const { fetchData: getAllAcquirer, data: allAcquirer } = useFetch();
  const { fetchData: getAllMerchant, data: allMerchant } = useFetch();
  useEffect(() => {
    getAllMerchant(endpoints.user.userList);
    getAllAcquirer(endpoints.payin.acquirerList);
  }, []);
  //   range picker
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
  const [formData, setFormData] = useState(transactionList);
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "userId") {
      setFormData({ ...formData, ["userId"]: value });
      setCurrentPage(0);
    }
    setFormData({ ...formData, [name]: value });
  };

  // Pagination handlers
  const [currentPage, setCurrentPage] = useState(0);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);
  const handlePrev = () => {
    setCurrentPage((prev) => prev - 1);
    setFormData({ ...formData, ["start"]: currentPage - 1 });
  };
  const handleNext = () => {
    setCurrentPage((prev) => prev + 1);
    setFormData({ ...formData, ["start"]: currentPage + 1 });
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
  // API handlers
  const { postData, data, loading } = usePost(endpoints.payout.transactionList);
  const handleSubmit = async () => {
    formData.dateFrom = dateFormatter(range[0].startDate);
    formData.dateTo = dateFormatter(range[0].endDate);
    await postData(formData);
  };
  useEffect(() => {
    handleSubmit();
  }, [formData, range, currentPage]);
  // const handleSearch = async (e) => {
  //   const { name, value } = e.target;
  //   setFormData({ ...formData, [name]: value });
  //   await postData(formData);
  // };
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
    a.download = `payout_report_${dateFormatter(new Date())}.csv`;
    a.click();
    URL.revokeObjectURL(url); // Clean up
  };

  const [viewDetailModal, setViewDetailModal] = useState(false);
  const [currentValue, setCurrentValue] = useState(null);
  const handleViewDetail = (item) => {
    setViewDetailModal(true);
    setCurrentValue(item);
  };

  return (
    <DashboardLayout page="Payout Transaction" url="/dashboard/transaction">
      {viewDetailModal && (
        <ViewPayoutModal
          data={currentValue}
          onClose={() => setViewDetailModal(!viewDetailModal)}
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
            isMerchantDisabled={isMerchant()}
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
                { id: "PENDING", name: "PENDING" },
                { id: "SUCCESS", name: "SUCCESS" },
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
            data={[
              { id: "25", name: "25" },
              { id: "1000", name: "1000" },
              { id: "5000", name: "5000" },
              { id: "10000", name: "10000" },
              { id: "50000", name: "50000" },
              { id: "100000", name: "100000" },
            ]}
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

          {/* <div className="d-flex gap-3 mt-4 justify-content-end">
              <button
                className={classes.submit + " " + classes.active}
                type="submit"
              >
                Search
              </button>
            </div> */}
        </div>
      </div>

      <div className={styles.listing}>
        <div className={styles.table}>
          <button className={styles.download} onClick={handleDownloadReport}>
            <i className="bi bi-download"></i>Export
          </button>
          <div className={styles.tableContainer}>
            <div ref={tableRef}>
              <table className="table table-responsive-sm" id="settlementList">
                <thead>
                  <tr>
                    <th style={{ minWidth: 75, position: "sticky", left: 0, zIndex: 12 }}>View</th>
                    <th style={{ minWidth: 150, position: "sticky", left: 75, zIndex: 11 }}>Order Id</th>
                    <th>Transaction ID</th>
                    <th>Business Name</th>
                    {GetUserRole() === "ADMIN" && <th>Acquirer</th>}
                    <th>Payout Date</th>
                    <th>Amount</th>
                    <th>Net Amount</th>
                    <th>Merchant TDR</th>
                    <th>GST</th>
                    <th>Transaction Status</th>
                    <th>Transaction Type</th>
                    <th>UTR Receipt</th>
                    {GetUserRole() === "ADMIN" && (
                      <th>Transaction Recipt ID</th>
                    )}
                    <th>Payment Mode</th>

                    <th>Beneficiary Name</th>
                    <th>Account Number</th>
                    <th>IFSC Code</th>

                    {/* <th>Transaction Type</th> */}
                  </tr>
                </thead>
                <tbody>
                  {data && data?.data.content.length > 0 ? (
                    data.data.content.map((item, index) => (
                      <tr key={item.payoutTxnId}>
                        <td style={{ minWidth: 75, position: "sticky", left: 0, zIndex: 12}}>
                          <i
                            className="bi bi-eye-fill text-success"
                            onClick={() => handleViewDetail(item)}
                          ></i>
                        </td>
                        <td style={{ minWidth: 150, position: "sticky", left: 75, zIndex: 11 }}>{item.orderId}</td>
                        <td>{item.transactionId}</td>
                        <td>{item.businessName}</td>
                        {GetUserRole() === "ADMIN" && (
                          <td>{item.acquirer || "NA"}</td>
                        )}
                        <td>{item.dateOfIssue}</td>
                        <td>{roundAmount(item.transactionAmmount)}</td>
                        <td>{roundAmount(item.netAmount)}</td>
                        <td>{roundAmount(item.merchantTdr)}</td>
                        <td>{roundAmount(item.gst)}</td>
                        <td>
                          {item.transactionStatus}
                          
                        </td>
                        <td>{item.transactionType}</td>
                        <td>{item.bankUtr || "NA"}</td>
                        {GetUserRole() === "ADMIN" && (
                          <td>{item.transactionReceiptId}</td>
                        )}
                        <td>{item.transactionBankTransferMode}</td>

                        <td>{item.beneficiary.name}</td>
                        <td>{item.beneficiary.accountNo}</td>
                        <td>{item.beneficiary.ifscCode}</td>

                        {/* <td></td> */}
                      </tr>
                    ))
                  ) : loading ? (
                    <tr>
                      <td colSpan={16}>Please wait while we fetch the data</td>
                    </tr>
                  ) : (
                    <tr>
                      <td colSpan={16}>No data found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          {data && data.data.content.length > 0 && (
            <div className={styles.pagination}>
              <span className={styles.total}>
                Total Records: {data.data.totalElements}
              </span>
              <form
                onSubmit={handleGoToPage}
                className="d-flex gap-2 align-items-center"
              >
                <input
                  type="text"
                  name="goto"
                  id="goto"
                  style={{ width: 50, height: 16 }}
                />
                <button
                  type="submit"
                  className={styles.btn}
                  style={{ width: "200px" }}
                >
                  Go To Page
                </button>
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
                {parseInt(formData.start) + 1}/{data.data.totalPages || 0}
              </span>
              <button
                className={styles.btn}
                id={styles.next}
                onClick={handleNext}
                disabled={
                  (currentPage + 1) * formData.size >= data?.data.totalElements
                }
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

export default TransactionList;
