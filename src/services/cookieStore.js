import Cookies from "js-cookie";
import CryptoJS from "crypto-js";
import { useEffect } from "react";
import useFetch from "../hooks/useFetch";
import { endpoints } from "./apiEndpoints";
import { useNavigate } from "react-router-dom";

const cookieOptions = {
  expires: 30 / (60 * 24), // Expires in 15 minutes
  sameSite: "strict", // Prevents CSRF attacks
  secure: import.meta.env.MODE === "production", // Ensures the cookie is sent over HTTPS
};


const encryptToken = (token) => {
  const encrypted = CryptoJS.AES.encrypt(
    token,
    import.meta.env.VITE_SECRET_KEY
  ).toString();
  return encrypted;
};

const decryptToken = (encryptedToken) => {
  const bytes = CryptoJS.AES.decrypt(
    encryptedToken,
    import.meta.env.VITE_SECRET_KEY
  );
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);
  return decrypted || null;
};

export const CookieStorage = (value) => {
  if (value) {
    const isProduction = import.meta.env.MODE === "production";
    Cookies.set("authToken", encryptToken(value.token), {
      ...cookieOptions
    });
    Cookies.set("role", encryptToken(value.authority), {
      ...cookieOptions
    });
    Cookies.set("username", encryptToken(value.username), {
      ...cookieOptions
    });
    Cookies.set("status", encryptToken(value.userAccountState), {
      ...cookieOptions
    });
    Cookies.set("userId", encryptToken(value.userId.toString()), {
      ...cookieOptions
    });
    // Set the expiry time for the authToken as session
    const expiryTime = encryptToken(
      new Date(Date.now() + 15 * 60 * 1000).toISOString()
    ); // 15 minutes from now
    Cookies.set("session", expiryTime, {
      ...cookieOptions
    });

    return true;
  }
  return null;
};

export const GetAuthToken = () => {
  const data = Cookies.get("authToken");

  if (data) {
    const decryptedData = decryptToken(data);
    return decryptedData;
  }
  return null;
};

export const GetUsername = () => {
  const data = Cookies.get("username");
  if (data) {
    const decryptedData = decryptToken(data);
    return decryptedData;
  }
  return null;
};

export const GetUserRole = () => {
  const data = Cookies.get("role");
  if (data) {
    const decryptedData = decryptToken(data);
    return decryptedData;
  }
  return null;
};

export const GetUserId = () => {
  const data = Cookies.get("userId")?.toString();
  if (data) {
    const decryptedData = decryptToken(data);
    return decryptedData;
  }
  return null;
};

export const GetUserStatus = () => {
  const data = Cookies.get("status");
  if (data) {
    const decryptedData = decryptToken(data);
    if (decryptedData) {
      return decryptedData === "ACTIVE";
    }
    return null;
  }
  return null;
};

// Check if merchant needs KYC verification
export const merchantNeedsKyc = () => {
  const role = GetUserRole();
  const status = GetUserStatus();
  
  // If user is merchant and status is not active, they need KYC
  return role === "MERCHANT" && status === false;
};

// Check if current route is allowed for inactive merchants
export const isKycRoute = (pathname) => {
  const allowedRoutes = [
    '/kyc-verification',
    '/login-history', 
    '/update-password',
    '/session-out',
    '/unauthorised',
    '/privacy-policy',
    '/terms-and-conditions',
    '/'
  ];
  
  // Check exact matches first
  if (allowedRoutes.includes(pathname)) {
    return true;
  }
  
  // Check if it's a sub-route of allowed routes
  return allowedRoutes.some(route => 
    route !== '/' && pathname.startsWith(route)
  );
};

// get session
export const GetSession = () => {
  const data = Cookies.get("session");
  if (data) {
    const decryptedData = decryptToken(data);
    return decryptedData;
  }
  return null;
};

// clear cookies
export const clearCookieStorage = () => {
  Cookies.remove("authToken");
  Cookies.remove("role");
  Cookies.remove("username");
  Cookies.remove("status");
  Cookies.remove("userId");
  Cookies.remove("session");
};

export const isAdmin = () => GetUserRole() === "ADMIN";
export const isMerchant = () => GetUserRole() === "MERCHANT";
export const isReseller = () => GetUserRole() === "RESELLER";

// get verification status
export const getVerificationStatus = () => {
  // get data from api

  return false;
};

export const CheckCookieTimeout = () => {
  // const { fetchData: LogoutUser } = useFetch();
  const navigate = useNavigate();
  useEffect(() => {
    const interval = setInterval(() => {
      const token = GetAuthToken();
      const session = GetSession();

      if (!token || !session) {
        clearCookieStorage();
        navigate("/");
        return;
      }

      const currentTime = Date.now();
      const sessionExpiryTime = new Date(session).getTime();

      if (currentTime > sessionExpiryTime) {
        clearCookieStorage();
        navigate("/");
        LogoutUser();
      }
    }, 30000); // check every 30 seconds — adjust as needed

    return () => clearInterval(interval); // cleanup on unmount
  }, []);

  return null;
};

// Hook to check and redirect merchants who need KYC
export const useMerchantKycCheck = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    if (merchantNeedsKyc() && !isKycRoute(window.location.pathname)) {
      navigate('/kyc-verification', { replace: true });
    }
  }, [navigate]);
};


export const LogoutUser = () => {
  const res = fetch(endpoints.logout, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GetAuthToken()}`,
    },
  });
  return res;
}