import {Typography } from "@mui/material"
import React, { useEffect, useState } from "react"
import {useLocation, useNavigate} from 'react-router-dom';
import { TransactionPayinRequestModel } from "../../model/TransactionPayinRequestModel.ts";
import './Loader.css'
import { AuthService } from "../../service/AuthService.ts";
import { msgTypes } from "../../constants/msgTypes.js";


const LoaderPage = () => {
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
    const [paymentStatus, setPaymentStatus] = useState("SENTTOBANK");
    const [apiResponse, setApiResponse] = useState(new TransactionPayinRequestModel())
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(()=>{
        if(location?.state!==undefined){
            checkStatus(location?.state?.request, location?.state?.token);
        }
    },[location?.state])


    useEffect(() => {
        const interval = setInterval(() => {
            checkStatus(location?.state?.request, location?.state?.token);
        }, 10000);
    
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (timeLeft === 0 || paymentStatus !== "SENTTOBANK") return;
        const intervalId = setInterval(() => {
            setTimeLeft(prevTime => prevTime - 1);
            if(timeLeft===1)
                navigate('/response-page', {state:{response: apiResponse }});
        }, 1000);
        return () => clearInterval(intervalId); // Clean up on component unmount or when time is up
    }, [timeLeft, paymentStatus]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes < 2 ? '0' : ''}${minutes}:${secs < 2 ? '0' : ''}${secs}`;
    };


    const checkStatus = async(requestData:TransactionPayinRequestModel, token: string) =>{ 
        const encryptResponse = await AuthService.encrypt(JSON.stringify({orderId:requestData.orderId }),msgTypes.APP_ID, msgTypes.SALT_ID)
        const requestObject= {appId:requestData.appId, data:encryptResponse}
        const res = await AuthService.checkStatus(requestObject, token);
        
        if(msgTypes.SUCCESS_CODE.includes(res.statusCode)){
            if(res.data.status){
                const response = res.data;
                const status = res?.data?.status;
                setApiResponse(response);
                if(status!==msgTypes.PENDING){
                   navigate('/response-page', {state:{response: response }})
                }
            }
        }
    }

    // const checktatus = () =>{

    // }



    return (
        // <Box display={"flex"} justifyContent={"center"} alignItems={"center"} minHeight="100vh" padding={2} maxHeight="80vh">
        <div className="p-4 d-flex justify-content-center">
            <div className="card">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <p className="p-0 m-0">{location?.state?.request?.businessName}</p>
                            <Typography><b>{location?.state?.request?.amount}&nbsp;</b>Rs</Typography>
                        </div>
                    </div>
                    <hr className="pt-0 mt-0 "></hr>
                    <div className="row w-100">
                        <div className="col-lg-3 col-md-3 col-sm-3">
                            <div className="content-box mt-2">
                                <img className="mt-2" src="images/bhim.png" width={80} height={80} alt=""></img>
                            </div>
                        </div>
                        <div className="col-lg-9 col-md-9 col-sm-9 p-2">
                            <p className="highlited-text">Step 1</p>
                            <Typography>Go to UPI Mobile App</Typography>
                        </div>
                    </div>
                    <div className="row w-100">
                        <div className="col-lg-3 col-md-3 col-sm-3">
                            <div className="content-box">
                                <img className="mt-2" src="images/loader-image2.jpeg" width={80} height={80} alt=""></img>
                            </div>
                        </div>
                        <div className="col-lg-9 col-md-9 col-sm-9 p-2">
                            <p className="highlited-text">Step 2</p>
                            <Typography>Check pending rquest and approve payment by entering <b>UPI PIN</b></Typography>
                        </div>
                    </div>
                    <br></br>
                    <br></br>
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="cardData">
                                <h3>Payment Pending</h3>
                                <div style={styles.timer}>
                                    <span style={styles.timerText}>{formatTime(timeLeft)}</span>
                                </div>
                                <div style={styles.progress}>
                                    <div style={{ ...styles.progressBar, width: `${(300 - timeLeft) / 3}%` }}></div>
                                </div>
                                {paymentStatus === "pending" && (
                                    <>
                                        <p style={styles.instructions}>Please complete the UPI payment within 5 minutes.</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        // </Box>
    );
};

const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
    },
    timer: {
        fontSize: "3rem",
        fontWeight: "bold",
        marginBottom: "1rem",
        color: "#333",
    },
    timerText: {
        fontSize: "2.5rem",
    },
    progress: {
        backgroundColor: "#e0e0e0",
        borderRadius: "25px",
        height: "10px",
        marginBottom: "1.5rem",
        overflow: "hidden",
    },
    progressBar: {
        backgroundColor: "#4caf50",
        height: "100%",
        transition: "width 1s",
    },
    instructions: {
        fontSize: "1rem",
        color: "#555",
        marginBottom: "1.5rem",
    },

};

export default LoaderPage