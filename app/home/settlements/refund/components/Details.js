"use client";
import Table from "@/app/ui/table/Table";
import { useEffect, useState } from "react";
import { data, headers } from "./Column";
import usePostRequest from "@/app/hooks/usePost";
import { endPoints } from "@/app/services/apiEndpoints";
import {
  dateFormatter,
  inputFieldDateFormatter,
} from "@/app/utils/dateFormatter";
import Label from "@/app/ui/label/Label";
import Dropdown from "@/app/ui/dropdown/Dropdown";
import { queryStringWithKeyword } from "@/app/services/queryString";
const currencyTypes = [
  { id: "INR", name: "Indian Rupee" },
  { id: "UGX", name: "Uganda Shilling" },
  { id: "USD", name: "US Dollar" },
  { id: "EUR", name: "Euro" },
  { id: "GBP", name: "Pound Sterling" },
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
          <td colSpan={13} className="text-center">
            {/* {loadingMsg("country")} */}
          </td>
        </tr>
      ) : (
        <>
          {data && data.length > 0 ? (
            data.map((item) => (
              <tr key={item.refundID}>
                <td>{item.refundID || "NA"}</td>
                <td>{item.transactionId || "NA"}</td>
                <td>{item.refundDate || "NA"}</td>
                <td>{item.refundAmount || "NA"}</td>
                <td>{item.currency || "NA"}</td>
                <td>{item.refundStatus || "NA"}</td>
                <td>{item.refundType || "NA"}</td>
                <td>{item.cardDigits || "NA"}</td>
                <td>{item.customerName || "NA"}</td>
                <td>{item.customerPhone || "NA"}</td>
                <td>{item.bankName || "NA"}</td>
                <td>{item.refundSource || "NA"}</td>
                <td>{item.refundFee || "NA"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={13} className="text-center">
                No data Available
              </td>
            </tr>
          )}
        </>
      )}
    </tbody>
  );
};
const Details = (role) => {
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
    if (merchantResponse && !merchantError && role) {
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
    id: currencyTypes[0].id,
    name: currencyTypes[0].name,
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
            max={new Date().toISOString().split("T")[0]}
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
            max={new Date().toISOString().split("T")[0]}
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
        download={true}
        search={false}
      >
        <BodyMapping data={null} />
      </Table>
    </div>
  );
};

export default Details;
