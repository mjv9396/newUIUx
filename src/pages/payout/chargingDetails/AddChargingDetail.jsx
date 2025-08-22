import { useEffect, useState, useCallback } from "react";
import styles from "../../../styles/common/Add.module.css";
import { endpoints } from "../../../services/apiEndpoints";
import usePost from "../../../hooks/usePost";
import useFetch from "../../../hooks/useFetch";
import Error from "../../errors/Error";
import Loading from "../../errors/Loading";
import { errorMessage, successMessage } from "../../../utils/messges";
import { GetAuthToken } from "../../../services/cookieStore";

const AddChargingDetail = () => {
  //fetch merchant, acquirer and currency
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

  // State management
  const [commonData, setCommonData] = useState({
    userId: "",
    acquirer: "",
    currencyCode: "",
  });

  const getEmptyRow = () => ({
    id: Date.now() + Math.random(),
    transferMode: "",
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
  });

  const [chargingDetailRows, setChargingDetailRows] = useState([getEmptyRow()]);
  const [errors, setErrors] = useState({});
  const [commonErrors, setCommonErrors] = useState({});
  const [minAmountInfo, setMinAmountInfo] = useState({}); // Store minimum amounts from API

  // Function to fetch minimum amount from API
  const fetchMinAmount = useCallback(async (acquirer, transferMode, userId) => {
    if (!acquirer || !transferMode || !userId) return null;

    try {
      const response = await fetch(
        import.meta.env.VITE_API_BASE_URL +
          endpoints.payout.getMaxChargingAmount,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${GetAuthToken()}`,
          },
          body: JSON.stringify({
            acquirer,
            transferMode,
            userId,
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
        // console.log("API response error or no data:", result);
      }
    } catch (error) {
      console.error("Error fetching min amount:", error);
    }

    return null;
  }, []);

  useEffect(() => {
    getAllCurrency(endpoints.payin.currencyList);
    getAllMerchant(endpoints.user.userList);
    getAllAcquirer(endpoints.payin.acquirerList);
  }, []);

  // Fetch minimum amounts when common data changes
  useEffect(() => {
    if (commonData.acquirer && commonData.userId) {
      // Fetch minimum amounts for existing rows with transfer modes
      chargingDetailRows.forEach((row, index) => {
        if (row.transferMode) {
          fetchMinAmount(
            commonData.acquirer,
            row.transferMode,
            commonData.userId
          ).then((minAmounts) => {
            if (minAmounts) {
              setMinAmountInfo((prev) => ({
                ...prev,
                [`${row.id}_${row.transferMode}`]: minAmounts,
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
                      r.transferMode
                    );
                    const merchantFromPrevious = getMinAmountForRow(
                      i,
                      "merchant",
                      r.transferMode
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
  }, [commonData.acquirer, commonData.userId, fetchMinAmount]);

  const { postData, loading: submitLoading } = usePost(
    endpoints.payout.addChargingDetails
  );

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

        // If transfer mode changes, fetch new minimum amounts and set initial values
        if (
          field === "transferMode" &&
          value &&
          commonData.acquirer &&
          commonData.userId
        ) {
          fetchMinAmount(commonData.acquirer, value, commonData.userId).then(
            (minAmounts) => {
              if (minAmounts) {
                setMinAmountInfo((prev) => ({
                  ...prev,
                  [`${rowId}_${value}`]: minAmounts,
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
                        value
                      );
                      const merchantFromPrevious = getMinAmountForRow(
                        currentRowIndex,
                        "merchant",
                        value
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
            }
          );
        }

        return updatedRow;
      }
      return row;
    });
    setChargingDetailRows(updatedRows);
  };

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

  const getMinAmountForRow = (currentRowIndex, field, transferMode) => {
    if (!transferMode) return "";

    const rowsWithSameConfig = chargingDetailRows
      .slice(0, currentRowIndex)
      .filter((row) => row.transferMode === transferMode);

    if (rowsWithSameConfig.length === 0) return "";

    const lastRow = rowsWithSameConfig[rowsWithSameConfig.length - 1];
    const lastMaxAmount = field.includes("bank")
      ? parseFloat(lastRow.bankMaxTxnAmount)
      : parseFloat(lastRow.merchantMaxTxnAmount);

    return isNaN(lastMaxAmount) ? "" : (lastMaxAmount + 1).toString();
  };

  // Get API minimum amount for first row
  const getApiMinAmount = (rowId, transferMode, field) => {
    const minInfo = minAmountInfo[`${rowId}_${transferMode}`];
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
    transferMode
  ) => {
    const rowMinAmount = getMinAmountForRow(
      currentRowIndex,
      field,
      transferMode
    );
    if (rowMinAmount) return parseFloat(rowMinAmount);

    const apiMinAmount = getApiMinAmount(rowId, transferMode, field);
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
    if (!commonData.acquirer) {
      newCommonErrors.acquirer = "Acquirer is required";
      hasErrors = true;
    }
    if (!commonData.currencyCode) {
      newCommonErrors.currencyCode = "Currency Code is required";
      hasErrors = true;
    }

    // Validate each row
    chargingDetailRows.forEach((row, index) => {
      const rowPrefix = `${row.id}_`;

      if (!row.transferMode) {
        newErrors[`${rowPrefix}transferMode`] = "Transfer Mode is required";
        hasErrors = true;
      }

      const bankMinAmount = getMinAmountForRow(index, "bank", row.transferMode);
      const merchantMinAmount = getMinAmountForRow(
        index,
        "merchant",
        row.transferMode
      );

      // Use user-entered values, but validate against calculated minimums
      const finalBankMin = row.bankMinTxnAmount;
      const finalMerchantMin = row.merchantMinTxnAmount;

      // Get effective minimum amounts for validation
      const effectiveBankMin = getEffectiveMinAmount(
        index,
        row.id,
        "bank",
        row.transferMode
      );
      const effectiveMerchantMin = getEffectiveMinAmount(
        index,
        row.id,
        "merchant",
        row.transferMode
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
              endpoints.payout.addChargingDetails,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${GetAuthToken()}`,
              },
              body: JSON.stringify(formData),
            }
          );

          const result = await res.json();

          if (result && result.statusCode && result.statusCode === 200) {
            results.push({ success: true, data: result, rowIndex: i });
          } else {
            const errorMsg =
              result?.data || result?.message || "Unknown error occurred";
            results.push({ success: false, error: errorMsg, rowIndex: i });
          }
        } catch (error) {
          const errorMsg =
            error?.message || error?.toString() || "Network error occurred";
          results.push({ success: false, error: errorMsg, rowIndex: i });
        }
      }

      const successCount = results.filter((r) => r.success).length;
      const failureCount = results.length - successCount;

      if (successCount === results.length) {
        successMessage(
          `All ${successCount} payout charging details added successfully!`
        );
        setCommonData({ userId: "", acquirer: "", currencyCode: "" });
        setChargingDetailRows([getEmptyRow()]);
        setErrors({});
        setCommonErrors({});
        setMinAmountInfo({});
      } else if (successCount > 0) {
        successMessage(
          `${successCount} payout charging details added successfully`
        );

        const failedRows = results.filter((r) => !r.success);
        failedRows.forEach((failedRow) => {
          const rowNumber = failedRow.rowIndex + 1;
          errorMessage(`Row ${rowNumber}: ${failedRow.error}`);
        });
      } else {
        const failedRows = results.filter((r) => !r.success);
        failedRows.forEach((failedRow) => {
          const rowNumber = failedRow.rowIndex + 1;
          errorMessage(`Row ${rowNumber}: ${failedRow.error}`);
        });
      }
    } catch (error) {
      errorMessage(
        "Error processing payout charging details: " + (error.message || error)
      );
    }
  };

  const clearAllForms = () => {
    setCommonData({ userId: "", acquirer: "", currencyCode: "" });
    setChargingDetailRows([getEmptyRow()]);
    setErrors({});
    setCommonErrors({});
    setMinAmountInfo({});
  };

  // Error handling and loading states
  if (merchantError) return <Error error="Error loading Merchants" />;
  if (acquirerError) return <Error error="Error loading Acquirers" />;
  if (currencyError) return <Error error="Error loading Currency" />;
  if (merchantLoading || acquirerLoading || currencyLoading)
    return <Loading loading="Loading Merchant, Acquirer, Currency" />;
  if (allAcquirer && allMerchant && allCurrency) {
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
                <label htmlFor="acquirer">
                  Acquirer <span className="required">*</span>
                </label>
                <select
                  name="acquirer"
                  id="acquirer"
                  onChange={handleCommonChange}
                  value={commonData.acquirer}
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
                {commonErrors.acquirer && (
                  <span className="errors">{commonErrors.acquirer}</span>
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

          {/* Payout Charging Details Table Section */}
          <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className={styles.sectionTitle}>Payout Charging Details</h5>
              <button
                type="button"
                className="btn btn-success btn-sm"
                onClick={addNewRow}
                disabled={
                  !commonData.userId ||
                  !commonData.acquirer ||
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
                    <th>Transfer Mode</th>
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
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {chargingDetailRows.map((row, index) => {
                    const bankMinAmount = getMinAmountForRow(
                      index,
                      "bank",
                      row.transferMode
                    );
                    const merchantMinAmount = getMinAmountForRow(
                      index,
                      "merchant",
                      row.transferMode
                    );

                    // Get effective minimum amounts
                    const effectiveBankMin = getEffectiveMinAmount(
                      index,
                      row.id,
                      "bank",
                      row.transferMode
                    );
                    const effectiveMerchantMin = getEffectiveMinAmount(
                      index,
                      row.id,
                      "merchant",
                      row.transferMode
                    );

                    return (
                      <tr key={row.id}>
                        <td>
                          <select
                            value={row.transferMode}
                            onChange={(e) =>
                              handleRowChange(
                                row.id,
                                "transferMode",
                                e.target.value
                              )
                            }
                            className="form-select form-select-sm"
                          >
                            <option value="">--Select--</option>
                            <option value="IMPS">IMPS</option>
                            <option value="IFT">IFT</option>
                            <option value="NEFT">NEFT</option>
                            <option value="RTGS">RTGS</option>
                            <option value="UPI">UPI</option>
                          </select>
                          {errors[`${row.id}_transferMode`] && (
                            <small className="text-danger">
                              {errors[`${row.id}_transferMode`]}
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
