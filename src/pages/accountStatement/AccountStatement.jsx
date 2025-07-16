/* eslint-disable react-hooks/exhaustive-deps */
import DashboardLayout from "../../layouts/DashboardLayout";
import { isAdmin, isMerchant, isReseller } from "../../services/cookieStore";
import styles from "../../styles/common/List.module.css";
import useFetch from "../../hooks/useFetch";
import { useEffect, useRef, useState } from "react";
import { endpoints } from "../../services/apiEndpoints";
import usePost from "../../hooks/usePost";
import { ledgerStatement } from "../../forms/payout";
import { dateFormatter } from "../../utils/dateFormatter";
import { DateRangePicker } from "react-date-range";
import { roundAmount } from "../../utils/roundAmount";
import Marquee from "react-fast-marquee";
import { errorMessage } from "../../utils/messges";
import Filters from "../../ui/Filter";

const AccountStatement = () => {
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
  const [formData, setFormData] = useState(ledgerStatement);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // API handlers
  const { postData, data, loading } = usePost(
    endpoints.payout.accountStatement
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
    a.download = `ledger_report_${dateFormatter(new Date())}.csv`;
    a.click();
    URL.revokeObjectURL(url); // Clean up
  };

  useEffect(() => {
    handleSubmit();
  }, [formData, range]);
  return (
    <DashboardLayout
      page="Payout Ledger Report"
      url="/dashboard/account-statement"
    >
      <div className="d-flex flex-wrap gap-3 align-items-center mt-3 justify-content-end">
        <Marquee>
          <b className="text-danger">
            NOTE: Reversal Payout Failed Txn amount added in 11 pm every day to
            Merchant payout Wallet
          </b>
        </Marquee>
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
          <p className="text-center">Please wait while we fetching your data</p>
        </div>
      )}
      {data && !loading && (
        <div className={styles.listing}>
          <div className={styles.table}>
            <button className={styles.download} onClick={handleDownloadReport}>
              Export To CSV
            </button>
            <div style={{ overflowX: "auto", maxHeight: "60vh" }}>
              <table
                className="table table-responsive-sm"
                id="settlementList"
                ref={tableRef}
              >
                <thead>
                  <tr>
                    <th>Sno</th>
                    <th>Business Name</th>
                    <th>Beneficiary ID</th>
                    <th>Remarks</th>
                    <th>Opening Balance</th>
                    <th>Credit Amount</th>
                    <th>Debit Amount</th>
                    <th>Closing Balance</th>
                    <th>Added Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data && data.data.content.length > 0 ? (
                    data.data.content.map((item, index) => (
                      <tr key={item.wasId}>
                        <td>{currentPage * data.data.size + index + 1}</td>
                        <td>{item.businessName}</td>
                        <td>{item.beneId}</td>
                        <td>{item.remarks}</td>
                        <td>{roundAmount(item.openingBalance) || 0.0}</td>
                        <td>{roundAmount(item.creditAmount) || 0.0}</td>
                        <td>{roundAmount(item.debitAmount) || 0.0}</td>
                        <td>{roundAmount(item.closingBalance) || 0.0}</td>
                        <td>{item.createdDate || "NA"}</td>
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
      )}
    </DashboardLayout>
  );
};

export default AccountStatement;
