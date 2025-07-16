/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
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
import sponsor from "../../assets/sponsorship.png";
import settlement from "../../assets/settlement.png";
import resolution from "../../assets/resolution.png";
import pending from "../../assets/pending.png";
import failed from "../../assets/transaction-failed.png";
import success from "../../assets/transaction-success.png";
import DetailCard from "./components/DetailCard";
import VirtualAccountCard from "./components/VirtualAccountCard";
import DepositCard from "./components/DepositCard";
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
  const { fetchData: getTotalBalance, data: totalBalanceData } = useFetch();
  useEffect(() => {
    if (GetUserRole() === "ADMIN") getTotalBalance(endpoints.user.totalBalance);
    else {
      getTotalBalance(endpoints.user.balance);
    }
  }, []);

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
        {/*  */}
        <div className="row">
          <div className="col-12 mb-4">
            <div className={styles.card}>
              <h6>Payin Details</h6>
              <div className="row mt-4">
                <div className="col-md-3 col-sm-6 col-xs-12 mb-3">
                  <DetailCard
                    name="Success Amount"
                    amt={payinData?.data?.totalSuccessAmount}
                    type="payin"
                    className="success"
                    img={success}
                    count={payinData?.data?.totalSuccess}
                  />
                </div>
                <div className="col-md-3 col-sm-6 col-xs-12 mb-3">
                  <DetailCard
                    name="Failed Amount"
                    amt={payinData?.data?.totalFailedAmount}
                    type="payin"
                    className="failed"
                    img={failed}
                    count={payinData?.data?.totalFailed}
                  />
                </div>
                <div className="col-md-3 col-sm-6 col-xs-12 mb-3">
                  <DetailCard
                    name="Pending Amount"
                    amt={payinData?.data?.totalPendingAmount}
                    type="payin"
                    className="pending"
                    img={pending}
                    count={payinData?.data?.totalPending}
                  />
                </div>
                <div className="col-md-3 col-sm-6 col-xs-12 mb-3">
                  <DetailCard
                    name="Total Dispute"
                    amt={chargebackData?.data.totalAmount}
                    type="dispute"
                    img={resolution}
                    count={chargebackData?.data?.count}
                  />
                </div>
              </div>
              <div className="row mb-1">
                <div className="col-md-6 col-sm-12 mb-3">
                  <div className={styles.subcard + " " + styles.settle}>
                    <div className="flex flex-column">
                      <span>Total Txn Amount</span>
                      <h6>
                        {formatToINRCurrency(settlementData?.data.amountSettle)}
                      </h6>
                    </div>
                    <div className="flex flex-column">
                      <span>Total Settled Amount</span>
                      <h6>
                        {formatToINRCurrency(
                          settlementData?.data.netAmountSettle
                        )}
                      </h6>
                    </div>
                    <img src={sponsor} alt="" />
                  </div>
                </div>
                <div className="col-md-6 col-sm-12 mb-3">
                  <div className={styles.subcard + " " + styles.unsettle}>
                    <span className="d-flex flex-column">
                      <span>Total Txn Amount</span>
                      <h6>
                        {formatToINRCurrency(
                          settlementData?.data.amountUnsettle
                        )}
                      </h6>
                    </span>
                    <span className="d-flex flex-column">
                      <span>Upcomming Settle Amount</span>
                      <h6>
                        {formatToINRCurrency(
                          settlementData?.data.netAmountUnsettle
                        )}
                      </h6>
                    </span>
                    <img src={settlement} alt="" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 mb-4">
            <div className={styles.card}>
              <h6>Payout Details</h6>
              <div className="row mt-3">
                <div className="col-md-4 col-sm-6 col-xs-12 mb-3">
                  <DetailCard
                    amt={
                      isAdmin()
                        ? totalBalanceData?.data
                        : totalBalanceData?.data?.accountBalance
                    }
                    count="Wallet Balance"
                    type="wallet"
                    img={wallet}
                  />
                </div>
                <div className="col-md-4 col-sm-6 col-xs-12 mb-3">
                  <DetailCard
                    img={success}
                    amt={payoutData?.data?.totalSuccessAmount}
                    name="Success Debit Amount"
                    type="wallet"
                    count={payoutData?.data?.totalSuccess}
                    className="success"
                  />
                </div>
                <div className="col-md-4 col-sm-6 col-xs-12 mb-3">
                  <DetailCard
                    img={failed}
                    amt={payoutData?.data?.totalFailedAmount}
                    name="Failed Debit Amount"
                    type="wallet"
                    className="failed"
                    count={payoutData?.data?.totalFailed}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-4 col-sm-6 col-xs-12 mb-3">
                  <DetailCard
                    img={pending}
                    amt={payoutData?.data?.totalPendingAmount}
                    name="Pending Debit Amount"
                    type="payout"
                    className="pending"
                    count={payoutData?.data?.totalPending}
                  />
                </div>
                <div className="col-md-4 col-sm-6 col-xs-12 mb-3">
                  <DetailCard
                    img={success}
                    amt={payoutData?.data?.totalCreditSuccessAmount}
                    name="Success Credited Amount"
                    type="credited"
                    count={payoutData?.data?.totalCreditSuccess}
                  />
                </div>
                <div className="col-md-4 col-sm-6 col-xs-12 mb-3">
                  <DetailCard
                    img={failed}
                    amt={payoutData?.data?.totalCreditRejectAmount}
                    name="Rejected Credit Amount"
                    type="rejected"
                    count={payoutData?.data?.totalCreditRejected}
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
