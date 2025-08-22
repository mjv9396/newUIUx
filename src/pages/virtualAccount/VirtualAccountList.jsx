import DashboardLayout from "../../layouts/DashboardLayout";
import styles from "../../styles/dashboard/Dashboard.module.css";
import listStyles from "../../styles/common/List.module.css";
import { useEffect, useRef, useState, useCallback } from "react";
import usePost from "../../hooks/usePost";
import useFetch from "../../hooks/useFetch";
import { endpoints } from "../../services/apiEndpoints";
import { dateFormatter } from "../../utils/dateFormatter";

import { GetUserId, isAdmin, isMerchant } from "../../services/cookieStore";
import { errorMessage } from "../../utils/messges";
import Filters from "../../ui/Filter";
import Dropdown from "../../ui/Dropdown";
import ExpandableFilterInput from "../../ui/TextInput";
import { PageSizes } from "../../utils/constants";
import { roundAmount } from "../../utils/roundAmount";

const VirtualAccountList = () => {
  const [currentPage, setCurrentPage] = useState(0);

  // Fetch all merchants for dropdown
  const { fetchData: getAllMerchant, data: allMerchant } = useFetch();

  const [formData, setFormData] = useState({
    start: "0",
    size: "25",
    utrNumber: "",
    keyword: "",
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
  const [selectedVirtualAccountId, setSelectedVirtualAccountId] = useState("");

  // Handle text input changes for filters
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setCurrentPage(0); // Reset pagination when filter changes
  };

  // Get virtual accounts for selected merchant
  const { fetchData: getVirtualAccounts, data: virtualAccountsData } =
    useFetch();

  // Collection API - single endpoint that handles both cases based on body
  const {
    postData: getCollectionData,
    data: collectionData,
    error: collectionError,
    loading: collectionLoading,
  } = usePost(endpoints.payin.collectionByVirtualAccount);

  // Use single data source
  const data = collectionData;
  const loading = collectionLoading;
  const error = collectionError;

  // Fetch merchants on component mount
  useEffect(() => {
    getAllMerchant(endpoints.user.userList);
  }, []);

  // Fetch virtual accounts when merchant changes or on component mount
  useEffect(() => {
    const fetchVirtualAccounts = async () => {
      const userId = isAdmin() ? merchantId : GetUserId();

      // Only fetch if we have a valid userId (merchant is selected)
      if (userId) {
        // Fetch virtual accounts for specific merchant using GET API
        await getVirtualAccounts(
          endpoints.payin.virtualAccountSummary + userId
        );
      }
      // Don't call API if no merchant is selected
    };

    // Only fetch virtual accounts when we have a merchant selected
    fetchVirtualAccounts();
  }, [merchantId]);

  const fetchTransactionData = useCallback(async () => {
    // Validate that we have proper date objects
    const startDate = range[0]?.startDate;
    const endDate = range[0]?.endDate;

    const baseRequestData = {
      start: currentPage.toString(),
      size: formData.size || "25",
      dateFrom: dateFormatter(startDate),
      dateTo: dateFormatter(endDate),
      virtualId: selectedVirtualAccountId || "", // Empty string for "All Virtual Accounts"
      userId: isAdmin() ? merchantId || "" : GetUserId(), // Empty string for "All Merchants" (admin only)
      utrNumber: formData.utrNumber || "",
      keyword: formData.keyword || "",
    };

    // Single API call - the backend determines behavior based on body content:
    // - If virtualId is provided: filters by specific virtual account (userId also sent)
    // - If virtualId is empty: shows data for the specified userId or all users if userId is empty
    await getCollectionData(baseRequestData);
  }, [
    currentPage,
    selectedVirtualAccountId,
    merchantId,
    formData.utrNumber,
    formData.keyword,
    formData.size,
    range,
    getCollectionData,
  ]);

  // Fetch data when component mounts or filters change
  useEffect(() => {
    // Only fetch if we have valid range data
    // if (!range || !range[0] || !range[0].startDate || !range[0].endDate) {
    //   return;
    // }

    // Always fetch data - for admin users, merchantId can be empty string to get all merchants
    fetchTransactionData();
  }, [
    currentPage,
    selectedVirtualAccountId,
    merchantId,
    formData.utrNumber,
    formData.keyword,
    formData.size,
    range,
  ]);

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
    const table = document.getElementById("virtualCollectionList");
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
    a.download = `virtual_collection_report_${dateFormatter(new Date())}.csv`;
    a.click();
    URL.revokeObjectURL(url); // Clean up
  };

  // Don't show loading/error at component level anymore
  // if (loading) return <Loading />;
  // if (error) return <Error error={error} />;

  return (
    <DashboardLayout page="Virtual Collection Details" url="/virtual-accounts">
      <div className={styles.dashboard}>
        {/* Filter Controls using Dashboard styles */}
        <div className={styles.user}>
          {/* Text filters for UTR Number and General Search */}
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

            {/* General search filter */}
            <ExpandableFilterInput
              label={"Search"}
              name={"keyword"}
              onChange={handleChange}
              value={formData.keyword || ""}
              placeholder={"Search for everything else"}
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

              {merchantId && <Dropdown
                data={[
                  { id: "", name: "All Virtual Accounts" },
                  ...(virtualAccountsData?.data?.map((item) => ({
                    id: item.virtualAccount,
                    name: item.virtualAccount,
                  })) || []),
                ]}
                selected={{
                  id: selectedVirtualAccountId ?? "",
                  name:
                    virtualAccountsData?.data?.find(
                      (item) => item.virtualAccount === selectedVirtualAccountId
                    )?.virtualAccount || "All Virtual Accounts",
                }}
                handleChange={(e) => {
                  setSelectedVirtualAccountId(e);
                  setCurrentPage(0); // Reset pagination when changing virtual account
                }}
                id="id"
                value="name"
              />}

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

        {/* Virtual Account Data Display */}
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
              <table
                id="virtualCollectionList"
                className="table table-responsive-sm"
              >
                <thead>
                  <tr>
                    <th style={{minWidth: "200px"}}>Virtual Account</th>
                    <th>Date</th>
                    <th>Previous Amount</th>
                    <th>TXN Amount</th>
                    <th>Updated Amount</th>
                    <th>TXN Code</th>
                    <th>TXN No.</th>
                    <th>UTR No</th>
                    <th>Remitter Name</th>
                    <th>Remitter Account No</th>
                    <th>TXN DESC</th>
                    <th>Virtual UPI</th>
                    <th>Corp Client Code</th>
                    <th>Corp Client Name</th>
                    <th>DRCR</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={16} className="text-start p-4">
                        <div className="d-flex align-items-center">
                          <div
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                          >
                            <span className="visually-hidden">Loading...</span>
                          </div>
                          Please wait while we fetch your data...
                        </div>
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={16} className="text-start p-4">
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
                    data.data.content.map((item) => (
                      <tr key={item.utrNo}>
                        <td>{item.virtualAcc}</td>
                        <td>
                          <span>
                            <i className="bi bi-calendar3"></i>{" "}
                            {
                              new Date(item.valueDate)
                                .toISOString()
                                .split("T")[0]
                            }
                            <br />
                            <i className="bi bi-clock"></i>{" "}
                            {new Date(item.valueDate).toLocaleTimeString(
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
                        <td>{roundAmount(item.previousBalance)}</td>
                        <td>{roundAmount(item.txnAmount)}</td>
                        <td>{roundAmount(item.updatedBalance)}</td>
                        <td>{item.txnCode}</td>
                        <td>{item.transactionno}</td>
                        <td>{item.utrNo}</td>
                        <td>{item.remitterName}</td>
                        <td>{item.remitterAccountNo}</td>
                        <td>{item.txnDesc}</td>
                        <td>{item.virtualUpi}</td>
                        <td>{item.corpClientCode}</td>
                        <td>{item.corpClientName}</td>
                        <td>{item.drcr}</td>
                        <td>{item.status}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={16} className="text-start p-4">
                        No account data found
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

export default VirtualAccountList;
