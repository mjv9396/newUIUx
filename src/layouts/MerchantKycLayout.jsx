/* eslint-disable react/prop-types */
import { Navigate, useLocation } from "react-router-dom";
import {
  merchantNeedsKyc,
  isKycRoute,
  GetUserRole,
} from "../services/cookieStore";

const MerchantKycLayout = ({ children }) => {
  const location = useLocation();
  const needsKyc = merchantNeedsKyc();
  const userRole = GetUserRole();

  // Only apply KYC restrictions for merchants
  if (userRole === "MERCHANT") {
    // If merchant needs KYC and is not on an allowed route, redirect to KYC
    if (needsKyc && !isKycRoute(location.pathname)) {
      return <Navigate to="/kyc-verification" replace />;
    }
  }

  return children;
};

export default MerchantKycLayout;
