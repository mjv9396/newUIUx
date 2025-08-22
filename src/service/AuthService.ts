import axios from "axios";
import ApiUrl from "./ApiUrl.ts";
import CryptoJS from "crypto-js";
import { msgTypes } from "../constants/msgTypes.js";
import { RouteType } from "../constants/RouteType.js";
import { LoginModel } from "../model/LoginModel.ts";
import { ResponseModel } from "../model/ResponseModel.ts";
import { PaymentInitModel } from "../model/PaymentInitModel.ts";
import { TransactionPayinRequestModel } from "../model/TransactionPayinRequestModel.ts";
export class AuthService {
  //
  static generatetoken = async (credentials: LoginModel) => {
    const url = ApiUrl.baseUrl + RouteType.SERVICE + RouteType.LOGIN;
    const res = await axios.post<string>(url, JSON.stringify(credentials), {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });
    return JSON.parse(JSON.stringify(res.data));
  };

  static checkoutPaymentInit = async (requestData) => {
    const url = ApiUrl.baseUrl + RouteType.CHECKOUT + RouteType.PAYMENTINIT;
    const res = await axios.post<string>(url, requestData, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        // 'Authorization': 'Bearer '
      },
    });
    return JSON.parse(JSON.stringify(res.data));
  };

  static payNow = async (requestData: TransactionPayinRequestModel) => {
    const url = ApiUrl.baseUrl + RouteType.CHECKOUT + RouteType.PAY;
    const res = await axios.post<string>(url, requestData, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        // 'Authorization': 'Bearer ' + token
      },
    });
    return JSON.parse(JSON.stringify(res.data));
  };

  static paymentActive = async (requestData: Object) => {
    // console.log(
    //   "🚀 ~ AuthService ~ paymentActive= ~ requestData:",
    //   requestData
    // );
    const url = ApiUrl.baseUrl + RouteType.CHECKOUT + RouteType.PAYMENT_ACTIVE;
    const res = await axios.post<string>(url, requestData, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        // 'Authorization': 'Bearer ' + token
      },
    });
    // console.log(
    //   "🚀 ~ AuthService ~ paymentActive= ~ JSON.parse(JSON.stringify(res.data)):",
    //   JSON.parse(JSON.stringify(res.data))
    // );

    return JSON.parse(JSON.stringify(res.data));
  };

  static checkStatus = async (requestData, token: string) => {
    const url = ApiUrl.baseUrl + RouteType.CHECKOUT + RouteType.STATUS;
    const res = await axios.post<string>(url, requestData, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Authorization: "Bearer " + token,
      },
    });
    return JSON.parse(JSON.stringify(res.data));
  };

  static submitTransactionPurpose = async (requestData: { txnId: string; txnPurpose: string }) => {
    const url = ApiUrl.baseUrl + "/transaction-purpose";
    const res = await axios.post<string>(url, requestData, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });
    return JSON.parse(JSON.stringify(res.data));
  };

  // Encrypt function
  static encrypt = async (
    strToEncrypt: string,
    secretKey: string,
    salt: string
  ) => {
    const ITERATION_COUNT = msgTypes.ITERATION_COUNT;
    const KEY_LENGTH = msgTypes.KEY_LENGTH; // AES-256 key length
    try {
      const iv = CryptoJS.lib.WordArray.random(16); // 16 bytes for AES block size
      const key = CryptoJS.PBKDF2(secretKey, salt, {
        keySize: KEY_LENGTH / 32, // 256 bits / 32 bits per word = 8 words
        iterations: ITERATION_COUNT,
      });
      const encrypted = CryptoJS.AES.encrypt(strToEncrypt, key, {
        iv: iv,
        padding: CryptoJS.pad.Pkcs7, // Equivalent to PKCS5Padding in Java
        mode: CryptoJS.mode.CBC, // CBC mode
      });
      const encryptedData = iv.concat(encrypted.ciphertext);
      return encryptedData.toString(CryptoJS.enc.Base64);
    } catch (error) {
      console.error("Encryption failed", error);
      return null;
    }
  };

  // AES decryption function
  static decrypt = (strToDecrypt, secretKey, salt) => {
    try {
      const encryptedData = CryptoJS.enc.Base64.parse(strToDecrypt);
      const iv = CryptoJS.lib.WordArray.create(encryptedData.words.slice(0, 4)); // First 16 bytes (IV)
      const cipherText = CryptoJS.lib.WordArray.create(
        encryptedData.words.slice(4)
      );
      const key = CryptoJS.PBKDF2(secretKey, salt, {
        keySize: msgTypes.KEY_LENGTH / 32, // 256 bits / 32 bits per word = 8 words
        iterations: msgTypes.ITERATION_COUNT,
      });
      const decrypted = CryptoJS.AES.decrypt({ ciphertext: cipherText }, key, {
        iv: iv,
        padding: CryptoJS.pad.Pkcs7, // Equivalent to PKCS5Padding in Java
        mode: CryptoJS.mode.CBC, // CBC mode
      });
      const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
      return decryptedText;
    } catch (error) {
      console.error("Decryption failed", error);
      return null;
    }
  };

  //For Encryprtion and Decryption
  static postCryptoRequest = async (apiUrl: string, requestJsonStr: string) => {
    apiUrl = ApiUrl.baseUrl + apiUrl;
    const res = await axios.post<string>(apiUrl, requestJsonStr, {
      responseType: "text" as "json",
    });
    return res;
  };
}
