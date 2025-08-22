import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { GetUserId } from "../../services/cookieStore";
import styles from "../../styles/common/List.module.css";
import useFetch from "../../hooks/useFetch";
import { endpoints } from "../../services/apiEndpoints";
import GenerateSecretKey from "./components/GenerateSecretKey";
import { successMessage } from "../../utils/messges";

const documents = [
  {
    name: "Non Seamless Integration",
    fileName: "non-seamless",
    path: "./non-seamless.json",
  },
  {
    name: "Payout Integration",
    fileName: "payout",
    path: "./payout.json",
  },
  {
    name: "Seamless Integration",
    fileName: "seamless",
    path: "./seamless.json",
  },
];

const Documentation = () => {
  const [showGenerateSecretKey, setShowGenerateSecretKey] = useState(false);
  const [showAppId, setShowAppId] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);

  const { fetchData, data, error, loading } = useFetch();

  useEffect(() => {
    fetchData(endpoints.user.fullProfile);
  }, []);

  const refreshProfileData = () => {
    fetchData(endpoints.user.fullProfile);
  };

  const handleDownload = (fileName, path) => {
    const link = document.createElement("a");
    link.href = path;
    link.download = `unitybridge-services-private-limited_api_documentation_${fileName}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopy = (text, type) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        // You can add a toast notification here if needed
        successMessage(`${type} copied to clipboard`);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  const maskString = (str, visibleChars = 4) => {
    if (!str) return "";
    if (str.length <= visibleChars) return str;
    return (
      str.substring(0, visibleChars) + "*".repeat(str.length - visibleChars)
    );
  };

  return (
    <DashboardLayout page="Documentation" url="/dashboard/documentation">
      {/* <h6>Unitybridge Services Private Limited Documentation</h6> */}

      {showGenerateSecretKey && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body">
                <GenerateSecretKey
                  onClose={() => setShowGenerateSecretKey(false)}
                  onSuccess={refreshProfileData}
                  userEmail={data?.data?.email}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ marginBottom: "1rem", marginTop: "1rem" }}>
        <div className="d-flex align-items-center gap-3 mb-3">
          <div className="d-flex align-items-center ">
            <strong>Merchant App ID:</strong>{" "}
            <span className="ms-2">
              {loading
                ? "Loading..."
                : showAppId
                ? data?.data?.appId
                : maskString(data?.data?.appId)}
            </span>
          </div>
          <div className="d-flex align-items-center ms-2">
            <button
              className="btn btn-sm btn-outline-secondary p-1 me-1"
              onClick={() => setShowAppId(!showAppId)}
              title={showAppId ? "Hide App ID" : "Show App ID"}
              disabled={loading}
              style={{ width: "32px", height: "32px" }}
            >
              <i className={`bi ${showAppId ? "bi-eye-slash" : "bi-eye"}`}></i>
            </button>
            <button
              className="btn btn-sm btn-outline-primary p-1"
              onClick={() => handleCopy(data?.data?.appId, "App ID")}
              title="Copy App ID"
              disabled={loading || !data?.data?.appId}
              style={{ width: "32px", height: "32px" }}
            >
              <i className="bi bi-copy"></i>
            </button>
          </div>
        </div>
        <div className="d-flex align-items-center gap-3">
          <div className="d-flex align-items-center ">
            <strong>Secret Key:</strong>{" "}
            <span className="ms-2">
              {loading
                ? "Loading..."
                : showSecretKey
                ? data?.data?.secretkey
                : maskString(data?.data?.secretkey)}
            </span>
          </div>
          <div className="d-flex align-items-center ms-2">
            <button
              className="btn btn-sm btn-outline-secondary p-1 me-1"
              onClick={() => setShowSecretKey(!showSecretKey)}
              title={showSecretKey ? "Hide Secret Key" : "Show Secret Key"}
              disabled={loading}
              style={{ width: "32px", height: "32px" }}
            >
              <i
                className={`bi ${showSecretKey ? "bi-eye-slash" : "bi-eye"}`}
              ></i>
            </button>
            <button
              className="btn btn-sm btn-outline-primary p-1 me-1"
              onClick={() => handleCopy(data?.data?.secretkey, "Secret Key")}
              title="Copy Secret Key"
              disabled={loading || !data?.data?.secretkey}
              style={{ width: "32px", height: "32px" }}
            >
              <i className="bi bi-copy"></i>
            </button>
            <button
              className="btn btn-sm btn-outline-primary px-2 py-1"
              onClick={() => setShowGenerateSecretKey(true)}
              title="Generate New Secret Key"
              disabled={loading}
              style={{ height: "32px" }}
            >
              <i className="bi bi-arrow-clockwise me-1"></i>
              Generate New Key
            </button>
          </div>
        </div>
      </div>
      <div className="col">
        {/* {documents.map((doc) => (
          <div
            className="d-flex align-items-center justify-content-between"
            key={doc.fileName}
          >
            <div
              style={{ display: "flex", flexDirection: "row", gap: 5 }}
              className={styles.listing}
            >
              <h5 className="text-left">{doc.name}</h5>
              <div className="">
                <button
                  className={styles.download}
                  onClick={() => handleDownload(doc.fileName, doc.path)}
                >
                  Download
                </button>
              </div>
            </div>
          </div>
        ))} */}
      </div>
    </DashboardLayout>
  );
};

export default Documentation;
