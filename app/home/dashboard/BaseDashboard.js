"use client";
import { use, useEffect, useState } from "react";
import { endPoints } from "@/app/services/apiEndpoints";
import usePostRequest from "@/app/hooks/usePost";
import {
  queryStringWithDate,
  queryStringWithKeyword,
} from "@/app/services/queryString";
import { dateFormatter } from "@/app/utils/dateFormatter";
import useGetRequest from "@/app/hooks/useFetch";
import Filters from "@/ui/Filter";
import Dashboard from "@/ui/Dashboard";
import dashboardData, {
  buildDashboardData,
} from "@/ui/Dashboard/components/PayInDashboard/components/dashboardData";
import { decryptParams } from "@/app/utils/decryptions";
import Cookies from "js-cookie";
import { decryptToken } from "@/app/utils/decryptToken";
import Refund from "../settlements/refund/page";

const BaseDashboard = ({ role, isSubMerchant, isAdmin, isMerchant }) => {
  const [symbol, setSymbol] = useState("₹");
  const [currencyTypes, setCurrencyTypes] = useState([]);
  const [currencyType, setCurrencyType] = useState({
    id: "",
    name: "Select Currency",
  });
  const [merchant, setMerchant] = useState({
    id: "",
    name: "Select Merchant",
  });
  const {
    response: merchantResponse,
    postData: getAllMerchants,
    error: merchantError,
  } = usePostRequest(endPoints.users.merchantListOnly);

  const {
    getData,
    response: currencyResponse,
    loading,
    error,
  } = useGetRequest();

  useEffect(() => {
    if (!merchant.id) return;
    getData(endPoints.users.mappedCurrency + merchant.id);
  }, [merchant]);

  useEffect(() => {
    if (currencyResponse) {
      const data = currencyResponse?.data;

      const currencyList = data?.map((item) => ({
        id: item?.currencyCode,
        name: item?.currencyName,
      }));
      setCurrencyTypes(currencyList);
      if (currencyList?.length > 0) {
        setCurrencyType({
          id: currencyList[0]?.id,
          name: currencyList[0]?.name,
        });
      } else {
        setCurrencyType({
          id: "",
          name: "Select Currency",
        });
      }
    }
    if (error) {
      setCurrencyTypes([]);
      setCurrencyType({
        id: "",
        name: "Select Currency",
      });
    }
  }, [currencyResponse, error]);

  useEffect(() => {
    getAllMerchants(queryStringWithKeyword(0));
  }, []);
  // useEffect(() => {
  //   if (merchantResponse && !merchantError) {
  //     setMerchant({
  //       id: merchantResponse?.data?.data[0]?.userId || "",
  //       name: merchantResponse?.data?.data[0]?.fullName || "Select Merchant",
  //     });
  //   }
  // }, [merchantResponse, merchantError]);
  const handleMerchantChange = async (id, name) => {
    setMerchant({ id, name });
  };

  const [dateRange, setDateRange] = useState({
    dateFrom: dateFormatter(new Date().toISOString()),
    dateTo: dateFormatter(new Date().toISOString()),
  });

  const handleDateChange = (event) => {
    const { name, value } = event.target;
    setDateRange((prev) => ({
      ...prev, // Spread the previous state
      [name]: dateFormatter(value), // Update the specific property
    }));
  };

  const handleCurrencyChange = (id, name) => {
    setCurrencyType({ id, name });
    switch (id) {
      case "USD":
        setSymbol("$");
        break;
      case "UGX":
        setSymbol("USh");
        break;
      case "EUR":
        setSymbol("€");
        break;
      case "GBP":
        setSymbol("£");
        break;
      default:
        setSymbol("₹");
        break;
    }
  };

  // dashboard APIS

  const { response, postData } = usePostRequest(
    endPoints.payin.dashboardTransaction
  );

  useEffect(() => {
    postData(
      queryStringWithDate(
        0,
        process.env.NEXT_PUBLIC_PAGINATION_SIZE,
        "",
        "ALL",
        dateRange.dateFrom,
        dateRange.dateTo,
        merchant.id,
        currencyType.id
      )
    );
  }, [dateRange.dateFrom, dateRange.dateTo, merchant.id, currencyType.id]);
  // Graph API Call

  // Get Line graph data
  const { postData: getLineGraphData, response: lineGraphData } =
    usePostRequest(endPoints.dashboard.lineGraph);
  useEffect(() => {
    getLineGraphData({
      userName: merchant.id,
      currencyCode: currencyType.id || "INR",
    });
  }, [merchant.id, dateRange.dateFrom, dateRange.dateTo, currencyType]);

  // Get User Counts
  const {
    getData: getUserCount,
    response: userCount,
    loading: userCountLoading,
    error: userCountError,
  } = useGetRequest();

  useEffect(() => {
    getUserCount(endPoints.dashboard.usersCount);
  }, []);

  // Get User Name
  const user = {
    name: decryptToken(Cookies.get("email")),

  };

  // Get Refunds Data
  const { postData: getRefundsData, response: refundsData } = usePostRequest(
    endPoints.dashboard.refunds
  );
  useEffect(() => {
    getRefundsData({
      userName: merchant.id,
      dateTo: dateRange.dateTo,
      dateFrom: dateRange.dateFrom,
      currencyCode: currencyType.id || "INR",
      status: "ALL",
    });
  }, [dateRange.dateFrom, dateRange.dateTo, merchant.id, currencyType.id]);

  // Get Settlements Data
  const { postData: getSettlementsData, response: settlementsData } =
    usePostRequest(endPoints.dashboard.settlements);
  useEffect(() => {
    getSettlementsData({
      userName: merchant.id,
      dateTo: dateRange.dateTo,
      dateFrom: dateRange.dateFrom,
      currencyCode: currencyType.id || "INR",
      status: "ALL",
    });
  }, [dateRange.dateFrom, dateRange.dateTo, merchant.id, currencyType.id]);

  // Get Current Day Data
  const { postData: getCurrentDaydata, response: currentDayData } =
    usePostRequest(endPoints.dashboard.currentDay);
  useEffect(() => {
    getCurrentDaydata({
      userName: merchant.id,
    });
  }, [dateRange.dateFrom, dateRange.dateTo, merchant.id, currencyType.id]);

  // Get Total Transaction Data
  const {
    postData: getTotalTransactionsData,
    response: totalTransactionsData,
  } = usePostRequest(endPoints.dashboard.totalTransactions);
  useEffect(() => {
    getTotalTransactionsData({
      userName: merchant.id,
      dateTo: dateRange.dateTo,
      dateFrom: dateRange.dateFrom,
      currencyCode: currencyType.id || "INR",
    });
  }, [dateRange.dateFrom, dateRange.dateTo, merchant.id, currencyType.id]);

  return (
    <>
      <Filters
        role={role}
        isSubMerchant={isSubMerchant}
        selectedMerchant={merchant}
        merchantOptions={merchantResponse?.data.data}
        handleMerchantChange={handleMerchantChange}
        selectedCurrency={currencyType}
        currencyOptions={currencyTypes}
        handleCurrencyChange={handleCurrencyChange}
        isMerchantDisabled={role || isSubMerchant}
        isStatusDisabled={true}
        handleDateRangeChange={handleDateChange}
        selectedDateRange={dateRange}
        setDateRange={setDateRange}
      />
      <Dashboard
        payinData={buildDashboardData(
          {
            ...user,
            amount: currentDayData?.data?.data?.amount || 0,
            count: currentDayData?.data?.data?.count || 0,
          },
          userCount?.data,
          lineGraphData?.data?.data,
          {
            percentage: 12,
            trend: [30, 40, 50, 40, 45, 50, 60, 70],
            currentPeriod: {
              label: `${dateRange.dateFrom} - ${dateRange.dateTo}`,
              count: refundsData?.data?.data?.totalCount ?? 0,
              amount: refundsData?.data?.data?.totalRefund ?? 0,
            },
            symbol: symbol,
          },
          {},
          settlementsData?.data?.data,
          totalTransactionsData?.data?.data,
          
          {
            percentage: 12,
            trend: [30, 40, 50, 40, 45, 50, 60, 70],
            currentPeriod: {
              label: `${dateRange.dateFrom} - ${dateRange.dateTo}`,
              count: currentDayData?.data?.data?.totalCount ?? 0,
              amount: currentDayData?.data?.data?.totalAmount ?? 0,
            },
            symbol: symbol,
          }
        )}
        symbol={symbol}
        isAdmin={isAdmin}
        isMerchant={isMerchant}
      />
    </>
  );

  //   <div className="wrapper"></div>

  //   <div className="row">
  //     <div className="col-md-12 col-sm-12 ">
  //       <TransactionsSummary response={response?.data.data} symbol={symbol} />
  //     </div>

  //   </div>
  //   <TransactionCount data={graphData?.data.data} />
  //   <TransactionAmount data={graphData?.data.data} /> */
};

export default BaseDashboard;
