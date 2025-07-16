import {
  validateContact,
  validateEmail,
  validateEmpty,
  validateName,
} from "../utils/validations";

export const validateAddBeneficiaryForm = (formdata, isVpa=false) => {
  let errors = {};
  const nameError = validateName(formdata.name);
  if (nameError) errors.name = nameError;
  const nicknameError = validateName(formdata.nickname);
  if (nicknameError) errors.nickname = nicknameError;
  const mobileError = validateContact(formdata.mobile);
  if (mobileError) errors.mobile = mobileError;
  const emailError = validateEmail(formdata.email);
  if (emailError) errors.email = emailError;
  if( isVpa ) {
    const vpaError = validateEmpty(formdata.vpaAddress);
    if (vpaError) errors.vpaAddress = vpaError;
  }else {
    const accountNoError = validateEmpty(formdata.accountNo);
    if (accountNoError) errors.accountNo = accountNoError;
    const ifscError = validateEmpty(formdata.ifscCode);
    if (ifscError) errors.ifscCode = ifscError;
  }
  
  return errors;
};
