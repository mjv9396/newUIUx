import * as Yup from "yup";
import { Validation } from "../constants/Validation.js";



export const InformationCollectionSchema = Yup.object({
    appId: Yup.string().required(Validation.required.message.replaceAll("^","App Id"))
                    .matches(Validation.plaintext.regex , Validation.plaintext.message),
    orderId: Yup.string().required(Validation.required.message.replaceAll("^","OrderId"))
                    .matches(Validation.plaintext.regex , Validation.plaintext.message),
    amount: Yup.string().required(Validation.required.message.replaceAll("^","Amount"))
                    .matches(Validation.amount.regex , Validation.amount.message),
    custEmail: Yup.string().required(Validation.required.message.replaceAll("^","Email"))
                    .matches(Validation.email.regex , Validation.email.message),
    custPhone: Yup.string().required(Validation.required.message.replaceAll("^","Phone"))
                    .matches(Validation.mobile.regex , Validation.mobile.message),
    currencyCode: Yup.string().required(Validation.required.message.replaceAll("^","Currency"))
                    .matches(Validation.numeric.regex , Validation.numeric.message),
    returnUrl: Yup.string().required(Validation.required.message.replaceAll("^","Return Url"))
                    .matches(Validation.plaintext.regex , Validation.plaintext.message),
    transactionType: Yup.string().required(Validation.required.message.replaceAll("^","Transaction type"))
                    .matches(Validation.plaintext.regex , Validation.plaintext.message),
    productDesc: Yup.string().required(Validation.required.message.replaceAll("^","Product Desc")),
   
})