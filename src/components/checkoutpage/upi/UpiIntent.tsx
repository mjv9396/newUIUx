import { Avatar, Box, Card, CardContent } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoginModel } from "../../../model/LoginModel.ts";
import { msgTypes } from "../../../constants/msgTypes";
import { AuthService } from "../../../service/AuthService.ts";
import { TransactionPayinRequestModel } from "../../../model/TransactionPayinRequestModel.ts";

const splitUrl = (intentUrl) => {
  return intentUrl.split("/pay")[1];
};

const UpiIntent = ({ url, payinRequest }) => {
  const navigate = useNavigate();

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

  const [apiResponse, setApiResponse] = useState(
    new TransactionPayinRequestModel()
  );
  const [token, setToken] = useState("");
  const [timerActive, setTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    // console.log("first time", payinRequest);
    if (!timerActive) return; // Exit if the timer is not active

    // Set up the interval
    const intervalId = setInterval(() => {
      checkStatus(payinRequest, token); // Call the function at each interval
      setTimeLeft((prev) => {
        // console.log("pay", payinRequest);
        if (prev <= 1) {
          clearInterval(intervalId); // Stop the timer when it reaches zero
          setTimerActive(false); // Deactivate the timer
          if (payinRequest?.returnUrl) {
            const url = new URLSearchParams(
              Object.entries(apiResponse).reduce((acc, [key, value]) => {
                acc[key] = String(value);
                return acc;
              }, {})
            ).toString();
            window.location.replace(`${payinRequest.returnUrl}?${url}`);
            // window.location.replace(payinRequest.returnUrl); // Redirect to the return URL
          } else {
            // console.log("inside else", payinRequest.returnUrl);
            // window.location.href = "https://google.com/"; // Redirect to the return URL
            navigate("/response-page", { state: { response: apiResponse } });
          }
          return 0;
        }
        return prev - 1; // Decrease the timer
      });
    }, 2000); // Set the interval duration (e.g., 2000 ms = 2 seconds)

    // Clean up on component unmount or timer stop
    return () => clearInterval(intervalId);
  }, [timerActive]);

  const handleRefresh = async () => {
    setTimerActive(true); // Activate the timer
    setTimeLeft(300);

    // const response = await AuthService.payNow(payinRequest);
    // if (msgTypes.SUCCESS_CODE.includes(response.statusCode)) {
    //   const res = response.data;
    //   if (res.txnStatus === msgTypes.PENDING) {

    //   }
    // }
  };
  const checkStatus = async (
    requestData: TransactionPayinRequestModel,
    token: string
  ) => {
    // console.log("request data", requestData);
    // const encryptResponse = await AuthService.encrypt(
    //   JSON.stringify({ orderId: requestData.orderId }),
    //   msgTypes.APP_ID,
    //   msgTypes.SALT_ID
    // );

    const requestObject = {
      appId: payinRequest.appId,
      data: payinRequest.orderId,
    };
    const res = await AuthService.checkStatus(requestObject, token);
    // console.log("resposne from checkStatus", res);
    if (msgTypes.SUCCESS_CODE.includes(res.statusCode)) {
      if (res.data.status) {
        const response = res.data;
        const status = res?.data?.status;
        setApiResponse(response);
        if (status !== msgTypes.PENDING) {
          setTimerActive(false); // Deactivate the timer
          setTimeLeft(0); // Reset the timer
          // console.log("response from checkStatus", response);
          // console.log("payin request", payinRequest);
          if (payinRequest.returnUrl) {
            // console.log("return url inside if", payinRequest.returnUrl);
            const url = new URLSearchParams(response).toString();
            window.location.replace(`${payinRequest.returnUrl}?${url}`); // Redirect to the return URL
          } else {
            // console.log("return url inside if", payinRequest.returnUrl);
            // window.location.href = payinRequest.returnUrl;
            navigate("/response-page", { state: { response: response } });
          }
        }
      }
    }
  };
  return (
    <Box paddingLeft={3.5} sx={{ display: { xs: "block", sm: "none" } }}>
      {timerActive && (
        <div className="loadingmodel">
          <div className="loadingmodeloverlay">
            Your Payment is processing...Please wait
          </div>
        </div>
      )}
      <p>Intent UPI</p>
      <Card>
        <CardContent>
          <Box display={"flex"} justifyContent={"center"} gap={2}>
            {/* <Link to="tez://upi/pay?pa=beeinbox@icici&pn=BEEINBOX%20INDIA%20PRIVATE%20LIMITED&tr=EZV2025011911534139057016&am=100.00&cu=INR&mc=4816">
              <Avatar alt="gpay" src="/images/googlepay.png" />
            </Link>
            <Link to="phonepe://pay?pa=beeinbox@icici&pn=BEEINBOX%20INDIA%20PRIVATE%20LIMITED&tr=EZV2025011911534139057016&am=100.00&cu=INR&mc=4816">
              <Avatar alt="phonepay" src="/images/phonepay.png" />
            </Link>
            <Link to="paytmmp://pay?pa=beeinbox@icici&pn=BEEINBOX%20INDIA%20PRIVATE%20LIMITED&tr=EZV2025011911534139057016&am=100.00&cu=INR&mc=4816">
              <Avatar alt="paytm" src="/images/paytm.png" />
            </Link>
            <Link to="upi://pay?pa=beeinbox@icici&pn=BEEINBOX%20INDIA%20PRIVATE%20LIMITED&tr=EZV2025011911534139057016&am=100.00&cu=INR&mc=4816">
              <Avatar alt="bhim" src="/images/bhim.png" />
            </Link> */}
            {/* <Link to="cred://upi/pay?pa=beeinbox@icici&pn=BEEINBOX%20INDIA%20PRIVATE%20LIMITED&tr=EZV2025011911534139057016&am=100.00&cu=INR&mc=4816">
              <Avatar alt="Cred" src="/images/cred.png" />
            </Link> */}
            {/* <Link to="amazonToAlipay://upi/pay?pa=beeinbox@icici&pn=BEEINBOX%20INDIA%20PRIVATE%20LIMITED&tr=EZV2025011911534139057016&am=100.00&cu=INR&mc=4816">
              <Avatar alt="Amazon" src="/images/amazon.png" />
            </Link> */}
            {/* <Link to="whatsapp://send?text=upi://pay?pa=beeinbox@icici&pn=BEEINBOX%20INDIA%20PRIVATE%20LIMITED&tr=EZV2025011911534139057016&am=100.00&cu=INR&mc=4816">
              <Avatar alt="whatsapp" src="/images/whatsapp.png" />
            </Link> */}
            <Link to={`tez://upi/pay` + splitUrl(url)} onClick={handleRefresh}>
              <Avatar alt="gpay" src="/images/googlepay.png" />
            </Link>
            <Link to={`phonepe://pay` + splitUrl(url)} onClick={handleRefresh}>
              <Avatar alt="phonepay" src="/images/phonepay.png" />
            </Link>
            <Link to={`paytmmp://pay` + splitUrl(url)} onClick={handleRefresh}>
              <Avatar alt="paytm" src="/images/paytm.png" />
            </Link>
            <Link to={`upi://pay` + splitUrl(url)} onClick={handleRefresh}>
              <Avatar alt="bhim" src="/images/bhim.png" />
            </Link>
            <Link
              to={`whatsapp://send?text=upi://pay` + splitUrl(url)}
              onClick={handleRefresh}
            >
              <Avatar alt="whatsapp" src="/images/whatsapp.png" />
            </Link>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
export default UpiIntent;
