/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from "react";
import { endpoints } from "../../../services/apiEndpoints";
import styles from "../../../styles/common/List.module.css";
import Loading from "../../errors/Loading";
import Error from "../../errors/Error";
import useFetch from "../../../hooks/useFetch";
import usePost from "../../../hooks/usePost";
import { GetUserRole } from "../../../services/cookieStore";
import { dateFormatter } from "../../../utils/dateFormatter";
import { successMessage } from "../../../utils/messges";

const LoadMoneyList = () => {
  const tableRef = useRef(null);

  const {
    fetchData: getLoadMoneyList,
    data: loadMoneyList,
    error: loadMoneyListError,
    loading: loadMoneyListLoading,
  } = useFetch();
  useEffect(() => {
    getLoadMoneyList(endpoints.payout.loadMoneyList);
  }, []);

  // API handler
  const {
    postData: approveTransaction,
    data: approveTransactionData,
    error: approveTransactionError,
  } = usePost(endpoints.payout.approve);
  const {
    postData: rejectTransaction,
    data: rejectTransactionData,
    error: rejectTransactionError,
  } = usePost(endpoints.payout.reject);
  // Approving transaction
  const handleApprove = async (id) => {
    approveTransaction({ transactionId: id });
  };

  // disapproving transaction
  const handleReject = async (id) => {
    rejectTransaction({ transactionId: id });
  };

  useEffect(() => {
    if (approveTransactionData && !approveTransactionError) {
      successMessage("Approved  successfully");
      getLoadMoneyList(endpoints.payout.loadMoneyList);
    }
  }, [approveTransactionData, approveTransactionError]);
  useEffect(() => {
    if (rejectTransactionData && !rejectTransactionError) {
      successMessage("Reject  successfully");
      getLoadMoneyList(endpoints.payout.loadMoneyList);
    }
  }, [rejectTransactionData, rejectTransactionError]);

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
    a.download = `loadmoney_report_${dateFormatter(new Date())}.csv`;
    a.click();
    URL.revokeObjectURL(url); // Clean up
  };

  if (loadMoneyListLoading)
    return <Loading loading="Load money list loading" />;
  if (loadMoneyListError) return <Error error={loadMoneyListError} />;
  if (loadMoneyList) {
    return (
      <>
        <div className={styles.listing}>
          {/* <div className={styles.filter}>
            <input type="search" placeholder="Search by UTR Id" />
          </div> */}
          <div className={styles.table}>
            <button className={styles.download} onClick={handleDownloadReport}>
              Export To CSV
            </button>
            <table
              className="table table-responsive-sm"
              id="settlementList"
              ref={tableRef}
            >
              <thead>
                <tr>
                  <th>Business Name</th>
                  <th>Issue Date</th>
                  <th>Transaction Status</th>
                  <th>Transaction Type</th>
                  <th>Previous Amount</th>
                  <th>Amount</th>
                  <th>Updated Amount</th>
                  <th>Remark</th>
                  <th>UTR Receipt</th>
                  {GetUserRole() === "ADMIN" && <th>Action</th>}
                </tr>
              </thead>
              <tbody>
                {loadMoneyList.data.length > 0 ? (
                  loadMoneyList.data.map((item) => (
                    <tr key={item.payoutTxnId}>
                      <td>{item.user.businessName}</td>
                      <td>{item.dateOfIssue}</td>
                      <td>{item.transactionStatus}</td>
                      <td>{item.transactionType}</td>
                      <td>{item.previousAmount}</td>
                      <td>{item.transactionAmmount}</td>
                      <td>{item.updatedAmount}</td>
                      <td>{item.remark}</td>
                      <td>{item.transactionReceiptId}</td>
                      {GetUserRole() === "ADMIN" && (
                        <td>
                          <button
                            className="btn btn-success btn-sm mx-1"
                            onClick={() => handleApprove(item.payoutTxnId)}
                            disabled={
                              item.transactionStatus === "SUCCESS" ||
                              item.transactionStatus === "REJECTED"
                            }
                          >
                            Approve
                          </button>
                          <button
                            className="btn btn-danger btn-sm mx-1"
                            onClick={() => handleReject(item.payoutTxnId)}
                            disabled={
                              item.transactionStatus === "SUCCESS" ||
                              item.transactionStatus === "REJECTED"
                            }
                          >
                            Reject
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9}>No Data Available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  }
};

export default LoadMoneyList;
