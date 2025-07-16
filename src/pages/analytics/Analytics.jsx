import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import useFetch from "../../hooks/useFetch";
import { endpoints } from "../../services/apiEndpoints";
import usePost from "../../hooks/usePost";
import { dateFormatter } from "../../utils/dateFormatter";
import styles from "../../styles/dashboard/Dashboard.module.css";
import { isAdmin, isMerchant, isReseller } from "../../services/cookieStore";
import { DateRangePicker } from "react-date-range";
import AmountCard from "./components/AmountCard";
import CountCard from "./components/CountCard";
import wallet from "../../assets/wallet.png";
import sponsor from "../../assets/sponsorship.png";
import resolution from "../../assets/resolution.png";
import pending from "../../assets/pending.png";
import failed from "../../assets/transaction-failed.png";
import success from "../../assets/transaction-success.png";
import reserve from "../../assets/reserve.png";
import Filters from "../../ui/Filter";

const Analytics = () => {
  const [merchantId, setMerchantId] = useState("");
  const { fetchData: getAllMerchant, data: allMerchant } = useFetch();
  useEffect(() => {
    if (isAdmin() || isReseller()) getAllMerchant(endpoints.user.userList);
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
  const [payinData, setPayinData] = useState();
  const [payoutData, setPayoutData] = useState();
  const [settlementData, setSettlementData] = useState();
  const [chargebackData, setChargeBackData] = useState();
  useEffect(() => {
    getPayinDashboardData();
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
  const { fetchData: getTotalBalance, data: totalBalanceData } = useFetch();
  useEffect(() => {
    if (isAdmin()) getTotalBalance(endpoints.user.totalBalance);
    else {
      getTotalBalance(endpoints.user.balance);
    }
  }, []);
  return (
    <DashboardLayout page="Analytics" url="/dashboard/analytics">
      <div className={styles.dashboard}>
        <Filters
          handleMerchantChange={setMerchantId}
          isMerchantDisabled={isMerchant()}
          merchantOptions={allMerchant?.data}
          setDateRange={setRange}
          isCurrencyDisabled
        />

        <div className="row">
          <div className="col-md-6 col-sm-12 px-4 ">
            <strong>Payin Data</strong>
            <div className="row mt-3">
              <div className="col-md-7 col-sm-12 mb-4">
                <AmountCard
                  name="Success Amount"
                  amt={payinData?.data?.totalSuccessAmount}
                  type="payin"
                  className="success"
                  img={success}
                />
              </div>
              <div className="col-md-5 col-sm-12 mb-4">
                <CountCard
                  name="Success Count"
                  count={payinData?.data?.totalSuccess}
                  type="success"
                />
              </div>
              <div className="col-md-7 col-sm-12 mb-4">
                <AmountCard
                  name="Failed amount"
                  amt={payinData?.data?.totalFailedAmount}
                  type="payin"
                  className="failed"
                  img={failed}
                />
              </div>
              <div className="col-md-5 col-sm-12 mb-4">
                <CountCard
                  name="Failed Count"
                  count={payinData?.data?.totalFailed}
                  type="failed"
                />
              </div>
              <div className="col-md-7 col-sm-12 mb-4">
                <AmountCard
                  name="Pending Amount"
                  amt={payinData?.data?.totalPendingAmount}
                  type="payin"
                  className="pending"
                  img={pending}
                />
              </div>
              <div className="col-md-5 col-sm-12 mb-4">
                <CountCard
                  name="Pending Count"
                  count={payinData?.data?.totalPending}
                  type="pending"
                />
              </div>
              <div className="col-md-7 col-sm-12 mb-4">
                <AmountCard
                  name="Total Dispute Amount"
                  amt={chargebackData?.data.totalAmount}
                  type="dispute"
                  img={resolution}
                />
              </div>
              <div className="col-md-5 col-sm-12 mb-4">
                <CountCard
                  name="Total Dispute Count"
                  count={chargebackData?.data?.count}
                  type="dispute"
                />
              </div>
              <div className="col-md-7 col-sm-12 mb-4">
                <AmountCard
                  name="Total Settlement Amount"
                  amt={settlementData?.data?.netAmountSettle}
                  type="settled"
                  img={sponsor}
                />
              </div>
              <div className="col-md-5 col-sm-12 mb-4">
                <AmountCard
                  name="Total Unsettled Amount"
                  amt={settlementData?.data?.netAmountUnsettle}
                  type="unsettled"
                />
              </div>
              <div className="col-md-7 col-sm-12 mb-4">
                <AmountCard
                  img={reserve}
                  amt={0}
                  name="Rolling Reserve"
                  type="reserve"
                />
              </div>
              <div className="col-md-5 col-sm-12 mb-4">
                <CountCard name="TDR" count={0} type="tdr" />
              </div>
            </div>
          </div>
          <div className="col-md-6 col-sm-12 px-4">
            <strong>Payout Data</strong>
            <div className="row mt-3">
              <div className="col-md-12 mb-4">
                <AmountCard
                  name="Available Balance"
                  amt={
                    isAdmin()
                      ? totalBalanceData?.data
                      : totalBalanceData?.data.accountBalance
                  }
                  type="wallet"
                  img={wallet}
                />
              </div>
              <div className="col-md-7 col-sm-12 mb-4">
                <AmountCard
                  img={success}
                  amt={payoutData?.data?.totalSuccessAmount}
                  name="Success Debit Amount"
                  type="payout"
                  className="success"
                />
              </div>
              <div className="col-md-5 col-sm-12 mb-4">
                <CountCard
                  name="Success Debit Count"
                  count={payoutData?.data?.totalSuccess}
                  type="success"
                />
              </div>
              <div className="col-md-7 col-sm-12 mb-4">
                <AmountCard
                  img={failed}
                  amt={payoutData?.data?.totalFailedAmount}
                  name="Failed Debit Amount"
                  type="payout"
                  className="failed"
                />
              </div>
              <div className="col-md-5 col-sm-12 mb-4">
                <CountCard
                  name="Failed Debit Count"
                  count={payoutData?.data?.totalFailed}
                  type="failed"
                />
              </div>
              <div className="col-md-7 col-sm-12 mb-4">
                <AmountCard
                  img={pending}
                  amt={payoutData?.data?.totalPendingAmount}
                  name="Pending Debit Amount"
                  type="payout"
                  className="pending"
                />
              </div>
              <div className="col-md-5 col-sm-12 mb-4">
                <CountCard
                  name="Pending Debit Count"
                  count={payoutData?.data?.totalPending}
                  type="pending"
                />
              </div>
              <div className="col-md-7 col-sm-12 mb-4">
                <AmountCard
                  img={success}
                  amt={payoutData?.data?.totalCreditSuccessAmount}
                  name="Success Credited Amount"
                  type="credited"
                />
              </div>
              <div className="col-md-5 col-sm-12 mb-4">
                <CountCard
                  name="Success Credit Count"
                  count={payoutData?.data?.totalCreditSuccess}
                  type="credited"
                />
              </div>
              <div className="col-md-7 col-sm-12 mb-4">
                <AmountCard
                  img={failed}
                  amt={payoutData?.data?.totalCreditRejectAmount}
                  name="Rejected Credit Amount"
                  type="rejected"
                />
              </div>
              <div className="col-md-5 col-sm-12 mb-4">
                <CountCard
                  name="Rejected Credit Count"
                  count={payoutData?.data?.totalCreditRejected}
                  type="rejected"
                />
              </div>
              <div className="col-md-7 col-sm-12 mb-4">
                <AmountCard
                  img={reserve}
                  amt={0}
                  name="Rolling Reserve"
                  type="reserve"
                />
              </div>
              <div className="col-md-5 col-sm-12 mb-4">
                <CountCard name="TDR" count={0} type="tdr" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
