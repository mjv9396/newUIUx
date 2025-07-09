"use client";
import React, { useEffect, useState } from "react";
import { headers } from "./column";
import usePostRequest from "@/app/hooks/usePost";
import {
  queryStringWithDate,
  queryStringWithKeyword,
} from "@/app/services/queryString";
import Label from "@/app/ui/label/Label";
import Dropdown from "@/app/ui/dropdown/Dropdown";
import { endPoints } from "@/app/services/apiEndpoints";
import Table from "@/app/ui/table/Table";
import {
  dateFormatter,
  inputFieldDateFormatter,
} from "@/app/utils/dateFormatter";
import { loadingMsg } from "@/app/utils/message";
import ChargeCard from "@/app/ui/cards/ChargeCard";
const currencyTypes = [
  { id: "INR", name: "Indian Rupee" },
  { id: "UGX", name: "Uganda Shilling" },
  { id: "USD", name: "US Dollar" },
  { id: "EUR", name: "Euro" },
  { id: "GBP", name: "Pound Sterling" },
];
const settlementStatusTypes = [
  { id: 1, name: "ALL" },
  { id: 2, name: "SETTLE" },
  { id: 3, name: "UNSETTLE" },
];
const BodyMapping = ({ data, loading }) => {
  return (
    <tbody>
      {!loading ? (
        <tr>
          <td colSpan={18} className="text-center">
            {loadingMsg("settlement")}
          </td>
        </tr>
      ) : (
        <>
          {data && data.length > 0 ? (
            data.map((item) => (
              <tr key={item.settlementId}>
                <td>{item.settlementId || "NA"}</td>
                <td>{item.payableAmount || "NA"}</td>
                <td>{item.acquirerCode || "NA"}</td>
                <td>{item.currencyCode || "NA"}</td>
                <td>{item.countryCode || "NA"}</td>
                <td>{item.customerName}</td>
                <td>{item.customerEmail || "NA"}</td>
                <td>{item.customerContactNumber || "NA"}</td>
                <td>{item.ordRequestId || "NA"}</td>
                <td>{item.merchantCharge || 0.0}</td>
                <td>{item.pgCharge || 0.0}</td>
                <td>{item.bankCharge || 0.0}</td>
                <td>{item.gstVat || 0.0}</td>
                <td>{item.netSettleAmount || 0.0}</td>
                <td>{dateFormatter(item.createdDate)}</td>
                <td>{item.settlementStatus}</td>
                <td>{item.utr || "NA"}</td>
                <td></td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={18}>No settlement Available</td>
            </tr>
          )}
        </>
      )}
    </tbody>
  );
};
const SettlementList = ({ role, isMerchant }) => {
  const [merchant, setMerchant] = useState({
    id: "",
    name: "Select Merchant",
  });
  const {
    loading: merchantLoading,
    error: merchantError,
    response: merchantResponse = [],
    postData: getAllMerchants,
  } = usePostRequest(endPoints.users.merchantList);
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
  const {
    loading: settlementLoading,
    error: settlementError,
    response: settlementResponse,
    postData: getAllSettlement,
  } = usePostRequest(endPoints.payin.settlement);

  // Filters start here
  const [currentPage, setCurrentPage] = useState(0);
  const [dateRange, setDateRange] = useState({
    dateFrom: dateFormatter(new Date()),
    dateTo: dateFormatter(new Date()),
  });
  const [settlementStatus, setSettlementStatus] = useState(
    settlementStatusTypes[0]
  );
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
  const [currencyType, setCurrencyType] = useState({
    id: currencyTypes[0].id,
    name: currencyTypes[0].name,
  });
  useEffect(() => {
    getAllSettlement(
      queryStringWithDate(
        currentPage,
        process.env.NEXT_PUBLIC_PAGINATION_SIZE,
        "",
        settlementStatus.name,
        dateRange.dateFrom,
        dateRange.dateTo,
        merchant.id,
        currencyType.id,
        "AUTH"
      )
    );
  }, [
    currentPage,
    dateRange.dateFrom,
    dateRange.dateTo,
    merchant.id,
    settlementStatus,
  ]);

  const [loader, setLoader] = useState(false);
  useEffect(() => {
    if (settlementLoading) setLoader(true);
  }, [settlementLoading]);

  if (merchantError || settlementError)
    return <p className="text-center">Error: Failed to fetch data</p>;
  if (merchantResponse)
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
          <div className="col-lg-2 col-md-6 col-sm-12 mb-4">
            <Label htmlFor="currencyType" label="Currency" />
            <Dropdown
              initialLabel="Select Currency"
              selectedValue={currencyType}
              options={currencyTypes}
              onChange={(id, name) => setCurrencyType({ id, name })}
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
              selectedValue={settlementStatus}
              options={settlementStatusTypes}
              onChange={(id, name) => setSettlementStatus({ id, name })}
              id="id"
              value="name"
            />
          </div>
        </div>
        <div className="d-flex row">
          <div className="col-lg-3 col-md-6 col-sm-12 mb-2">
            <ChargeCard type="Total Count" value="0.00" />
          </div>
          <div className="col-lg-3 col-md-6 col-sm-12 mb-2">
            <ChargeCard type="Total Amount" value="10000$" />
          </div>
        </div>
        <Table
          headers={headers}
          currentPage={settlementResponse?.data.pageNumber}
          pageSize={settlementResponse?.data.pageSize}
          totalElement={settlementResponse?.data.totalElement}
          handleNext={handleNext}
          handlePrev={handlePrev}
          link={false}
          search={false}
          downloadUrl={endPoints.transaction.settlementDownload}
          userName={merchant.id}
          dateFrom={dateRange.dateFrom}
          dateTo={dateRange.dateTo}
          status={settlementStatus.name}
          currencyType={currencyType.id}
          merchantName={isMerchant ? "Select Merchant" : merchant.name}
          source="auth_settlement_report"
        >
          <BodyMapping
            data={settlementResponse?.data.data || null}
            loading={loader}
          />
        </Table>
      </div>
    );
};

export default SettlementList;
