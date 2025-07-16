import { useState } from "react";
import { apiClient } from "../services/httpRequest";

const useDeleteWithBody = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const deleteData = async (url, data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.delete(url, { data });
      setData(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };
  return { deleteData, data, error, loading };
};

export default useDeleteWithBody;
