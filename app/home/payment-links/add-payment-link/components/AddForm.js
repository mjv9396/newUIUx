"use client";
import { addPaymentLink } from "@/app/formBuilder/payout";
import useGetRequest from "@/app/hooks/useFetch";
import useMerchant from "@/app/hooks/useMerchant";
import usePostRequest from "@/app/hooks/usePost";
import { endPoints } from "@/app/services/apiEndpoints";
import { successMsg } from "@/app/services/notify";
import { queryStringWithKeyword } from "@/app/services/queryString";
import Dropdown from "@/app/ui/dropdown/Dropdown";
import Label from "@/app/ui/label/Label";
import { dateTimeFormatter } from "@/app/utils/dateFormatter";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
const txnTypes = [
  { id: "SALE", name: "SALE" },
  { id: "AUTH", name: "AUTH" },
];
const AddForm = ({ merchantId, role }) => {
  //   Logic to fetch all mapped currency and countries of merchant
  // handling search keyword
  const [keyword, setKeyword] = useState({ currencyId: "", countryId: "" });
  const handleKeyword = (dropdownKey, keyword) => {
    setKeyword({ ...keyword, [dropdownKey]: keyword });
  };
  const { selectedMerchant, merchantList, handleMerchantChange } =
    useMerchant();
  const { getData: getCountryData, response: countries = [] } = useGetRequest();
  const { getData: getCurrencyData, response: currencies = [] } =
    useGetRequest();
  useEffect(() => {
    if (selectedMerchant.id)
      getCountryData(endPoints.mapping.country + "/" + selectedMerchant.id);
  }, [selectedMerchant.id]);
  useEffect(() => {
    if (selectedMerchant.id)
      getCurrencyData(endPoints.mapping.currency + "/" + selectedMerchant.id);
  }, [selectedMerchant.id]);

  const [country, setCountry] = useState({ id: "", name: "Select Country" });
  const [currency, setCurrency] = useState({ id: "", name: "Select Currency" });

  // End of fetching mapped country and currency
  const [txnType, setTxnType] = useState({
    id: "",
    name: "Select Transaction Type",
  });

  // Form submission
  const formRef = useRef(null);
  const { postData, error, response, loading } = usePostRequest(
    endPoints.paymentLink.paymentLink
  );

  const [formData, setFormData] = useState(addPaymentLink(selectedMerchant));
  const [errors, setErrors] = useState({});

  // handle input change
  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "expDate") {
      setFormData({ ...formData, [name]: dateTimeFormatter(value).toString() });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setErrors({});
  };
  const [notificationToggles, setNotificationToggles] = useState({
    email: false,
    phone: false,
    expiry: false,
  });

  const handleCheckboxChange = (type) => {
    setNotificationToggles((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));

    // Clear the field when unchecked
    if (notificationToggles[type]) {
      handleChange({
        target: {
          name: type,
          value: "",
        },
      });
    }

    if (type === "expiry") {
      setFormData((prev) => ({
        ...prev,
        notifyDate: "",
      }));
    }

    if (type === "email") {
      setFormData((prev) => ({
        ...prev,
        notifyEmail: "",
      }));
    }
    if (type === "phone") {
      setFormData((prev) => ({
        ...prev,
        notifyPhone: "",
      }));
    }
  };
  const handleCountryDropDownChange = (id, name) => {
    setCountry({ id, name });
    setFormData((prev) => ({
      ...prev,
      countryCode: id,
    }));
    setErrors({});
  };
  const handleCurrencyDropDownChange = (id, name) => {
    setCurrency({ id, name });
    setFormData((prev) => ({
      ...prev,
      currencyCode: id,
    }));
    setErrors({});
  };
  async function handleSubmit(event) {
    event.preventDefault();
    // const validationErrors = validate(formData);
    // if (Object.keys(validationErrors).length > 0) {
    //   setErrors(validationErrors);
    //   return;
    // }
    await postData(formData);
  }

  const [generatedLink, setGeneratedLink] = useState("");

  useEffect(() => {
    if (response && !error) {
      if (response.data.status === "success") {
        setFormData(addPaymentLink(selectedMerchant));
        setTxnType({ id: "", name: "Select Transaction Type" });
        setCountry({ id: "", name: "Select State" });
        setCurrency({ id: "", name: "Select Currency" });

        setGeneratedLink(response?.data?.data?.paymentLinkUrl);
        successMsg("Payment link created successfully");

        formRef.current.reset();
      }
    }
  }, [response, error]);

  function convertFormatWithMoment(comingFormat) {
    const momentObj = moment(comingFormat, "DD MMM YYYY hh:mm:ss a");
    if (momentObj.isValid()) {
      // Subtract 24 hours (1 day)
      // momentObj.subtract(1, "day");
      return momentObj.format("YYYY-MM-DDTHH:mm");
    } else {
      return "Invalid Date Format";
    }
  }

  useEffect(() => {
    if (selectedMerchant.id) {
      setFormData((prev) => ({
        ...prev,
        merchantId: selectedMerchant.id,
      }));
    }
  }, [selectedMerchant.id]);

  if (countries && currencies) {
    return (
      <div className="wrapper">
        <form onSubmit={handleSubmit} ref={formRef}>
          <div className="row">
            {role && (
              <div className="col-md-6 col-sm-12 mb-2">
                <Label
                  htmlFor="merchant"
                  label="Select Merchant"
                  required={true}
                />
                <Dropdown
                  initialLabel="Select Merchant"
                  selectedValue={selectedMerchant}
                  options={merchantList?.data?.data}
                  onChange={handleMerchantChange}
                  id="userId"
                  value="fullName"
                />
                {errors.merchant && (
                  <small className="text-danger">
                    <span className="text-danger"> *</span>
                    {errors.merchant}
                  </small>
                )}
              </div>
            )}
            <div className="col-md-6 col-sm-12 mb-2">
              <Label
                htmlFor="txnType"
                label="Select Transaction Type"
                required={true}
              />
              <Dropdown
                initialLabel="Select Transaction Type"
                selectedValue={txnType}
                options={txnTypes}
                onChange={(id, name) => {
                  setTxnType({ id, name });
                  setGeneratedLink("");
                  setFormData((prev) => ({
                    ...prev,
                    txnType: name,
                  }));

                }}
                id="id"
                value="name"
              />
              {errors.txnTypes && (
                <small className="text-danger">
                  <span className="text-danger"> *</span>
                  {errors.txnTypes}
                </small>
              )}
            </div>
            <div className="col-md-6 col-sm-12 mb-2">
              <Label htmlFor="country" label="Country" required={true} />
              <Dropdown
                initialLabel="Select Country"
                selectedValue={country}
                options={countries?.data}
                onChange={handleCountryDropDownChange}
                id="countryCode"
                value="countryName"
                search={true}
                onSearch={handleKeyword}
              />
              {errors.country && (
                <small className="text-danger">
                  <span className="text-danger"> *</span>
                  {errors.country}
                </small>
              )}
            </div>
            <div className="col-md-6 col-sm-12 mb-2">
              <Label htmlFor="currency" label="Currency" required={true} />
              <Dropdown
                initialLabel="Select Currency"
                selectedValue={currency}
                options={currencies?.data}
                onChange={handleCurrencyDropDownChange}
                id="currencyCode"
                value="currencyName"
                search={true}
                onSearch={handleKeyword}
              />
              {errors.currency && (
                <small className="text-danger">
                  <span className="text-danger"> *</span>
                  {errors.currency}
                </small>
              )}
            </div>
            <div className="col-md-6 col-sm-12 mb-2">
              <Label
                htmlFor="payableAmount"
                label="Payable Amount"
                required={true}
              />
              <input
                type="text"
                name="payableAmount"
                id="payableAmount"
                placeholder="Enter payable amount"
                className="forminput"
                onChange={handleChange}
              />
              {errors.payableAmount && (
                <small className="text-danger">
                  <span className="text-danger"> *</span>
                  {errors.payableAmount}
                </small>
              )}
            </div>
            <div className="col-md-6 col-sm-12 mb-2">
              <Label
                htmlFor="ordRequestId"
                label="Order Request ID"
                required={true}
              />
              <input
                type="text"
                name="ordRequestId"
                id="ordRequestId"
                placeholder="Enter payment type code"
                className="forminput"
                onChange={handleChange}
              />
              {errors.ordRequestId && (
                <small className="text-danger">
                  <span className="text-danger"> *</span>
                  {errors.ordRequestId}
                </small>
              )}
            </div>
            <div className="col-md-6 col-sm-12 mb-2">
              <Label
                htmlFor="customerName"
                label="Customer Name"
                required={true}
              />
              <input
                type="text"
                name="customerName"
                id="customerName"
                placeholder="Enter customer name"
                className="forminput"
                onChange={handleChange}
              />
              {errors.customerName && (
                <small className="text-danger">
                  <span className="text-danger"> *</span>
                  {errors.customerName}
                </small>
              )}
            </div>{" "}
            <div className="col-md-6 col-sm-12 mb-2">
              <Label
                htmlFor="customerEmailId"
                label="Customer Email ID"
                required={true}
              />
              <input
                type="text"
                name="customerEmailId"
                id="customerEmailId"
                placeholder="Enter customer email id"
                className="forminput"
                onChange={handleChange}
              />
              {errors.customerEmailId && (
                <small className="text-danger">
                  <span className="text-danger"> *</span>
                  {errors.customerEmailId}
                </small>
              )}
            </div>{" "}
            <div className="col-md-6 col-sm-12 mb-2">
              <Label
                htmlFor="customerContactNumber"
                label="Customer Contact Number"
                required={true}
              />
              <input
                type="text"
                name="customerContactNumber"
                id="customerContactNumber"
                placeholder="Enter customer contact number"
                className="forminput"
                onChange={handleChange}
              />
              {errors.customerContactNumber && (
                <small className="text-danger">
                  <span className="text-danger"> *</span>
                  {errors.customerContactNumber}
                </small>
              )}
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 col-sm-12 mb-2">
              <span className="d-flex gap-1 mb-2">
                <input
                  type="checkbox"
                  checked={notificationToggles.email}
                  onChange={() => handleCheckboxChange("email")}
                  style={{ width: "18px", height: "18px" }}
                />
                <Label htmlFor="notifyViaEmail" label="Notify via Email" />
              </span>
              {notificationToggles.email && (
                <>
                  <input
                    type="email"
                    name="notifyEmail"
                    id="notifyEmail"
                    value={formData.notifyEmail || ""}
                    onChange={handleChange}
                    className="forminput"
                    placeholder="Enter email address"
                  />
                  {errors.email && (
                    <small className="text-danger">
                      <span className="text-danger"> *</span>
                      {errors.email}
                    </small>
                  )}
                </>
              )}
            </div>
            {/* Phone Notification */}
            <div className="col-md-6 col-sm-12 mb-2">
              <span className="d-flex gap-1 mb-2">
                <input
                  type="checkbox"
                  checked={notificationToggles.phone}
                  onChange={() => handleCheckboxChange("phone")}
                  style={{ width: "18px", height: "18px" }}
                />
                <Label htmlFor="notifyViaPhone" label="Notify via Phone" />
              </span>
              {notificationToggles.phone && (
                <>
                  <input
                    type="tel"
                    name="notifyPhone"
                    id="notifyPhone"
                    value={formData.notifyPhone || ""}
                    onChange={handleChange}
                    className="forminput"
                    placeholder="Enter phone number"
                  />
                  {errors.phone && (
                    <small className="text-danger">
                      <span className="text-danger"> *</span>
                      {errors.phone}
                    </small>
                  )}
                </>
              )}
            </div>
            {/* Link Expiry */}
            <div className="col-md-6 col-sm-12 mb-2">
              <span className="d-flex gap-1 mb-2">
                <input
                  type="checkbox"
                  checked={notificationToggles.expiry}
                  onChange={() => handleCheckboxChange("expiry")}
                  style={{ width: "18px", height: "18px" }}
                />
                <Label htmlFor="linkExpiry" label="Link Expiry" />
              </span>
              {notificationToggles.expiry && (
                <>
                  <input
                    type="datetime-local"
                    name="expDate"
                    id="expDate"
                    value={
                      formData.expDate
                        ? convertFormatWithMoment(formData.expDate)
                        : ""
                    }
                    onChange={handleChange}
                    className="forminput"
                    min={new Date().toISOString().slice(0, 16)} // Format: YYYY-MM-DDTHH:MM
                  />
                  {errors.expiry && (
                    <small className="text-danger">
                      <span className="text-danger"> *</span>
                      {errors.expiry}
                    </small>
                  )}
                </>
              )}
            </div>
          </div>
          {generatedLink && (
            <>
              <h6 className="text-left mt-3">Generated Payment Link</h6>
              <p className="text-left">
                <a
                  href={generatedLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-success"
                  style={{ wordBreak: "break-all", wordWrap: "break-word" }}
                >
                  {generatedLink}
                </a>
              </p>
            </>
          )}
          <div className="d-flex justify-content-between gap-2 mt-2 mb-2">
            <button
              type="button"
              className="back"
              onClick={() => router.back()}
            >
              Back
            </button>
            <span className="d-flex gap-2">
              <button
                type={loading ? "button" : "submit"}
                className="submit"
                disabled={loading}
              >
                {loading ? "Please Wait..." : "Submit"}
              </button>
              <button
                type="reset"
                className="reset"
                onClick={() => {
                  setErrors({});
                  setFormData(add);
                  setCountry({ id: "", name: "Select Country" });
                  setCurrency({ id: "", name: "Select Currency" });
                }}
              >
                Clear
              </button>
            </span>
          </div>
        </form>
      </div>
    );
  }
};

export default AddForm;
