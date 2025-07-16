export const addCountry = {
  countryName: "",
  isoCodeAlpha2: "",
  isoCodeAlpha3: "",
  unCode: "",
  currency: "",
  isdCode: "",
  isActive: "true",
};

export const addCurrency = {
  currencyName: "",
  currencyCode: "",
  currencyNumber: "",
  currencyDecimalPlace: "",
  isActive: "true",
};

export const addPaymentType = {
  paymentTypeName: "",
  paymentTypeCode: "",
  countryCode: "",
  currencyCode: "",
  isActive: "true",
};

export const addMopType = {
  mopName: "",
  mopCode: "",
  countryCode: "",
  currencyCode: "",
  paymentTypeCode: "",
  isActive: "true",
  isDowntime: "false",
};

export const addAcquirer = {
  acqName: "",
  acqCode: "",
  isActive: "true",
};

export const addAcquirerProfile = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  password: "",
  dailyAmountLimit: "",
  acqCode: "",
  acqName: "",
  currencyCode: "",
  merchantId: "",
  acqPassword: "",
  txnKey: "",
  userAccountState: "ACTIVE",
  isActive: true,
  userName: "",
  clientId: "",
  clientSecret: "",
  corporateCode: "",
  corporateProductCode: "",
  channelId: "",
  merchantVPA: "",
  merchantVirtualAccount: "",
  virtualIfsc: "",
  accessToken: "",
  paymentTxnToken: "",
  paymentStatusToken: "",
  debitAccount: "",

  isVPA: "",
  isVirtualAccount: "",
  bankCode1: "",
  bankCode2: "",
  virtualCode: "@",
};

export const chargingDetaiList = {
  userId: "",
  acqCode: "",
};
export const payoutChargingDetailList = {
  userId: "",
  acquirer: "",
};

export const addChargingDetailList = {
  userId: "",
  acqCode: "",
  currencyCode: "",
  paymentTypeCode: "",
  mopCode: "",
  transactionType: "",
  bankMinTxnAmount: "",
  bankMaxTxnAmount: "",
  bankTdr: "",
  bankPreference: "",
  merchantMinTxnAmount: "",
  merchantMaxTxnAmount: "",
  merchantTdr: "",
  merchantPreference: "",
  gst: "",
  vendorCommision: "",
  rollingReserve: "",
};

export const mapAcquirerProfile = (id) => {
  return {
    acqProfileId: "",
    userId: id,
    acqCode: "",
    mopCode: "",
    paymentTypeCode: "",
    transactionType: "",
    currencyCode: "",
    isActive: "false",
    priority: "",
    amountLimit: "",
  };
};

export const settlement = (id, type = "", active = true) => {
  return {
    settlementType: type,
    day: "",
    settlementTime: "",
    hours: "",
    amount: "",
    userId: id,
    settlementActive: active,
  };
};
export const settlementReport = {
  start: "",
  size: "25",
  userId: "",
  dateFrom: "",
  dateTo: "",
  txnStatus: "",
  pgAcqCode: "",
};
export const downloadReport = {
  txnStatus: "",
  dateFrom: "",
  dateTo: "",
  username: "",
};

export const dispute = {
  userId: "",
  orderId: "",
  txnId: "",
  dateFrom: "",
  dateTo: "",
};
