/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import useFetch from "../../hooks/useFetch";
import DashboardLayout from "../../layouts/DashboardLayout";
import styles from "../../styles/common/List.module.css";
import { endpoints } from "../../services/apiEndpoints";
import { serachPayoutTransaction } from "../../forms/payout";
import { DateRangePicker } from "react-date-range";
import { GetUserRole, isMerchant } from "../../services/cookieStore";
import { dateFormatter } from "../../utils/dateFormatter";
import usePost from "../../hooks/usePost";

import { errorMessage, successMessage } from "../../utils/messges";
import Filters from "../../ui/Filter";
import Dropdown from "../../ui/Dropdown";
import ExpandableFilterInput from "../../ui/TextInput";
import { PageSizes } from "../../utils/constants";
const PayinTransaction = () => {
  const tableRef = useRef(null);
  const [successAction, setSuccessAction] = useState(false);
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
  const [showPicker, setShowPicker] = useState(false);

  const handleSelect = (ranges) => {
    setRange([ranges.selection]);
    setShowPicker(false); // Hide picker after selecting dates
  };

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
  }, [formData, range, currentPage, successAction]);

  const {
    postData: updateTransactionStatus,
    error: updateTransactionError,
    data: updateTransactionResponse,
  } = usePost(endpoints.payin.updateTransactionStatus);
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

  return (
    <DashboardLayout
      page="Update Payin Transaction"
      url="/dashboard/update-transaction/payin"
    >
      
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
              ).name || "Status",
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
              )?.acqName ?? "Acquirer",
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
          placeholder="Transaction Type"
          selected={{
            id: formData.txnType,
            name: formData.txnType || "Transaction Type",
          }}
          handleChange={(e) => {
            setFormData({ ...formData, txnType: e });
            setCurrentPage(0);
          }}
          id="id"
          value="name"
        />

        <Dropdown
          data={PageSizes}
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
            <div
              style={{ overflowX: "auto", maxHeight: "50vh" }}
              ref={tableRef}
            >
              <table className="table table-responsive-sm" id="settlementList">
                <thead>
                  <tr>
                    <th>Order Id</th>
                    <th>Transaction ID</th>
                    <th>Date</th>
                    <th>Business Name</th>
                    <th>Acquirer</th>
                    <th>Amount</th>
                    <th> Status</th>
                    <th>UTR</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data && data.data.content.length > 0 ? (
                    data.data.content.map((item) => (
                      <tr key={item.txnPayinId}>
                        <td>{item.orderId}</td>
                        <td>{item.txnId}</td>
                        <td>{item.createdDate}</td>
                        <td>{item.businessName || "NA"}</td>
                        {GetUserRole() === "ADMIN" && (
                          <td>{item.pgAcqName || "NA"}</td>
                        )}
                        <td>{item.amount || 0.0}</td>
                        <td>{item.txnStatus}</td>
                        <td>{item.utr || "NA"}</td>
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

export default PayinTransaction;
