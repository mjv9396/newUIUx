/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { GetUserRole, isMerchant } from "../../../services/cookieStore";
import styles from "../../../styles/common/List.module.css";
import { dispute } from "../../../forms/payin";
import useFetch from "../../../hooks/useFetch";
import { endpoints } from "../../../services/apiEndpoints";
import usePost from "../../../hooks/usePost";
import { dateFormatter } from "../../../utils/dateFormatter";
import { errorMessage } from "../../../utils/messges";
import Filters from "../../../ui/Filter";
import ExpandableFilterInput from "../../../ui/TextInput";

const Dispute = () => {
  const tableRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(0);

  //fetch merchant, acquirer, payment type, mop type and  curreny

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

  // form handlers
  const [formData, setFormData] = useState(dispute);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const { postData, data, loading } = usePost(endpoints.payin.chargeback);

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
    a.download = `dispute_report_${dateFormatter(new Date())}.csv`;
    a.click();
    URL.revokeObjectURL(url); // Clean up
  };
  useEffect(() => {
    handleSubmit();
  }, [formData, range, currentPage]);

  const handleChangeMerchant = (merchantId) => {
    setFormData({ ...formData, ["userId"]: merchantId });
  };

  return (
    <DashboardLayout page="Dispute" url="/dashboard/dispute">
      <div className="d-flex flex-wrap gap-3 align-items-center justify-content-end mt-3">
        

        <div className="right d-flex gap-3 align-items-center">
          {/* UTR filter */}
          <ExpandableFilterInput
            label={"UTR"}
            name={"utrNumber"}
            onChange={handleChange}
            value={formData.utrNumber || ""}
          />
          {/* Order Id filter */}
          <ExpandableFilterInput
            label={"Order Id"}
            name={"orderId"}
            onChange={handleChange}
            value={formData.orderId || ""}
          />
          {/* Txn Id filter */}
          <ExpandableFilterInput
            label={"Txn Id"}
            name={"txnId"}
            onChange={handleChange}
            value={formData.txnId || ""}
          />
          <Filters
            handleMerchantChange={handleChangeMerchant}
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
      </div>
      {loading && (
        <div className={styles.table}>
          <p className="text-center">Please wait while we fetching your data</p>
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
            </span>

            <div
              style={{ overflowX: "auto", maxHeight: "50vh" }}
              ref={tableRef}
            >
              <table className="table table-responsive-sm" id="settlementList">
                <thead>
                  <tr>
                    <th>Order Id</th>
                    <th>Transaction ID</th>
                    <th>Transaction Date</th>
                    <th>Business Name</th>
                    <th>Amount</th>
                    <th>Type</th>
                    <th>Open Date</th>
                    <th>Closed Date</th>
                    <th>Status</th>
                    <th>Remark</th>
                  </tr>
                </thead>
                <tbody>
                  {data && data.data.content.length > 0 ? (
                    data.data.content.map((item) => (
                      <tr key={item.chargeBackId}>
                        <td>{item.orderId}</td>
                        <td>{item.txnId}</td>
                        <td>{item.txnDate}</td>
                        <td>{item.businessName || "NA"}</td>
                        <td>{item.amount || 0.0}</td>
                        <td>{item.chargeBackType}</td>
                        <td>{item.chargeBackStartDate}</td>
                        <td>{item.chargeBackCloseDate || "NA"}</td>
                        <td>{item.chargeBackStatus || "NA"}</td>
                        <td>{item.remark || "NA"}</td>
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
    </DashboardLayout>
  );
};

export default Dispute;
