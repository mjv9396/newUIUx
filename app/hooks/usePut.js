import { useState } from "react";
import apiClient from "../services/apiClient";

const usePutRequest = (url) => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const putData = async (data) => {
    setLoading(true);
    try {
      const result = await apiClient.put(url, data);
      setResponse(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { response, error, loading, putData };
};

export default usePutRequest;
