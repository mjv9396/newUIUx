import { useState } from "react";
import { apiClient } from "../services/httpRequest";

const useFileDownload = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const fetchData = async (url, name) => {
    setLoading(true);
    try {
      const response = await apiClient.get(url, {
        responseType: "blob",
      });
      const blob = URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = blob;
      link.download = `${name}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { fetchData, error, loading };
};
export default useFileDownload;
