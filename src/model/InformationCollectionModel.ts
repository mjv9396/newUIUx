import { msgTypes } from "../constants/msgTypes";

export class InformationCollectionModel {
    appId: string;
    orderId: string;
    amount: string;
    custEmail: string;
    custPhone: string;
    currencyCode: string;
    returnUrl: string;
    transactionType: string;
    productDesc: string;
    constructor() {
        this.appId = msgTypes.APP_ID;
        this.orderId = "";
        this.amount = "100";
        this.custEmail = "johnwilson@gmail.com";
        this.custPhone = "9987564321";
        this.currencyCode = "356";
        this.returnUrl = "https://pgapi.atmoondps.com/response-page";
        this.transactionType = "SALE";
        this.productDesc = "Transaction";


    }
}