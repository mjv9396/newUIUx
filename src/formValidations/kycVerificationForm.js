export const validateKycVerificationForm = (formdata) => {
  let errors = {};
  let activeStep = 6; // Assuming activeStep is passed or defined somewhere

  // company details
  if (!formdata.email) {
    errors.email = "Email is required";
    activeStep = activeStep == 6 ? 2 : activeStep;
  }
  if (!formdata.companyName) {
    errors.companyName = "Company name is required";
    activeStep = activeStep === 6 ? 2 : activeStep;
  }
  if (!formdata.companyType) {
    errors.companyType = "Company type is required";
    activeStep = activeStep === 6 ? 2 : activeStep;
  }
  if (!formdata.companyCategory) {
    errors.companyCategory = "Company category is required";
    activeStep = activeStep === 6 ? 2 : activeStep;
  }
  if (!formdata.companyPhone) {
    errors.companyPhone = "Company phone is required";
    activeStep = activeStep === 6 ? 2 : activeStep;
  }
  if (!formdata.companyEmail) {
    errors.companyEmail = "Company email is required";
    activeStep = activeStep === 6 ? 2 : activeStep;
  }
  if (!formdata.companyWebsite) {
    errors.companyWebsite = "Company website is required";
    activeStep = activeStep === 6 ? 2 : activeStep;
  }
  // registration details
  if (!formdata.companyPan) {
    errors.companyPan = "Company PAN is required";
    activeStep = activeStep === 6 ? 3 : activeStep;
  }
  if (!formdata.companyPanFile) {
    errors.companyPanFile = "Company PAN file is required";
    activeStep = activeStep === 6 ? 3 : activeStep;
  }
  if (!formdata.gstNumber) {
    errors.gstNumber = "GST number is required";
    activeStep = activeStep === 6 ? 3 : activeStep;
  }
  if (!formdata.gstFile) {
    errors.gstFile = "GST file is required";
    activeStep = activeStep === 6 ? 3 : activeStep;
  }
  if (!formdata.registrationNumber) {
    errors.registrationNumber = "Registration number is required";
    activeStep = activeStep === 6 ? 3 : activeStep;
  }
  if (!formdata.registrationFile) {
    errors.registrationFile = "Registration file is required";
    activeStep = activeStep === 6 ? 3 : activeStep;
  }
  // AuthorisedSignatory
  if (!formdata.listOfDirectors) {
    errors.listOfDirectors = "List of directors is required";
    activeStep = activeStep === 6 ? 4 : activeStep;
  }
  if (!formdata.directorName) {
    errors.directorName = "Director name is required";
    activeStep = activeStep === 6 ? 4 : activeStep;
  }
  if (!formdata.directorPanNumber) {
    errors.directorPanNumber = "Director PAN number is required";
    activeStep = activeStep === 6 ? 4 : activeStep;
  }
  if (!formdata.directorPAN) {
    errors.directorPAN = "Director PAN is required";
    activeStep = activeStep === 6 ? 4 : activeStep;
  }
  if (!formdata.addressProof) {
    errors.addressProof = "Address proof is required";
    activeStep = activeStep === 6 ? 4 : activeStep;
  }
  if (!formdata.aadhaarNumber) {
    errors.aadhaarNumber = "Aadhaar number is required";
    activeStep = activeStep === 6 ? 4 : activeStep;
  }
  if (!formdata.aadhaarCardMasked) {
    errors.aadhaarCardMasked = "Aadhaar card masked file is required";
    activeStep = activeStep === 6 ? 4 : activeStep;
  }
  // bank details
  if (!formdata.accountHolderName) {
    errors.accountHolderName = "Account holder name is required";
    activeStep = activeStep === 6 ? 5 : activeStep;
  }
  if (!formdata.accountNumber) {
    errors.accountNumber = "Account number is required";
    activeStep = activeStep === 6 ? 5 : activeStep;
  }
  if (!formdata.ifscCode) {
    errors.ifscCode = "IFSC code is required";
    activeStep = activeStep === 6 ? 5 : activeStep;
  }
  if (!formdata.bankName) {
    errors.bankName = "Bank name is required";
    activeStep = activeStep === 6 ? 5 : activeStep;
  }
  if (!formdata.branchName) {
    errors.branchName = "Branch name is required";
    activeStep = activeStep === 6 ? 5 : activeStep;
  }
  if (!formdata.cancelledCheque) {
    errors.cancelledCheque = "Cancelled cheque is required";
    activeStep = activeStep === 6 ? 5 : activeStep;
  }
  // Documents
  if (!formdata.memorandumOfAssociation) {
    errors.memorandumOfAssociation = "Memorandum of Association is required";
  }
  if (!formdata.articlesOfAssociation) {
    errors.articlesOfAssociation = "Articles of Association is required";
  }
  if (!formdata.certificateOfIncorporation) {
    errors.certificateOfIncorporation =
      "Certificate of Incorporation is required";
  }
  if (!formdata.merchantRegistrationForm) {
    errors.merchantRegistrationForm = "Merchant Registration Form is required";
  }
  if (!formdata.gstCertificate) {
    errors.gstCertificate = "GST Certificate is required";
  }
  if (!formdata.boardResolution) {
    errors.boardResolution = "Board Resolution is required";
  }
  if (!formdata.NCIFRegistrationForms) {
    errors.NCIFRegistrationForms = "NCIF Registration Forms are required";
  }
  if (!formdata.SubMerchantTemplates) {
    errors.SubMerchantTemplates = "Sub Merchant Templates are required";
  }
  if (!formdata.BO) {
    errors.BO = "BO is required";
  }
  if (!formdata.customerEnquiryQuestions) {
    errors.customerEnquiryQuestions = "Customer Enquiry Questions are required";
  }
  if (!formdata.officeBuildingPhoto) {
    errors.officeBuildingPhoto = "Office Building Photo is required";
  }
  if (!formdata.officePhoto) {
    errors.officePhoto = "Office Photo is required";
  }
  return {
    errors,
    activeStep,
  };
};
