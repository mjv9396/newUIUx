"use client";
import { useEffect, useState } from "react";
import { endPoints } from "@/app/services/apiEndpoints";
import Dropdown from "@/app/ui/dropdown/Dropdown";
import Label from "@/app/ui/label/Label";
import { headers } from "./Column";
import CardPayIn from "./CardPayIn";
import {
  queryStringWithDate,
  queryStringWithKeyword,
} from "@/app/services/queryString";
import Table from "@/app/ui/table/Table";
import usePostRequest from "@/app/hooks/usePost";
import {
  dateFormatter,
  inputFieldDateFormatter,
} from "@/app/utils/dateFormatter";
import { loadingMsg } from "@/app/utils/message";
import TransactionDetails from "../modal/TransactionDetail";
const currencyTypes = [
  { id: "INR", name: "Indian Rupee" },
  { id: "UGX", name: "Uganda Shilling" },
  { id: "USD", name: "US Dollar" },
  { id: "EUR", name: "Euro" },
  { id: "GBP", name: "Pound Sterling" },
];
const transactionStatusTypes = [
  { id: 1, name: "All" },
  { id: 2, name: "Pending" },
  { id: 3, name: "Success" },
  { id: 4, name: "Failed" },
  { id: 5, name: "Rejected" },
  { id: 6, name: "Declined" },
];
const BodyMapping = ({ data = [], loading, merchant }) => {
  const [viewModal, setViewModal] = useState(false);
  const [transactionData, setTransactionData] = useState(null);
  const handleViewTransactionDetail = (data) => {
    setTransactionData(data);
    setViewModal(true);
  };
  return (
    <>
      {viewModal && (
        <TransactionDetails
          name={merchant}
          onClose={() => setViewModal(!viewModal)}
          data={transactionData}
        />
      )}
      <tbody>
        {!loading ? (
          <tr>
            <td colSpan={8} className="text-center">
              {loadingMsg("transactions")}
            </td>
          </tr>
        ) : (
          <>
            {data && data.length > 0 ? (
              data.map((item) => (
                <tr key={item.transactionId | "NA"}>
                  <td>{item.transactionId || "NA"}</td>
                  <td>{item.payableAmount || 0.0}</td>
                  <td>{item.transactionTypes || "NA"}</td>
                  <td>{item.customerName || "NA"}</td>
                  <td>{item.customerEmail || "NA"}</td>
                  <td>{item.customerContactNumber || "NA"}</td>
                  <td>{item.transactionStatus}</td>
                  <td>
                    <i
                      className="bi bi-display-fill text-info"
                      title="View Details"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleViewTransactionDetail(item)}
                    ></i>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8}>No Transactions Available</td>
              </tr>
            )}
          </>
        )}
      </tbody>
    </>
  );
};
const TransactionList = ({ role, isMerchant }) => {

  const [symbol, setSymbol] = useState("₹");
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
  const [merchant, setMerchant] = useState({
    id: "",
    name: "Select Merchant",
  });
  const {
    loading: merchantLoading,
    error: merchantError,
    response: merchantResponse = [],
    postData: getAllMerchants,
  } = usePostRequest(endPoints.users.merchantListOnly);
  useEffect(() => {
    getAllMerchants(queryStringWithKeyword(0));
  }, []);

  useEffect(() => {
    if (merchantResponse && role) {
      setMerchant({
        id: merchantResponse?.data?.data[0]?.userId || "",
        name: merchantResponse?.data?.data[0]?.fullName || "Select Merchant",
      });
    }
  }, [merchantResponse]);

  // Load Transaction API Call
  const {
    loading: transactionLoading,
    error: transactionError,
    response: transactionResponse = [],
    postData: getAllTransaction,
  } = usePostRequest(endPoints.payin.transaction);

  // Filters start here
  const [currentPage, setCurrentPage] = useState(0);
  const [dateRange, setDateRange] = useState({
    dateFrom: dateFormatter(new Date()),
    dateTo: dateFormatter(new Date()),
  });
  const [transactionStatus, setTransactionStatus] = useState(
    transactionStatusTypes[0]
  );
  const [currencyType, setCurrencyType] = useState({
    id: currencyTypes[0].id,
    name: currencyTypes[0].name,
  });
  // Handle for pagination, date change, merchant change
  const handlePrev = () => {
    setCurrentPage((prev) => prev - 1);
  };
  const handleNext = () => {
    setCurrentPage((prev) => prev + 1);
  };
  const handleMerchantChange = (id, name) => {
    setMerchant({ id, name });
  };
  const handleDateChange = (event) => {
    const { name, value } = event.target;
    setDateRange((prev) => ({
      ...prev, // Spread the previous state
      [name]: dateFormatter(value), // Update the specific property
    }));
  };

  useEffect(() => {
    getAllTransaction(
      queryStringWithDate(
        currentPage,
        process.env.NEXT_PUBLIC_PAGINATION_SIZE,
        "",
        transactionStatus.name,
        dateRange.dateFrom,
        dateRange.dateTo,
        merchant.id,
        currencyType.id
      )
    );
  }, [currentPage, dateRange, merchant.id, transactionStatus, currencyType.id]);

  const [loader, setLoader] = useState(false);
  useEffect(() => {
    if (transactionLoading) setLoader(true);
  }, [transactionLoading]);

  if (merchantError || transactionError)
    return <p className="text-center">Error: Failed to fetch data</p>;

  if (merchantResponse) {
    return (
      <div className="wrapper">
        <div className="row">
          {role && (
            <div className="col-lg-2 col-md-6 col-sm-12 mb-3">
              <Label htmlFor="merchant" label="Merchant" />
              <Dropdown
                initialLabel="Select Merchant"
                selectedValue={merchant}
                options={merchantResponse?.data?.data}
                onChange={handleMerchantChange}
                id="userId"
                value="fullName"
              />
            </div>
          )}
          <div className="col-md-2 col-sm-12 mb-4">
            <Label htmlFor="currencyType" label="Currency" />
            <Dropdown
              initialLabel="Select Currency"
              selectedValue={currencyType}
              options={currencyTypes}
              onChange={handleCurrencyChange}
              id="id"
              value="name"
            />
          </div>
          <div className="col-lg-2 col-md-6 col-sm-12 mb-3">
            <Label htmlFor="dateFrom" label="Date From" />
            <input
              type="date"
              id="inputDate"
              name="dateFrom"
              max={new Date().toISOString().split("T")[0]}
              onChange={handleDateChange}
              value={inputFieldDateFormatter(dateRange.dateFrom)}
            />
          </div>
          <div className="col-lg-2 col-md-6 col-sm-12 mb-3">
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
          <div className="col-lg-2 col-md-6 col-sm-12 mb-3">
            <Label htmlFor="status" label="Status" />
            <Dropdown
              initialLabel=""
              selectedValue={transactionStatus}
              options={transactionStatusTypes}
              onChange={(id, name) => setTransactionStatus({ id, name })}
              id="id"
              value="name"
            />
          </div>
        </div>
        <CardPayIn data={transactionResponse?.data.summary} symbol={symbol} />
        <Table
          headers={headers}
          currentPage={transactionResponse?.data.pageNumber}
          pageSize={transactionResponse?.data.pageSize}
          totalElement={transactionResponse?.data.totalElement}
          handleNext={handleNext}
          handlePrev={handlePrev}
          link={false}
          search={false}
          downloadUrl={endPoints.payin.downloadTransaction}
          userName={merchant.id}
          dateFrom={dateRange.dateFrom}
          dateTo={dateRange.dateTo}
          status={transactionStatus.name}
          currencyCode={currencyType.id !== ''? currencyType.id : "Please Select Currency"}
          merchantName={isMerchant ? "Select Merchant" : merchant.name}
          source="transaction_report"
        >
          <BodyMapping
            data={transactionResponse?.data.data || null}
            loading={loader}
            merchant={merchant.name || ""}
          />
        </Table>
      </div>
    );
  }
};

export default TransactionList;
