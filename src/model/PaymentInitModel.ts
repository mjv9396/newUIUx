import { PaymentTypeModel } from "./PaymentTypeModel.ts";
import { TransactionPayinRequestModel } from "./TransactionPayinRequestModel.ts";

export class PaymentInitModel{
    transactionPayinRequest : TransactionPayinRequestModel;
    paymentType: PaymentTypeModel;
    constructor(){
        this.transactionPayinRequest = new TransactionPayinRequestModel();
        this.paymentType = new PaymentTypeModel();
    }
}