"use client";
import Table from "@/app/ui/table/Table";
import React, { useEffect, useState } from "react";
import { data, headers } from "./Column";
import {
  dateFormatter,
  inputFieldDateFormatter,
} from "@/app/utils/dateFormatter";
import { queryStringWithKeyword } from "@/app/services/queryString";
import usePostRequest from "@/app/hooks/usePost";
import { endPoints } from "@/app/services/apiEndpoints";
import Label from "@/app/ui/label/Label";
import Dropdown from "@/app/ui/dropdown/Dropdown";
import { loadingMsg } from "@/app/utils/message";
const currencyTypes = [
  { id: "UGX", name: "Uganda Shilling" },
  { id: "USD", name: "US Dollar" },
  { id: "EUR", name: "Euro" },
  { id: "GBP", name: "Pound Sterling" },
  { id: "INR", name: "Indian Rupee" },
];

const paymentStatusTypes = [
  { id: 1, name: "Pending" },
  { id: 2, name: "Success" },
  { id: 3, name: "Failed" },
];
const BodyMapping = ({ data = [], loading = true }) => {
  return (
    <tbody>
      {!loading ? (
        <tr>
          <td colSpan={8} className="text-center">
            {loadingMsg("charge back")}
          </td>
        </tr>
      ) : (
        <>
          {data && data.length > 0 ? (
            data.map((item) => (
              <tr key={item.chargebackId}>
                <td>{item.chargebackId || "NA"}</td>
                <td>{item.transactionId || "NA"}</td>
                <td>{item.chargebackAmount || "NA"}</td>
                <td>{item.chargebackDate || "NA"}</td>
                <td>{item.merchantName || "NA"}</td>
                <td>{item.paymentMethod || "NA"}</td>
                <td>{item.chargebackStatus || "NA"}</td>
                <td>{item.chargebackFee || "NA"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={9}>No data Available</td>
            </tr>
          )}
        </>
      )}
    </tbody>
  );
};
const ChargeBackList = ({ role, isMerchant }) => {
  const [keyword, setKeyword] = useState({ userId: "" });
  const handleKeyword = (dropdownKey, keyword) => {
    setKeyword({ ...keyword, [dropdownKey]: keyword });
  };
  const [merchant, setMerchant] = useState({
    id: "",
    name: "All",
  });
  const {
    response: merchantResponse = [],
    postData: getAllMerchants,
    error: merchantError,
    loading: merchantLoading,
  } = usePostRequest(endPoints.users.merchantList);
  const handleChangeMerchant = async (id, name) => {
    setMerchant({ id, name });
  };

  useEffect(() => {
    getAllMerchants(
      queryStringWithKeyword(
        0,
        process.env.NEXT_PUBLIC_PAGINATION_SIZE,
        keyword.userId
      )
    );
  }, [keyword.userId]);
  // end of merchant fetch logic
  useEffect(() => {
    if (role && merchantResponse && !merchantError) {
      setMerchant({
        id: merchantResponse?.data?.data[0]?.userId || "",
        name: merchantResponse?.data?.data[0]?.fullName || "Select Merchant",
      });
    }
  }, [merchantError, merchantResponse]);

  const [paymentStatus, setPaymentStatus] = useState({
    id: "1",
    name: "Pending",
  });
  const [currencyType, setCurrencyType] = useState({
    id: "",
    name: "Select Currency",
  });

  const [currentPage, setCurrentPage] = useState(0);
  const [loader, setLoader] = useState(false);

  const handlePrev = () => {
    setCurrentPage((prev) => prev - 1);
  };
  const handleNext = () => {
    setCurrentPage((prev) => prev + 1);
  };
  const [dateRange, setDateRange] = useState({
    dateFrom: dateFormatter(new Date()),
    dateTo: dateFormatter(new Date()),
  });

  const handleDateChange = (event) => {
    const { name, value } = event.target;
    setDateRange((prev) => ({
      ...prev, // Spread the previous state
      [name]: dateFormatter(value), // Update the specific property
    }));
  };
  return (
    <div className="wrapper">
      <div className="row">
        {role && (
          <div className="col-md-2 col-sm-12 mb-4">
            <>
              <Label htmlFor="merchant" label="Merchant" />
              <Dropdown
                initialLabel="Select Merchant"
                selectedValue={merchant}
                options={merchantResponse?.data.data}
                onChange={handleChangeMerchant}
                id="userId"
                value="fullName"
                search={true}
                onSearch={handleKeyword}
              />
            </>
          </div>
        )}

        <div className="col-md-2 col-sm-12 mb-4">
          <Label htmlFor="paymentStatus" label="Payment Status" />
          <Dropdown
            initialLabel="Select Payment Status"
            selectedValue={paymentStatus}
            options={paymentStatusTypes}
            onChange={(id, name) => setPaymentStatus({ id, name })}
            id="id"
            value="name"
          />
        </div>
        <div className="col-md-2 col-sm-12 mb-4">
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
        <div className="col-md-2 col-sm-12 mb-4">
          <Label htmlFor="dateFrom" label="Date From" />
          <input
            type="date"
            id="inputDate"
            name="dateFrom"
            onChange={handleDateChange}
            value={inputFieldDateFormatter(dateRange.dateFrom)}
          />
        </div>
        <div className="col-md-2 col-sm-12 mb-4">
          <Label htmlFor="dateTo" label="Date To" />
          <input
            type="date"
            id="inputDate"
            name="dateTo"
            onChange={handleDateChange}
            value={inputFieldDateFormatter(dateRange.dateTo)}
          />
        </div>
      </div>
      <Table
        headers={headers}
        currentPage={0}
        totalPages={1}
        pageSize={3}
        totalElement={3}
        handleNext={handleNext}
        handlePrev={handlePrev}
        link={false}
        search={false}
        userName={merchant.id}
        dateFrom={dateRange.dateFrom}
        dateTo={dateRange.dateTo}
        currencyCode={currencyType.id !== ''? currencyType.id : "Please Select Currency"}
        status={paymentStatus.id}
        merchantName={isMerchant ? "Select Merchant" : merchant.name}
        >
        <BodyMapping data={data || null} />
      </Table>
    </div>
  );
};

export default ChargeBackList;
