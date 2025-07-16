/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import usePost from "../../hooks/usePost";
import { endpoints } from "../../services/apiEndpoints";
import { dateFormatter } from "../../utils/dateFormatter";
import DashboardLayout from "../../layouts/DashboardLayout";
import { transactionList } from "../../forms/payout";
import useFetch from "../../hooks/useFetch";
import styles from "../../styles/common/List.module.css";
import { DateRangePicker } from "react-date-range";
import { roundAmount } from "../../utils/roundAmount";

import { errorMessage, successMessage } from "../../utils/messges";
import Filters from "../../ui/Filter";
import { GetUserRole, isMerchant } from "../../services/cookieStore";
import Dropdown from "../../ui/Dropdown";
import ExpandableFilterInput from "../../ui/TextInput";

const PayoutTransaction = () => {
  const tableRef = useRef(null);
  const [successAction, setSuccessAction] = useState(false);
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
  }, [formData, range, currentPage, successAction]);

  const {
    postData: updateTransactionStatus,
    error: updateTransactionError,
    data: updateTransactionResponse,
  } = usePost(endpoints.payout.updateTransactionStatus);
  const handleTransactionStatus = async (e, orderId) => {
    await updateTransactionStatus({
      orderId: orderId,
      transactionStatus: e.target.value,
    });
  };
  useEffect(() => {
    if (updateTransactionResponse && !updateTransactionError) {
      setSuccessAction(!successAction);
      successMessage("Transaction status updated successfully");
    }
  }, [updateTransactionError, updateTransactionResponse]);
  if (allMerchant && allAcquirer) {
    return (
      <DashboardLayout
        page="Update Payout Transaction"
        url="/dashboard/update-transaction/payout"
      >
        <div className="d-flex flex-wrap gap-1 align-items-center mt-3 justify-content-end">
         
          <div className="d-flex flex-wrap gap-1 align-items-center mt-3 justify-content-end">
            
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
                      { id: "", name: "Select Status" },
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
                  { id: "", name: "Select Status" },
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

            {/* transaction type  */}
            <Dropdown
              data={[
                { id: "AUTHORISE", name: "AUTHORISE" },
                { id: "SALE", name: "SALE" },
                { id: "CAPTURE", name: "CAPTURE" },
                { id: "SETTLE", name: "SETTLE" },
                { id: "REFUND", name: "REFUND" },
              ]}
              placeholder="Select Transaction Type"
              selected={{
                id: formData.txnType,
                name: formData.txnType || "Select Transaction Type",
              }}
              handleChange={(e) => {
                setFormData({ ...formData, txnType: e });
                setCurrentPage(0);
              }}
              id="id"
              value="name"
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
              placeholder=" Number of Transaction"
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

          {/* <div className="d-flex gap-3 mt-4 justify-content-end">
          <button
            className={classes.submit + " " + classes.active}
            type="submit"
          >
            Search
          </button>
        </div> */}
        </div>

        <div className={styles.listing}>
          <div className={styles.table}>
            <div
              style={{ overflowX: "auto", maxHeight: "50vh" }}
              ref={tableRef}
            >
              <table className="table table-responsive-sm" id="settlementList">
                <thead>
                  <tr>
                    <th>Order Id</th>
                    <th>Transaction ID</th>
                    <th>Business Name</th>
                    <th>Acquirer</th>
                    <th>Payout Date</th>
                    <th>Payment Mode</th>
                    <th>Transaction Status</th>
                    <th>Transaction Type</th>
                    <th>Amount</th>
                    <th>UTR Receipt</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data && data?.data.content.length > 0 ? (
                    data.data.content.map((item) => (
                      <tr key={item.payoutTxnId}>
                        <td>{item.orderId}</td>
                        <td>{item.transactionId}</td>
                        <td>{item.businessName}</td>
                        <td>{item.acquirer || "NA"}</td>
                        <td>
                          <span>
                            <i class="bi bi-calendar3"></i>{" "}
                            {
                              new Date(item.dateOfIssue)
                                .toISOString()
                                .split("T")[0]
                            }<br/>
                            <i class="bi bi-clock"></i>{" "}
                            {new Date(item.dateOfIssue).toLocaleTimeString(
                              "en-US",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                                hour12: true,
                              }
                            )}
                          </span>
                        </td>
                        <td>{item.transactionBankTransferMode}</td>
                        <td>{item.transactionStatus}</td>
                        <td>{item.transactionType}</td>
                        <td>{roundAmount(item.transactionAmmount)}</td>
                        <td>{item.bankUtr || "NA"}</td>
                        <td>
                          <select
                            name="transactionStatus"
                            id="transactionStatus"
                            onChange={(e) =>
                              handleTransactionStatus(e, item.orderId)
                            }
                            defaultValue={item.txnStatus}
                          >
                            <option value="SENTTOBANK">SENDTOBANK</option>
                            <option value="FAILED">FAILED</option>
                            <option value="SUCCESS">SUCCESS</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  ) : loading ? (
                    <tr>
                      <td colSpan={11}>Please wait while we fetch the data</td>
                    </tr>
                  ) : (
                    <tr>
                      <td colSpan={11}>No data found</td>
                    </tr>
                  )}
                </tbody>
              </table>
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
                  {parseInt(formData.start) + 1}/{data.data.totalPages || 0}
                </span>
                <button
                  className={styles.btn}
                  id={styles.next}
                  onClick={handleNext}
                  disabled={
                    (currentPage + 1) * formData.size >=
                    data?.data.totalElements
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
  }
};

export default PayoutTransaction;
