import { GetUserStatus } from "../services/cookieStore";
import { Navigate } from "react-router-dom";

const ActiveUserLayout = ({ children }) => {
  const status = GetUserStatus();
  if (status === null) {
    return <Navigate to="/session-out" replace />;
  }
  return status ? children : <Navigate to="/kyc-verification" replace />;
};

export default ActiveUserLayout;
