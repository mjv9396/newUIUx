import { useState } from "react";
import { apiClient } from "../services/httpRequest";

const usePut = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const putData = async (url, data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.put(url, data);
      setData(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };
  return { putData, data, error, loading };
};

export default usePut;
