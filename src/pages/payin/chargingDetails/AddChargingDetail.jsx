import { useEffect, useState, useCallback } from "react";
import styles from "../../../styles/common/Add.module.css";
import { endpoints } from "../../../services/apiEndpoints";
import usePost from "../../../hooks/usePost";
import useFetch from "../../../hooks/useFetch";
import Error from "../../errors/Error";
import Loading from "../../errors/Loading";
import { successMessage, errorMessage } from "../../../utils/messges";
import { GetAuthToken } from "../../../services/cookieStore";

const AddChargingDetail = () => {
  // Fetch data hooks
  const {
    fetchData: getAllMerchant,
    data: allMerchant,
    error: merchantError,
    loading: merchantLoading,
  } = useFetch();

  const {
    fetchData: getAllAcquirer,
    data: allAcquirer,
    error: acquirerError,
    loading: acquirerLoading,
  } = useFetch();

  const {
    fetchData: getAllCurrency,
    data: allCurrency,
    error: currencyError,
    loading: currencyLoading,
  } = useFetch();

  const {
    fetchData: getAllPaymentType,
    data: allPaymentType,
    error: paymentTypeError,
    loading: paymentTypeLoading,
  } = useFetch();

  const { postData: getAllMopType, data: allMopType } = usePost(
    endpoints.payin.mopTypeList
  );

  useEffect(() => {
    getAllCurrency(endpoints.payin.currencyList);
    getAllMerchant(endpoints.user.userList);
    getAllAcquirer(endpoints.payin.acquirerList);
    getAllPaymentType(endpoints.payin.paymentTypeList);
  }, []);

  // State management
  const [commonData, setCommonData] = useState({
    userId: "",
    acqCode: "",
    currencyCode: "",
  });

  const getEmptyRow = () => ({
    id: Date.now() + Math.random(),
    paymentTypeCode: "",
    mopCode: "",
    transactionType: "",
    bankMinTxnAmount: "",
    bankMaxTxnAmount: "",
    bankTdr: "",
    bankPreference: "",
    merchantMinTxnAmount: "",
    merchantMaxTxnAmount: "",
    merchantTdr: "",
    merchantPreference: "",
    gst: "",
    vendorCommision: "",
    rollingReserve: "",
  });

  const [chargingDetailRows, setChargingDetailRows] = useState([getEmptyRow()]);
  const [errors, setErrors] = useState({});
  const [commonErrors, setCommonErrors] = useState({});
  const [currentMopTypes, setCurrentMopTypes] = useState({});
  const [minAmountInfo, setMinAmountInfo] = useState({}); // Store minimum amounts from API

  // Function to fetch minimum amount from API
  const fetchMinAmount = useCallback(
    async (userId, acqCode, paymentTypeCode, mopCode) => {
      if (!userId || !acqCode || !paymentTypeCode || !mopCode) return null;

      try {
        const response = await fetch(
          import.meta.env.VITE_API_BASE_URL +
            endpoints.payin.getMaxChargingAmount,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${GetAuthToken()}`,
            },
            body: JSON.stringify({
              userId,
              acqCode,
              paymentTypeCode,
              mopCode,
            }),
          }
        );

        const result = await response.json();

        if (result && result.statusCode === 200 && result.data) {
          // Add 1 to the max amounts to get the minimum for next range
          const bankMinAmount = result.data.bankMaxTxnAmount
            ? parseFloat(result.data.bankMaxTxnAmount) + 1
            : null;
          const merchantMinAmount = result.data.merchantMaxTxnAmount
            ? parseFloat(result.data.merchantMaxTxnAmount) + 1
            : null;

         

          return {
            bankMinAmount,
            merchantMinAmount,
          };
        } else {
          // console.log("Payin API response error or no data:", result);
        }
      } catch (error) {
        console.error("Error fetching payin min amount:", error);
      }

      return null;
    },
    []
  );

  const { postData, loading: submitLoading } = usePost(
    endpoints.payin.addChargingDetail
  );

  // Fetch minimum amounts when common data changes
  useEffect(() => {
    if (commonData.userId && commonData.acqCode) {
      // Fetch minimum amounts for existing rows with payment and mop types
      chargingDetailRows.forEach((row, index) => {
        if (row.paymentTypeCode && row.mopCode) {
          fetchMinAmount(
            commonData.userId,
            commonData.acqCode,
            row.paymentTypeCode,
            row.mopCode
          ).then((minAmounts) => {
            if (minAmounts) {
              setMinAmountInfo((prev) => ({
                ...prev,
                [`${row.id}_${row.paymentTypeCode}_${row.mopCode}`]: minAmounts,
              }));

              // Auto-populate minimum amounts if they're empty
              setChargingDetailRows((prevRows) =>
                prevRows.map((r, i) => {
                  if (
                    r.id === row.id &&
                    (!r.bankMinTxnAmount || !r.merchantMinTxnAmount)
                  ) {
                    const bankFromPrevious = getMinAmountForRow(
                      i,
                      "bank",
                      r.paymentTypeCode,
                      r.mopCode,
                      r.transactionType
                    );
                    const merchantFromPrevious = getMinAmountForRow(
                      i,
                      "merchant",
                      r.paymentTypeCode,
                      r.mopCode,
                      r.transactionType
                    );

                    return {
                      ...r,
                      bankMinTxnAmount:
                        r.bankMinTxnAmount ||
                        bankFromPrevious ||
                        (minAmounts.bankMinAmount
                          ? minAmounts.bankMinAmount.toString()
                          : ""),
                      merchantMinTxnAmount:
                        r.merchantMinTxnAmount ||
                        merchantFromPrevious ||
                        (minAmounts.merchantMinAmount
                          ? minAmounts.merchantMinAmount.toString()
                          : ""),
                    };
                  }
                  return r;
                })
              );
            }
          });
        }
      });
    }
  }, [commonData.userId, commonData.acqCode, fetchMinAmount]);

  // Event handlers
  const handleCommonChange = (e) => {
    const { name, value } = e.target;
    setCommonData({ ...commonData, [name]: value });
    setCommonErrors({ ...commonErrors, [name]: "" });
  };

  const handleRowChange = (rowId, field, value) => {
    const updatedRows = chargingDetailRows.map((row) => {
      if (row.id === rowId) {
        const updatedRow = { ...row, [field]: value };

        setErrors((prev) => ({
          ...prev,
          [`${rowId}_${field}`]: "",
        }));

        if (field === "paymentTypeCode" && value) {
          getAllMopType({ paymentTypeCode: value });
          updatedRow.mopCode = "";
        }

        // If payment type or mop code changes, fetch new minimum amounts and set initial values
        if (
          (field === "paymentTypeCode" || field === "mopCode") &&
          value &&
          commonData.userId &&
          commonData.acqCode
        ) {
          const paymentType =
            field === "paymentTypeCode" ? value : row.paymentTypeCode;
          const mopCode = field === "mopCode" ? value : row.mopCode;

          if (paymentType && mopCode) {
            fetchMinAmount(
              commonData.userId,
              commonData.acqCode,
              paymentType,
              mopCode
            ).then((minAmounts) => {
              if (minAmounts) {
                setMinAmountInfo((prev) => ({
                  ...prev,
                  [`${rowId}_${paymentType}_${mopCode}`]: minAmounts,
                }));

                // Auto-populate minimum amounts if they're empty
                setChargingDetailRows((prevRows) =>
                  prevRows.map((r) => {
                    if (r.id === rowId) {
                      const currentRowIndex = prevRows.findIndex(
                        (row) => row.id === rowId
                      );
                      const bankFromPrevious = getMinAmountForRow(
                        currentRowIndex,
                        "bank",
                        paymentType,
                        mopCode,
                        r.transactionType
                      );
                      const merchantFromPrevious = getMinAmountForRow(
                        currentRowIndex,
                        "merchant",
                        paymentType,
                        mopCode,
                        r.transactionType
                      );

                      return {
                        ...r,
                        bankMinTxnAmount:
                          bankFromPrevious ||
                          (minAmounts.bankMinAmount
                            ? minAmounts.bankMinAmount.toString()
                            : r.bankMinTxnAmount),
                        merchantMinTxnAmount:
                          merchantFromPrevious ||
                          (minAmounts.merchantMinAmount
                            ? minAmounts.merchantMinAmount.toString()
                            : r.merchantMinTxnAmount),
                      };
                    }
                    return r;
                  })
                );
              }
            });
          }
        }

        return updatedRow;
      }
      return row;
    });
    setChargingDetailRows(updatedRows);
  };

  useEffect(() => {
    if (allMopType) {
      chargingDetailRows.forEach((row) => {
        if (row.paymentTypeCode && !currentMopTypes[row.paymentTypeCode]) {
          setCurrentMopTypes((prev) => ({
            ...prev,
            [row.paymentTypeCode]: allMopType,
          }));
        }
      });
    }
  }, [allMopType, chargingDetailRows]);

  const addNewRow = () => {
    setChargingDetailRows([...chargingDetailRows, getEmptyRow()]);
  };

  const removeRow = (rowId) => {
    if (chargingDetailRows.length > 1) {
      setChargingDetailRows(
        chargingDetailRows.filter((row) => row.id !== rowId)
      );
      const updatedErrors = { ...errors };
      Object.keys(updatedErrors).forEach((key) => {
        if (key.startsWith(`${rowId}_`)) {
          delete updatedErrors[key];
        }
      });
      setErrors(updatedErrors);
    }
  };

  const getMinAmountForRow = (
    currentRowIndex,
    field,
    paymentTypeCode,
    mopCode,
    transactionType
  ) => {
    if (!paymentTypeCode || !mopCode || !transactionType) return "";

    const rowsWithSameConfig = chargingDetailRows
      .slice(0, currentRowIndex)
      .filter(
        (row) =>
          row.paymentTypeCode === paymentTypeCode &&
          row.mopCode === mopCode &&
          row.transactionType === transactionType
      );

    if (rowsWithSameConfig.length === 0) return "";

    const lastRow = rowsWithSameConfig[rowsWithSameConfig.length - 1];
    const lastMaxAmount = field.includes("bank")
      ? parseFloat(lastRow.bankMaxTxnAmount)
      : parseFloat(lastRow.merchantMaxTxnAmount);

    return isNaN(lastMaxAmount) ? "" : (lastMaxAmount + 1).toString();
  };

  // Get API minimum amount for first row
  const getApiMinAmount = (rowId, paymentTypeCode, mopCode, field) => {
    const minInfo = minAmountInfo[`${rowId}_${paymentTypeCode}_${mopCode}`];
    if (!minInfo) return null;

    return field.includes("bank")
      ? minInfo.bankMinAmount
      : minInfo.merchantMinAmount;
  };

  // Get effective minimum amount (either from previous row or API)
  const getEffectiveMinAmount = (
    currentRowIndex,
    rowId,
    field,
    paymentTypeCode,
    mopCode,
    transactionType
  ) => {
    const rowMinAmount = getMinAmountForRow(
      currentRowIndex,
      field,
      paymentTypeCode,
      mopCode,
      transactionType
    );
    if (rowMinAmount) return parseFloat(rowMinAmount);

    const apiMinAmount = getApiMinAmount(
      rowId,
      paymentTypeCode,
      mopCode,
      field
    );
    return apiMinAmount || null;
  };

  // Validate minimum amount against effective minimum
  const validateMinAmount = (value, effectiveMin) => {
    if (!effectiveMin || !value) return true;
    return parseFloat(value) >= effectiveMin;
  };

  const validateAllForms = () => {
    let hasErrors = false;
    let newCommonErrors = {};
    let newErrors = {};

    // Validate common fields
    if (!commonData.userId) {
      newCommonErrors.userId = "Merchant is required";
      hasErrors = true;
    }
    if (!commonData.acqCode) {
      newCommonErrors.acqCode = "Acquirer is required";
      hasErrors = true;
    }
    if (!commonData.currencyCode) {
      newCommonErrors.currencyCode = "Currency Code is required";
      hasErrors = true;
    }

    // Validate each row
    chargingDetailRows.forEach((row, index) => {
      const rowPrefix = `${row.id}_`;

      if (!row.paymentTypeCode) {
        newErrors[`${rowPrefix}paymentTypeCode`] = "Payment Type is required";
        hasErrors = true;
      }
      if (!row.mopCode) {
        newErrors[`${rowPrefix}mopCode`] = "MOP Code is required";
        hasErrors = true;
      }
      if (!row.transactionType) {
        newErrors[`${rowPrefix}transactionType`] =
          "Transaction Type is required";
        hasErrors = true;
      }

      const bankMinAmount = getMinAmountForRow(
        index,
        "bank",
        row.paymentTypeCode,
        row.mopCode,
        row.transactionType
      );
      const merchantMinAmount = getMinAmountForRow(
        index,
        "merchant",
        row.paymentTypeCode,
        row.mopCode,
        row.transactionType
      );

      // Use user-entered values, but validate against calculated minimums
      const finalBankMin = row.bankMinTxnAmount;
      const finalMerchantMin = row.merchantMinTxnAmount;

      // Get effective minimum amounts for validation
      const effectiveBankMin = getEffectiveMinAmount(
        index,
        row.id,
        "bank",
        row.paymentTypeCode,
        row.mopCode,
        row.transactionType
      );
      const effectiveMerchantMin = getEffectiveMinAmount(
        index,
        row.id,
        "merchant",
        row.paymentTypeCode,
        row.mopCode,
        row.transactionType
      );

      if (!finalBankMin) {
        newErrors[`${rowPrefix}bankMinTxnAmount`] =
          "Bank Min Amount is required";
        hasErrors = true;
      } else if (
        effectiveBankMin &&
        !validateMinAmount(finalBankMin, effectiveBankMin)
      ) {
        newErrors[
          `${rowPrefix}bankMinTxnAmount`
        ] = `Bank Min Amount must be at least ${effectiveBankMin}`;
        hasErrors = true;
      }

      if (!row.bankMaxTxnAmount) {
        newErrors[`${rowPrefix}bankMaxTxnAmount`] =
          "Bank Max Amount is required";
        hasErrors = true;
      }

      if (!finalMerchantMin) {
        newErrors[`${rowPrefix}merchantMinTxnAmount`] =
          "Merchant Min Amount is required";
        hasErrors = true;
      } else if (
        effectiveMerchantMin &&
        !validateMinAmount(finalMerchantMin, effectiveMerchantMin)
      ) {
        newErrors[
          `${rowPrefix}merchantMinTxnAmount`
        ] = `Merchant Min Amount must be at least ${effectiveMerchantMin}`;
        hasErrors = true;
      }
      if (!row.merchantMaxTxnAmount) {
        newErrors[`${rowPrefix}merchantMaxTxnAmount`] =
          "Merchant Max Amount is required";
        hasErrors = true;
      }

      const otherRequiredFields = [
        "bankTdr",
        "bankPreference",
        "merchantTdr",
        "merchantPreference",
        "gst",
        "vendorCommision",
        "rollingReserve",
      ];

      otherRequiredFields.forEach((field) => {
        if (!row[field]) {
          newErrors[`${rowPrefix}${field}`] = `${field
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (str) => str.toUpperCase())} is required`;
          hasErrors = true;
        }
      });

      if (finalBankMin && row.bankMaxTxnAmount) {
        if (parseFloat(finalBankMin) >= parseFloat(row.bankMaxTxnAmount)) {
          newErrors[`${rowPrefix}bankMaxTxnAmount`] =
            "Max amount must be greater than min amount";
          hasErrors = true;
        }
      }

      if (finalMerchantMin && row.merchantMaxTxnAmount) {
        if (
          parseFloat(finalMerchantMin) >= parseFloat(row.merchantMaxTxnAmount)
        ) {
          newErrors[`${rowPrefix}merchantMaxTxnAmount`] =
            "Max amount must be greater than min amount";
          hasErrors = true;
        }
      }

      // Validate that Merchant TDR >= Bank TDR
      if (row.bankTdr && row.merchantTdr) {
        const bankTdrValue = parseFloat(row.bankTdr);
        const merchantTdrValue = parseFloat(row.merchantTdr);

        if (!isNaN(bankTdrValue) && !isNaN(merchantTdrValue)) {
          if (merchantTdrValue < bankTdrValue) {
            newErrors[`${rowPrefix}merchantTdr`] =
              "Merchant TDR must be greater than or equal to Bank TDR";
            hasErrors = true;
          }
        }
      }
    });

    setCommonErrors(newCommonErrors);
    setErrors(newErrors);
    return !hasErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateAllForms()) {
      errorMessage("Please fix all validation errors before submitting");
      return;
    }

    try {
      const results = [];

      for (let i = 0; i < chargingDetailRows.length; i++) {
        const row = chargingDetailRows[i];

        const formData = {
          ...commonData,
          ...row,
          // Use the user-entered minimum amounts
          bankMinTxnAmount: row.bankMinTxnAmount,
          merchantMinTxnAmount: row.merchantMinTxnAmount,
        };

        delete formData.id;

        try {
          const res = await fetch(
            import.meta.env.VITE_API_BASE_URL +
              endpoints.payin.addChargingDetail,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${GetAuthToken()}`,
              },
              body: JSON.stringify(formData),
            }
          );
          // console.log("🚀 ~ handleSubmit ~ result:", result)
          const result = await res.json();
          // Check if the API response indicates success or failure
          if (result && result.statusCode && result.statusCode === 200) {
            results.push({ success: true, data: result, rowIndex: i });
          } else {
            // API returned an error response
            const errorMsg =
              result?.data || result?.message || "Unknown error occurred";
            results.push({ success: false, error: errorMsg, rowIndex: i });
          }
        } catch (error) {
          // Network or other errors
          const errorMsg =
            error?.message || error?.toString() || "Network error occurred";
          results.push({ success: false, error: errorMsg, rowIndex: i });
        }
      }

      const successCount = results.filter((r) => r.success).length;
      const failureCount = results.length - successCount;

      if (successCount === results.length) {
        successMessage(
          `All ${successCount} charging details added successfully!`
        );
        setCommonData({ userId: "", acqCode: "", currencyCode: "" });
        setChargingDetailRows([getEmptyRow()]);
        setErrors({});
        setCommonErrors({});
        setCurrentMopTypes({});
        setMinAmountInfo({});
      } else if (successCount > 0) {
        successMessage(`${successCount} charging details added successfully`);

        // Show detailed error messages for failed rows
        const failedRows = results.filter((r) => !r.success);
        failedRows.forEach((failedRow) => {
          const rowNumber = failedRow.rowIndex + 1;
          errorMessage(`Row ${rowNumber}: ${failedRow.error}`);
        });
      } else {
        // errorMessage("Failed to add charging details");

        // Show detailed error messages for all failed rows
        const failedRows = results.filter((r) => !r.success);
        failedRows.forEach((failedRow) => {
          const rowNumber = failedRow.rowIndex + 1;
          errorMessage(`Row ${rowNumber}: ${failedRow.error}`);
        });
      }
    } catch (error) {
      errorMessage(
        "Error processing charging details: " + (error.message || error)
      );
    }
  };

  const clearAllForms = () => {
    setCommonData({ userId: "", acqCode: "", currencyCode: "" });
    setChargingDetailRows([getEmptyRow()]);
    setErrors({});
    setCommonErrors({});
    setCurrentMopTypes({});
    setMinAmountInfo({});
  };

  // Error handling and loading states
  if (merchantError) return <Error error="Error loading Merchants" />;
  if (acquirerError) return <Error error="Error loading Acquirers" />;
  if (paymentTypeError) return <Error error="Error loading Payment Type" />;
  if (currencyError) return <Error error="Error loading Currency" />;
  if (
    merchantLoading ||
    acquirerLoading ||
    currencyLoading ||
    paymentTypeLoading
  )
    return (
      <Loading loading="Loading Merchant, Acquirer, Currency and Payment Type" />
    );

  if (allAcquirer && allMerchant && allPaymentType && allCurrency) {
    return (
      <div className={styles.listing}>
        <form onSubmit={handleSubmit}>
          {/* Common Fields Section */}
          <div className={styles.commonSection}>
            <h5 className={styles.sectionTitle}>Common Details</h5>
            <div className="d-flex flex-wrap gap-3 align-items-center">
              <div className={styles.input}>
                <label htmlFor="userId">
                  Merchant <span className="required">*</span>
                </label>
                <select
                  name="userId"
                  id="userId"
                  onChange={handleCommonChange}
                  value={commonData.userId}
                >
                  <option value="">--Select Merchant--</option>
                  {allMerchant.data.length > 0 ? (
                    allMerchant.data.map((item) => (
                      <option key={item.userId} value={item.userId}>
                        {item.firstName} {item.lastName}
                      </option>
                    ))
                  ) : (
                    <option disabled>No merchant added</option>
                  )}
                </select>
                {commonErrors.userId && (
                  <span className="errors">{commonErrors.userId}</span>
                )}
              </div>

              <div className={styles.input}>
                <label htmlFor="acqCode">
                  Acquirer <span className="required">*</span>
                </label>
                <select
                  name="acqCode"
                  id="acqCode"
                  onChange={handleCommonChange}
                  value={commonData.acqCode}
                >
                  <option value="">--Select Acquirer--</option>
                  {allAcquirer.data.length > 0 ? (
                    allAcquirer.data.map((item) => (
                      <option key={item.acqCode} value={item.acqCode}>
                        {item.acqName} ({item.acqCode})
                      </option>
                    ))
                  ) : (
                    <option disabled>No acquirer added</option>
                  )}
                </select>
                {commonErrors.acqCode && (
                  <span className="errors">{commonErrors.acqCode}</span>
                )}
              </div>

              <div className={styles.input}>
                <label htmlFor="currencyCode">
                  Currency Code <span className="required">*</span>
                </label>
                <select
                  name="currencyCode"
                  id="currencyCode"
                  onChange={handleCommonChange}
                  value={commonData.currencyCode}
                >
                  <option value="">--Select Currency--</option>
                  {allCurrency.data.length > 0 ? (
                    allCurrency.data.map((item) => (
                      <option key={item.currencyCode} value={item.currencyCode}>
                        {item.currencyName} ({item.currencyCode})
                      </option>
                    ))
                  ) : (
                    <option disabled>No currency added</option>
                  )}
                </select>
                {commonErrors.currencyCode && (
                  <span className="errors">{commonErrors.currencyCode}</span>
                )}
              </div>
            </div>
          </div>

          {/* Charging Details Table Section */}
          <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className={styles.sectionTitle}>Charging Details</h5>
              <button
                type="button"
                className="btn btn-success btn-sm"
                onClick={addNewRow}
                disabled={
                  !commonData.userId ||
                  !commonData.acqCode ||
                  !commonData.currencyCode
                }
              >
                Add New Row
              </button>
            </div>

            <div className={styles.tableContainer}>
              <table className={`table table-bordered ${styles.chargingTable}`}>
                <thead className="table-light">
                  <tr>
                    <th>Payment Type</th>
                    <th>MOP Type</th>
                    <th>Transaction Type</th>
                    <th>Bank Min Amount</th>
                    <th>Bank Max Amount</th>
                    <th>Bank TDR</th>
                    <th>Bank Preference</th>
                    <th>Merchant Min Amount</th>
                    <th>Merchant Max Amount</th>
                    <th>Merchant TDR</th>
                    <th>Merchant Preference</th>
                    <th>GST</th>
                    <th>Vendor Commission</th>
                    <th>Rolling Reserve</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {chargingDetailRows.map((row, index) => {
                    const bankMinAmount = getMinAmountForRow(
                      index,
                      "bank",
                      row.paymentTypeCode,
                      row.mopCode,
                      row.transactionType
                    );
                    const merchantMinAmount = getMinAmountForRow(
                      index,
                      "merchant",
                      row.paymentTypeCode,
                      row.mopCode,
                      row.transactionType
                    );

                    // Get effective minimum amounts
                    const effectiveBankMin = getEffectiveMinAmount(
                      index,
                      row.id,
                      "bank",
                      row.paymentTypeCode,
                      row.mopCode,
                      row.transactionType
                    );
                    const effectiveMerchantMin = getEffectiveMinAmount(
                      index,
                      row.id,
                      "merchant",
                      row.paymentTypeCode,
                      row.mopCode,
                      row.transactionType
                    );

                    return (
                      <tr key={row.id}>
                        <td>
                          <select
                            value={row.paymentTypeCode}
                            onChange={(e) =>
                              handleRowChange(
                                row.id,
                                "paymentTypeCode",
                                e.target.value
                              )
                            }
                            className="form-select form-select-sm"
                          >
                            <option value="">--Select--</option>
                            {allPaymentType.data.map((item) => (
                              <option
                                key={item.paymentTypeCode}
                                value={item.paymentTypeCode}
                              >
                                {item.paymentTypeName}
                              </option>
                            ))}
                          </select>
                          {errors[`${row.id}_paymentTypeCode`] && (
                            <small className="text-danger">
                              {errors[`${row.id}_paymentTypeCode`]}
                            </small>
                          )}
                        </td>

                        <td>
                          <select
                            value={row.mopCode}
                            onChange={(e) =>
                              handleRowChange(row.id, "mopCode", e.target.value)
                            }
                            className="form-select form-select-sm"
                            disabled={!row.paymentTypeCode}
                          >
                            <option value="">--Select--</option>
                            {currentMopTypes[row.paymentTypeCode]?.data?.map(
                              (item) => (
                                <option key={item.mopCode} value={item.mopCode}>
                                  {item.mopName}
                                </option>
                              )
                            )}
                          </select>
                          {errors[`${row.id}_mopCode`] && (
                            <small className="text-danger">
                              {errors[`${row.id}_mopCode`]}
                            </small>
                          )}
                        </td>

                        <td>
                          <select
                            value={row.transactionType}
                            onChange={(e) =>
                              handleRowChange(
                                row.id,
                                "transactionType",
                                e.target.value
                              )
                            }
                            className="form-select form-select-sm"
                          >
                            <option value="">--Select--</option>
                            <option value="SALE">SALE</option>
                            <option value="AUTH">AUTH</option>
                          </select>
                          {errors[`${row.id}_transactionType`] && (
                            <small className="text-danger">
                              {errors[`${row.id}_transactionType`]}
                            </small>
                          )}
                        </td>

                        <td>
                          <div className="position-relative">
                            <input
                              type="text"
                              value={row.bankMinTxnAmount}
                              onChange={(e) =>
                                handleRowChange(
                                  row.id,
                                  "bankMinTxnAmount",
                                  e.target.value
                                )
                              }
                              className="form-control form-control-sm"
                              placeholder={
                                effectiveBankMin
                                  ? `Min: ${effectiveBankMin}`
                                  : "Min Amount"
                              }
                            />
                            {effectiveBankMin && (
                              <span
                                className="position-absolute top-0 end-0 p-1"
                                style={{ cursor: "help" }}
                                title={`Minimum allowed: ${effectiveBankMin}`}
                              >
                                <i className="fas fa-info-circle text-warning"></i>
                              </span>
                            )}
                          </div>
                          {errors[`${row.id}_bankMinTxnAmount`] && (
                            <small className="text-danger">
                              {errors[`${row.id}_bankMinTxnAmount`]}
                            </small>
                          )}
                        </td>

                        <td>
                          <input
                            type="text"
                            value={row.bankMaxTxnAmount}
                            onChange={(e) =>
                              handleRowChange(
                                row.id,
                                "bankMaxTxnAmount",
                                e.target.value
                              )
                            }
                            className="form-control form-control-sm"
                            placeholder="Max Amount"
                          />
                          {errors[`${row.id}_bankMaxTxnAmount`] && (
                            <small className="text-danger">
                              {errors[`${row.id}_bankMaxTxnAmount`]}
                            </small>
                          )}
                        </td>

                        <td>
                          <input
                            type="text"
                            value={row.bankTdr}
                            onChange={(e) =>
                              handleRowChange(row.id, "bankTdr", e.target.value)
                            }
                            className="form-control form-control-sm"
                            placeholder="Bank TDR"
                          />
                          {errors[`${row.id}_bankTdr`] && (
                            <small className="text-danger">
                              {errors[`${row.id}_bankTdr`]}
                            </small>
                          )}
                        </td>

                        <td>
                          <select
                            value={row.bankPreference}
                            onChange={(e) =>
                              handleRowChange(
                                row.id,
                                "bankPreference",
                                e.target.value
                              )
                            }
                            className="form-select form-select-sm"
                          >
                            <option value="">--Select--</option>
                            <option value="Percentage">Percentage</option>
                            <option value="Flat">Flat</option>
                          </select>
                          {errors[`${row.id}_bankPreference`] && (
                            <small className="text-danger">
                              {errors[`${row.id}_bankPreference`]}
                            </small>
                          )}
                        </td>

                        <td>
                          <div className="position-relative">
                            <input
                              type="text"
                              value={row.merchantMinTxnAmount}
                              onChange={(e) =>
                                handleRowChange(
                                  row.id,
                                  "merchantMinTxnAmount",
                                  e.target.value
                                )
                              }
                              className="form-control form-control-sm"
                              placeholder={
                                effectiveMerchantMin
                                  ? `Min: ${effectiveMerchantMin}`
                                  : "Min Amount"
                              }
                            />
                            {effectiveMerchantMin && (
                              <span
                                className="position-absolute top-0 end-0 p-1"
                                style={{ cursor: "help" }}
                                title={`Minimum allowed: ${effectiveMerchantMin}`}
                              >
                                <i className="fas fa-info-circle text-warning"></i>
                              </span>
                            )}
                          </div>
                          {errors[`${row.id}_merchantMinTxnAmount`] && (
                            <small className="text-danger">
                              {errors[`${row.id}_merchantMinTxnAmount`]}
                            </small>
                          )}
                        </td>

                        <td>
                          <input
                            type="text"
                            value={row.merchantMaxTxnAmount}
                            onChange={(e) =>
                              handleRowChange(
                                row.id,
                                "merchantMaxTxnAmount",
                                e.target.value
                              )
                            }
                            className="form-control form-control-sm"
                            placeholder="Max Amount"
                          />
                          {errors[`${row.id}_merchantMaxTxnAmount`] && (
                            <small className="text-danger">
                              {errors[`${row.id}_merchantMaxTxnAmount`]}
                            </small>
                          )}
                        </td>

                        <td>
                          <input
                            type="text"
                            value={row.merchantTdr}
                            onChange={(e) =>
                              handleRowChange(
                                row.id,
                                "merchantTdr",
                                e.target.value
                              )
                            }
                            className="form-control form-control-sm"
                            placeholder="Merchant TDR"
                          />
                          {errors[`${row.id}_merchantTdr`] && (
                            <small className="text-danger">
                              {errors[`${row.id}_merchantTdr`]}
                            </small>
                          )}
                        </td>

                        <td>
                          <select
                            value={row.merchantPreference}
                            onChange={(e) =>
                              handleRowChange(
                                row.id,
                                "merchantPreference",
                                e.target.value
                              )
                            }
                            className="form-select form-select-sm"
                          >
                            <option value="">--Select--</option>
                            <option value="Percentage">Percentage</option>
                            <option value="Flat">Flat</option>
                          </select>
                          {errors[`${row.id}_merchantPreference`] && (
                            <small className="text-danger">
                              {errors[`${row.id}_merchantPreference`]}
                            </small>
                          )}
                        </td>

                        <td>
                          <input
                            type="text"
                            value={row.gst}
                            onChange={(e) =>
                              handleRowChange(row.id, "gst", e.target.value)
                            }
                            className="form-control form-control-sm"
                            placeholder="GST"
                          />
                          {errors[`${row.id}_gst`] && (
                            <small className="text-danger">
                              {errors[`${row.id}_gst`]}
                            </small>
                          )}
                        </td>

                        <td>
                          <input
                            type="text"
                            value={row.vendorCommision}
                            onChange={(e) =>
                              handleRowChange(
                                row.id,
                                "vendorCommision",
                                e.target.value
                              )
                            }
                            className="form-control form-control-sm"
                            placeholder="Vendor Commission"
                          />
                          {errors[`${row.id}_vendorCommision`] && (
                            <small className="text-danger">
                              {errors[`${row.id}_vendorCommision`]}
                            </small>
                          )}
                        </td>

                        <td>
                          <input
                            type="text"
                            value={row.rollingReserve}
                            onChange={(e) =>
                              handleRowChange(
                                row.id,
                                "rollingReserve",
                                e.target.value
                              )
                            }
                            className="form-control form-control-sm"
                            placeholder="Rolling Reserve"
                          />
                          {errors[`${row.id}_rollingReserve`] && (
                            <small className="text-danger">
                              {errors[`${row.id}_rollingReserve`]}
                            </small>
                          )}
                        </td>

                        <td>
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => removeRow(row.id)}
                            disabled={chargingDetailRows.length === 1}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="d-flex gap-3 mt-4 mb-2 justify-content-end">
            <button
              className={
                !submitLoading
                  ? styles.submit + " " + styles.active
                  : styles.submit
              }
              type="submit"
              disabled={submitLoading}
            >
              {submitLoading ? "Processing..." : "Submit All"}
            </button>
            <button
              className={styles.clear}
              type="button"
              onClick={clearAllForms}
            >
              Clear All
            </button>
          </div>
        </form>
      </div>
    );
  }

  return null;
};

export default AddChargingDetail;
