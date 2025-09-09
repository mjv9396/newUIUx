import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import styles from "../../styles/fraudPrevention/FraudPrevention.module.css";
import useFetch from "../../hooks/useFetch";
import { endpoints } from "../../services/apiEndpoints";
import BlockIPAddress from "./components/BlockIPAddress";
import BlockIssuerCountry from "./components/BlockIssuerCountry";
import BlockCardNumber from "./components/BlockCardNumber";
import BlockCurrency from "./components/BlockCurrency";
import BlockCallbackUrl from "./components/BlockCallbackUrl";
import BlockPaymentTypes from "./components/BlockPaymentTypes";
import BlockCustomerCountry from "./components/BlockCustomerCountry";
import BlockDomainUrl from "./components/BlockDomainUrl";
import BlockCustomerName from "./components/BlockCustomerName";
import BlockReturnUrl from "./components/BlockReturnUrl";
import BlockMOP from "./components/BlockMOP";
import BlockCardRange from "./components/BlockCardRange";
import BlockProdDesc from "./components/BlockProdDesc";
import BlockVPAAddr from "./components/BlockVPAAddr";
import BlockEmailAddr from "./components/BlockEmailAddr";
import BlockCustomerPhn from "./components/BlockCustomerPhn";
import BlockAmountLimit from "./components/BlockAmountLimit";
import Filters from "../../ui/Filter";
import { isAdmin, isMerchant } from "../../services/cookieStore";

const FraudPrevention = () => {
  //fetch merchant, acquirer, payment type, mop type and  curreny
  const { fetchData: getAllMerchant, data: allMerchant } = useFetch();

  useEffect(() => {
    getAllMerchant(endpoints.user.userList);
  }, []);
  const [selectedMerchant, setSelectedMerchant] = useState();
  const { fetchData: getAllTypes, data: allTypes } = useFetch();
  const handleChange = async (e) => {
    setSelectedMerchant(e);
    await getAllTypes(endpoints.fraud.allTypes);
  };

  const [active, setActive] = useState("IP_ADDRESS");
  const handleTab = (id) => {
    setActive(id);
  };

  useEffect(() => {
    if (isMerchant() && allMerchant) {
      const merchantId = allMerchant?.data?.find(
        (item) => item.userId === allMerchant?.data[0]?.userId
      )?.userId;
      setSelectedMerchant(merchantId);
      getAllTypes(endpoints.fraud.allTypes);
    }
  }, [allMerchant]);

  if (isAdmin ? allMerchant : selectedMerchant)
    return (
      <DashboardLayout
        page="Fraud Prevention"
        url="/dashboard/fraud-prevention"
      >
        <div className="d-flex flex-wrap gap-3 align-items-center justify-content-end mt-3">
          <Filters
            handleMerchantChange={handleChange}
            selectedMerchant={{
              id: selectedMerchant,
              name:
                (allMerchant?.data?.find(
                  (item) => item.userId === selectedMerchant
                )?.firstName ?? "Select") +
                " " +
                (allMerchant?.data?.find(
                  (item) => item.userId === selectedMerchant
                )?.lastName ?? "Merchant"),
            }}
            isMerchantDisabled={isMerchant()}
            merchantOptions={allMerchant?.data}
            isCurrencyDisabled
          />
         
        </div>
        {allTypes && (
          <div className={styles.listing}>
            <div className="row">
              <div
                className="col-md-3 col-sm-12 mb-3"
                style={{ maxHeight: "50vh", overflow: "auto" }}
              >
                {allTypes.data.length > 0 &&
                  allTypes.data.map((type) => (
                    <button
                      className={
                        active === type.value
                          ? styles.typeButton + " " + styles.active
                          : styles.typeButton
                      }
                      key={type.value}
                      onClick={() => handleTab(type.value)}
                    >
                      {type.name}
                    </button>
                  ))}
              </div>
              <div className="col-md-9 col-sm-12 mb-3">
                {active === "IP_ADDRESS" && (
                  <BlockIPAddress type="IP_ADDRESS" userId={selectedMerchant} />
                )}
                {active === "ISSUER_COUNTRY" && (
                  <BlockIssuerCountry
                    type="ISSUER_COUNTRY"
                    userId={selectedMerchant}
                  />
                )}
                {active === "CARD_NUMBER" && (
                  <BlockCardNumber
                    type="CARD_NUMBER"
                    userId={selectedMerchant}
                  />
                )}
                {active === "CURRENCY" && (
                  <BlockCurrency type="CURRENCY" userId={selectedMerchant} />
                )}
                {active === "CALLBACK_URL" && (
                  <BlockCallbackUrl
                    type="CALLBACK_URL"
                    userId={selectedMerchant}
                  />
                )}
                {active === "PAYMENT_TYPES" && (
                  <BlockPaymentTypes
                    type="PAYMENT_TYPES"
                    userId={selectedMerchant}
                  />
                )}
                {active === "CUSTOMER_COUNTRY" && (
                  <BlockCustomerCountry
                    type="CUSTOMER_COUNTRY"
                    userId={selectedMerchant}
                  />
                )}
                {active === "DOMAIN_URL" && (
                  <BlockDomainUrl type="DOMAIN_URL" userId={selectedMerchant} />
                )}
                {active === "CUSTOMER_NAME" && (
                  <BlockCustomerName
                    type="CUSTOMER_NAME"
                    userId={selectedMerchant}
                  />
                )}
                {active === "RETURN_URL" && (
                  <BlockReturnUrl type="RETURN_URL" userId={selectedMerchant} />
                )}
                {active === "MODE_OF_PAYMENT" && (
                  <BlockMOP type="MODE_OF_PAYMENT" userId={selectedMerchant} />
                )}
                {active === "CARD_RANGE" && (
                  <BlockCardRange type="CARD_RANGE" userId={selectedMerchant} />
                )}
                {active === "PRODUCT_DESC" && (
                  <BlockProdDesc
                    type="PRODUCT_DESC"
                    userId={selectedMerchant}
                  />
                )}
                {active === "VPA_ADDRESS" && (
                  <BlockVPAAddr type="VPA_ADDRESS" userId={selectedMerchant} />
                )}
                {active === "EMAIL_ADDRESS" && (
                  <BlockEmailAddr
                    type="EMAIL_ADDRESS"
                    userId={selectedMerchant}
                  />
                )}
                {active === "CUSTOMER_PHONE" && (
                  <BlockCustomerPhn
                    type="CUSTOMER_PHONE"
                    userId={selectedMerchant}
                  />
                )}
                {active === "AMOUNT_LIMIT" && (
                  <BlockAmountLimit
                    type="AMOUNT_LIMIT"
                    userId={selectedMerchant}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </DashboardLayout>
    );
};

export default FraudPrevention;
