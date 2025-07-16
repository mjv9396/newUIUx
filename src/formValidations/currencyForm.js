import { validateDecimalNumber, validateEmpty } from "../utils/validations";

export const validateCurrencyForm = (formdata) => {
  let errors = {};

  // Currency Code
  const currencyCodeError = validateEmpty(formdata.currencyCode);
  if (currencyCodeError) errors.currencyCode = "Currency code is required";

  // Currency Name
  const currencyNameError = validateEmpty(formdata.currencyName);
  if (currencyNameError) errors.currencyName = "Currency name is required";

  // Currency Number
  const currencyNumberError = validateEmpty(formdata.currencyNumber);
  if (currencyNumberError) errors.currencyNumber = "Currency number is required";

  // Decimal Digits
  const decimalDigitsEmpty = validateEmpty(formdata.currencyDecimalPlace);
  const decimalDigitsFormat = !decimalDigitsEmpty ? validateDecimalNumber(formdata.currencyDecimalPlace) : null;
  if (decimalDigitsEmpty) {
    errors.currencyDecimalPlace = "Decimal place is required";
  } else if (decimalDigitsFormat) {
    errors.currencyDecimalPlace = decimalDigitsFormat;
  }

  return errors;
};