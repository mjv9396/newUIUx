import { useState } from "react";
import { apiClient } from "../services/httpRequest";

const usePost = (url, multipart) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const postData = async (data) => {
    setLoading(true);
    setError(null);
    setData(null);
    
    try {
      const response = await apiClient.post(url, data, {
        headers: { "Content-Type": multipart ? "multipart/form-data" : "application/json" },
      });
      setData(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };
  return { postData, data, error, loading };
};

export default usePost;
