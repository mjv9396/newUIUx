"use client";
import { useEffect, useState } from "react";
import { endPoints } from "@/app/services/apiEndpoints";
import { queryStringWithKeyword } from "@/app/services/queryString";
import usePostRequest from "@/app/hooks/usePost";
import useGetRequest from "@/app/hooks/useFetch";
import { loadingMsg } from "@/app/utils/message";
import { dateFormatter } from "@/app/utils/dateFormatter";
import WalletCard from "./WalletCard";
import styles from "./WalletCard.module.css";
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
          {Object.keys(data) && Object.keys(data).length > 0 ? (
            <>
              {Object.entries(data)?.map(([key, wallets]) => (
                <tr key={key} className="wallet-row">
                  <td colSpan={9}>
                    <div className="p-3">
                      <h6 className="mb-0">{key}</h6>
                      <small className="">id: {wallets[0].user.userId}</small>
                      <div className="d-flex flex-wrap gap-3 my-2">
                        {wallets?.map((item, index) => (
                          <WalletCard
                            key={index}
                            wallet={{
                              walletId: item.userAccountId,
                              currency: item.currency?.currencyCode,
                              balance: item.amountBalance,
                              lastUpdated: item.lastModifiedDate,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </>
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

const UserAccountsList = ({ isMerchant, isAdmin, role, isSubMerchant }) => {
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

  // API call
  const { loading, error, response, postData } = usePostRequest(
    endPoints.payout.getUserAccounts
  );

  // Get merchant list on initial load
  useEffect(() => {
    getAllMerchants(queryStringWithKeyword(0));
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
    // if (!merchant.id) return;

    const requestBody = {
      userName: merchant.id || "",
      currencyCode: currency.id || "",
    };

    postData(requestBody);
  }, [currentPage, merchant.id, currency.id]);

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
    // You could add a search feature that filters client-side or calls the API
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
        <div className={styles.table} />

        <BodyMapping data={response?.data?.data || []} loading={loading} />
      </div>
    </>
  );
};

export default UserAccountsList;
