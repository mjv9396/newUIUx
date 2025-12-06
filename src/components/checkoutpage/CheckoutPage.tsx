import { useState, useEffect } from "react";
import * as React from "react";
import "./CheckoutPage.css"; // You might need to adjust or create this for custom fonts/styles
import { useLocation, useNavigate } from "react-router-dom";
import { TransactionPayinRequestModel } from "../../model/TransactionPayinRequestModel.ts";
import { PaymentTypeModel } from "../../model/PaymentTypeModel.ts";
import { PaymentInitModel } from "../../model/PaymentInitModel.ts";
import { AuthService } from "../../service/AuthService.ts";
import { toast } from "react-toastify";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { CheckoutSchema } from "../../schema/CheckoutSchema.jsx";
import { msgTypes } from "../../constants/msgTypes.js";

// MUI Components for a polished UI
import {
  Box,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography,
  Grid,
  Divider,
  InputAdornment,
  Tooltip,
  IconButton,
} from "@mui/material";

// Icons
import CreditCardIcon from "@mui/icons-material/CreditCard";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LockIcon from "@mui/icons-material/Lock";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

// Child Components for cleaner code
import Loading from "../loader/Loading.tsx";
import UpiQr from "./upi/UpiQr.tsx";
// import TransactionPurposePopup from "./TransactionPurposePopup.tsx";

// --- Card Detection Utility ---
const detectCardType = (cardNumber: string) => {
  const patterns = {
    VI: /^4/,
    MS: /^5[1-5]/,
    AE: /^3[47]/,
    DN: /^3(?:0[0-5]|[68][0-9])/,
    RU: /^(60|65|81|82)/,
  };
  for (const key in patterns) {
    if (patterns[key].test(cardNumber)) {
      return key;
    }
  }
  return "";
};

const CheckoutPage = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // --- Demo Mode Flag ---
  // Set to true to show ALL payment options regardless of API response
  // Set to false to use actual API payment type restrictions
  const [isDemoMode, setIsDemoMode] = useState(true); // Set to true for demo mode

  // --- State Management ---
  const [loading, setLoading] = useState(true);
  const [apiCall, setApiCall] = useState(false);
  const [paymentInitModel, setPaymentInitModel] = useState(
    new PaymentInitModel()
  );
  const [payinRequest, setPayinRequest] = useState(
    new TransactionPayinRequestModel()
  );
  const [paymentType, setPaymentType] = useState(new PaymentTypeModel());

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [selectedMopCode, setSelectedMopCode] = useState("");
  const [selectedBankCode, setSelectedBankCode] = useState("");

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [detectedCardNetwork, setDetectedCardNetwork] = useState("");
  const [cardNetworkError, setCardNetworkError] = useState("");

  // --- Transaction Purpose Popup State ---
  // const [showTransactionPurposePopup, setShowTransactionPurposePopup] =
  //   useState(false);
  // const [transactionPurposeSubmitted, setTransactionPurposeSubmitted] =
  //   useState(false);
  // const [transactionPurposeLoading, setTransactionPurposeLoading] =
  //   useState(false);
  // const [txnId, setTxnId] = useState("");

  // --- Demo Mode Payment Types ---
  const demoPaymentType = {
    CC: ["VI", "MS", "AE", "DN", "RU"], // All card types
    DC: ["VI", "MS", "AE", "DN", "RU"], // All debit card types
    UP: ["INTENT"], // Only UPI Apps, no QR or COLLECT
    NB: ["HDFC", "ICICI", "SBI", "AXIS", "BOB", "PNB", "KOTAK"], // All banks
    // WL: [] // No wallet in demo mode
  };

  const amount = isNaN(parseFloat(payinRequest.amount))
    ? "0.00"
    : parseFloat(payinRequest.amount).toFixed(2);

  const getMopName = (mopCode: string): string =>
    ({
      VI: "Visa",
      MS: "Mastercard",
      AE: "American Express",
      DN: "Diners Club",
      RU: "RuPay",
      INTENT: "UPI Apps",
      QR: "Show QR Code",
      COLLECT: "UPI ID / VPA",
      HDFC: "HDFC Bank",
      ICICI: "ICICI Bank",
      SBI: "State Bank of India",
      AXIS: "Axis Bank",
      BOB: "Bank of Baroda",
      PNB: "Punjab National Bank",
      KOTAK: "Kotak Mahindra Bank",
    }[mopCode] || mopCode);

  const getMopIcon = (mopCode: string): string =>
    ({
      VI: "/images/cards/visa.png",
      MS: "/images/cards/master.png",
      AE: "/images/cards/amex.png",
      DN: "/images/cards/diner.png",
      RU: "/images/cards/rupey.png",
    }[mopCode] || "/images/cards/default.png");

  // --- API Calls ---
  useEffect(() => {
    const payentActive = async () => {
      setLoading(true);
      const id = pathname.split("/pay/")[1];
      try {
        const response = await AuthService.paymentActive({
          appId: msgTypes.APP_ID,
          txnPayinId: id,
        });
        if (msgTypes.SUCCESS_CODE.includes(response.statusCode)) {
          setPaymentInitModel(response.data);
          setPayinRequest(response.data.transactionPayinRequest);
          // Keep original API logic but override with demo data if demo mode is enabled
          setPaymentType(
            isDemoMode ? demoPaymentType : response.data.paymentType
          );
          // setTxnId(response.data.transactionPayinRequest.txnId);

          // Show transaction purpose popup after data is loaded
          // setShowTransactionPurposePopup(true);
        } else {
          toast.error(response.message || "Failed to load payment details.");
          // In demo mode, still show payment types even if API fails
          if (isDemoMode) {
            setPaymentType(demoPaymentType);
            // setShowTransactionPurposePopup(true);
          }
        }
      } catch (error) {
        toast.error("An error occurred while fetching payment details.");
        // In demo mode, still show payment types even if API fails
        if (isDemoMode) {
          setPaymentType(demoPaymentType);
          // setShowTransactionPurposePopup(true);
        }
      } finally {
        setLoading(false);
      }
    };
    payentActive();
  }, [pathname]);

  // --- Transaction Purpose Handler ---
  // const handleTransactionPurposeSubmit = async (txnPurpose: string) => {
  //   setTransactionPurposeLoading(true);
  //   try {
  //     const requestData = {
  //       transactionId: txnId,
  //       transactionPurpose: txnPurpose,
  //     };

  //     const response = await AuthService.submitTransactionPurpose(requestData);

  //     if (msgTypes.SUCCESS_CODE.includes(response.statusCode)) {
  //       setTransactionPurposeSubmitted(true);
  //       setShowTransactionPurposePopup(false);
  //       toast.success("Transaction purpose submitted successfully");
  //     } else {
  //       toast.error(response.data || "Failed to submit transaction purpose");
  //     }
  //   } catch (error) {
  //     console.error("Error submitting transaction purpose:", error);
  //     toast.error("Failed to submit transaction purpose. Please try again.");
  //   } finally {
  //     setTransactionPurposeLoading(false);
  //   }
  // };

  const handlePayNow = async (values: any) => {
    setApiCall(true);
    const requestData = { ...payinRequest };

    if (["CREDIT_CARD", "DEBIT_CARD"].includes(selectedPaymentMethod)) {
      Object.assign(requestData, {
        paymentTypeCode: selectedPaymentMethod === "CREDIT_CARD" ? "CC" : "DC",
        mopCode: detectedCardNetwork,
        cardNumber: values.cardNumber.replace(/\s/g, ""),
        cardHolderName: values.cardName,
        cardExpiry: expiry.replace("/", ""),
        cardCvv: values.cvv,
      });
    } else if (selectedPaymentMethod === "UPI") {
      // Auto-determine UPI method: QR if intentUrl available, otherwise INTENT
      const upiMethod = payinRequest.intentUrl ? "QR" : "INTENT";
      Object.assign(requestData, {
        paymentTypeCode: "UP",
        mopCode: upiMethod,
        custVpa: "", // No VPA collection anymore
      });
    } else if (selectedPaymentMethod === "NETBANKING") {
      Object.assign(requestData, {
        paymentTypeCode: "NB",
        bankCode: selectedBankCode,
      });
    } else if (selectedPaymentMethod === "WALLET") {
      Object.assign(requestData, {
        paymentTypeCode: "WL",
        mopCode: selectedMopCode,
      });
    }

    try {
      const response = await AuthService.payNow(requestData);
      if (msgTypes.SUCCESS_CODE.includes(response.statusCode)) {
        if (response.data.txnStatus === msgTypes.PENDING) {
          navigate("/loader", { state: { request: requestData } });
        } else {
          toast.info(`Transaction status: ${response.data.txnStatus}`);
        }
      } else {
        toast.error(response.data || "Payment failed.");
      }
    } catch (error) {
      toast.error("An error occurred during payment processing.");
    } finally {
      setApiCall(false);
    }
  };

  // --- UI Event Handlers ---
  const handlePaymentMethodSelect = (method: string) => {
    setSelectedPaymentMethod(method);
    [
      setSelectedMopCode,
      setSelectedBankCode,
      setCardNumber,
      setExpiry,
      setDetectedCardNetwork,
      setCardNetworkError,
    ].forEach((f) => f(""));
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\s/g, "");
    const formattedValue = rawValue
      .replace(/\D/g, "")
      .replace(/(.{4})/g, "$1 ")
      .trim();
    setCardNumber(formattedValue);
    setCardNetworkError("");
    if (rawValue.length >= 1) {
      const network = detectCardType(rawValue);
      setDetectedCardNetwork(network);
      const supportedNetworks =
        selectedPaymentMethod === "CREDIT_CARD"
          ? paymentType.CC
          : paymentType.DC;
      if (network && !supportedNetworks?.includes(network)) {
        setCardNetworkError(`${getMopName(network)} is not supported.`);
      }
    } else {
      setDetectedCardNetwork("");
    }
  };

  const handleExpiryChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue
  ) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 2)
      value = `${value.substring(0, 2)}/${value.substring(2, 4)}`;
    setExpiry(value);
    setFieldValue("expiry", value);
  };

  // --- Render Logic ---
  const renderPaymentMethodList = () => (
    <Box
      sx={{
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.9) 100%)",
        height: "100%",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "linear-gradient(135deg, rgba(21,184,109,0.05) 0%, rgba(14,165,233,0.05) 100%)",
          backdropFilter: "blur(5px)",
        },
      }}
    >
      <Box sx={{ position: "relative", zIndex: 1, height: "100%" }}>
        <Typography
          variant="h5"
          sx={{
            p: 3,
            fontWeight: 700,
            background: "linear-gradient(135deg, #15b86d 0%, #0ea5e9 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
            textAlign: "center",
            borderBottom: "1px solid rgba(0,0,0,0.08)",
          }}
        >
          Payment Methods
        </Typography>
        <List sx={{ px: 2, py: 1 }}>
          {paymentType?.CC?.length > 0 && (
            <PaymentMethodItem
              name="Credit Card"
              icon={<CreditCardIcon />}
              method="CREDIT_CARD"
              selected={selectedPaymentMethod === "CREDIT_CARD"}
              onClick={handlePaymentMethodSelect}
            />
          )}
          {paymentType?.DC?.length > 0 && (
            <PaymentMethodItem
              name="Debit Card"
              icon={<CreditCardIcon />}
              method="DEBIT_CARD"
              selected={selectedPaymentMethod === "DEBIT_CARD"}
              onClick={handlePaymentMethodSelect}
            />
          )}
          {paymentType?.UP?.length > 0 && (
            <PaymentMethodItem
              name="UPI"
              icon={
                <img
                  src="/images/bhim.png"
                  alt="UPI"
                  style={{ width: 28, height: 28 }}
                />
              }
              method="UPI"
              selected={selectedPaymentMethod === "UPI"}
              onClick={handlePaymentMethodSelect}
            />
          )}
          {paymentType?.NB?.length > 0 && (
            <PaymentMethodItem
              name="Net Banking"
              icon={<AccountBalanceIcon />}
              method="NETBANKING"
              selected={selectedPaymentMethod === "NETBANKING"}
              onClick={handlePaymentMethodSelect}
            />
          )}
          {paymentType?.WL?.length > 0 && (
            <PaymentMethodItem
              name="Wallet"
              icon={<AccountBalanceWalletIcon />}
              method="WALLET"
              selected={selectedPaymentMethod === "WALLET"}
              onClick={handlePaymentMethodSelect}
            />
          )}
        </List>
      </Box>
    </Box>
  );

  const renderCardForm = (touched, errors, setFieldValue) => {
    const fieldStyles = {
      variant: "outlined",
      sx: {
        "& .MuiOutlinedInput-root": {
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          borderRadius: "12px",
          transition: "all 0.3s ease",
          "& fieldset": {
            borderColor: "rgba(0, 0, 0, 0.1)",
            borderWidth: "1px",
          },
          "&:hover fieldset": {
            borderColor: "#15b86d",
            borderWidth: "2px",
          },
          "&.Mui-focused fieldset": {
            borderColor: "#15b86d",
            borderWidth: "2px",
            boxShadow: "0 0 0 3px rgba(21, 184, 109, 0.1)",
          },
        },
        "& .MuiInputLabel-root": {
          color: "rgba(0, 0, 0, 0.6)",
          fontWeight: 500,
          "&.Mui-focused": {
            color: "#15b86d",
          },
        },
        "& .MuiInputAdornment-root": {
          color: "rgba(0, 0, 0, 0.4)",
        },
      },
    };

    return (
      <Box
        sx={{
          background:
            "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)",
          backdropFilter: "blur(10px)",
          borderRadius: "20px",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          padding: "32px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            mb: 4,
            fontWeight: 700,
            background: "linear-gradient(135deg, #15b86d 0%, #0ea5e9 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
            textAlign: "center",
          }}
        >
          Enter Card Details
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Field
              as={TextField}
              name="cardNumber"
              label="Card Number"
              fullWidth
              value={cardNumber}
              onChange={handleCardNumberChange}
              {...fieldStyles}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CreditCardIcon
                      sx={{ color: "#15b86d", fontSize: "1.2rem" }}
                    />
                  </InputAdornment>
                ),
                endAdornment: detectedCardNetwork && (
                  <InputAdornment position="end">
                    <Box
                      sx={{
                        background: "white",
                        borderRadius: "8px",
                        padding: "4px 8px",
                        display: "flex",
                        alignItems: "center",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      }}
                    >
                      <img
                        src={getMopIcon(detectedCardNetwork)}
                        alt={detectedCardNetwork}
                        style={{ height: "20px" }}
                      />
                    </Box>
                  </InputAdornment>
                ),
              }}
              inputProps={{ maxLength: 19 }}
              error={
                !!cardNetworkError ||
                (touched.cardNumber && !!errors.cardNumber)
              }
              helperText={
                cardNetworkError || (
                  <ErrorMessage
                    name="cardNumber"
                    component="div"
                    className="error-message"
                  />
                )
              }
            />
          </Grid>
          <Grid item xs={12}>
            <Field
              as={TextField}
              name="cardName"
              label="Cardholder Name"
              fullWidth
              {...fieldStyles}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlineIcon
                      sx={{ color: "#15b86d", fontSize: "1.2rem" }}
                    />
                  </InputAdornment>
                ),
              }}
              inputProps={{ maxLength: 50 }}
              error={touched.cardName && !!errors.cardName}
              helperText={
                <ErrorMessage
                  name="cardName"
                  component="div"
                  className="error-message"
                />
              }
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              name="expiry"
              label="Expiry Date"
              placeholder="MM / YY"
              fullWidth
              value={expiry}
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  borderRadius: "12px",
                  transition: "all 0.3s ease",
                  "& fieldset": {
                    borderColor: "rgba(0, 0, 0, 0.1)",
                    borderWidth: "1px",
                  },
                  "&:hover fieldset": {
                    borderColor: "#15b86d",
                    borderWidth: "2px",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#15b86d",
                    borderWidth: "2px",
                    boxShadow: "0 0 0 3px rgba(21, 184, 109, 0.1)",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "rgba(0, 0, 0, 0.6)",
                  fontWeight: 500,
                  "&.Mui-focused": {
                    color: "#15b86d",
                  },
                },
              }}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleExpiryChange(e, setFieldValue)
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarTodayIcon
                      sx={{ color: "#15b86d", fontSize: "1.1rem" }}
                    />
                  </InputAdornment>
                ),
              }}
              inputProps={{ maxLength: 5 }}
              error={touched.expiry && !!errors.expiry}
              helperText={
                <ErrorMessage
                  name="expiry"
                  component="div"
                  className="error-message"
                />
              }
            />
          </Grid>
          <Grid item xs={6}>
            <Field
              as={TextField}
              name="cvv"
              label="CVV"
              type="password"
              fullWidth
              {...fieldStyles}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: "#15b86d", fontSize: "1.1rem" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip
                      title="The 3 or 4-digit security code on your card"
                      arrow
                    >
                      <IconButton
                        size="small"
                        sx={{ color: "rgba(0,0,0,0.4)" }}
                      >
                        <HelpOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
              inputProps={{ maxLength: 4 }}
              error={touched.cvv && !!errors.cvv}
              helperText={
                <ErrorMessage
                  name="cvv"
                  component="div"
                  className="error-message"
                />
              }
            />
          </Grid>
        </Grid>
      </Box>
    );
  };

  const renderUpiContent = () => {
    // If QR URL is available, show QR directly
    if (payinRequest.intentUrl) {
      return (
        <Box>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            Scan QR Code to Pay
          </Typography>
          <Box textAlign="center">
            <UpiQr url={payinRequest.intentUrl} />
          </Box>
        </Box>
      );
    }

    // If no QR URL available, show UPI Apps button
    // But only if not in demo mode or if API succeeded
    if (!isDemoMode || payinRequest.intentUrl !== undefined) {
      return (
        <Box>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            Pay with UPI Apps
          </Typography>
          <Button
            fullWidth
            variant="contained"
            onClick={() => setSelectedMopCode("INTENT")}
            sx={{
              justifyContent: "flex-start",
              p: 1.5,
              textTransform: "none",
              borderRadius: "8px",
              background: "linear-gradient(135deg, #15b86d 0%, #0ea5e9 100%)",
            }}
          >
            Open UPI Apps
          </Button>
        </Box>
      );
    }

    // Demo mode with no API data - show placeholder
    return (
      <Box textAlign="center" sx={{ p: 4, color: "text.secondary" }}>
        <Typography variant="h6" gutterBottom>
          UPI Payment
        </Typography>
        <Typography>
          UPI payment will be available when connected to payment gateway.
        </Typography>
      </Box>
    );
  };

  const renderMopSelection = () => {
    let options: String[] = [],
      title = "",
      type: "mop" | "bank" = "mop";
    switch (selectedPaymentMethod) {
      case "NETBANKING":
        [options, title, type] = [
          isDemoMode ? demoPaymentType.NB : paymentType.NB || [],
          "Select Your Bank",
          "bank",
        ];
        break;
      case "WALLET":
        [options, title, type] = [
          isDemoMode ? [] : paymentType.WL || [], // No wallet in demo mode
          "Select Your Wallet",
          "mop",
        ];
        break;
      default:
        return null;
    }
    return (
      <Box>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          {title}
        </Typography>
        <Grid container spacing={1.5}>
          {options.map((option) => (
            <Grid item xs={12} key={option.toString()}>
              <Button
                fullWidth
                variant={
                  (type === "mop" && selectedMopCode === option) ||
                  (type === "bank" && selectedBankCode === option)
                    ? "contained"
                    : "outlined"
                }
                onClick={() =>
                  type === "mop"
                    ? setSelectedMopCode(option.toString())
                    : setSelectedBankCode(option.toString())
                }
                sx={{
                  justifyContent: "flex-start",
                  p: 1.5,
                  textTransform: "none",
                  borderRadius: "8px",
                }}
              >
                {getMopName(option.toString())}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  const renderCentralContent = (touched, errors, setFieldValue) => {
    if (!selectedPaymentMethod) {
      return (
        <Box textAlign="center" sx={{ p: 4, color: "text.secondary" }}>
          <Typography variant="h6" gutterBottom>
            Welcome to Secure Checkout
          </Typography>
          <Typography>
            Please select a payment method from the left to begin.
          </Typography>
        </Box>
      );
    }
    switch (selectedPaymentMethod) {
      case "CREDIT_CARD":
      case "DEBIT_CARD":
        return renderCardForm(touched, errors, setFieldValue);
      case "UPI":
        return renderUpiContent();
      case "NETBANKING":
      case "WALLET":
        return renderMopSelection();
      default:
        return null;
    }
  };

  if (loading) return <Loading />;

  return (
    <>
      {/* Transaction Purpose Popup */}
      {/* <TransactionPurposePopup
        open={showTransactionPurposePopup}
        txnId={txnId}
        onSubmit={handleTransactionPurposeSubmit}
        loading={transactionPurposeLoading}
      /> */}

      {/* Main Checkout Content - only show if transaction purpose is submitted */}
      {/* {transactionPurposeSubmitted && ( */}
      <Formik
        initialValues={{
          cardNumber: "",
          cardName: "",
          expiry: "",
          cvv: "",
          custVpa: "",
        }}
        validationSchema={CheckoutSchema}
        onSubmit={handlePayNow}
        enableReinitialize
      >
        {({ errors, touched, setFieldValue }) => (
          <Form>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                background:
                  "linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)",
                backgroundSize: "400% 400%",
                animation: "gradientShift 15s ease infinite",
                p: { xs: 1, sm: 2, md: 3 },
                "@keyframes gradientShift": {
                  "0%": { backgroundPosition: "0% 50%" },
                  "50%": { backgroundPosition: "100% 50%" },
                  "100%": { backgroundPosition: "0% 50%" },
                },
              }}
            >
              <Grid
                container
                sx={{
                  maxWidth: { xs: "100%", sm: "95%", md: "1200px" },
                  width: "100%",
                  minHeight: { xs: "auto", md: "700px" },
                  background: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(20px)",
                  borderRadius: { xs: "12px", md: "24px" },
                  boxShadow:
                    "0 20px 60px rgba(0,0,0,0.1), 0 8px 25px rgba(0,0,0,0.05)",
                  overflow: "hidden",
                  border: "1px solid rgba(255,255,255,0.3)",
                }}
              >
                <Grid
                  item
                  xs={12}
                  md={3.5}
                  sx={{
                    order: { xs: 2, md: 1 },
                  }}
                >
                  {renderPaymentMethodList()}
                </Grid>

                <Grid
                  item
                  xs={12}
                  md={4.5}
                  sx={{
                    p: { xs: 2, sm: 3, md: 4 },
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    order: { xs: 1, md: 2 },
                    minHeight: { xs: "auto", md: "500px" },
                  }}
                >
                  {renderCentralContent(touched, errors, setFieldValue)}
                </Grid>

                <Grid
                  item
                  xs={12}
                  md={4}
                  sx={{
                    order: { xs: 3, md: 3 },
                  }}
                >
                  <Box
                    sx={{
                      p: 0,
                      display: "flex",
                      flexDirection: "column",
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      position: "relative",
                      overflow: "hidden",
                      minHeight: { xs: "auto", md: "100%" },
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background:
                          "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
                        backdropFilter: "blur(10px)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        position: "relative",
                        zIndex: 1,
                        p: { xs: 3, md: 4 },
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        color: "white",
                      }}
                    >
                      <Box sx={{ mb: 3 }}>
                        <Typography
                          variant="overline"
                          sx={{
                            color: "rgba(255,255,255,0.7)",
                            fontWeight: 600,
                            letterSpacing: "1px",
                          }}
                        >
                          PAYING TO
                        </Typography>
                        <Typography
                          variant="h5"
                          sx={{
                            fontWeight: 700,
                            mt: 1,
                            textShadow: "0 2px 4px rgba(0,0,0,0.1)",
                            fontSize: { xs: "1.25rem", md: "1.5rem" },
                          }}
                        >
                          {payinRequest.businessName}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          background: "rgba(255,255,255,0.1)",
                          borderRadius: "16px",
                          p: 3,
                          mb: 3,
                          backdropFilter: "blur(10px)",
                          border: "1px solid rgba(255,255,255,0.2)",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mb: 2,
                          }}
                        >
                          <Typography
                            sx={{
                              color: "rgba(255,255,255,0.8)",
                              fontWeight: 500,
                            }}
                          >
                            Order ID
                          </Typography>
                          <Typography
                            sx={{
                              wordBreak: "break-all",
                              fontWeight: 600,
                              fontSize: { xs: "0.8rem", md: "0.9rem" },
                            }}
                          >
                            {payinRequest.orderId}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography
                            sx={{
                              color: "rgba(255,255,255,0.8)",
                              fontWeight: 500,
                            }}
                          >
                            Email
                          </Typography>
                          <Typography
                            sx={{
                              fontWeight: 600,
                              fontSize: { xs: "0.8rem", md: "0.9rem" },
                            }}
                          >
                            {payinRequest.custEmail}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ flexGrow: 1 }} />

                      <Box
                        sx={{
                          background: "rgba(255,255,255,0.15)",
                          borderRadius: "20px",
                          p: 3,
                          backdropFilter: "blur(15px)",
                          border: "1px solid rgba(255,255,255,0.3)",
                          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 3,
                          }}
                        >
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 600,
                              color: "rgba(255,255,255,0.9)",
                            }}
                          >
                            Total Payable
                          </Typography>
                          <Typography
                            variant="h4"
                            sx={{
                              fontWeight: 800,
                              textShadow: "0 2px 4px rgba(0,0,0,0.2)",
                              fontSize: { xs: "1.5rem", md: "2rem" },
                            }}
                          >
                            ₹{amount}
                          </Typography>
                        </Box>

                        <Button
                          type="submit"
                          variant="contained"
                          fullWidth
                          size="large"
                          disabled={apiCall}
                          sx={{
                            py: 2,
                            fontSize: { xs: "1rem", md: "1.1rem" },
                            fontWeight: 700,
                            borderRadius: "16px",
                            background:
                              "linear-gradient(135deg, #15b86d 0%, #0ea5e9 100%)",
                            boxShadow: "0 8px 25px rgba(21, 184, 109, 0.3)",
                            border: "none",
                            textTransform: "none",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              background:
                                "linear-gradient(135deg, #13a85e 0%, #0284c7 100%)",
                              transform: "translateY(-2px)",
                              boxShadow: "0 12px 35px rgba(21, 184, 109, 0.4)",
                            },
                            "&:disabled": {
                              background: "rgba(255,255,255,0.1)",
                              color: "rgba(255,255,255,0.5)",
                            },
                          }}
                        >
                          {apiCall ? (
                            <CircularProgress
                              size={24}
                              sx={{ color: "white" }}
                            />
                          ) : (
                            `Pay ₹${amount} securely`
                          )}
                        </Button>
                      </Box>

                      <Box sx={{ textAlign: "center", mt: 4 }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mb: 2,
                          }}
                        >
                          <LockIcon
                            sx={{
                              fontSize: "1.2rem",
                              mr: 1,
                              color: "rgba(255,255,255,0.7)",
                            }}
                          />
                          <Typography
                            variant="body2"
                            sx={{
                              color: "rgba(255,255,255,0.7)",
                              fontWeight: 500,
                              fontSize: { xs: "0.8rem", md: "0.875rem" },
                            }}
                          >
                            Secured by MINDMESH
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            opacity: 0.6,
                          }}
                        >
                          <img
                            src="/images/pci-dss.png"
                            alt="PCI DSS Compliant"
                            style={{
                              height: "25px",
                              filter: "brightness(0) invert(1)",
                              opacity: 0.7,
                            }}
                          />
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Form>
        )}
      </Formik>
      {/* )} */}
    </>
  );
};

const PaymentMethodItem = ({
  name,
  icon,
  method,
  selected,
  onClick,
}: {
  name: string;
  icon: React.ReactNode;
  method: string;
  selected: boolean;
  onClick: (method: string) => void;
}) => (
  <ListItem disablePadding sx={{ my: 1 }}>
    <ListItemButton
      selected={selected}
      onClick={() => onClick(method)}
      sx={{
        borderRadius: "16px",
        py: 2,
        px: 2.5,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        background: selected
          ? "linear-gradient(135deg, rgba(21,184,109,0.1) 0%, rgba(14,165,233,0.1) 100%)"
          : "transparent",
        border: selected
          ? "2px solid rgba(21,184,109,0.3)"
          : "2px solid transparent",
        boxShadow: selected ? "0 8px 25px rgba(21,184,109,0.15)" : "none",
        "&:hover": {
          background: selected
            ? "linear-gradient(135deg, rgba(21,184,109,0.15) 0%, rgba(14,165,233,0.15) 100%)"
            : "rgba(21,184,109,0.05)",
          transform: "translateY(-2px)",
          boxShadow: "0 8px 25px rgba(21,184,109,0.1)",
        },
        "&.Mui-selected": {
          color: "#15b86d",
          fontWeight: "700",
          "& .MuiListItemIcon-root": {
            color: "#15b86d",
            transform: "scale(1.1)",
          },
          "& .MuiListItemText-primary": {
            fontWeight: "700",
          },
        },
      }}
    >
      <ListItemIcon
        sx={{
          minWidth: "48px",
          transition: "all 0.3s ease",
        }}
      >
        {icon}
      </ListItemIcon>
      <ListItemText
        primary={name}
        sx={{
          "& .MuiListItemText-primary": {
            fontSize: "1rem",
            fontWeight: selected ? 700 : 500,
            transition: "all 0.3s ease",
          },
        }}
      />
    </ListItemButton>
  </ListItem>
);

export default CheckoutPage;
