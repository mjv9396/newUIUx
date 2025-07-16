import { validateEmpty, validateName } from "../utils/validations";

export const validateAcquirerForm = (formdata) => {
  let errors = {};
  const nameError = validateName(formdata.acqName);
  if (nameError) errors.acqName = nameError;
  const aquirerError = validateEmpty(formdata.acqCode);
  if (aquirerError) errors.acqCode = aquirerError;

  return errors;
};
