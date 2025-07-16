import { DateRangePicker } from "react-date-range";
import DashboardLayout from "../../layouts/DashboardLayout";
import { GetUserRole, isAdmin, isReseller } from "../../services/cookieStore";
import styles from "../../styles/dashboard/Dashboard.module.css";
import classes from "../../styles/common/List.module.css";
import useFetch from "../../hooks/useFetch";
import { useEffect, useRef, useState } from "react";
import { endpoints } from "../../services/apiEndpoints";
import Error from "../errors/Error";
import Loading from "../errors/Loading";
import { dateFormatter } from "../../utils/dateFormatter";
import usePost from "../../hooks/usePost";
import { roundAmount } from "../../utils/roundAmount";

const ReconciliationReport = () => {
  //fetch merchant, acquirer, payment type, mop type and  curreny
  const [merchantId, setMerchantId] = useState("");
  const [acquirerId, setAcquirerId] = useState("");
  const {
    fetchData: getAllMerchant,
    data: allMerchant,
    error: merchantError,
    loading: merchantLoading,
  } = useFetch();
  const {
    fetchData: getAllAcquirer,
    data: allAcquirer,
    error: acquirerError,
    loading: acquirerLoading,
  } = useFetch();
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
    postData: payinChargingDetailReq,
    data: payinChargingData,
    error: payinChargingDataError,
  } = usePost(endpoints.payin.chargingDetailList);
  const {
    postData: payoutChargingDetailReq,
    data: payoutChargingData,
    error: payoutChargingDataError,
  } = usePost(endpoints.payout.chargingDetailsList);
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
    await payinChargingDetailReq({
      userId: merchantId,
      acqCode: acquirerId,
    });
    await payoutChargingDetailReq({ userId: merchantId, acquirer: acquirerId });
  };
  const [payinData, setPayinData] = useState();
  const [payoutData, setPayoutData] = useState();
  const [settlementData, setSettlementData] = useState();
  const [chargebackData, setChargeBackData] = useState();
  const [payinChargingDetail, setPayinChargingDetail] = useState();
  const [payoutChargingDetail, setPayoutChargingDetail] = useState();
  useEffect(() => {
    if (merchantId && acquirerId) getPayinDashboardData();
  }, [range, merchantId, acquirerId]);

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
    if (payinChargingData && !payinChargingDataError) {
      setPayinChargingDetail(payinChargingData);
    }
  }, [payinChargingData, payinChargingDataError]);
  useEffect(() => {
    if (payoutChargingData && !payoutChargingDataError) {
      setPayoutChargingDetail(payoutChargingData);
    }
  }, [payoutChargingData, payoutChargingDataError]);
  const payinTableRef = useRef(null);
  const payoutTableRef = useRef(null);
  const totalTableRef = useRef(null);
  const getTableData = (tableRef) => {
    const rows = Array.from(tableRef.current?.rows || []);
    return rows.map((row) =>
      Array.from(row.cells)
        .map((cell) => `"${cell.textContent?.trim()}"`)
        .join(",")
    );
  };
  const handleExportData = () => {
    const data1 = getTableData(payinTableRef);
    const data2 = getTableData(payoutTableRef);
    const data3 = getTableData(totalTableRef);
    // Optional: add a blank line or section title between tables
    const csvContent = [...data1, "", ...data2, "", ...data3].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `consolidated_report${dateFormatter(new Date())}.csv`;
    a.click();

    URL.revokeObjectURL(url);
  };

  if (merchantError) <Error error="Error loading Merchants" />;
  if (acquirerError) <Error error="Error loading Acquirers" />;
  if (merchantLoading || acquirerLoading)
    <Loading loading="Loading Merchant and Acquirer List" />;
  if (allAcquirer && allMerchant)
    return (
      <DashboardLayout
        page="Reconciliation Report"
        url="/reconciliation-report"
      >
        <div className={styles.dashboard}>
          <button className={classes.btn} onClick={handleExportData}>
            Export
          </button>

          <div className={styles.user}>
            <div className={styles.input}>
              <label htmlFor="userId">
                Enter Date Range <span className="required">*</span>
              </label>
              <input
                type="text"
                name="dateFrom"
                readOnly
                value={`${range[0].startDate.toLocaleDateString()} - ${range[0].endDate.toLocaleDateString()}`}
                onClick={() => setShowPicker(!showPicker)}
                style={{ cursor: "pointer" }}
              />
              {showPicker && (
                <div
                  style={{
                    position: "absolute",
                    zIndex: 1000,
                    right: 0,
                    top: 50,
                  }}
                >
                  <DateRangePicker ranges={range} onChange={handleSelect} />
                </div>
              )}
            </div>
            {(isAdmin() || isReseller()) && (
              <>
                <div className={styles.input}>
                  <label htmlFor="userId">
                    Merchant <span className="required">*</span>
                  </label>
                  <select
                    name="userId"
                    id="userId"
                    defaultValue=""
                    onChange={(e) => setMerchantId(e.target.value)}
                  >
                    <option value="">--Select Merchant--</option>
                    {allMerchant.data.length > 0 ? (
                      allMerchant.data.map((item) => (
                        <option key={item.userId} value={item.userId}>
                          {item.firstName} {item.lastName}
                        </option>
                      ))
                    ) : (
                      <option>No merchant added</option>
                    )}
                  </select>
                </div>

                <div className={styles.input}>
                  <label htmlFor="acqCode">
                    Acquirer <span className="required">*</span>
                  </label>
                  <select
                    name="acqCode"
                    id="acqCode"
                    onChange={(e) => setAcquirerId(e.target.value)}
                    defaultValue=""
                  >
                    <option value="" disabled>
                      --Select Acquirer--
                    </option>
                    {allAcquirer.data.length > 0 ? (
                      allAcquirer.data.map((item) => (
                        <option key={item.acqCode} value={item.acqCode}>
                          {item.acqName}
                        </option>
                      ))
                    ) : (
                      <option>No acquirer added</option>
                    )}
                  </select>
                </div>
              </>
            )}
          </div>

          <div className="row">
            <div className="col-md-6 col-sm-12 mb-3">
              <div className={classes.listing}>
                <h5>Payin</h5>
                <div className={classes.table}>
                  <table
                    className="table table-responsive-sm"
                    ref={payinTableRef}
                  >
                    <thead className="hidden">
                      <tr>
                        <th></th>
                        <th></th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Total Payin</td>
                        <td colSpan={2}>
                          <b>
                            &#8377;
                            {roundAmount(payinData?.data?.totalSuccessAmount) ||
                              0}
                          </b>
                        </td>
                      </tr>
                      <tr>
                        <td>Payin charge</td>
                        <td>
                          {payinChargingDetail &&
                            payinChargingDetail.data[0].merchantTdr}{" "}
                          %
                        </td>
                        <td>
                          <b>
                            &#8377;
                            {payinChargingDetail &&
                              roundAmount(
                                (payinChargingDetail.data[0].merchantTdr /
                                  100) *
                                  roundAmount(
                                    payinData?.data?.totalSuccessAmount
                                  )
                              )}
                          </b>
                        </td>
                      </tr>
                      <tr>
                        <td>Payin GST</td>
                        <td>
                          {payinChargingDetail &&
                            payinChargingDetail.data[0].gst}{" "}
                          %
                        </td>
                        <td>
                          <b>
                            &#8377;
                            {payinChargingDetail &&
                              roundAmount(
                                (payinChargingDetail.data[0].merchantTdr /
                                  100) *
                                  roundAmount(
                                    payinData?.data?.totalSuccessAmount
                                  )
                              ) *
                                (payinChargingDetail.data[0].gst / 100)}
                          </b>
                        </td>
                      </tr>
                      <tr>
                        <td>Payin (after charge)</td>
                        <td colSpan={2}>
                          <b>
                            &#8377;
                            {payinChargingDetail &&
                              roundAmount(payinData?.data?.totalSuccessAmount) -
                                roundAmount(
                                  (payinChargingDetail.data[0].merchantTdr /
                                    100) *
                                    roundAmount(
                                      payinData?.data?.totalSuccessAmount
                                    )
                                ) -
                                roundAmount(
                                  (payinChargingDetail.data[0].merchantTdr /
                                    100) *
                                    roundAmount(
                                      payinData?.data?.totalSuccessAmount
                                    ) *
                                    (payinChargingDetail.data[0].gst / 100)
                                )}
                          </b>
                        </td>
                      </tr>
                      <br />
                      <tr>
                        <td>Total Settled Amount</td>
                        <td colSpan={2}>
                          <b>
                            &#8377;
                            {roundAmount(
                              settlementData?.data.netAmountSettle
                            ) || 0}
                          </b>
                        </td>
                      </tr>
                      <tr>
                        <td>Unsettled Amount</td>
                        <td colSpan={2}>
                          <b>
                            &#8377;
                            {roundAmount(
                              settlementData?.data.netAmountUnsettle
                            ) || 0}
                          </b>
                        </td>
                      </tr>
                      <tr>
                        <td>Chargeback</td>
                        <td colSpan={2}>
                          &#8377;
                          {roundAmount(chargebackData?.data?.totalAmount) || 0}
                        </td>
                      </tr>

                      <tr>
                        <td>Other</td>
                        <td colSpan={2}>0</td>
                      </tr>
                      <tr>
                        <td>Other</td>
                        <td colSpan={2}>0</td>
                      </tr>
                      <tr>
                        <td>Other</td>
                        <td colSpan={2}>0</td>
                      </tr>
                      <br />
                      <tr>
                        <td>
                          <strong>TOTAL PAID</strong>
                        </td>
                        <td colSpan={2}>
                          <b>
                            &#8377;
                            {roundAmount(chargebackData?.data?.totalAmount) ||
                              0}
                          </b>
                        </td>
                      </tr>
                      <br />
                      <tr>
                        <td>
                          <b>Total Payin Txn</b>
                        </td>
                        <td colSpan={2}>
                          <b>
                            &#8377;
                            {payinChargingDetail &&
                              roundAmount(payinData?.data?.totalSuccessAmount) -
                                roundAmount(
                                  (payinChargingDetail.data[0].merchantTdr /
                                    100) *
                                    roundAmount(
                                      payinData?.data?.totalSuccessAmount
                                    )
                                ) -
                                roundAmount(chargebackData?.data?.totalAmount) -
                                roundAmount(
                                  (payinChargingDetail.data[0].merchantTdr /
                                    100) *
                                    roundAmount(
                                      payinData?.data?.totalSuccessAmount
                                    )
                                ) *
                                  (payinChargingDetail.data[0].gst / 100)}
                          </b>{" "}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-sm-12 mb-3">
              <div className={classes.listing}>
                <h5>Payout</h5>
                <table
                  className="table table-responsive-sm"
                  ref={payoutTableRef}
                >
                  <thead className="hidden">
                    <tr>
                      <th></th>
                      <th></th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Total Payout</td>
                      <td colSpan={2}>
                        <b>
                          &#8377;.{" "}
                          {roundAmount(payoutData?.data?.totalSuccessAmount)}
                        </b>
                      </td>
                    </tr>
                    <tr>
                      <td>Charge</td>
                      <td>
                        {payoutChargingDetail &&
                          payoutChargingDetail.data[0].merchantTdr}{" "}
                        %
                      </td>
                      <td>
                        <b>
                          &#8377;
                          {payoutChargingDetail &&
                            roundAmount(
                              (payoutChargingDetail.data[0].merchantTdr / 100) *
                                roundAmount(
                                  payoutData?.data?.totalSuccessAmount
                                )
                            )}
                        </b>
                      </td>
                    </tr>
                    <tr>
                      <td>Payout GST</td>
                      <td>
                        {payoutChargingDetail &&
                          payoutChargingDetail.data[0].gst}{" "}
                        %
                      </td>
                      <td>
                        <b>
                          &#8377;
                          {payoutChargingDetail &&
                            roundAmount(
                              (payoutChargingDetail.data[0].merchantTdr / 100) *
                                roundAmount(
                                  payoutData?.data?.totalSuccessAmount
                                ) *
                                (payoutChargingDetail.data[0].gst / 100)
                            )}
                        </b>
                      </td>
                    </tr>
                    <tr>
                      <td>Payout (after charge)</td>
                      <td colSpan={2}>
                        <b>
                          &#8377;
                          {payoutChargingDetail &&
                            roundAmount(
                              parseFloat(
                                roundAmount(
                                  payoutData?.data?.totalSuccessAmount
                                )
                              ) +
                                parseFloat(
                                  roundAmount(
                                    (payoutChargingDetail.data[0].merchantTdr /
                                      100) *
                                      roundAmount(
                                        payoutData?.data?.totalSuccessAmount
                                      )
                                  )
                                ) +
                                parseFloat(
                                  roundAmount(
                                    (payoutChargingDetail.data[0].merchantTdr /
                                      100) *
                                      roundAmount(
                                        payoutData?.data?.totalSuccessAmount
                                      )
                                  ) *
                                    (payoutChargingDetail.data[0].gst / 100)
                                )
                            )}
                        </b>
                      </td>
                    </tr>
                    <br />
                    <tr>
                      <td>Other</td>
                      <td colSpan={2}>0</td>
                    </tr>
                    <tr>
                      <td>Other</td>
                      <td colSpan={2}>0</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Balance Reflecting in Payout Wallet</strong>
                      </td>

                      {GetUserRole() === "MERCHANT" && (
                        <td colSpan={2}>
                          <b>
                            &#8377;
                            {totalBalanceData
                              ? roundAmount(
                                  totalBalanceData.data.accountBalance
                                )
                              : ""}
                          </b>
                        </td>
                      )}
                      {GetUserRole() === "ADMIN" && (
                        <td colSpan={2}>
                          <b>
                            &#8377;
                            {totalBalanceData
                              ? roundAmount(totalBalanceData.data)
                              : ""}
                          </b>
                        </td>
                      )}
                    </tr>
                    <br />
                    <tr>
                      <td>
                        <b>Total Payout Txn</b>
                      </td>
                      <td colSpan={2}>
                        <b>
                          &#8377;
                          {payoutChargingDetail &&
                            roundAmount(
                              parseFloat(totalBalanceData.data) +
                                parseFloat(
                                  roundAmount(
                                    payoutData?.data?.totalSuccessAmount
                                  )
                                ) +
                                parseFloat(
                                  roundAmount(
                                    (payoutChargingDetail.data[0].merchantTdr /
                                      100) *
                                      roundAmount(
                                        payoutData?.data?.totalSuccessAmount
                                      )
                                  )
                                ) +
                                parseFloat(
                                  roundAmount(
                                    (payoutChargingDetail.data[0].merchantTdr /
                                      100) *
                                      roundAmount(
                                        payoutData?.data?.totalSuccessAmount
                                      )
                                  ) *
                                    (payoutChargingDetail.data[0].gst / 100)
                                )
                            )}
                        </b>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table
                  className="table table-responsive-sm"
                  ref={totalTableRef}
                >
                  <thead>
                    <tr>
                      <th></th>
                      <th></th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <b>Difference in wallet:</b>{" "}
                      </td>
                      <td>
                        <b>&#8377;</b>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
};

export default ReconciliationReport;
