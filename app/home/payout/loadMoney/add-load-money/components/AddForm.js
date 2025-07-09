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
import { loadMoney } from "@/app/formBuilder/payout";
import { validate } from "@/app/validations/forms/AddLoadMoneyFormValidation";

const AddForm = () => {
  const router = useRouter();

  const { postData, error, response, loading } = usePostRequest(
    endPoints.payout.addLoadMoney
  );

  // Form json state data
  const [formData, setFormData] = useState(loadMoney());

  // Merchant selection state
  const [selectedMerchant, setSelectedMerchant] = useState({
    id: "",
    name: "Select Merchant",
  });

  // Currency selection state
  const [currencyTypes, setCurrencyTypes] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState({
    id: "",
    name: "Select Currency",
  });

  const [symbol, setSymbol] = useState("₹");

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

  // File upload state
  const [filePreview, setFilePreview] = useState(null);

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
    setSelectedCurrency({ id: "", name: "All Currency" });
  };

  // Handle currency selection
  const handleCurrencyChange = (id, name) => {
    setSelectedCurrency({ id, name });
    setFormData((prev) => ({
      ...prev,
      currencyId: id,
    }));

    // Set currency symbol based on currency code
    switch (id) {
      case "USD":
        setSymbol("$");
        break;
      case "UGX":
        setSymbol("USh");
        break;
      case "EUR":
        setSymbol("€");
        break;
      case "GBP":
        setSymbol("£");
        break;
      default:
        setSymbol("₹");
        break;
    }
  };

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, receiptImage: file });

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Form submission
  async function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = await validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      console.log("Validation errors:", validationErrors);
      return;
    }

    // Create FormData for file upload
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] != null || formData[key] != undefined) {
        formDataToSend.append(key, formData[key]);
      }
    });

    await postData(formDataToSend, true);
  }

  // Handle successful submission
  useEffect(() => {
    if (response && !error) {
      successMsg(response.message || "Money loaded successfully");
      setFormData(loadMoney());
      setSelectedMerchant({ id: "", name: "Select Merchant" });
      setSelectedCurrency({ id: "", name: "Select Currency" });
      setFilePreview(null);
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
            <Label htmlFor="amount" label="Amount" required={true} />
            <div className="input-group">
              <input
                type="number"
                name="amount"
                id="amount"
                placeholder="Enter Amount"
                className="forminput"
                value={formData.amount}
                onChange={handleChange}
                autoComplete="off"
              />
            </div>
            {errors.amount && (
              <small className="text-danger">
                <span className="text-danger"> *</span>
                {errors.amount}
              </small>
            )}
          </div>
          <div className="col-md-6 col-sm-12 mb-2">
            <Label htmlFor="receiptId" label="Receipt ID" required={true} />
            <input
              type="text"
              name="receiptId"
              id="receiptId"
              placeholder="Enter Receipt ID"
              className="forminput"
              onChange={handleChange}
              value={formData.receiptId}
              autoComplete="off"
            />
            {errors.receiptId && (
              <small className="text-danger">
                <span className="text-danger"> *</span>
                {errors.receiptId}
              </small>
            )}
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 col-sm-12 mb-2">
            <Label htmlFor="receipt" label="Upload Receipt" />
            <input
              type="file"
              name="receipt"
              id="receipt"
              className="forminput"
              onChange={handleFileChange}
              accept="image/*"
            />
            {filePreview && (
              <div className="mt-2">
                <img
                  src={filePreview}
                  alt="Receipt Preview"
                  style={{ maxWidth: "100%", maxHeight: "150px" }}
                />
              </div>
            )}
          </div>
          <div className="col-md-6 col-sm-12 mb-2">
            <Label htmlFor="remark" label="Remark" />
            <textarea
              name="remark"
              id="remark"
              placeholder="Enter remark"
              className="forminput"
              rows="4"
              value={formData.remark}
              onChange={handleChange}
            ></textarea>
          </div>
        </div>
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
                setFormData(initialLoadMoneyData);
                setSelectedMerchant({ id: "", name: "Select Merchant" });
                setSelectedCurrency({ id: "", name: "Select Currency" });
                setFilePreview(null);
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

export default AddForm;
