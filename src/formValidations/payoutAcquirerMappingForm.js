import { validateEmpty } from "../utils/validations";

export const validatePayoutAcquirerMappingForm = (formdata) => {
  let errors = {};
  const acqCodeError = validateEmpty(formdata.acqCode);
  if (acqCodeError) errors.acqCode = acqCodeError;
  const acqProfileIdError = validateEmpty(formdata.acqProfileId);
  if (acqProfileIdError) errors.acqProfileId = acqProfileIdError;
  const transferModeError = validateEmpty(formdata.transferMode);
  if (transferModeError) errors.transferMode = transferModeError;
  // Note: priority and amountLimit are now fetched from API, so no validation needed
  return errors;
};
