"use client";
import { headers } from "./Columns";
import { useEffect, useState } from "react";
import { endPoints } from "@/app/services/apiEndpoints";
import Table from "@/app/ui/table/Table";
import { queryStringWithKeyword } from "@/app/services/queryString";
import usePostRequest from "@/app/hooks/usePost";
import useGetRequest from "@/app/hooks/useFetch";
import { loadingMsg } from "@/app/utils/message";
import { dateFormatter } from "@/app/utils/dateFormatter";
import Filters from "@/ui/Filter";

const BodyMapping = ({ data = [], loading }) => {
  return (
    <tbody>
      {loading ? (
        <tr>
          <td colSpan={9} className="text-center">
            {loadingMsg("merchant")}
          </td>
        </tr>
      ) : (
        <>
          {data && data.length > 0 ? (
            data.map((item) => (
              <tr key={item.userAccountId}>
                <td>{item?.userAccount?.user?.fullName || "NA"}</td>
                <td>{item?.createdDate || "NA"}</td>
                <td>
                  {item.currency.currencyName} ({item.currency.currencyCode})
                </td>
                <td>{item.previousBalance || "0.0"}</td>
                <td>{item.amount || "0.0"}</td>
                <td>{item.updatedBalance || "0.0"}</td>
                <td>{item.transactionTypes || "CREDIT"}</td>
                <td>{item.remark || "NA"}</td>
                <td>{item.receiptId || "NA"}</td>
                <td>
                  {item.image ? (
                    <i
                      className="bi bi-file-earmark-image text-info"
                      title="View Image"
                    ></i>
                  ) : (
                    "NA"
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={9} className="text-center">
                No Data Available
              </td>
            </tr>
          )}
        </>
      )}
    </tbody>
  );
};

const LoadMoneyList = ({ isMerchant, isAdmin, role, isSubMerchant }) => {
  const [currentPage, setCurrentPage] = useState(0);

  // Merchant state
  const [merchant, setMerchant] = useState({
    id: "",
    name: "Select Merchant",
  });

  // Currency state
  const [currencyTypes, setCurrencyTypes] = useState([]);
  const [currency, setCurrency] = useState({
    id: "",
    name: "Select Currency",
  });

  // Date range state
  const [dateRange, setDateRange] = useState({
    dateFrom: dateFormatter(
      new Date(
        new Date().setFullYear(new Date().getFullYear() - 1)
      ).toISOString()
    ), // 1 year ago
    dateTo: dateFormatter(new Date().toISOString()), // Current date
  });

  // API call for merchant dropdown
  const {
    loading: merchantLoading,
    error: merchantError,
    response: merchantResponse,
    postData: getAllMerchants,
  } = usePostRequest(endPoints.users.merchantListOnly);

  // API for getting currencies based on merchant
  const {
    getData,
    response: currencyResponse,
    loading: currencyLoading,
    error: currencyError,
  } = useGetRequest();

  // API call for load money data
  const { loading, error, response, postData } = usePostRequest(
    endPoints.payout.loadMoney
  );

  // Get merchant list on initial load
  useEffect(() => {
    getAllMerchants(
      queryStringWithKeyword(
        currentPage,
        process.env.NEXT_PUBLIC_PAGINATION_SIZE,
        keyword
      )
    );
  }, []);

  // setInitial Merchant
  useEffect(() => {
    if (merchantResponse && isAdmin) {
      setMerchant({
        id: "",
        name: "All Merchant",
      });
    }
  }, [merchantResponse]);

  // Fetch currencies when merchant changes
  useEffect(() => {
    if (!merchant.id) return;
    getData(endPoints.users.mappedCurrency + merchant.id);
  }, [merchant]);

  // Handle currency response
  useEffect(() => {
    if (currencyResponse) {
      const data = currencyResponse?.data;

      const currencyList = data?.map((item) => ({
        id: item?.currencyId,
        name: item?.currencyName,
      }));
      setCurrencyTypes(currencyList);

      if (currencyList?.length > 0) {
        setCurrency({
          id: currencyList[0]?.id,
          name: currencyList[0]?.name,
        });
      } else {
        setCurrency({
          id: "",
          name: "Select Currency",
        });
      }
    }
    if (currencyError) {
      setCurrencyTypes([]);
      setCurrency({
        id: "",
        name: "Select Currency",
      });
    }
  }, [currencyResponse, currencyError]);

  // Fetch load money data based on filters
  useEffect(() => {
    const requestBody = {
      userName: merchant.id,
      currencyCode: currency.id || "",
      dateFrom: dateRange.dateFrom,
      dateTo: dateRange.dateTo,
      pageNumber: currentPage,
      pageSize: process.env.NEXT_PUBLIC_PAGINATION_SIZE || 25,
    };

    postData(requestBody);
  }, [
    currentPage,
    merchant.id,
    currency.id,
    dateRange.dateFrom,
    dateRange.dateTo,
  ]);

  const handlePrev = () => {
    setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const handleMerchantChange = (id, name) => {
    setMerchant({ id, name });
    setCurrency({ id: "", name: "Select Currency" });
  };

  const handleCurrencyChange = (id, name) => {
    setCurrency({ id, name });
  };

  const handleDateChange = (event) => {
    const { name, value } = event.target;
    setDateRange((prev) => ({
      ...prev,
      [name]: dateFormatter(value),
    }));
  };

  // handling search keyword
  const [keyword, setKeyword] = useState("");
  const handleKeyword = (e) => {
    setKeyword(e.target.value);
  };

  return (
    <>
      <Filters
        role={role}
        isSubMerchant={isMerchant}
        selectedMerchant={merchant}
        merchantOptions={merchantResponse?.data.data}
        handleMerchantChange={handleMerchantChange}
        selectedCurrency={currency}
        currencyOptions={currencyTypes}
        handleCurrencyChange={handleCurrencyChange}
        isMerchantDisabled={role}
        isStatusDisabled={true}
        handleDateRangeChange={handleDateChange}
        selectedDateRange={dateRange}
        setDateRange={setDateRange}
      />
      <div className="wrapper">
        <div />

        <Table
          headers={headers}
          currentPage={response?.data?.pageNumber || 0}
          pageSize={response?.data?.pageSize || 10}
          totalElement={response?.data?.totalElement || 0}
          handleNext={handleNext}
          handlePrev={handlePrev}
          link="/home/payout/loadMoney/add-load-money"
          download={false}
          search={false}
          onChange={handleKeyword}
        >
          <BodyMapping data={response?.data?.data || []} loading={loading} />
        </Table>
      </div>
    </>
  );
};

export default LoadMoneyList;
