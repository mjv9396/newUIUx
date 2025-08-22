import axios from "axios";
import { clearCookieStorage, GetAuthToken } from "./cookieStore";
import { errorMessage } from "../utils/messges";

// Create a axios instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 40000,
});

//Request interceptor for adding tokens or custom headers
apiClient.interceptors.request.use(
  (config) => {
    const token = GetAuthToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors and responses globally
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      if(data?.path === "/service/logout") return;
      if (status === 401) {
        if (window.location.pathname !== "/") {
          window.location.href = "/session-out";
        }
        clearCookieStorage();

        errorMessage(data.error.detailMessage || data.error);
      } else if (status === 500) {
        errorMessage(data.error.detailMessage || "Internal Server Error");
      } else {
        errorMessage(data.error.detailMessage || "An Error occurred");
      }
    } else if (error.request) {
      errorMessage("Network error. Please check your connection");
    } else {
      errorMessage(error.message || "Something went wrong");
    }
    return Promise.reject(error);
  }
);

// Method for multipart/formdata request with progress
const uploadFile = async (url, formdata) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await apiClient.post(url, formdata, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        console.log(`upload progress: ${percentCompleted}`);
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export { apiClient, uploadFile };
