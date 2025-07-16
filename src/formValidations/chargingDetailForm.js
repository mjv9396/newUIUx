import { validateEmpty } from "../utils/validations";

export const validateChargingDetailForm = (formdata) => {
  let errors = {};

  const userIdError = validateEmpty(formdata.userId);
  if (userIdError) errors.userId = "Merchant is required";

  const acquirerError = validateEmpty(formdata.acqCode);
  if (acquirerError) errors.acqCode = "Acquirer is required";

  const paymentTypeError = validateEmpty(formdata.paymentTypeCode);
  if (paymentTypeError) errors.paymentTypeCode = "Payment Type Code is required";

  const mopTypeError = validateEmpty(formdata.mopCode);
  if (mopTypeError) errors.mopCode = "MOP Code is required";

  const currencyCodeError = validateEmpty(formdata.currencyCode);
  if (currencyCodeError) errors.currencyCode = "Currency Code is required";

  return errors;
};