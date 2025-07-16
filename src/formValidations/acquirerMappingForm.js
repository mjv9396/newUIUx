import { validateEmpty } from "../utils/validations";

export const validateAcquirerMappingForm = (formdata) => {
  let errors = {};
  const acqCodeError = validateEmpty(formdata.acqCode);
  if (acqCodeError) errors.acqCode = acqCodeError;
  const acqProfileIdError = validateEmpty(formdata.acqProfileId);
  if (acqProfileIdError) errors.acqProfileId = acqProfileIdError;
  const paymentTypeError = validateEmpty(formdata.paymentTypeCode);
  if (paymentTypeError) errors.paymentTypeCode = paymentTypeError;
  const mopTypeError = validateEmpty(formdata.mopCode);
  if (mopTypeError) errors.mopCode = mopTypeError;
  const currencyCodeError = validateEmpty(formdata.currencyCode);
  if (currencyCodeError) errors.currencyCode = currencyCodeError;
  const transactionTypeError = validateEmpty(formdata.transactionType);
  if (transactionTypeError) errors.transactionType = transactionTypeError;
  // Note: priority and amountLimit are now fetched from API, so no validation needed
  return errors;
};
