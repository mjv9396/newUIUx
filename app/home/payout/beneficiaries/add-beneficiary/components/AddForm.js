"use client";
import Label from "@/app/ui/label/Label";
import usePostRequest from "@/app/hooks/usePost";
import useGetRequest from "@/app/hooks/useFetch";
import { useEffect, useState } from "react";
import { endPoints } from "@/app/services/apiEndpoints";
import { successMsg } from "@/app/services/notify";
import { useRouter } from "next/navigation";
import Dropdown from "@/app/ui/dropdown/Dropdown";
import { queryStringWithKeyword } from "@/app/services/queryString";
import { addBankBeneficiary } from "@/app/formBuilder/payout";
import { validate } from "@/app/validations/forms/AddBeneficiaryFormValidations";

const AddBeneficiaryForm = () => {
  const router = useRouter();

  const { postData, error, response, loading } = usePostRequest(
    endPoints.payout.beneficiary
  );

  // Merchant selection state
  const [selectedMerchant, setSelectedMerchant] = useState({
    id: "",
    name: "Select Merchant",
  });

  // Form json state data
  const [formData, setFormData] = useState(
    addBankBeneficiary(selectedMerchant.id)
  );

  // Currency selection state
  const [currencyTypes, setCurrencyTypes] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState({
    id: "",
    name: "Select Currency",
  });

  // Payment type options
  const paymentTypes = [
    { id: "BANK", name: "Bank Transfer" },
    { id: "UPI", name: "UPI" },
  ];

  // Selected payment type state
  const [selectedPaymentType, setSelectedPaymentType] = useState({
    id: "BANK",
    name: "Bank Transfer",
  });

  // Get merchants API
  const {
    response: merchantResponse,
    postData: getAllMerchants,
    error: merchantError,
  } = usePostRequest(endPoints.users.merchantListOnly);

  // Get merchant currencies API
  const {
    getData,
    response: currencyResponse,
    loading: currencyLoading,
    error: currencyError,
  } = useGetRequest();

  // State to handle errors on form submission
  const [errors, setErrors] = useState({});

  // Load merchants on component mount
  useEffect(() => {
    getAllMerchants(queryStringWithKeyword(0));
  }, []);

  // Fetch currencies when merchant changes
  useEffect(() => {
    if (!selectedMerchant.id) return;
    getData(endPoints.users.mappedCurrency + selectedMerchant.id);
  }, [selectedMerchant]);

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
        handleCurrencyChange(currencyList[0]?.id, currencyList[0]?.name);
      } else {
        handleCurrencyChange("", "Select Currency");
      }
    }
    if (currencyError) {
      setCurrencyTypes([]);
      handleCurrencyChange("", "Select Currency");
    }
  }, [currencyResponse, currencyError]);

  // Handle merchant selection
  const handleMerchantChange = (id, name) => {
    setSelectedMerchant({ id, name });
    setFormData((prev) => ({
      ...prev,
      userId: id,
      currencyId: "",
    }));
    setSelectedCurrency({ id: "", name: "Select Currency" });
  };

  // Handle currency selection
  const handleCurrencyChange = (id, name) => {
    setSelectedCurrency({ id, name });
    setFormData((prev) => ({
      ...prev,
      currencyId: id,
    }));
  };

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({});
  };

  // Handle payment type selection
  const handlePaymentTypeChange = (id, name) => {
    setSelectedPaymentType({ id, name });
    setFormData({
      ...formData,
      paymentType: id,
      accountNumber: "",
      ifscCode: "",
      vpa: "",
    });
    setErrors({});
  };

  // Form validation

  // Form submission
  async function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = await validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      console.log("Validation errors:", validationErrors);
      return;
    }

    // Format the data to match the required structure
    const formattedData = {
      user: { userId: formData.userId },
      currency: { currencyId: formData.currencyId },
      beneficiaryName: formData.beneficiaryName,
      beneficiaryContactNumber: formData.beneficiaryContactNumber,
      beneficiaryEmail: formData.beneficiaryEmail,
      beneficiaryNickName: formData.beneficiaryNickName,
      accountNumber: formData.accountNumber,
      beneficiaryBankName: formData.beneficiaryBankName,
      ifscCode: formData.ifscCode,
      vpa: formData.vpa,
    };

    await postData(formattedData);
  }

  // Handle successful submission
  useEffect(() => {
    if (response && !error) {
      successMsg(response.message || "Beneficiary added successfully");
      setFormData(addBankBeneficiary(selectedMerchant.id));
      setSelectedMerchant({ id: "", name: "Select Merchant" });
      setSelectedCurrency({ id: "", name: "Select Currency" });
    }
  }, [response, error]);

  return (
    <div className="wrapper">
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6 col-sm-12 mb-2">
            <Label htmlFor="merchant" label="Merchant" required={true} />
            <Dropdown
              initialLabel="Select Merchant"
              selectedValue={selectedMerchant}
              options={merchantResponse?.data?.data || []}
              onChange={handleMerchantChange}
              id="userId"
              value="fullName"
            />
            {errors.merchantId && (
              <small className="text-danger">
                <span className="text-danger"> *</span>
                {errors.merchantId}
              </small>
            )}
          </div>
          <div className="col-md-6 col-sm-12 mb-2">
            <Label htmlFor="currency" label="Currency" required={true} />
            <Dropdown
              initialLabel="Select Currency"
              selectedValue={selectedCurrency}
              options={currencyTypes}
              onChange={handleCurrencyChange}
              id="id"
              value="name"
              disabled={!selectedMerchant.id || currencyTypes.length === 0}
            />
            {errors.currencyCode && (
              <small className="text-danger">
                <span className="text-danger"> *</span>
                {errors.currencyCode}
              </small>
            )}
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 col-sm-12 mb-2">
            <Label
              htmlFor="beneficiaryName"
              label="Beneficiary Name"
              required={true}
            />
            <input
              type="text"
              name="beneficiaryName"
              id="beneficiaryName"
              placeholder="Enter Beneficiary Name"
              className="forminput"
              value={formData.beneficiaryName}
              onChange={handleChange}
              autoComplete="off"
            />
            {errors.beneficiaryName && (
              <small className="text-danger">
                <span className="text-danger"> *</span>
                {errors.beneficiaryName}
              </small>
            )}
          </div>
          <div className="col-md-6 col-sm-12 mb-2">
            <Label htmlFor="beneficiaryNickName" label="Nickname" />
            <input
              type="text"
              name="beneficiaryNickName"
              id="beneficiaryNickName"
              placeholder="Enter Nickname"
              className="forminput"
              value={formData.beneficiaryNickName}
              onChange={handleChange}
              autoComplete="off"
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 col-sm-12 mb-2">
            <Label
              htmlFor="beneficiaryContactNumber"
              label="Contact Number"
              required={true}
            />
            <input
              type="text"
              name="beneficiaryContactNumber"
              id="beneficiaryContactNumber"
              placeholder="Enter Contact Number"
              className="forminput"
              value={formData.beneficiaryContactNumber}
              onChange={handleChange}
              autoComplete="off"
            />
            {errors.beneficiaryContactNumber && (
              <small className="text-danger">
                <span className="text-danger"> *</span>
                {errors.beneficiaryContactNumber}
              </small>
            )}
          </div>
          <div className="col-md-6 col-sm-12 mb-2">
            <Label htmlFor="beneficiaryEmail" label="Email" required={true} />
            <input
              type="email"
              name="beneficiaryEmail"
              id="beneficiaryEmail"
              placeholder="Enter Email"
              className="forminput"
              value={formData.beneficiaryEmail}
              onChange={handleChange}
              autoComplete="off"
            />
            {errors.beneficiaryEmail && (
              <small className="text-danger">
                <span className="text-danger"> *</span>
                {errors.beneficiaryEmail}
              </small>
            )}
          </div>
        </div>
        {/* Bank Name Input  */}

        <div className="row">
          <div className="col-md-6 col-sm-12 mb-2">
            <Label
              htmlFor="beneficiaryBankName"
              label="Beneficiary Bank Name"
              required={true}
            />
            <input
              type="text"
              name="beneficiaryBankName"
              id="beneficiaryBankName"
              placeholder="Enter Beneficiary Bank Name"
              className="forminput"
              value={formData.beneficiaryBankName}
              onChange={handleChange}
              autoComplete="off"
            />
            {errors.beneficiaryBankName && (
              <small className="text-danger">
                <span className="text-danger"> *</span>
                {errors.beneficiaryBankName}
              </small>
            )}
          </div>
        </div>

        <div className="row">
          <div className="col-md-12 col-sm-12 mb-2">
            <Label htmlFor="paymentType" label="Payment Type" required={true} />
            <Dropdown
              initialLabel="Select Payment Type"
              selectedValue={selectedPaymentType}
              options={paymentTypes}
              onChange={handlePaymentTypeChange}
              id="id"
              value="name"
            />
          </div>
        </div>

        {/* Conditionally render fields based on payment type */}
        {formData.paymentType === "BANK" && (
          <div className="row">
            <div className="col-md-6 col-sm-12 mb-2">
              <Label
                htmlFor="accountNumber"
                label="Account Number"
                required={true}
              />
              <input
                type="text"
                name="accountNumber"
                id="accountNumber"
                placeholder="Enter Account Number"
                className="forminput"
                value={formData.accountNumber}
                onChange={handleChange}
                autoComplete="off"
              />
              {errors.accountNumber && (
                <small className="text-danger">
                  <span className="text-danger"> *</span>
                  {errors.accountNumber}
                </small>
              )}
            </div>
            <div className="col-md-6 col-sm-12 mb-2">
              <Label htmlFor="ifscCode" label="IFSC Code" required={true} />
              <input
                type="text"
                name="ifscCode"
                id="ifscCode"
                placeholder="Enter IFSC Code"
                className="forminput"
                value={formData.ifscCode}
                onChange={handleChange}
                autoComplete="off"
              />
              {errors.ifscCode && (
                <small className="text-danger">
                  <span className="text-danger"> *</span>
                  {errors.ifscCode}
                </small>
              )}
            </div>
          </div>
        )}

        {formData.paymentType === "UPI" && (
          <div className="row">
            <div className="col-md-12 col-sm-12 mb-2">
              <Label htmlFor="vpa" label="UPI ID / VPA" required={true} />
              <input
                type="text"
                name="vpa"
                id="vpa"
                placeholder="Enter UPI ID (e.g. name@upi)"
                className="forminput"
                value={formData.vpa}
                onChange={handleChange}
                autoComplete="off"
              />
              {errors.vpa && (
                <small className="text-danger">
                  <span className="text-danger"> *</span>
                  {errors.vpa}
                </small>
              )}
            </div>
          </div>
        )}
        <div className="d-flex justify-content-between align-items-center gap-2 mt-1 mb-2">
          <button type="button" className="back" onClick={() => router.back()}>
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
                setFormData(initialBeneficiaryData());
                setSelectedMerchant({ id: "", name: "Select Merchant" });
                setSelectedCurrency({ id: "", name: "Select Currency" });
              }}
            >
              Clear
            </button>
          </span>
        </div>
      </form>
    </div>
  );
};

export default AddBeneficiaryForm;
