import { validateEmpty, validateName } from "../utils/validations";

export const validateCountryForm = (formdata) => {
  let errors = {};
  const nameError = validateName(formdata.countryName);
  if (nameError) errors.countryName = nameError;
  const isoCodeAlpha2Error = validateEmpty(formdata.isoCodeAlpha2);
  if (isoCodeAlpha2Error) errors.isoCodeAlpha2 = isoCodeAlpha2Error;
  const isoCodeAlpha3Error = validateEmpty(formdata.isoCodeAlpha3);
  if (isoCodeAlpha3Error) errors.isoCodeAlpha3 = isoCodeAlpha3Error;
  const unCodeError = validateEmpty(formdata.unCode);
  if (unCodeError) errors.unCode = unCodeError;
  const currencyCodeError = validateEmpty(formdata.currency);
  if (currencyCodeError) errors.currency = currencyCodeError;
  const isdCodeError = validateEmpty(formdata.isdCode);
  if (isdCodeError) errors.isdCode = isdCodeError;
  return errors;
};
