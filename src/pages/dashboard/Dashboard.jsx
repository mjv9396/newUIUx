/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import DashboardLayout from "../../layouts/DashboardLayout";
import styles from "../../styles/dashboard/ModernDashboard.module.css";
import PayinAnalytics from "./components/PayinAnalytics";
import PayinMultiAnalytics from "./components/PayinMultiAnalytics";
import { endpoints } from "../../services/apiEndpoints";
import { DateRangePicker } from "react-date-range";
import usePost from "../../hooks/usePost";
import { dateFormatter } from "../../utils/dateFormatter";
import {
  GetUserId,
  GetUserRole,
  isAdmin,
  isMerchant,
} from "../../services/cookieStore";
import { formatToINRCurrency } from "../../utils/formatToINRCurrency ";
import wallet from "../../assets/wallet.png";
import transactional from "../../assets/transactional.png";
import sponsor from "../../assets/sponsorship.png";
import settlement from "../../assets/settlement.png";
import resolution from "../../assets/resolution.png";
import pending from "../../assets/pending.png";
import failed from "../../assets/transaction-failed.png";
import success from "../../assets/transaction-success.png";
import Filters from "../../ui/Filter/index.jsx";

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 2,
  slidesToScroll: 1,
};
const Dashboard = () => {
  // Helper function to safely handle null/NaN values
  const safeNumber = (value, defaultValue = 0) => {
    if (value === null || value === undefined || isNaN(value)) {
      return defaultValue;
    }
    return Number(value) || defaultValue;
  };

  // Slider setting

  //fetch merchant, acquirer, payment type, mop type and  curreny
  const { fetchData: getAllMerchant, data: allMerchant } = useFetch();
  useEffect(() => {
    getAllMerchant(endpoints.user.userList);
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
  const [merchantId, setMerchantId] = useState("");

  const handleSelect = (ranges) => {
    setRange([ranges.selection]);
    setShowPicker(false); // Hide picker after selecting dates
  };

  // Helper function to get the appropriate balance amount
  const getBalanceAmount = () => {
    if (totalBalanceLoading) return 0;
    if (totalBalanceError) return 0;

    if (isAdmin()) {
      if (merchantId) {
        // Merchant-specific balance for admin
        return safeNumber(totalBalanceData?.data);
      } else {
        // Total balance across all merchants for admin
        return safeNumber(totalBalanceData?.data);
      }
    } else {
      // User's own balance
      return safeNumber(totalBalanceData?.data?.accountBalance);
    }
  };

  // Helper function to get the appropriate subtitle
  const getBalanceSubtitle = () => {
    if (totalBalanceLoading) return "Loading...";
    if (totalBalanceError) return "Error loading balance";
    return "Available Balance";
  };

  const {
    fetchData: getTotalBalance,
    data: totalBalanceData,
    loading: totalBalanceLoading,
    error: totalBalanceError,
  } = useFetch();
  useEffect(() => {
    if (GetUserRole() === "ADMIN") {
      if (merchantId) {
        // If admin has selected a merchant, get that merchant's balance
        console.log("Fetching merchant balance for userId:", merchantId);
        getTotalBalance(`${endpoints.user.balanceByUser}?userId=${merchantId}`);
      } else {
        // If no merchant selected, get total balance across all merchants
        console.log("Fetching total balance for admin");
        getTotalBalance(endpoints.user.totalBalance);
      }
    } else {
      // For non-admin users, get their own balance
      console.log("Fetching user balance");
      getTotalBalance(endpoints.user.balance);
    }
  }, [merchantId]); // Added merchantId dependency

  // Log the balance data when it changes
  useEffect(() => {
    console.log("Balance data updated:", totalBalanceData);
    if (totalBalanceError) {
      console.error("Balance fetch error:", totalBalanceError);
    }
  }, [totalBalanceData, totalBalanceError]);

  const { postData: getVirtualBalance, data: VirtualBalanceData } = usePost(
    endpoints.user.virtualBalance
  );
  useEffect(() => {
    // if(!merchantId && isAdmin()) return;
    getVirtualBalance({
      userId: isAdmin() ? merchantId : GetUserId(),
      dateFrom: dateFormatter(range[0].startDate),
      dateTo: dateFormatter(range[0].endDate),
    });
  }, [merchantId, range]);

  const {
    error: payinDashboardError,
    postData: getPayinDashboard,
    data: payinDashboardData,
  } = usePost(endpoints.payin.dashboard);
  const {
    error: payoutDashboardError,
    postData: getPayoutDashboard,
    data: payoutDashboardData,
  } = usePost(endpoints.payout.dashboard);
  const {
    error: settlementDashboardError,
    postData: getSettlementDashboard,
    data: settlementDashboardData,
  } = usePost(endpoints.payin.dashboardSettlement);

  const {
    error: chargeBackDashboardError,
    postData: getChargebackDashboard,
    data: chargeBackDashboardData,
  } = usePost(endpoints.payin.chargebackSummary);

  const {
    error: virtualAccountDashboardError,
    fetchData: getVirtualAccountDashboard,
    data: virtualAccountDashboardData,
    loading: virtualAccountDashboardLoading,
  } = useFetch();

  const getPayinDashboardData = async () => {
    await getPayinDashboard({
      startDate: dateFormatter(range[0].startDate),
      endDate: dateFormatter(range[0].endDate),
      userId: merchantId,
    });
    await getPayoutDashboard({
      dateFrom: dateFormatter(range[0].startDate),
      dateTo: dateFormatter(range[0].endDate),
      userId: merchantId,
    });
    await getSettlementDashboard({
      dateFrom: dateFormatter(range[0].startDate),
      dateTo: dateFormatter(range[0].endDate),
      userId: merchantId,
    });
    await getChargebackDashboard({
      dateFrom: dateFormatter(range[0].startDate),
      dateTo: dateFormatter(range[0].endDate),
      userId: merchantId,
    });
  };

  const getVirtualAccounts = async (url) => {
    if ((isAdmin() && merchantId) || !isAdmin()) {
      await getVirtualAccountDashboard(
        endpoints.payin.virtualAccountSummary +
          (isAdmin() ? merchantId : GetUserId())
      );
    }
  };

  const [payinData, setPayinData] = useState();
  const [payoutData, setPayoutData] = useState();
  const [settlementData, setSettlementData] = useState();
  const [chargebackData, setChargeBackData] = useState();
  const [virtualAccountData, setVirtualAccountData] = useState();
  useEffect(() => {
    getPayinDashboardData();
    getVirtualAccounts();
  }, [range, merchantId]);

  useEffect(() => {
    if (payinDashboardData && !payinDashboardError) {
      setPayinData(payinDashboardData);
    }
  }, [payinDashboardData, payinDashboardError]);

  useEffect(() => {
    if (settlementDashboardData && !settlementDashboardError) {
      setSettlementData(settlementDashboardData);
    }
  }, [settlementDashboardData, settlementDashboardError]);

  useEffect(() => {
    if (payoutDashboardData && !payoutDashboardError) {
      setPayoutData(payoutDashboardData);
    }
  }, [payoutDashboardData, payoutDashboardError]);
  useEffect(() => {
    if (chargeBackDashboardData && !chargeBackDashboardError) {
      setChargeBackData(chargeBackDashboardData);
    }
  }, [chargeBackDashboardData, chargeBackDashboardError]);
  useEffect(() => {
    if (virtualAccountDashboardData && !virtualAccountDashboardError) {
      setVirtualAccountData(virtualAccountDashboardData);
    }
  }, [virtualAccountDashboardData, virtualAccountDashboardError]);

  return (
    <DashboardLayout page="Dashboard" url="/dashboard">
      <div className={styles.dashboard}>
        {/* Dashboard Header */}
        <div className={styles.dashboardHeader}>
          <div className={styles.titleSection}>
            <div>
              <h1 className={styles.dashboardTitle}>MoneyPay Dashboard</h1>
              <p className={styles.dashboardSubtitle}>
                Your financial overview at a glance
              </p>
            </div>
          </div>
          <div className={styles.filtersSection}>
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
          </div>
        </div>

        <div className={styles.dashboardGrid}>
          {/* Balance Overview Section - Compact */}
          <div className={styles.balanceOverview}>
            <div className={styles.balanceCard}>
              <div className={styles.balanceCardIcon}>
                <img src={wallet} alt="Wallet Balance" />
              </div>
              <h3 className={styles.balanceCardTitle}>Wallet Balance</h3>
              <p className={styles.balanceCardSubtitle}>
                {getBalanceSubtitle()}
              </p>
              <h2 className={styles.balanceCardAmount}>
                {formatToINRCurrency(getBalanceAmount())}
              </h2>
            </div>

            {/* Virtual Accounts + Collection Combined Card */}
            <div className={styles.virtualCard}>
              <div className={styles.virtualCardHeader}>
                <h3 className={styles.virtualCardTitle}>
                  Virtual Accounts & Collections
                </h3>
                <h2 className={styles.virtualCollectionAmount}>
                  {formatToINRCurrency(
                    safeNumber(
                      isAdmin()
                        ? VirtualBalanceData?.data
                        : VirtualBalanceData?.data
                    )
                  )}
                </h2>
              </div>

              {!virtualAccountData || virtualAccountData?.data?.length === 0 ? (
                <div className={styles.noData}>
                  <div className={styles.noDataIcon}>💳</div>
                  {virtualAccountDashboardLoading ? (
                    <div className={styles.loading}>
                      <div className={styles.loadingSpinner}></div>
                      Loading accounts...
                    </div>
                  ) : isAdmin() && !virtualAccountDashboardLoading ? (
                    "Select a merchant to view accounts"
                  ) : (
                    "No virtual accounts found"
                  )}
                </div>
              ) : (
                <div className={styles.virtualAccountsList}>
                  {virtualAccountData?.data.map((item, index) => (
                    <div key={index} className={styles.virtualAccountItem}>
                      <div className={styles.virtualAccountItemHeader}>
                        <h4 className={styles.virtualAccountItemTitle}>
                          {item.acqCode}
                        </h4>
                        <span className={styles.virtualAccountItemBalance}>
                          {formatToINRCurrency(safeNumber(item.balance))}
                        </span>
                      </div>
                      <div className={styles.virtualAccountItemDetails}>
                        <div className={styles.virtualAccountItemDetail}>
                          <span
                            className={styles.virtualAccountItemDetailLabel}
                          >
                            Account
                          </span>
                          <span
                            className={styles.virtualAccountItemDetailValue}
                          >
                            {item.virtualAccount}
                          </span>
                        </div>
                        <div className={styles.virtualAccountItemDetail}>
                          <span
                            className={styles.virtualAccountItemDetailLabel}
                          >
                            IFSC
                          </span>
                          <span
                            className={styles.virtualAccountItemDetailValue}
                          >
                            {item.ifscCode}
                          </span>
                        </div>
                        {item.userVPA && (
                          <div className={styles.virtualAccountItemDetail}>
                            <span
                              className={styles.virtualAccountItemDetailLabel}
                            >
                              VPA
                            </span>
                            <span
                              className={styles.virtualAccountItemDetailValue}
                            >
                              {item.userVPA}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Transaction Overview Section - Revolutionary Different Designs */}
          <div className={styles.transactionOverview}>
            {/* Payin Card - Hexagonal Metrics Design */}
            <div className={styles.payinCard}>
              <div className={styles.payinHeader}>
                <div className={styles.payinIcon}>
                  <img src={sponsor} alt="Payin" />
                </div>
                <h3 className={styles.payinTitle}>Payin Transactions</h3>
              </div>
              <div className={styles.payinMetrics}>
                <div className={styles.payinMetric}>
                  <p className={styles.payinMetricLabel}>Success</p>
                  <h4 className={styles.payinMetricValue}>
                    {formatToINRCurrency(
                      safeNumber(payinData?.data?.totalSuccessAmount)
                    )}
                  </h4>
                  <p className={styles.payinMetricCount}>
                    {safeNumber(payinData?.data?.totalSuccess)} txns
                  </p>
                </div>
                <div className={styles.payinMetric}>
                  <p className={styles.payinMetricLabel}>Failed</p>
                  <h4 className={styles.payinMetricValue}>
                    {formatToINRCurrency(
                      safeNumber(payinData?.data?.totalFailedAmount)
                    )}
                  </h4>
                  <p className={styles.payinMetricCount}>
                    {safeNumber(payinData?.data?.totalFailed)} txns
                  </p>
                </div>
                <div className={styles.payinMetric}>
                  <p className={styles.payinMetricLabel}>Pending</p>
                  <h4 className={styles.payinMetricValue}>
                    {formatToINRCurrency(
                      safeNumber(payinData?.data?.totalPendingAmount)
                    )}
                  </h4>
                  <p className={styles.payinMetricCount}>
                    {safeNumber(payinData?.data?.totalPending)} txns
                  </p>
                </div>
                <div className={styles.payinMetric}>
                  <p className={styles.payinMetricLabel}>Disputes</p>
                  <h4 className={styles.payinMetricValue}>
                    {formatToINRCurrency(
                      safeNumber(chargebackData?.data?.totalAmount)
                    )}
                  </h4>
                  <p className={styles.payinMetricCount}>
                    {safeNumber(chargebackData?.data?.count)} disputes
                  </p>
                </div>
              </div>
            </div>

            {/* Payout Card - Circular Progress Design */}
            <div className={styles.payoutCard}>
              <div className={styles.payoutHeader}>
                <div className={styles.payoutIcon}>
                  <img src={settlement} alt="Payout" />
                </div>
                <h3 className={styles.payoutTitle}>Payout Transactions</h3>
              </div>
              <div className={styles.payoutMetrics}>
                <div className={styles.payoutMetric}>
                  <p className={styles.payoutMetricLabel}>Success Debit</p>
                  <h4 className={styles.payoutMetricValue}>
                    {formatToINRCurrency(
                      safeNumber(payoutData?.data?.totalSuccessAmount)
                    )}
                  </h4>
                  <p className={styles.payoutMetricCount}>
                    {safeNumber(payoutData?.data?.totalSuccess)} txns
                  </p>
                </div>
                <div className={styles.payoutMetric}>
                  <p className={styles.payoutMetricLabel}>Failed Debit</p>
                  <h4 className={styles.payoutMetricValue}>
                    {formatToINRCurrency(
                      safeNumber(payoutData?.data?.totalFailedAmount)
                    )}
                  </h4>
                  <p className={styles.payoutMetricCount}>
                    {safeNumber(payoutData?.data?.totalFailed)} txns
                  </p>
                </div>
                <div className={styles.payoutMetric}>
                  <p className={styles.payoutMetricLabel}>Pending Debit</p>
                  <h4 className={styles.payoutMetricValue}>
                    {formatToINRCurrency(
                      safeNumber(payoutData?.data?.totalPendingAmount)
                    )}
                  </h4>
                  <p className={styles.payoutMetricCount}>
                    {safeNumber(payoutData?.data?.totalPending)} txns
                  </p>
                </div>
                <div className={styles.payoutMetric}>
                  <p className={styles.payoutMetricLabel}>Success Credit</p>
                  <h4 className={styles.payoutMetricValue}>
                    {formatToINRCurrency(
                      safeNumber(payoutData?.data?.totalCreditSuccessAmount)
                    )}
                  </h4>
                  <p className={styles.payoutMetricCount}>
                    {safeNumber(payoutData?.data?.totalCreditSuccess)} txns
                  </p>
                </div>
                <div className={styles.payoutMetric}>
                  <p className={styles.payoutMetricLabel}>Rejected Credit</p>
                  <h4 className={styles.payoutMetricValue}>
                    {formatToINRCurrency(
                      safeNumber(payoutData?.data?.totalCreditRejectAmount)
                    )}
                  </h4>
                  <p className={styles.payoutMetricCount}>
                    {safeNumber(payoutData?.data?.totalCreditRejected)} txns
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Settlement Section */}
          <div className={styles.settlementSection}>
            <div className={styles.settledCard}>
              <div className={styles.settledHeader}>
                <div className={styles.settledIcon}></div>
                <h3 className={styles.settledTitle}>Settled Transactions</h3>
              </div>
              <div className={styles.settledMetrics}>
                <div className={styles.settledMetric}>
                  <p className={styles.settledMetricLabel}>
                    Total Transaction Amount
                  </p>
                  <p className={styles.settledMetricValue}>
                    {formatToINRCurrency(
                      safeNumber(settlementData?.data?.amountSettle)
                    )}
                  </p>
                </div>
                <div className={styles.settledMetric}>
                  <p className={styles.settledMetricLabel}>
                    Net Settled Amount
                  </p>
                  <p className={styles.settledMetricValue}>
                    {formatToINRCurrency(
                      safeNumber(settlementData?.data?.netAmountSettle)
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.unsettledCard}>
              <div className={styles.unsettledHeader}>
                <div className={styles.unsettledIcon}></div>
                <h3 className={styles.unsettledTitle}>Pending Settlement</h3>
              </div>
              <div className={styles.unsettledMetrics}>
                <div className={styles.unsettledMetric}>
                  <p className={styles.unsettledMetricLabel}>
                    Total Transaction Amount
                  </p>
                  <p className={styles.unsettledMetricValue}>
                    {formatToINRCurrency(
                      safeNumber(settlementData?.data?.amountUnsettle)
                    )}
                  </p>
                </div>
                <div className={styles.unsettledMetric}>
                  <p className={styles.unsettledMetricLabel}>
                    Upcoming Settlement
                  </p>
                  <p className={styles.unsettledMetricValue}>
                    {formatToINRCurrency(
                      safeNumber(settlementData?.data?.netAmountUnsettle)
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Analytics Section */}
          <div className={styles.analyticsSection}>
            <div className={styles.singleAnalyticsCard}>
              <PayinMultiAnalytics />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
