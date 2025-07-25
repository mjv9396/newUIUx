import React, { useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { TextField, Button, Box, Card, CardContent } from "@mui/material";
import "./InformationCollection.css";
import FormikControl from "../wrapperComponents/FormikControl.js";
import { InformationCollectionSchema } from "../../schema/InformationCollectionSchema.jsx";
import { InformationCollectionModel } from "../../model/InformationCollectionModel.ts";
import { AuthService } from "../../service/AuthService.ts";
import { msgTypes } from "../../constants/msgTypes.js";
import { LoginModel } from "../../model/LoginModel.ts";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const InformationCollection = () => {
  const [initialValue, setInitialValue] = useState(
    new InformationCollectionModel()
  );
  const navigate = useNavigate();

  const submitForm = async (values: InformationCollectionModel) => {
    // console.log("inside submit form", values);
    const appId = msgTypes.APP_ID;
    const saltId = msgTypes.SALT_ID;
    // const loginRequestData = new LoginModel();
    // loginRequestData.username = msgTypes.USERNAME;
    // loginRequestData.password = msgTypes.PASSWORD;
    // const res = await AuthService.generatetoken(loginRequestData);

    // if (res?.token !== null && res?.token !== undefined) {
    const encryptResponse = await AuthService.encrypt(
      JSON.stringify(values),
      appId,
      saltId
    );
    // console.log("encrypted response", encryptResponse);
    // const token = res.token;
    // console.log("token", token);
    const requestData = { appId: msgTypes.APP_ID, data: encryptResponse };
    const response = await AuthService.checkoutPaymentInit(requestData);
    if (msgTypes.SUCCESS_CODE.includes(response.statusCode)) {
      // console.log("payment link", response.data.paymentLink);
      const splitData = response.data.paymentLink.split("/pay/");
      const id = splitData[1];
      // console.log("id", id);
      navigate("/pay/" + id);
    } else {
      toast.error(response.data);
    }
    // }
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initialValue}
        validationSchema={InformationCollectionSchema}
        onSubmit={submitForm}
      >
        {({ isValid, dirty, isSubmitting, values }) => (
          <Box
            display="flex"
            justifyContent="center"
            marginTop={5}
            marginBottom={5}
          >
            <Card>
              <CardContent>
                <Form>
                  <div className="row p-4 ">
                    {/* <div className="col-lg-6 col-md-6">
                      <FormikControl control='textfield'
                        name='username'
                        label="User Name"
                        placeholder="Enter User Name"
                        requiredField

                      />
                    </div>
      
                    <div className="col-lg-6 col-md-6">
                      <FormikControl control='textfield'
                        name='password'
                        label="Password"
                        placeholder="Enter Password"
                        requiredField
                      />
                    </div> */}

                    <div className="col-lg-6 col-md-6">
                      <FormikControl
                        control="textfield"
                        name="appId"
                        label="App Id"
                        placeholder="Enter App Id"
                        requiredField
                      />
                    </div>
                    <div className="col-lg-6 col-md-6">
                      <FormikControl
                        control="textfield"
                        name="orderId"
                        label="Order Id"
                        placeholder="Enter Order Id"
                        requiredField
                      />
                    </div>

                    <div className="col-lg-6 col-md-6">
                      <FormikControl
                        control="textfield"
                        name="amount"
                        label="Amount"
                        placeholder="Enter Amount"
                        requiredField
                      />
                    </div>
                    <div className="col-lg-6 col-md-6">
                      <FormikControl
                        control="textfield"
                        name="custEmail"
                        label="Email"
                        placeholder="Enter Email"
                        requiredField
                      />
                    </div>
                    <div className="col-lg-6 col-md-6">
                      <FormikControl
                        control="textfield"
                        name="custPhone"
                        label="Customer Phone"
                        placeholder="Enter Customer Phone"
                        requiredField
                      />
                    </div>
                    <div className="col-lg-6 col-md-6">
                      <FormikControl
                        control="textfield"
                        name="currencyCode"
                        label="Currency Code"
                        placeholder="Enter Currency Code"
                        requiredField
                      />
                    </div>

                    <div className="col-lg-6 col-md-6">
                      <FormikControl
                        control="textfield"
                        name="returnUrl"
                        label="Return Url"
                        placeholder="Enter Return URL"
                        requiredField
                      />
                    </div>

                    <div className="col-lg-6 col-md-6">
                      <FormikControl
                        control="textfield"
                        name="transactionType"
                        label="Transaction Type"
                        placeholder="Enter Transaction Type"
                        requiredField
                      />
                    </div>

                    <div className="col-lg-6 col-md-6">
                      <FormikControl
                        control="textfield"
                        name="productDesc"
                        label="Product Description"
                        placeholder="Enter Product Description"
                        requiredField
                      />
                    </div>

                    <div className="col-12 mt-3 d-flex justify-content-end">
                      <FormikControl
                        control="button"
                        className="btn-submit btn"
                        color="primary"
                        label="Submit"
                        type="submit"
                        disabled={!dirty || !isValid}
                      />
                      &nbsp;&nbsp;
                      <FormikControl
                        control="button"
                        className="btn-cancel btn"
                        color="warning"
                        label="Reset"
                        type="reset"
                      />
                    </div>
                  </div>
                </Form>
              </CardContent>
            </Card>
          </Box>
        )}
      </Formik>
    </>
  );
};

export default InformationCollection;
