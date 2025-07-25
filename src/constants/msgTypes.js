export const msgTypes = {
  APP_ID: "APP315796524644",
  SALT_ID: "9f6fc8c7775c4c42",

  // APP_ID: "APP752089274926",
  // SALT_ID: "2fe9b5395c714eef",

  USERNAME: "user@atmoon.com",
  PASSWORD: "Test@123",

  KEY_LENGTH: 256, // Key length in bits
  ITERATION_COUNT: 65536, // Iteration count for PBKDF2
  UPI: {
    INTENT: "INTENT",
    COLLECT: "COLLECT",
    QR: "QR",
  },

  PAYMENT_METHOD: {
    QR: "QR",
    UPI: "UPI",
    CARD: "CARD",
    NETBANKING: "NETBANKING",
    WALLET: "WALLET",
  },

  PAYMENT_TYPE: {
    UP: "UP",
    WL: "WL",
    CD: "CD",
    NB: "NB",
  },

  SUCCESS_CODE: [200],

  SUCCESS: "SUCCESS",
  PENDING: "SENTTOBANK",
  CANCELLED: "CANCELLED",
  FAILED: "FAILED",
};
