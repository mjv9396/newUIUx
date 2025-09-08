export const mapAcquirerProfile = (id) => {
  return {
    acqProfileId: "",
    userId: id,
    acqCode: "",
    transferMode: "",
    currencyCode: "",
    isActive: "false",
    priority: "",
    amountLimit: "",
  };
};
export const addChargingDetailList = {
  bankMinTxnAmount: "",
  bankMaxTxnAmount: "",
  bankTdr: "",
  bankPreference: "",
  merchantMinTxnAmount: "",
  merchantMaxTxnAmount: "",
  merchantTdr: "",
  merchantPreference: "",
  vendorCommision: "",
  gst: "",
  isSlabeEnable: "true",
  acquirer: "",
  transferMode: "",
  userId: "",
  currencyCode: "",
};
export const addLoadMoney = {
  userId: "",
  transactionAmount: "",
  transactionReceiptId: "",
  remark: "",
};
export const serachPayoutTransaction = {
  start: "0",
  size: "25",
  userId: "",
  dateFrom: "",
  dateTo: "",
  txnStatus: "",
  txnType: "",
  orderId: "",
  txnId: "",
  utrNumber: "",
  keyword: "",
  pgAcqCode: "",
};
export const transactionList = {
  start: "0",
  size: "25",
  userId: "",
  pgAcqCode: "",
  txnStatus: "",
  dateFrom: "",
  dateTo: "",
  txnId: "",
  orderId: "",
  utrNumber: "",
};
export const addbeneficiary = {
  name: "",
  nickname: "",
  mobile: "",
  email: "",
  accountNo: "",
  ifscCode: "",
};

export const addVPA = {
  name: "",
  nickname: "",
  mobile: "",
  email: "",
  vpaAddress: "",
};

export const sendMoney = {
  orderId: "",
  name: "",
  nickname: "",
  mobile: "",
  email: "",
  accountNo: "",
  ifscCode: "",
  transactionAmmount: "",
  transactionBankTransferMode: "",
  vpaAddress: "",
};

export const existingVPA = {
  beneficiaryId: "",
  transactionAmmount: "",
  transactionBankTransferMode: "",
};
export const addNewVPA = {
  name: "",
  nickname: "",
  mobile: "",
  email: "",
  vpaAddress: "",
  transactionAmmount: "",
  transactionBankTransferMode: "",
};

export const ledgerStatement = {
  userId: "",
  dateFrom: "",
  dateTo: "",
};

export const remittanceReport = {
  start: "",
  size: "",
  userId: "",
  dateFrom: "",
  dateTo: "",
};

export const internalTransfer = {
  amount: "",
  merchantAppId: "",
  reenterMerchantAppId: "",
  captcha: "",
};

export const addAcquirerProfile = {
  acqCode: "",
  currencyCode: "",
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  password: "",
  acqPassword: "",
  merchantId: "",
  txnKey: "",
  userName: "",
  clientId: "",
  clientSecret: "",
  corporateCode: "",
  corporateProductCode: "",
  channelId: "",
  virtualIfsc: "",
  debitAccount: "",
  accessToken: "",
  paymentTxnToken: "",
  paymentStatusToken: "",
  dailyAmountLimit: "",
  merchantVPA: "",
  merchantVirtualAccount: "",
  isVPA: "",
  isVirtualAccount: "",
  bankCode1: "",
  bankCode2: "",
  virtualCode: "@",
  isActive: "true",
};

export const downloadReport = {
  txnStatus: "",
  dateFrom: "",
  dateTo: "",
  userId: "",
};
