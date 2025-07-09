import { use } from "react";

export const addLoadMoney = () => {
  return {
    merchant: "",
    utrNo: "",
    amount: "",
  };
};

export const addPaymentLink = () => {
  return {
    txnType: "",
    countryCode: "",
    currencyCode: "",
    merchantId: "",
    payableAmount: "",
    ordRequestId: "",
    customerName: "",
    customerEmailId: "",
    customerContactNumber: "",
    notifyEmail: "",
    notifyPhone: "",
    // notifyDate: "",
    expDate: "",
  };
};

export const loadMoney = () => {
  return {
    userId: "",
    currencyId: "",
    amount: "",
    remark: "",
    receiptId: "",
    receiptImage: null,
  };
};

export const addBankBeneficiary = (id) => {
  return {
    userId: id,
    currencyId: "",
    beneficiaryName: "",
    beneficiaryContactNumber: "",
    beneficiaryEmail: "",
    beneficiaryNickName: "",
    paymentType: "BANK", // Default to Bank Transfer
    beneficiaryBankName: "",
    accountNumber: "",
    ifscCode: "",
    vpa: "",
  };
};
export const addVPABeneficiary = () => {
  return {
    name: "",
    contactNumber: "",
    email: "",
    vpaAddress: "",
  };
};

export const directTransferMoney = () => {
  return { transferId: "", benficiaryName: "" };
};

export const addSinglePayout = () => {
  return {
    appKey: "",
    amount: "",
    transferType: "single",
    countryCode: "",
    currencyCode: "",
    transferMode: "",
    orderId: "",
    contactNumber: "",
    email: "",
    remark: "",
    beneficiaryName: "",
    beneficiaryBankName: "",
    beneficiaryAccount: "",
    beneficiaryIFSCCode: "",
    vpaAddress: "",
    returnUrl: "https://pg-Atmoon.in/resonse",
  };
};
