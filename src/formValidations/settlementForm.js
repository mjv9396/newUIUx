import { validateEmpty, validateDecimalNumber } from "../utils/validations";

export const validateSettlementForm = (formData) => {
  const errors = {};

  if (validateEmpty(formData.userId)) {
    errors.userId = "Merchant is required";
  }

  if (validateEmpty(formData.settlementType)) {
    errors.settlementType = "Settlement type is required";
  }

  if (formData.settlementType === "D") {
    if (validateEmpty(formData.day)) {
      errors.day = "Day is required for Daily settlement";
    }

    if (validateEmpty(formData.settlementTime)) {
      errors.settlementTime =
        "Settlement time is required for Daily settlement";
    }
  }

  if (formData.settlementType === "H") {
    if (validateEmpty(formData.hours)) {
      errors.hours = "Hour interval is required for Hourly settlement";
    }
  }

  if (formData.settlementType === "A") {
    const amountEmptyError = validateEmpty(formData.amount);
    const amountFormatError = !amountEmptyError ? validateDecimalNumber(formData.amount) : null;
    if (amountEmptyError) {
      errors.amount = "Amount is required for Amount based settlement";
    } else if (amountFormatError) {
      errors.amount = "Valid amount is required for Amount based settlement";
    }
  }

  return errors;
};