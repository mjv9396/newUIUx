import {
  validateContact,
  validateEmail,
  validateEmpty,
  validateName,
  validateAccountNumber,
  validateIFSC,
  validateVpa,
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
  
  if (isVpa) {
    const vpaError = validateVpa(formdata.vpaAddress);
    if (vpaError) errors.vpaAddress = vpaError;
  } else {
    const accountNoError = validateAccountNumber(formdata.accountNo);
    if (accountNoError) errors.accountNo = accountNoError;
    
    const ifscError = validateIFSC(formdata.ifscCode);
    if (ifscError) errors.ifscCode = ifscError;
  }
  
  return errors;
};
