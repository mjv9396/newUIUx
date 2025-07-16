import { useState } from "react";
import { uploadFile } from "../services/httpRequest";

const useFileUpload = () => {
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const uploadData = async (url, formdata) => {
    setLoading(true);
    setProgress(0);
    setError(null);
    try {
      const response = await uploadFile(url, formdata);
      return response;
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };
  return { uploadData, progress, error, loading };
};

export default useFileUpload;
