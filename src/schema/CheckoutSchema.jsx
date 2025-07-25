import * as Yup from "yup";
import { Validation } from "../constants/Validation.js";



export const CheckoutSchema = Yup.object({
    custVpa: Yup.string().required(Validation.required.message.replaceAll("^","UPI Id"))
                    .matches(Validation.vpa.regex , Validation.vpa.message),
   
   
})