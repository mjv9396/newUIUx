import { useState, useEffect } from "react";
import * as React from "react";
import "./CheckoutPage.css";
import "./CheckoutPage1.css";
import { useLocation, useNavigate } from "react-router-dom";
import { TransactionPayinRequestModel } from "../../model/TransactionPayinRequestModel.ts";
import { PaymentTypeModel } from "../../model/PaymentTypeModel.ts";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import {
  Avatar,
  Box,
  Button,
  LinearProgress,
  ListItemAvatar,
  Typography,
} from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { msgTypes } from "../../constants/msgTypes.js";
import UpiCollect from "./upi/UpiCollect.tsx";
import { Formik, Form } from "formik";
import { CheckoutSchema } from "../../schema/CheckoutSchema.jsx";
import { PaymentInitModel } from "../../model/PaymentInitModel.ts";
import { AuthService } from "../../service/AuthService.ts";
import { toast } from "react-toastify";
import { LoginModel } from "../../model/LoginModel.ts";
import UpiIntent from "./upi/UpiIntent.tsx";
import TransactionPurposePopup from "./TransactionPurposePopup.tsx";

import { MobileView } from "react-device-detect";
import UpiQr from "./upi/UpiQr.tsx";
import Loading from "../loader/Loading.tsx";
const CheckoutPage = () => {
  const { pathname } = useLocation();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string>("");
  const [paymentInitModel, setPaymentInitModel] = React.useState(
    new PaymentInitModel()
  );
  const [payinRequest, setPayinRequest] = React.useState(
    new TransactionPayinRequestModel()
  );
  const [paymentType, setPaymentType] = React.useState(new PaymentTypeModel());
  const [apiCall, setApiCall] = React.useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = React.useState("");
  const [selectedMopType, setSelectedMopType] = React.useState<string[]>([]);
  const [amount, setAmount] = React.useState("0.00");
  const [transactionId, setTransactionId] = React.useState("");
  const [showTransactionPurposePopup, setShowTransactionPurposePopup] =
    React.useState(false);
  const [transactionPurposeSubmitted, setTransactionPurposeSubmitted] =
    React.useState(false);
  const [transactionPurposeLoading, setTransactionPurposeLoading] =
    React.useState(false);
  const [txnId, setTxnId] = React.useState("");
  const navigate = useNavigate();

  // React.useEffect(() => {
  //     if (location.state) {
  //         payentActive();
  //     }
  // }, [location?.state])

  const payentActive = async () => {
    setLoading(true);
    try {
      const id = pathname.split("/pay/")[1];
      setTxnId(id);
      const requestData = { appId: msgTypes.APP_ID, txnPayinId: id };
      const response = await AuthService.paymentActive(requestData);

      if (msgTypes.SUCCESS_CODE.includes(response.statusCode)) {
        setPaymentInitModel(response.data);
        setPayinRequest(response.data.transactionPayinRequest);
        setPaymentType(response.data.paymentType);
        setSelectedPaymentMethod(
          availablePaymentMethod(response.data.paymentType)
        );
        setTransactionId(response.data.transactionPayinRequest.txnId);
        setAmount(
          isNaN(parseFloat(response.data.transactionPayinRequest.amount))
            ? "0.00"
            : parseFloat(response.data.transactionPayinRequest.amount).toFixed(
                2
              )
        );

        // Data loaded successfully, stop loading first, then show popup
        setLoading(false);
        // Small delay to ensure loading state is updated before showing popup
        setTimeout(() => {
          setShowTransactionPurposePopup(true);
        }, 100);
      } else {
        // Handle API error responses
        const errorMessage = response.data || "Failed to load payment details";
        setError(errorMessage);
        toast.error(errorMessage);
        console.error("Payment active API error:", response);
      }
    } catch (error) {
      // Handle network or other errors
      const errorMessage = "Failed to load payment details. Please try again.";
      setError(errorMessage);
      console.error("Error in paymentActive:", error);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const availablePaymentMethod = (paymentType: PaymentTypeModel) => {
    if (paymentType?.UP) {
      setSelectedMopType(paymentType?.UP);
      return msgTypes.PAYMENT_METHOD.UPI;
    } else if (paymentType?.CD) {
      setSelectedMopType(paymentType?.CD);
      return msgTypes.PAYMENT_METHOD.CARD;
    } else if (paymentType?.NB) {
      setSelectedMopType(paymentType?.NB);
      return msgTypes.PAYMENT_METHOD.NETBANKING;
    } else if (paymentType?.WL) {
      setSelectedMopType(paymentType?.WL);
      return msgTypes.PAYMENT_METHOD.WALLET;
    } else {
      return "";
    }
  };

  const payNow = async (requestData: TransactionPayinRequestModel) => {
    setApiCall(true);
    const response = await AuthService.payNow(requestData);
    if (msgTypes.SUCCESS_CODE.includes(response.statusCode)) {
      setApiCall(false);
      const res = response.data;
      if (res.txnStatus === msgTypes.PENDING) {
        navigate("/loader", {
          state: { request: requestData },
        });
      }
    } else {
      setApiCall(false);
      toast.error(response.data);
    }
  };

  const generateToken = async () => {
    const loginRequestData = new LoginModel();
    loginRequestData.username = msgTypes.USERNAME;
    loginRequestData.password = msgTypes.PASSWORD;
    const res = await AuthService.generatetoken(loginRequestData);
    if (res.token) {
      return res.token;
    } else {
      return "";
    }
  };

  const handleTransactionPurposeSubmit = async (txnPurpose: string) => {
    setTransactionPurposeLoading(true);
    try {
      const   requestData = {
        transactionId: transactionId,
        transactionPurpose: txnPurpose,
      };

      const response = await AuthService.submitTransactionPurpose(requestData);

      if (msgTypes.SUCCESS_CODE.includes(response.statusCode)) {
        setTransactionPurposeSubmitted(true);
        setShowTransactionPurposePopup(false);
        toast.success("Transaction purpose submitted successfully");
      } else {
        toast.error(response.data || "Failed to submit transaction purpose");
      }
    } catch (error) {
      console.error("Error submitting transaction purpose:", error);
      toast.error("Failed to submit transaction purpose. Please try again.");
    } finally {
      setTransactionPurposeLoading(false);
    }
  };
  React.useEffect(() => {
    payentActive();
  }, []);
  return (
    <>
      {loading ? (
        <Loading />
      ) : error ? (
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          minHeight="98vh"
          overflow={"hidden"}
          padding={5}
        >
          <TransactionPurposePopup
            open={true}
            txnId={txnId}
            onSubmit={handleTransactionPurposeSubmit}
            loading={transactionPurposeLoading}
          />
          <div className="text-center">
            <Typography
              variant="h4"
              color="error"
              sx={{ mb: 3, fontWeight: "bold" }}
            >
              Payment Error
            </Typography>
            <Typography variant="body1" sx={{ mb: 4 }}>
              {error}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setError("");
                payentActive();
              }}
            >
              Retry
            </Button>
          </div>
        </Box>
      ) : (
        <>
          {/* Transaction Purpose Popup */}
          <TransactionPurposePopup
            open={showTransactionPurposePopup}
            txnId={txnId}
            onSubmit={handleTransactionPurposeSubmit}
            loading={transactionPurposeLoading}
          />

          {/* Main Checkout Content - always render but disable interaction when popup is open */}
          <Formik
            enableReinitialize={true}
            initialValues={{ custVpa: "" }}
            validationSchema={CheckoutSchema}
            onSubmit={(values) => {
              if (!showTransactionPurposePopup && transactionPurposeSubmitted) {
                const requestData = payinRequest;
                if (selectedPaymentMethod === msgTypes.PAYMENT_METHOD.UPI) {
                  requestData.paymentTypeCode = msgTypes.PAYMENT_TYPE.UP;
                  if (values.custVpa !== "") {
                    requestData.custVpa = values.custVpa;
                  }
                  requestData.mopCode = msgTypes.UPI.COLLECT;
                }
                payNow(requestData);
              }
            }}
          >
            {({ isValid, dirty, isSubmitting, values }) => (
              <Form>
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  minHeight="100vh"
                  padding={5}
                  sx={{
                    filter: showTransactionPurposePopup ? "blur(3px)" : "none",
                    pointerEvents: showTransactionPurposePopup
                      ? "none"
                      : "auto",
                    opacity: showTransactionPurposePopup ? 0.7 : 1,
                  }}
                >
                  <div
                    className="row bg-grey-secondary border-radius-md-20 border-radius-tl-20 border-radius-tr-20 box-shadow-primary border-primary"
                    id="custom-container-row"
                  >
                    <div className="col-12 bg-white d-flex  align-items-center py-15 border-radius-tl-20 border-radius-tr-20 d-md-none">
                      <button className="font-size-20 text-primary d-md-none border-none bg-none">
                        <i className="pg-icon icon-menu d-block"></i>
                      </button>
                      <div id="logo-mobile">
                        <img
                          src="/images/logo.jpg"
                          alt="ATMOON"
                          height="50"
                        />
                      </div>
                    </div>
                    <div className="col-12 mobile-summary bg-white d-md-none">
                      <ul className="list-unstyled bg-grey-primary p-15 mb-15 border-radius-8 box-shadow-primary border-primary font-size-14">
                        <li className="d-flex justify-content-between">
                          <span className="text-grey-light">
                            {payinRequest.businessName}
                          </span>
                        </li>
                        <li className="d-flex justify-content-between flex-wrap">
                          <span
                            className="text-grey-lighter lang"
                            data-key="orderId"
                          >
                            Order ID
                          </span>
                          <span className="text-grey-light">
                            {payinRequest.orderId}
                          </span>
                        </li>
                      </ul>
                    </div>
                    <div className="col-12">
                      <div className="row">
                        <div
                          className="col-12 col-md-4 col-lg-3 bg-white border-radius-tl-md-20 border-right-md-grey-lighter mh-xl-525"
                          id="navigation-column"
                        >
                          <div
                            className="logo h-105 align-items-center "
                            id="logo"
                          >
                            <img
                              src="/images/logo.jpg"
                              alt="ATMOON"
                              height="60"
                              width="auto"
                            />
                          </div>
                          <List sx={{ width: "100%" }} aria-label="contacts">
                            {paymentType?.UP?.length > 0 && (
                              <ListItem disablePadding>
                                <ListItemButton
                                  selected={
                                    selectedPaymentMethod ===
                                    msgTypes.PAYMENT_METHOD.UPI
                                  }
                                  onClick={() => {
                                    setSelectedPaymentMethod(
                                      msgTypes.PAYMENT_METHOD.UPI
                                    );
                                  }}
                                >
                                  <ListItemAvatar>
                                    <Avatar>
                                      <img
                                        src="/images/bhim.png"
                                        width={"30px"}
                                        height={"30px"}
                                        alt=""
                                      ></img>
                                    </Avatar>
                                  </ListItemAvatar>
                                  <ListItemText primary="UPI" />
                                </ListItemButton>
                              </ListItem>
                            )}

                            {paymentType?.CD?.length > 0 && (
                              <ListItem disablePadding>
                                <ListItemButton
                                  selected={
                                    selectedPaymentMethod ===
                                    msgTypes.PAYMENT_METHOD.CARD
                                  }
                                  onClick={() => {
                                    setSelectedPaymentMethod(
                                      msgTypes.PAYMENT_METHOD.CARD
                                    );
                                  }}
                                >
                                  <ListItemAvatar>
                                    <Avatar>
                                      <CreditCardIcon />
                                    </Avatar>
                                  </ListItemAvatar>
                                  <ListItemText primary="Cards" />
                                </ListItemButton>
                              </ListItem>
                            )}

                            {paymentType?.NB?.length > 0 && (
                              <ListItem disablePadding>
                                <ListItemButton
                                  selected={
                                    selectedPaymentMethod ===
                                    msgTypes.PAYMENT_METHOD.NETBANKING
                                  }
                                  onClick={() => {
                                    setSelectedPaymentMethod(
                                      msgTypes.PAYMENT_METHOD.NETBANKING
                                    );
                                  }}
                                >
                                  <ListItemAvatar>
                                    <Avatar>
                                      <AccountBalanceOutlinedIcon />
                                    </Avatar>
                                  </ListItemAvatar>
                                  <ListItemText primary="Net Banking" />
                                </ListItemButton>
                              </ListItem>
                            )}
                            {paymentType?.WL?.length > 0 && (
                              <ListItem disablePadding>
                                <ListItemButton
                                  selected={
                                    selectedPaymentMethod ===
                                    msgTypes.PAYMENT_METHOD.WALLET
                                  }
                                  onClick={() => {
                                    setSelectedPaymentMethod(
                                      msgTypes.PAYMENT_METHOD.WALLET
                                    );
                                  }}
                                >
                                  <ListItemAvatar>
                                    <Avatar>
                                      <AccountBalanceWalletOutlinedIcon />
                                    </Avatar>
                                  </ListItemAvatar>
                                  <ListItemText primary="Wallet" />
                                </ListItemButton>
                              </ListItem>
                            )}
                          </List>
                          {/* <ul className="list-unstyled horizontal-nav-content mb-0 mb-md-15" id="navigation">
                                <li className="nav-list">
                                    <button id="creditLi" data-id="debitWithPin" data-type="CC" className="tabLi d-flex align-items-center ">
                                        <span className="nav-icon">
                                            <CreditCardIcon />
                                        </span>
                                        <span className="tab-span lang" data-key="card">Cards</span>
                                    </button>
                                </li>
                                <li className="nav-list">
                                    <button id="upiLi" data-id="upi" data-type="UP" className="tabLi d-flex align-items-center active">
                                        <span className="nav-icon">
                                            <img src='/images/bhim.png' width={30} height={30}></img>
                                        </span>
                                        <span className="tab-span lang" data-key="upi">UPI</span>
                                    </button>
                                </li>
                                <li className="nav-list">
                                    <button id="nbLi" data-id="netBanking" data-type="NB" className="tabLi d-flex align-items-center">
                                        <span className="nav-icon">
                                            <AccountBalanceOutlinedIcon />
                                        </span>
                                        <span className="tab-span lang" data-key="netBanking">Net Banking</span>
                                    </button>
                                </li>
                                <li className="nav-list">
                                    <button id="wlLi" data-id="wallet" data-type="WL" className="tabLi d-flex align-items-center">
                                        <span className="nav-icon">
                                            <AccountBalanceWalletOutlinedIcon />
                                        </span>
                                        <span className="tab-span lang" data-key="wallet">Wallet</span>
                                    </button>
                                </li>
                            </ul> */}
                        </div>
                        <div className="col-12 col-md-8 col-lg-6 bg-white border-radius-br-md-20 border-radius-lg-none mh-xl-525">
                          {/* <div className="row mt-md-30 mb-md-35">
                      <div className="col-12 d-flex justify-content-between align-items-center px-xl-30">
                        <div className="d-flex align-items-center custom-merchantName">
                          <button className="font-size-20 text-primary d-none d-md-block d-lg-none mr-md-15 border-none bg-none">
                            <i className="pg-icon icon-menu d-block"></i>
                          </button> */}
                          {/* <h3 id="merchantName" className="font-size-18 font-weight-medium text-black d-none d-md-block">Atmoon PG Hosted</h3> */}
                          {/* </div>
                        <div id="lang-switch-desktop">
                          <select
                            id="translate"
                            className="form-control max-width-200"
                          >
                            <option value="english">English</option>
                            <option value="hindi">Hindi</option>
                            <option value="punjabi">Punjabi</option>
                            <option value="urdu">Urdu</option>
                            <option value="arabic">Arabic</option>
                            <option value="telugu">Telugu</option>
                            <option value="tamil">Tamil</option>
                            <option value="french">French</option>
                            <option value="spanish">Spanish</option>
                            <option value="malayalam">Malayalam</option>
                            <option value="kannada">Kannada</option>
                            <option value="marathi">Marathi</option>
                          </select>
                        </div>
                      </div>
                    </div> */}
                          <div className="row paymentSections p-4 mt-20">
                            {/* {payinRequest.intentUrl &&
                            selectedPaymentMethod ===
                              msgTypes.PAYMENT_METHOD.QR && (
                              <div className="col-md-6 col-sm-12 p-0 m-0 paymentWrapper">
                                <UpiQr url={payinRequest.intentUrl || ""} />
                              </div>
                            )} */}
                            {payinRequest.intentUrl &&
                              selectedMopType.includes("QR") && (
                                <div className="col-md-6 col-sm-12 p-0 m-0 paymentWrapper">
                                  <UpiQr url={payinRequest.intentUrl} />
                                </div>
                              )}
                            <div className="col-md-6 col-sm-12 p-0 m-0">
                              {selectedPaymentMethod ===
                                msgTypes.PAYMENT_METHOD.UPI &&
                                selectedMopType.includes("COLLECT") && (
                                  <UpiCollect />
                                )}
                            </div>
                            <div className="col-md-6 col-sm-12 p-0 m-0">
                              {selectedPaymentMethod ===
                                msgTypes.PAYMENT_METHOD.UPI &&
                                selectedMopType.length === 0 && (
                                  <div>No Payment Methods available</div>
                                )}
                            </div>
                            <div className="p-2">
                              <MobileView>
                                {payinRequest.intentUrl &&
                                  selectedPaymentMethod ===
                                    msgTypes.PAYMENT_METHOD.UPI && (
                                    <UpiIntent
                                      url={payinRequest.intentUrl || ""}
                                      payinRequest={payinRequest}
                                    />
                                  )}
                              </MobileView>
                              {/* <UpiIntent
                              url={payinRequest.intentUrl || ""}
                              payinRequest={payinRequest}
                            /> */}
                            </div>
                          </div>
                        </div>
                        <div
                          className="col-12 col-lg-3 d-lg-block mh-xl-525 p-20"
                          id="summary-column"
                          style={{ background: "#15b86d" }}
                        >
                          <div className="mt-lg-95 mb-lg-50 px-xl-15">
                            <div id="summary-wrap-desktop">
                              <div className="row">
                                <div className="col-12">
                                  <h2
                                    className="font-weight-bold font-size-16  text-light txt-white border-bottom-grey-darker pb-10 mb-10 lang"
                                    data-key="summary"
                                    id="summary-title"
                                    style={{
                                      textTransform: "uppercase",
                                      letterSpacing: 2,
                                      color: "white",
                                    }}
                                  >
                                    Summary
                                  </h2>
                                  <ul
                                    className="list-unstyled mb-0 font-size-lg-24"
                                    id="order-summary"
                                  >
                                    <li
                                      className="justify-content-between pt-15   font-weight-light font-size-16"
                                      id="customerName"
                                    >
                                      <span className="txt-white text-white">
                                        {payinRequest.businessName}
                                      </span>
                                    </li>
                                    <li
                                      className="d-flex justify-content-between flex-wrap font-weight-light border-bottom-grey-darker mb-30"
                                      id="order-id"
                                    >
                                      <span
                                        className="text-grey txt-white lang summary-label text-white font-size-16"
                                        data-key="orderId"
                                        style={{ textTransform: "uppercase" }}
                                      >
                                        Order ID
                                      </span>
                                      <span
                                        className="text-grey txt-white summary-label-text text-white font-weight-bold font-size-18 mb-20"
                                        title={payinRequest.orderId}
                                        style={{ letterSpacing: 1 }}
                                      >
                                        {payinRequest.orderId}
                                      </span>
                                    </li>
                                    {/* <li className="justify-content-between flex-wrap font-weight-medium-bold d-none" id="amout_tab">
                                                <span className="text-grey txt-white lang summary-label" data-key="amount" id="amount">Amount</span>
                                                <span className="text-grey txt-white summary-label-text d-inline-flex align-items-center" id="innerAmount">
                                                    <i className="pg-icon icon-inr mr-5"></i>
                                                    <span className="value-block">{payinRequest.amount}</span>
                                                </span>
                                            </li> */}
                                    {/* <li className="justify-content-between flex-wrap font-weight-medium-bold d-none" id="tdrBLock_head">
                                                <span id="surchargeName" className="text-grey txt-white lang summary-label" data-key="convenienceFee">Convenience Fee</span>
                                                <span className="text-grey txt-white summary-label-text d-inline-flex align-items-center" id="surcharge">
                                                    <i className="pg-icon icon-inr mr-5"></i><span className="value-block">0.00</span>
                                                </span>
                                            </li> */}
                                    {/* <li className="justify-content-between flex-wrap d-none font-weight-medium-bold" id="gst-block">
                                                <span id="gstName" className="text-grey txt-white lang summary-label" data-key="gst">GST</span>
                                                <span className="text-grey txt-white summary-label-text d-inline-flex align-items-center" id="gstAmount">
                                                    <i className="pg-icon icon-inr mr-5"></i><span className="value-block">0</span>
                                                </span>
                                            </li> */}
                                    <li
                                      className="d-flex justify-content-between font-size-22 font-weight-bold flex-wrap  "
                                      id="new_head"
                                    >
                                      <span
                                        className="txt-white lang summary-label text-white"
                                        data-key="amountPayable"
                                        style={{ textTransform: "uppercase" }}
                                      >
                                        Total Payable
                                      </span>
                                      <span
                                        className="txt-white summary-label-text d-inline-flex align-items-center text-white"
                                        id="totalAmount"
                                      >
                                        <i className="pg-icon icon-inr mr-5"></i>
                                        <span className="value-block">
                                          {amount}
                                        </span>
                                      </span>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                            <div id="submit-btns-desktop">
                              <Button
                                variant="contained"
                                type="submit"
                                disabled={!dirty || !isValid}
                                id="pay-now"
                                color="success"
                                size="large"
                                sx={{
                                  boxShadow: "0 0 3px 0 white",
                                  backgroundColor: "rgb(237 141 1)",
                                  width: "100%",
                                  padding: "16px",
                                  marginTop: "16px",
                                  color: "white",
                                  "&.Mui-disabled": {
                                    backgroundColor: "#f5c882",
                                    color: "white",
                                    opacity: 0.9,
                                    boxShadow: "0 0 3px 0 white",
                                  },
                                }}
                              >
                                {/* <CircularProgress /> */}
                                <span className="d-flex align-items-center justify-content-center">
                                  <span
                                    className="lang mr-10 line-height-16"
                                    id="payBtnKey"
                                    data-key="payBtnText"
                                  >
                                    Pay
                                  </span>
                                  <span className="payBtnAmount d-inline-flex align-items-center">
                                    <i className=" pg-icon icon-inr mr-5"></i>
                                    <span className="value-block line-height-16">
                                      {amount}
                                    </span>
                                  </span>
                                </span>
                              </Button>
                              {apiCall && (
                                <div className="pt-1">
                                  <LinearProgress />
                                </div>
                              )}
                              <div className="text-center mt-10 mt-md-0 mt-lg-10">
                                <button
                                  type="button"
                                  id="ccCancelButton"
                                  className="font-weight-bold font-size-14 lang bg-none text-white"
                                  name="ccCancelButton"
                                  data-key="cancel"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                            <div
                              className="d-flex align-items-center mt-15 justify-content-center mb-15"
                              id="safe-secure-logo"
                            >
                              <i className="pg-icon txt-white icon-secure-payment font-size-26"></i>
                              <span className="font-size-12 txt-white ml-10 text-white">
                                Safe and Secure Payments
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className="row custom-footer bg-grey-ternary border-radius-bl-20 border-radius-br-20 position-relative border-top"
                        id="footer"
                      >
                        <div
                          className="col-md-3 col-lg-3 d-flex justify-content-center align-items-center"
                          style={{ backgroundColor: "#15b86d " }}
                        >
                          <span className="font-size-12 text-white">
                            © 2025 ATMOON, All
                            rights reserved.
                          </span>
                        </div>
                        <div
                          className="col-md-6 col-lg-6 d-sm-flex justify-content-sm-between justify-content-lg-center py-15 py-lg-20"
                          style={{ backgroundColor: "#15b86d " }}
                        >
                          {/* <div className="d-flex justify-content-center align-items-center">
                      <img src="/pgui/img/visa-logo.png" alt="" />
                      <img src="/pgui/img/mcard.png" alt="" />
                      <span className="pg-icon icon-rupay-logo font-size-20 mr-5">
                        <span className="path1"></span>
                        <span className="path2"></span>
                        <span className="path3"></span>
                        <span className="path4"></span>
                      </span>
                      <span className="pg-icon icon-american-express font-size-24 mr-md-5">
                        <span className="path1"></span>
                        <span className="path2"></span>
                        <span className="path3"></span>
                      </span>
                    </div> */}
                        </div>
                        <div
                          className="col-md-3 col-lg-3 bg-grey-dark-primary d-flex align-items-center border-radius-br-20 border-radius-bl-20 border-radius-bl-md-0 justify-content-center p-10"
                          id="footer-poweredby"
                        >
                          <span className=" font-size-12 text-white">
                            Powered By
                            <span
                              className=" font-size-18 text-white font-family-logo"
                              id="companyName"
                            >
                              ATMOON
                            </span>
                            <span className="text-white">©</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Box>
              </Form>
            )}
          </Formik>
        </>
      )}
    </>
  );
};

export default CheckoutPage;
