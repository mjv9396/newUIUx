import { GetUserId } from "../services/cookieStore";

export const kycFormData = {
  userId: GetUserId(), // User ID from cookies
  kycType: "individual", // 'B' for Business KYC, 'P' for Personal KYC
  // company details
  email: "",
  companyName: "",
  companyType: "",
  companyCategory: "",
  companyPhone: "",
  companyEmail: "",
  companyWebsite: "",

  // registration details
  companyPan: "",
  companyPanFile: "", // file
  gstNumber: "",
  gstFile: "", // file
  registrationNumber: "", // LLP No. if LLP, CIN if Pvt Ltd, etc.
  registrationFile: "", // file

  // AuthorisedSignatory
  listOfDirectors: "", //file
  directorName: "",
  directorPanNumber: "",
  directorPAN: "", //file
  addressProof: "", //file
  aadhaarCardMasked: "", //file

  // bank details
  accountHolderName: "",
  accountNumber: "",
  ifscCode: "",
  bankName: "",
  branchName: "",
  cancelledCheque: "",

  // Documents
  memorandumOfAssociation: "", // file
  articlesOfAssociation: "", // file
  certificateOfIncorporation: "", // file
  merchantRegistrationForm: "", // file
  gstCertificate: "", // file
  boardResolution: "", // file
  NCIFRegistrationForms: "", // file
  SubMerchantTemplates: "", // file
  BO: "", // file
  customerEnquiryQuestions: "", // file
  officeBuildingPhoto: "", // file
  officePhoto: "", // file
};
