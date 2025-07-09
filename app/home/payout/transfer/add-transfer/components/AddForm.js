"use client";
import Label from "@/app/ui/label/Label";
import { useEffect, useState } from "react";
import { addSinglePayout } from "@/app/formBuilder/payout";
import Single from "./Single";
import usePostRequest from "@/app/hooks/usePost";
import { endPoints } from "@/app/services/apiEndpoints";

const AddForm = () => {
  const { postData, error, response, loading } = usePostRequest(
    endPoints.payout.singlePayout
  );

  // Form json state data with initial values
  const [formData, setFormData] = useState({
    ...addSinglePayout(),
  });

  // Form validation
  const validate = async (data) => {
    let validationErrors = {};

    if (!data.appKey) {
      validationErrors.merchantId = "Merchant is required";
    }

    if (!data.currencyCode) {
      validationErrors.currencyCode = "Currency is required";
    }
    if (!data.countryCode) {
      validationErrors.countryCode = "Country is required";
    }
    if (!data.transferMode) {
      validationErrors.transferMode = "Transfer mode is required";
    }

    if (!data.orderId) {
      validationErrors.orderId = "Order ID is required";
    }

    if (!data.amount) {
      validationErrors.amount = "Amount is required";
    } else if (isNaN(data.amount) || parseFloat(data.amount) <= 0) {
      validationErrors.amount = "Please enter a valid amount";
    }
    if (!data.contactNumber) {
      validationErrors.contactNumber = "Contact number is required";
    } else if (!/^\d{10}$/.test(data.contactNumber)) {
      validationErrors.contactNumber = "Contact number must be 10 digits";
    }
    if (!data.email) {
      validationErrors.email = "Email is required";
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(data.email)
    ) {
      validationErrors.email = "Email is not valid";
    }

    if (!data.beneficiaryAccount) {
      validationErrors.beneficiaryAccount = "Beneficiary account is required";
    } else if (
      isNaN(data.beneficiaryAccount) ||
      parseFloat(data.beneficiaryAccount) <= 0
    ) {
      validationErrors.beneficiaryAccount =
        "Please enter a valid account number";
    }

    // Single transfer specific validation is handled within the SingleTransfer component
    // Bulk transfer specific validation is handled within the BulkTransfer component

    return validationErrors;
  };

  // State to handle errors on form submission
  const [errors, setErrors] = useState({});

  // Form submission
  async function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = await validate(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    // Create data to send
    const dataToSend = {
      appKey: formData.appKey,
      amount: formData.amount,
      countryCode: formData.countryCode,
      currencyCode: formData.currencyCode,
      transferMode: formData.transferMode,
      orderId: formData.orderId,
      contactNumber: formData.contactNumber,
      email: formData.email,
      remark: formData.remark,
      beneficiaryName: formData.beneficiaryName,
      beneficiaryBankName: formData.beneficiaryBankName,
      beneficiaryAccount: formData.beneficiaryAccount,
      beneficiaryIFSCCode: formData.beneficiaryIFSCCode,
      vpaAddress: formData.vpaAddress,
      returnUrl: formData.returnUrl,
    };

    console.log("Data to send:", dataToSend);

    // Send data to API
    await postData(dataToSend);
  }

  // Handle input change for form fields
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // logic to handle bulk transfer by having differnt handlesubmit that will put the data in an array

  const [transferList, setTransferList] = useState([]);

  const handleBulkTransferSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = await validate(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Create data to send
    const dataToSend = {
      appKey: formData.appKey,
      amount: formData.amount,
      countryCode: formData.countryCode,
      currencyCode: formData.currencyCode,
      transferMode: formData.transferMode,
      orderId: formData.orderId,
      contactNumber: formData.contactNumber,
      email: formData.email,
      remark: formData.remark,
      beneficiaryName: formData.beneficiaryName,
      beneficiaryAccount: formData.beneficiaryAccount,
      beneficiaryIFSCCode: formData.beneficiaryIFSCCode,
      vpaAddress: formData.vpaAddress,
      returnUrl: formData.returnUrl,
    };

    // Add it in array
    setTransferList((prevList) => [...prevList, dataToSend]);
  };
  // API call to fetch merchant list

  return (
    <div className="wrapper">
      <form
        onSubmit={
          formData.transferType === "single"
            ? handleSubmit
            : handleBulkTransferSubmit
        }
      >
        {/* Transfer Type Selection */}
        <div className="row mb-3">
          <div className="col-12">
            <Label label="Transfer Type" required={true} />
            <div className="d-flex gap-4">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="transferType"
                  id="singleTransfer"
                  value="single"
                  checked={formData.transferType === "single"}
                  onChange={handleChange}
                />
                <label className="form-check-label" htmlFor="singleTransfer">
                  Single Transfer
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="transferType"
                  id="bulkTransfer"
                  value="bulk"
                  checked={formData.transferType === "bulk"}
                  onChange={handleChange}
                />
                <label className="form-check-label" htmlFor="bulkTransfer">
                  Bulk Transfer
                </label>
              </div>
            </div>
          </div>
        </div>

        <Single
          formData={formData}
          handleChange={handleChange}
          setFormData={setFormData}
          validate={validate}
          response={response}
          error={error}
          loading={loading}
          errors={errors}
        />
      </form>
    </div>
  );
};

export default AddForm;
