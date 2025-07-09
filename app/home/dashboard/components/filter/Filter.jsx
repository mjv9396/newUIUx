"use client";
import Dropdown from "@/app/ui/dropdown/Dropdown";
import { useEffect, useState } from "react";
import { endPoints } from "@/app/services/apiEndpoints";
import TransactionsSummary from "../summary/TransactionsSummary";
import AmountSummary from "../summary/AmountSummary";
import Label from "@/app/ui/label/Label";
import usePostRequest from "@/app/hooks/usePost";
import {
  queryStringWithDate,
  queryStringWithKeyword,
} from "@/app/services/queryString";
import TransactionCount from "../../graphs/TransactionCount";
import TransactionAmount from "../../graphs/TransactionAmount";
import {
  dateFormatter,
  inputFieldDateFormatter,
} from "@/app/utils/dateFormatter";
import PaymentTypeData from "../../graphs/PaymentTypeData";
import useGetRequest from "@/app/hooks/useFetch";

const Filter = ({ role, isSubMerchant }) => {
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
      console.log("🚀 ~ useEffect ~ data:", data);

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
  useEffect(() => {
    if (role && merchantResponse && !merchantError) {
      setMerchant({
        id: merchantResponse?.data?.data[0]?.userId || "",
        name: merchantResponse?.data?.data[0]?.fullName || "Select Merchant",
      });
    }
  }, [merchantResponse, merchantError]);
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
  const { postData: getGraphData, response: graphData } = usePostRequest(
    endPoints.graph
  );
  useEffect(() => {
    getGraphData({
      userName: merchant.id,
      currencyCode: currencyType.id || "",
      dateTo: dateRange.dateTo,
      dateFrom: dateRange.dateFrom,
    });
  }, [merchant.id, dateRange, currencyType]);
  // Get Pie graph data
  const { postData: getPieGraphData, response: pieGraphData } = usePostRequest(
    endPoints.piegraph
  );
  useEffect(() => {
    getPieGraphData({
      userName: merchant.id,
      dateTo: dateRange.dateTo,
      dateFrom: dateRange.dateFrom,
      currencyCode: currencyType.id || "",
    });
  }, [merchant.id, dateRange.dateFrom, dateRange.dateTo, currencyType]);

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
  return (
    <div className="wrapper">


      


      <div className="row mb-3">
        {!role && !isSubMerchant && (
          <>
            <div className="col-md-3">
              <Label htmlFor="merchant" label="Select Merchant" />
              <Dropdown
                initialLabel="Select Merchant"
                selectedValue={merchant}
                options={merchantResponse?.data.data}
                onChange={handleMerchantChange}
                id="userId"
                value="fullName"
              />
            </div>
          </>
        )}

        <div className="col-md-3 col-sm-12 mb-4">
          <Label htmlFor="currencyType" label="Select Currency" />
          <Dropdown
            initialLabel="Select Currency"
            selectedValue={currencyType}
            options={currencyTypes}
            onChange={handleCurrencyChange}
            id="id"
            value="name"
          />
        </div>
        <div className="col-md-3 col-sm-12">
          <Label htmlFor="dateFrom" label="Date From" />
          <input
            type="date"
            id="inputDate"
            name="dateFrom"
            max={new Date().toISOString().split("T")[0]}
            onChange={handleDateChange}
            value={inputFieldDateFormatter(dateRange.dateFrom).toString()}
          />
        </div>
        <div className="col-md-3 col-sm-12">
          <Label htmlFor="dateTo" label="Date To" />
          <input
            type="date"
            id="inputDate"
            name="dateTo"
            max={new Date().toISOString().split("T")[0]}
            onChange={handleDateChange}
            value={inputFieldDateFormatter(dateRange.dateTo)}
          />
        </div>
      </div>

      {/* new dashboard  */}

      

      <div className="row">
        <div className="col-md-12 col-sm-12 ">
          <TransactionsSummary response={response?.data.data} symbol={symbol} />
          {/* <AmountSummary response={response?.data.data} symbol={symbol} /> */}
        </div>
        {/* <div className="col-md-12 col-sm-12">
          <PaymentTypeData data={pieGraphData} />
        </div> */}
      </div>
      <TransactionCount data={graphData?.data.data} />
      <TransactionAmount data={graphData?.data.data} />
    </div>
  );
};

export default Filter;
