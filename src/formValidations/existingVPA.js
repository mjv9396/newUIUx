import { validateEmpty } from "../utils/validations";

export const validateAddExistingVPAForm = (formdata) => {
  let errors = {};
  const beneficiaryError = validateEmpty(formdata.beneficiaryId);
  if (beneficiaryError) errors.beneficiaryId = beneficiaryError;

  return errors;
};
