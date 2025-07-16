/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";
import { GetAuthToken, GetUserRole } from "../services/cookieStore";

const ProtectedLayout = ({ allowedRoles, children }) => {
  const isAuthenticated = GetAuthToken();
  const role = GetUserRole();
  if (!isAuthenticated) {
    return <Navigate to="/session-out" replace />;
  } else if (allowedRoles && !allowedRoles.includes(role)) {
    // If the user is authenticated but does not have the required role, redirect to Unauthorised page
    return <Navigate to="/unauthorised" replace />;
  }
  //  More authentication logic goes here:
  return isAuthenticated ? children : <Navigate to="/session-out" replace />;
};

export default ProtectedLayout;
