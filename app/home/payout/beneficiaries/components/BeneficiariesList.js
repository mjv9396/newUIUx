"use client";
import { useEffect, useState } from "react";
import { endPoints } from "@/app/services/apiEndpoints";
import { headers } from "./Column";
import { queryStringWithKeyword } from "@/app/services/queryString";
import Table from "@/app/ui/table/Table";
import usePostRequest from "@/app/hooks/usePost";
import { dateFormatter } from "@/app/utils/dateFormatter";
import { loadingMsg } from "@/app/utils/message";
import BeneficiaryDetails from "../modal/BeneficiaryDetails";
import { useRouter } from "next/navigation";
import Filters from "@/ui/Filter";
import useGetRequest from "@/app/hooks/useFetch";

const BodyMapping = ({ data = [], loading, merchant }) => {
  const [viewModal, setViewModal] = useState(false);
  const [beneficiaryData, setBeneficiaryData] = useState(null);

  return (
    <>
      {viewModal && (
        <BeneficiaryDetails
          name={merchant}
          onClose={() => setViewModal(!viewModal)}
          data={beneficiaryData}
        />
      )}
      <tbody>
        {!loading ? (
          <tr>
            <td colSpan={8} className="text-center">
              {loadingMsg("beneficiaries")}
            </td>
          </tr>
        ) : (
          <>
            {data && data.length > 0 ? (
              data.map((item) => (
                <tr key={item.beneficiaryId || "NA"}>
                  <td>{item.beneficiaryName || "NA"}</td>
                  <td>{item.beneficiaryNickName || "NA"}</td>
                  <td>{item.beneficiaryContactNumber || "NA"}</td>
                  <td>{item.beneficiaryEmail || "NA"}</td>
                  <td>{item.accountNumber || "NA"}</td>
                  <td>{item.ifscCode || "NA"}</td>
                  <td>{item.vpa || "NA"}</td>
                  {/* <td>
                    <i
                      style={{ cursor: "pointer" }}
                      className="bi bi-person"
                      onClick={() => handleViewBeneficiaryDetail(item)}
                    ></i>
                  </td> */}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8}>No Beneficiaries Available</td>
              </tr>
            )}
          </>
        )}
      </tbody>
    </>
  );
};

const BeneficiariesList = ({ isMerchant, isAdmin, role }) => {
  const router = useRouter();
  const [merchant, setMerchant] = useState({
    id: "",
    name: "All Merchant",
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
    if (role && merchantResponse) {
      setMerchant({
        id: merchantResponse?.data?.data[0]?.userId || "",
        name: merchantResponse?.data?.data[0]?.fullName || "Select Merchant",
      });
    }
  }, [merchantResponse]);

  // Load Beneficiaries API Call
  const {
    loading: beneficiariesLoading,
    error: beneficiariesError,
    response: beneficiariesResponse = [],
    postData: getAllBeneficiaries,
  } = usePostRequest(endPoints.payout.getBeneficiary);

  // Filters start here
  const [currentPage, setCurrentPage] = useState(0);
  const [dateRange, setDateRange] = useState({
    dateFrom: dateFormatter(new Date()),
    dateTo: dateFormatter(new Date()),
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
      ...prev,
      [name]: dateFormatter(value),
    }));
  };

  // Currency state
  const [currencyTypes, setCurrencyTypes] = useState([]);
  const [currency, setCurrency] = useState({
    id: "",
    name: "All Currency",
  });

  // API for getting currencies based on merchant
  const {
    getData,
    response: currencyResponse,
    loading: currencyLoading,
    error: currencyError,
  } = useGetRequest();

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
          name: "All Currency",
        });
      }
    }
    if (currencyError) {
      setCurrencyTypes([]);
      setCurrency({
        id: "",
        name: "All Currency",
      });
    }
  }, [currencyResponse, currencyError]);

  const handleCurrencyChange = (id, name) => {
    setCurrency({ id, name });
  };

  useEffect(() => {
    getAllBeneficiaries({
      currencyCode: currency.id,
      userName: merchant.id,
    });
  }, [merchant.id]);

  const [loader, setLoader] = useState(false);
  useEffect(() => {
    if (beneficiariesLoading) setLoader(true);
  }, [beneficiariesLoading]);

  if (merchantError || beneficiariesError)
    return <p className="text-center">Error: Failed to fetch data</p>;

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
        <Table
          headers={headers}
          currentPage={beneficiariesResponse?.data?.pageNumber}
          pageSize={beneficiariesResponse?.data?.pageSize}
          totalElement={beneficiariesResponse?.data?.totalElement}
          handleNext={handleNext}
          handlePrev={handlePrev}
          link={"/home/payout/beneficiaries/add-beneficiary"}
          search={false}
          download={false}
          userName={merchant.id}
          dateFrom={dateRange.dateFrom}
          dateTo={dateRange.dateTo}
          merchantName={isMerchant ? "Select Merchant" : merchant.name}
          source="beneficiaries_report"
        >
          <BodyMapping
            data={beneficiariesResponse?.data?.data || null}
            loading={loader}
            merchant={merchant.name || ""}
          />
        </Table>
      </div>
    </>
  );
};

export default BeneficiariesList;
