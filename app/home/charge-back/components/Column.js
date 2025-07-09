export const headers = [
  "Chargeback ID",
  "Transaction ID ",
  "Chargeback Amount ",
  "Chargeback Date",
  "Merchant Name",
  "Payment Method ",
  "Chargeback Status ",
  "Chargeback Fee",
];

export const data = [
  {
    chargebackId: "ZEpNIaTHy12877",
    transactionId: "124e43def",
    chargebackAmount: 2000,
    chargebackDate: "21/3/2025",
    merchantName: "Razor Pay",
    paymentMethod: "RTGS",
    chargebackStatus: "Done",
    chargebackFee: 15,
  },
  {
    chargebackId: "ZEpNIaTHy13777",
    transactionId: "123e43def",
    chargebackAmount: 2900,
    chargebackDate: "23/3/2025",
    merchantName: "Phone Pay",
    paymentMethod: "NEFT",
    chargebackStatus: "Pending",
    chargebackFee: 15,
  },
  {
    chargebackId: "ZEpNIaTHy89777",
    transactionId: "433e43def",
    chargebackAmount: 4900,
    chargebackDate: "24/3/2025",
    merchantName: "Amazon Pay",
    paymentMethod: "UPI",
    chargebackStatus: "Failed",
    chargebackFee: 15,
  },
];
