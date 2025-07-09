import { decryptParams } from "../utils/decryptions";

export const bankAccount = {
  bankName: "",
  branchName: "",
  bankAccountNumber: "",
  ifscCode: "",
  cardNumber: "",
  vpa: "",
};

export const updateBankDetails = (responseBank, param) => {
  return {
    bankDetailId: responseBank?.bankDetailId || "",
    bankName: responseBank?.bankName || "",
    branchName: responseBank?.branchName || "",
    bankAccountNumber: responseBank?.bankAccountNumber || "",
    ifscCode: responseBank?.ifscCode || "",
    cardNumber: responseBank?.cardNumber || "",
    vpa: responseBank?.vpa || "",
    user: {
      userId: decryptParams(param.merchantId),
    },
    
  };
};

export const updateBusinessDetails = (responseBusiness, param) => {
  return {
    id: responseBusiness.id,
    businessName: responseBusiness.businessName,
    companyRegistrationNo: responseBusiness.companyRegistrationNo || "",
    businessEmail: responseBusiness.businessEmail || "",
    phone: responseBusiness.phone || "",
    websiteUrl: responseBusiness.websiteUrl || "",
    city: responseBusiness.city || "",
    panSsn: responseBusiness.panSsn || "",
    gstVat: responseBusiness.gstVat || "",
    setupIntegrationFees: responseBusiness.setupIntegrationFees || 0,
    wireTransferFees: responseBusiness.wireTransferFees || 0,
    settlementFees: responseBusiness.settlementFees || 0,
    minimumSettlementAmount: responseBusiness.minimumSettlementAmount || 0,
    user: {
      userId: decryptParams(param.merchantId),
    },
  };
};
