import { useState } from "react";
import { apiClient } from "../services/httpRequest";
const blobresponse = { responseType: "blob" };
const useFetch = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const fetchData = async (url, responseType = false) => {
    setLoading(true);
    try {
      const response = await apiClient.get(url, responseType && blobresponse);
      if (responseType) {
        const url = URL.createObjectURL(response.data);
        setData(url);
      } else {
        setData(response.data);
      }
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { fetchData, data, error, loading };
};

export default useFetch;
