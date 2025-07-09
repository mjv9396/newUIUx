import { useState } from "react";
import apiClient from "../services/apiClient";
import { multipartHeader } from "../services/headerConfig";

const usePostRequest = (url) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);
  const postData = async (data, formData = false, responseType = false) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.post(url, data, {
        headers: formData && multipartHeader,
        responseType: responseType ? "blob" : undefined,
      });
      setResponse(res);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { postData, loading, error, response };
};
export default usePostRequest;
