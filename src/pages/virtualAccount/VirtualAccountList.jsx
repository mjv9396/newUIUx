import DashboardLayout from "../../layouts/DashboardLayout";
import styles from "../../styles/dashboard/Dashboard.module.css";
import listStyles from "../../styles/common/List.module.css";
import { useEffect, useState } from "react";
import usePost from "../../hooks/usePost";
import useFetch from "../../hooks/useFetch";
import { endpoints } from "../../services/apiEndpoints";
import { DateRangePicker } from "react-date-range";
import { dateFormatter } from "../../utils/dateFormatter";
import {
  GetUserId,
  GetUserRole,
  isAdmin,
  isMerchant,
} from "../../services/cookieStore";
import Loading from "../errors/Loading";
import Error from "../errors/Error";
import { errorMessage } from "../../utils/messges";
import Filters from "../../ui/Filter";
import Dropdown from "../../ui/Dropdown";

const VirtualAccountList = () => {
  const [currentPage, setCurrentPage] = useState(0);

  // Fetch all merchants for dropdown
  const { fetchData: getAllMerchant, data: allMerchant } = useFetch();

  const [formData, setFormData] = useState({ start: "0", size: "25" });

  // Date range picker state
  const [range, setRange] = useState([
    {
      startDate: new Date(), // Today
      endDate: new Date(), // Today
      key: "selection",
    },
  ]);
  const [showPicker, setShowPicker] = useState(false);
  const [merchantId, setMerchantId] = useState("");
  const [selectedVirtualAccountId, setSelectedVirtualAccountId] = useState("");

  const handleSelect = (ranges) => {
    setRange([ranges.selection]);
    setShowPicker(false); // Hide picker after selecting dates
  };

  // Get virtual accounts for selected merchant
  const { fetchData: getVirtualAccounts, data: virtualAccountsData } =
    useFetch();

  // Collection by user (when only merchant selected or virtual account = "All")
  const {
    postData: getCollectionByUser,
    data: collectionByUserData,
    error: collectionByUserError,
    loading: collectionByUserLoading,
  } = usePost(endpoints.payin.collectionByUser);

  // Collection by virtual account (when specific virtual account selected)
  const {
    postData: getCollectionByAccount,
    data: collectionByAccountData,
    error: collectionByAccountError,
    loading: collectionByAccountLoading,
  } = usePost(endpoints.payin.collectionByVirtualAccount);

  // Determine which data and loading state to use
  const data = selectedVirtualAccountId
    ? collectionByAccountData
    : collectionByUserData;
  const loading = selectedVirtualAccountId
    ? collectionByAccountLoading
    : collectionByUserLoading;
  const error = selectedVirtualAccountId
    ? collectionByAccountError
    : collectionByUserError;

  // Fetch merchants on component mount
  useEffect(() => {
    getAllMerchant(endpoints.user.userList);
  }, []);

  // Fetch virtual accounts when merchant changes or on component mount
  useEffect(() => {
    if (merchantId || !isAdmin()) {
      fetchVirtualAccounts();
    }
  }, [merchantId]);

  // Fetch data when component mounts or filters change
  useEffect(() => {
    if ((isAdmin() && merchantId) || !isAdmin()) {
      fetchTransactionData();
    }
  }, [merchantId, selectedVirtualAccountId, range, currentPage]);

  const fetchVirtualAccounts = async () => {
    const userId = isAdmin() ? merchantId : GetUserId();
    if (userId) {
      await getVirtualAccounts(
        endpoints.payin.virtualAccountSummary +
          (isAdmin() ? merchantId : GetUserId())
      );
    }
  };

  const fetchTransactionData = async () => {
    const baseRequestData = {
      start: currentPage.toString(),
      size: "25",
      dateFrom: dateFormatter(range[0].startDate),
      dateTo: dateFormatter(range[0].endDate),
    };

    if (selectedVirtualAccountId) {
      // Call collection by virtual account API
      const requestData = {
        ...baseRequestData,
        virtualId: selectedVirtualAccountId,
      };
      await getCollectionByAccount(requestData);
    } else {
      // Call collection by user API
      const userId = isAdmin() ? merchantId : GetUserId();
      if (userId) {
        const requestData = {
          ...baseRequestData,
          userId: userId,
        };
        await getCollectionByUser(requestData);
      }
    }
  };

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
    if (e.target.goto.value > data.data.totalPages) {
      errorMessage("Page number exceeds total pages");
      return;
    }
    setCurrentPage(parseInt(e.target.goto.value - 1));
    setFormData({ ...formData, ["start"]: e.target.goto.value - 1 });
  };

  if (loading) return <Loading />;
  if (error) return <Error error={error} />;

  console.log(
    "🚀 ~ VirtualAccountList ~ virtualAccountsData?.data:",
    virtualAccountsData?.data
  );
  return (
    <DashboardLayout page="Virtual Collection Details" url="/virtual-accounts">
      <div className={styles.dashboard}>
        {/* Filter Controls using Dashboard styles */}

        <div style={{ alignItems: "center" }} className={styles.user}>
          <Filters
            handleMerchantChange={setMerchantId}
            selectedMerchant={{
              id: merchantId,
              name:
                (allMerchant?.data?.find((item) => item.userId === merchantId)
                  ?.firstName ?? "All") +
                " " +
                (allMerchant?.data?.find((item) => item.userId === merchantId)
                  ?.lastName ?? "Merchant"),
            }}
            isMerchantDisabled={isMerchant()}
            merchantOptions={allMerchant?.data}
            setDateRange={setRange}
            isCurrencyDisabled
          />

          <Dropdown
            data={
              virtualAccountsData?.data?.map((item) => ({
                id: item.userAccountId,
                name: item.virtualAccount,
              })) || [{ id: "", name: "Select Virtual Account" }]
            }
            selected={{
              id: selectedVirtualAccountId ?? "",
              name:
                virtualAccountsData?.data?.find(
                  (item) => item.userAccountId === selectedVirtualAccountId
                )?.virtualAccount || "Select Virtual Account",
            }}
            handleChange={(e) => {
              setSelectedVirtualAccountId(e);
              setCurrentPage(0); // Reset pagination when changing virtual account
            }}
            id="id"
            value="name"
          />
        </div>

        {/* Virtual Account Data Display */}
        {loading && (
          <div className={listStyles.table}>
            <p className="text-center mt-3">
              Please wait while we fetching your data
            </p>
          </div>
        )}

        {data && !loading && (
          <div className={listStyles.listing}>
            <div className={listStyles.table}>
              <div style={{ overflowX: "auto", maxHeight: "50vh" }}>
                <table className="table table-responsive-sm">
                  <thead>
                    <tr>
                      <th>TXN No.</th>
                      <th>Previous Amount</th>
                      <th>TXN Amount</th>
                      <th>Updated Amount</th>
                      <th>TXN Code</th>
                      <th>TXN DESC</th>
                      <th>Virtual Account</th>
                      <th>Virtual UPI</th>
                      <th>Corp Client Code</th>
                      <th>Corp Client Name</th>
                      <th>Value Date</th>
                      <th>DRCR</th>
                      <th>UTR No</th>
                      <th>Remitter Name</th>
                      <th>Remitter Account No</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data && data?.data?.content?.length > 0 ? (
                      data.data.content.map((item) => (
                        <tr key={item.utrNo}>
                          <td>{item.transactionno}</td>
                          <td>{item.previousBalance}</td>
                          <td>{item.txnAmount}</td>
                          <td>{item.updatedBalance}</td>
                          <td>{item.txnCode}</td>
                          <td>{item.txnDesc}</td>
                          <td>{item.virtualAcc}</td>
                          <td>{item.virtualUpi}</td>
                          <td>{item.corpClientCode}</td>
                          <td>{item.corpClientName}</td>
                          <td>{dateFormatter(item.valueDate)}</td>
                          <td>{item.drcr}</td>
                          <td>{item.utrNo}</td>
                          <td>{item.remitterName}</td>
                          <td>{item.remitterAccountNo}</td>
                          <td>{item.status}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={14}>No account data found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className={listStyles.pagination}>
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
                  disabled={currentPage === data?.data?.totalPages - 1 || 0}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {!data && !loading && (
          <div className={listStyles.table}>
            <div className="text-center p-4">
              <p>Please select a merchant to view transactions</p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default VirtualAccountList;
