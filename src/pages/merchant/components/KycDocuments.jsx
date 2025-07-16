import { useEffect, useState } from "react";
import useFetch from "../../../hooks/useFetch";
import { endpoints } from "../../../services/apiEndpoints";
import styles from "../../../styles/common/List.module.css";
import Error from "../../errors/Error";
import Loading from "../../errors/Loading";
import ViewDocumentImage from "./ViewDocumentImage";

export default function KycDocuments({ userId }) {
  const { fetchData, data, error, loading } = useFetch();
  const [viewDocument, setViewDocument] = useState(false);
  const [documentId, setDocumentId] = useState(null);
  const [document, setDocument] = useState("");
  const handleViewDocument = (id, data) => {
    setDocumentId(id);
    setDocument(data);
    setViewDocument(true);
  };
  useEffect(() => {
    fetchData(endpoints.kyc.getAllDocument + userId);
  }, []);
  if (loading) return <Loading />;
  if (error) return <Error error={error} />;

  return (
    <div>
      {viewDocument && (
        <ViewDocumentImage
          docId={documentId}
          docUrl={document?.documentUrl}
          onClose={() => {
            setViewDocument(!viewDocument);
            fetchData(endpoints.kyc.getAllDocument + userId);

          }}
          userId={userId}
          isVerified={document?.verified}
          rejectReason={document?.rejectedReasion}
        />
      )}
      <h6>KYC Documents</h6>
      <div className={styles.table}>
        <table className="table table-responsive-sm">
          <thead>
            <tr>
              <th>Sr. No.</th>
              <th>Document Type</th>
              <th>Document Number</th>
              <th>Document File</th>
              <th>Status</th>
              <th style={{ minWidth: 80 }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {data?.data.length > 0 ? (
              data.data.map((item, index) => (
                <tr key={item.documentId}>
                  <td>{index + 1}</td>
                    <td>{item.documentType}</td>
                    <td>{item.documentNumber ?? "N/A"}</td>
                  <td>{item.documentName}</td>
                  <td>
                    {item.verified ? <span className="badge bg-success">Verified</span> : item.rejectedReasion ? (
                        <span className="badge bg-danger">Rejected</span>
                        ) : (
                        <span className="badge bg-warning">Pending</span>
                        )}
                  </td>
                  <td>
                    <button
                      className="btn btn-ghost-primary btn-sm"
                      onClick={() => handleViewDocument(item.documentId, item)}
                      title="View Document"
                    >
                      <i className="bi bi-eye"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3}>No Documents Available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
