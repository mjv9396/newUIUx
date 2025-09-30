/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import DashboardLayout from "../../layouts/DashboardLayout";
import styles from "../../styles/dashboard/Dashboard.module.css";
import PayinAnalytics from "./components/PayinAnalytics";
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
import DetailCard from "./components/DetailCard";
import VirtualAccountCard3D from "./components/VirtualAccountCard3D";
import DepositCard from "./components/DepositCard";
import WalletCard from "./components/WalletCard";
import SettlementCard from "./components/SettlementCard";
import debitcard from "../../assets/debit-card.png";
import deposit from "../../assets/deposit.png";
import passbook from "../../assets/passbook.png";
import Filters from "../../ui/Filter/index.jsx";

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 2,
  slidesToScroll: 1,
};
const Dashboard = () => {
  const navigate = useNavigate();

  // Navigation handlers for DetailCards
  const handlePayinNavigation = (status) => {
    navigate(`/payin/transactions?status=${status}`);
  };

  const handlePayoutNavigation = (status) => {
    navigate(`/payout/transactions?status=${status}`);
  };

  const handleDisputeNavigation = () => {
    navigate("/dispute");
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

  // Helper function to get the appropriate balance amount
  const getBalanceAmount = () => {
    if (totalBalanceLoading) return "0";
    if (totalBalanceError) return "0";

    if (isAdmin()) {
      if (merchantId) {
        // Merchant-specific balance for admin
        return parseFloat(totalBalanceData?.data) ?? 0;
      } else {
        // Total balance across all merchants for admin        
        return totalBalanceData?.data ?? 0;
      }
    } else {
      // User's own balance
      return totalBalanceData?.data?.accountBalance ?? 0;
    }
  };

  // Helper function to get the appropriate subtitle
  const getBalanceSubtitle = () => {
    if (totalBalanceLoading) return "Loading...";
    if (totalBalanceError) return "Error loading balance";
    return "Available Balance";
  };

  const handleSelect = (ranges) => {
    setRange([ranges.selection]);
    setShowPicker(false); // Hide picker after selecting dates
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
        <div className={styles.user}>
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
        <div className="row">
          <div className="col-md-6 col-sm-12 mb-3">
            {/* <div className={styles.card}> */}
            {/* <h6 className="mb-3">Virtual Accounts</h6> */}
            <div className="d-flex overflow-auto pb-2" style={{ gap: "0px" }}>
              {!virtualAccountData || virtualAccountData?.data?.length === 0 ? (
                <div
                  className={styles.noData}
                  style={{
                    width: "100%",
                    textAlign: "center",
                    padding: "40px 20px",
                  }}
                >
                  {virtualAccountDashboardLoading ? "Loading..." : null}
                  {isAdmin() && !virtualAccountDashboardLoading
                    ? "Select a merchant to view virtual accounts"
                    : "No virtual accounts found"}
                </div>
              ) : (
                virtualAccountData?.data.map((item, index) => (
                  <VirtualAccountCard3D
                    key={index}
                    title={item.businessName ?? item.firstName}
                    amt={item.balance}
                    accountNo={item.virtualAccount}
                    ifsc={item.ifscCode}
                    vpa={item.userVPA}
                  />
                ))
              )}
            </div>
            {/* </div> */}
          </div>
          <div className="col-md-6 col-sm-12 mb-3">
            <div className="d-flex gap-3 flex-md-row flex-column">
              <WalletCard
                img={wallet}
                title="Wallet Balance"
                subtitle={getBalanceSubtitle()}
                amount={getBalanceAmount()}
              />
              <WalletCard
                img={transactional}
                title="Virtual Collection"
                subtitle="Virtual Collection"
                amount={
                  isAdmin()
                    ? VirtualBalanceData?.data
                    : VirtualBalanceData?.data
                }
              />
              {/* <DepositCard img={debitcard} title="Credit Cards" /> */}
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 col-lg-12 col-xl-6">
            <div className={styles.card}>
              <h6>Payin Details</h6>
              <div className="row mt-4">
                <div className="col-md-6 col-sm-12 mb-3">
                  <DetailCard
                    title="Success Amount"
                    amount={payinData?.data?.totalSuccessAmount}
                    type="success"
                    // className="success"
                    img={success}
                    subtitle={`Txn Count : ${payinData?.data?.totalSuccess}`}
                    onClick={() => handlePayinNavigation("SUCCESS")}
                  />
                </div>
                <div className="col-md-6 col-sm-12 mb-3">
                  <DetailCard
                    title="Failed Amount"
                    amount={payinData?.data?.totalFailedAmount}
                    type="failed"
                    className="failed"
                    img={failed}
                    subtitle={`Txn Count : ${payinData?.data?.totalFailed}`}
                    onClick={() => handlePayinNavigation("FAILED")}
                  />
                </div>
                <div className="col-md-6 col-sm-12 mb-3">
                  <DetailCard
                    title="Pending Amount"
                    amount={payinData?.data?.totalPendingAmount}
                    type="pending"
                    className="pending"
                    img={pending}
                    subtitle={`Txn Count : ${payinData?.data?.totalPending}`}
                    onClick={() => handlePayinNavigation("PENDING")}
                  />
                </div>
                <div className="col-md-6 col-sm-12 mb-3">
                  <DetailCard
                    title="Total Dispute"
                    amount={chargebackData?.data.totalAmount}
                    type="info"
                    img={resolution}
                    subtitle={`Txn Count : ${chargebackData?.data?.count}`}
                    onClick={handleDisputeNavigation}
                  />
                </div>
              </div>
              <div className="row mb-1">
                <div className="col-md-12 col-sm-12 mb-3">
                  <SettlementCard
                    img={sponsor}
                    primaryTitle="Total Txn Amount"
                    primaryAmount={settlementData?.data.amountSettle}
                    secondaryTitle="Total Settled Amount"
                    secondaryAmount={settlementData?.data.netAmountSettle}
                    type="settled"
                  />
                </div>
                <div className="col-md-12 col-sm-12">
                  <SettlementCard
                    img={settlement}
                    primaryTitle="Total Txn Amount"
                    primaryAmount={settlementData?.data.amountUnsettle}
                    secondaryTitle="Upcoming Settle Amount"
                    secondaryAmount={settlementData?.data.netAmountUnsettle}
                    type="unsettled"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-12 col-xl-6 mt-xl-0 mt-2">
            <div className={styles.card}>
              <h6>Payout Details</h6>
              <div className="row mt-4">
                <div className="col-md-6 col-sm-12 mb-3">
                  <DetailCard
                    img={success}
                    amount={payoutData?.data?.totalSuccessAmount}
                    title="Success Debit Amount"
                    type="success"
                    subtitle={`Txn Count : ${payoutData?.data?.totalSuccess}`}
                    className="success"
                    onClick={() => handlePayoutNavigation("SUCCESS")}
                  />
                </div>
                <div className="col-md-6 col-sm-12 mb-3">
                  <DetailCard
                    img={failed}
                    amount={payoutData?.data?.totalFailedAmount}
                    title="Failed Debit Amount"
                    type="failed"
                    className="failed"
                    subtitle={`Txn Count : ${payoutData?.data?.totalFailed}`}
                    onClick={() => handlePayoutNavigation("FAILED")}
                  />
                </div>
                <div className="col-md-6 col-sm-12 mb-3">
                  <DetailCard
                    img={pending}
                    amount={payoutData?.data?.totalPendingAmount}
                    title="Pending Debit Amount"
                    type="pending"
                    className="pending"
                    subtitle={`Txn Count : ${payoutData?.data?.totalPending}`}
                    onClick={() => handlePayoutNavigation("PENDING")}
                  />
                </div>
                <div className="col-md-6 col-sm-12 mb-3">
                  <DetailCard
                    img={success}
                    amount={payoutData?.data?.totalCreditSuccessAmount}
                    title="Success Credited Amount"
                    type="success"
                    subtitle={`Txn Count : ${payoutData?.data?.totalCreditSuccess}`}
                    
                  />
                </div>
                <div className="col-md-6 col-sm-12 mb-3">
                  <DetailCard
                    img={failed}
                    amount={payoutData?.data?.totalCreditRejectAmount}
                    title="Rejected Credit Amount"
                    type="failed"
                    subtitle={`Txn Count : ${payoutData?.data?.totalCreditRejected}`}
                    
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <PayinAnalytics
              type="Count"
              value="totalCount"
              min={0}
              max={1000}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <PayinAnalytics
              type="Amount"
              value="totalAmount"
              min={500}
              max={2000000}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
