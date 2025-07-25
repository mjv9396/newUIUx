import { useState, useEffect } from 'react';
import "./ResponsePage.css";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { TransactionPayinRequestModel } from "../../model/TransactionPayinRequestModel.ts";
import { msgTypes } from "../../constants/msgTypes.js";

const ResponsePage = () => {
  const location = useLocation();
  console.log("location", location);
  const queryString = location?.search.split("?")[1];
  const params = new URLSearchParams(queryString);
  // console.log("params", params);
  const result = {};
  params.forEach((value, key) => {
    // Convert 'null' strings into actual null values, if necessary
    result[key] = value === "null" ? null : decodeURIComponent(value);
  });

  // console.log(result);
  const [response, setResponse] = useState(new TransactionPayinRequestModel());
  const [responseClass, setResponseClass] = useState("");
  // useEffect(() => {
  //   if (location?.state !== undefined) {
  //     setResponse(location?.state?.response);
  //     if (location?.state?.response.status === msgTypes.SUCCESS) {
  //       setResponseClass("status-success status-message");
  //     } else if (location?.state?.response.status === msgTypes.PENDING) {
  //       setResponseClass("status-pending status-message");
  //     } else if (location?.state?.response.status === msgTypes.FAILED) {
  //       setResponseClass("status-failure status-message");
  //     }
  //   }
  // }, [location?.state]);

  useEffect(() => {
    if (location?.state !== undefined) {
      setResponse(location?.state?.response);
      if (location?.state?.response.status === msgTypes.SUCCESS) {
        setResponseClass("status-success status-message");
      } else if (location?.state?.response.status === msgTypes.PENDING) {
        setResponseClass("status-pending status-message");
      } else if (location?.state?.response.status === msgTypes.FAILED) {
        setResponseClass("status-failure status-message");
      }
    }
    if (location?.search !== undefined) {
      const queryString = location?.search.split("?")[1];
      const params = new URLSearchParams(queryString);
      // console.log("params", params);
      const result = new TransactionPayinRequestModel();
      params.forEach((value, key) => {
        // Convert 'null' strings into actual null values, if necessary
        result[key] = value === "null" ? null : decodeURIComponent(value);
      });
      setResponse(result);
      if (result.status === msgTypes.SUCCESS) {
        setResponseClass("status-success status-message");
      } else if (result.status === msgTypes.PENDING) {
        setResponseClass("status-pending status-message");
      } else if (result.status === msgTypes.FAILED) {
        setResponseClass("status-failure status-message");
      }
    }
  }, [location?.search, location?.state]);

  //   const navigate = useNavigate();
  //   const [time, setTime] = useState(15);
  //   useEffect(() => {
  //     const interval = setInterval(() => {
  //       setTime((prev) => prev - 1);
  //     }, 1000);
  //     if (time === 0) {
  //       clearInterval(interval);
  //       navigate(response.returnUrl);
  //     }
  //     return () => clearInterval(interval);
  //   }, [time]);


  // const fetchUrls = [
  //   "http://localhost:8080/api/v1/transaction/payin/response",
  // ]

  // useEffect(() => {
  //   const fetchData = async () => {
  //     for (const url of fetchUrls) {
  //       try {
  //         const response = await fetch(url);
  //         // if (!response.ok) throw new Error("Network response was not ok");
  //         const data = await response.json();
  //         // console.log("Fetched data:", data);
  //         // Process the data as needed
  //       } catch (error) {
  //         // console.error("Error fetching data:", error);
  //       }
  //     }
  //   };

  //   fetchData();
  // }, []);

  return (
    <>
      <div className="success-container">
        <div className="success-content">
          <div className="status-heading">Payment Transaction Status</div>
          <div className={responseClass}>Transaction {response.status}</div>
          <br></br>
          <div className="transaction-details">
            <p>
              <span className="details-label">Transaction ID :</span>{" "}
              {response.txnId}
            </p>
            <p>
              <span className="details-label">Order ID :</span>{" "}
              {response.orderId}
            </p>
            <p>
              <span className="details-label">UTR Number :</span>{" "}
              {response?.utr?.length > 0 ? response.utr : "NA"}
            </p>
            <p>
              <span className="details-label">Response Message :</span>{" "}
              {response.responseMessage}
            </p>
            <p>
              <span className="details-label">Transaction Status : :</span>{" "}
              {response.status}
            </p>
            <p>
              <span className="details-label">Amount :</span> {response.amount}
            </p>
          </div>

          {/* <p>You will be redirected in {time}s. Do not refresh the page.</p> */}
          {/* Transaction ID- {response.txnId}
          Order ID- {response.orderId}
          UTR Number- {response.utr}
          Response Message- {response.responseMessage}
          Transaction Status- {response.status}
          Amount- {response.amount} */}

          {/* {response?.status} */}
          {/* <h1>Payment Successful!</h1>
          <p>Your payment has been processed successfully. Thank you for your purchase!</p>
          <button onClick={() => window.location.href = '/'}>Go to Home</button> */}
        </div>
      </div>
    </>
  );
};
export default ResponsePage;
