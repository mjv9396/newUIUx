import { Navigate } from "react-router-dom";
import { GetAuthToken } from "../services/cookieStore";

const LoginLayout = ({ children }) => {
  const isAuthenticated = GetAuthToken();

  return isAuthenticated ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <> {children}</>
  );
};

export default LoginLayout;
