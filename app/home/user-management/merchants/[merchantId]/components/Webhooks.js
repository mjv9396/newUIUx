import styles from "../page.module.css";
import useGetRequest from "@/app/hooks/useFetch";
import { useEffect, useState } from "react";
import { endPoints } from "@/app/services/apiEndpoints";
import useDeleteRequest from "@/app/hooks/useDelete";
import DeleteWarning from "@/app/ui/modals/DeleteWarning";
import AddWebhook from "../modals/AddWebhook";

const Webhooks = ({ name, id }) => {
  // State for managing modals and form data
  const [successfullAdd, setSuccessfullAdd] = useState(false);
  const [viewAddWebhookModal, setViewAddWebhookModal] = useState(false);
  const [addWebhookData, setAddWebhookData] = useState({
    type: "",
    url: "",
    userId: "",
    action: "",
    defaultValue: null,
  });

  // State for delete warning
  const [viewDeleteWarning, setViewDeleteWarning] = useState(false);
  const [deletionTypeUrl, setDeletionTypeUrl] = useState();

  // API hooks
  const {
    getData: getPayinWebhook,
    response: responsePayinWebhook,
    error: errorPayinWebhook,
  } = useGetRequest();
  
  const {
    getData: getPayoutWebhook,
    response: responsePayoutWebhook,
    error: errorPayoutWebhook,
  } = useGetRequest();

  const {
    response: deleteResponse,
    deleteData,
    error: deleteError,
  } = useDeleteRequest();

  // Handle adding webhook
  const handleAddWebhook = (userId, type, url, action, defaultValue = null) => {
    setAddWebhookData({ userId, type, url, action, defaultValue });
    setViewAddWebhookModal(true);
  };

  // Handle deleting webhook
  const handleViewDeleteWarning = (url) => {
    setDeletionTypeUrl(url);
    setViewDeleteWarning(true);
  };

  const handleConfirmDelete = async () => {
    await deleteData(deletionTypeUrl);
    setViewDeleteWarning(false);
  };

  // Fetch webhooks data
  useEffect(() => {
    getPayinWebhook(endPoints.mapping.payinWebhook + "/" + id);
    getPayoutWebhook(endPoints.mapping.payoutWebhook + "/" + id);
  }, [successfullAdd, deleteResponse, deleteError]);

  if (errorPayinWebhook || errorPayoutWebhook) {
    return <p className="text-center">Error loading webhook data</p>;
  }

  return (
    <>
      {viewAddWebhookModal && (
        <AddWebhook
          name={name}
          id={id}
          data={addWebhookData}
          onSuccess={() => setSuccessfullAdd(!successfullAdd)}
          onClose={() => setViewAddWebhookModal(!viewAddWebhookModal)}
        />
      )}
      {viewDeleteWarning && (
        <DeleteWarning
          onClose={() => setViewDeleteWarning(!viewDeleteWarning)}
          onConfirm={handleConfirmDelete}
        />
      )}
      
      {/* Payin Webhook Section */}
      <div className="row">
        <div className="col-md-12 col-sm-12 mb-4">
          <div className={styles.secondaryCard}>
            <div className="d-flex justify-content-between align-items-center">
              <h6>Payin Webhook</h6>
              {!responsePayinWebhook?.data?.payinWebhookUrl && (
                <button 
                  className="btn btn-sm btn-outline-primary"
                  onClick={() =>
                    handleAddWebhook(
                      id,
                      "payin",
                      endPoints.mapping.payinWebhook,
                      "Add"
                    )
                  }
                >
                  <i className="bi bi-plus-lg"></i> Add
                </button>
              )}
              {responsePayinWebhook?.data?.payinWebhookUrl && (
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() =>
                    handleAddWebhook(
                      id,
                      "payin",
                      endPoints.mapping.payinWebhook,
                      "Edit",
                      responsePayinWebhook?.data.payinWebhookUrl
                    )
                  }
                >
                  <i className="bi bi-pencil-fill"></i> Edit
                </button>
              )}
            </div>
            {responsePayinWebhook?.data?.payinWebhookUrl && (
              <div className="row p-2">
                <table
                  className="table table-borderless table-sm"
                  id={styles.infotable}
                >
                  <thead className="hidden">
                    <tr>
                      <th></th>
                      <th></th>
                      <th style={{ width: 50 }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ width: 120 }}>URL</td>
                      <td>
                        {responsePayinWebhook?.data.payinWebhookUrl || "NA"}
                      </td>
                      <td>
                        <button
                          className="btn btn-sm text-danger"
                          onClick={() =>
                            handleViewDeleteWarning(
                              `${endPoints.mapping.payinWebhook}/${id}`
                            )
                          }
                        >
                          <i className="bi bi-trash-fill"></i>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
            {!responsePayinWebhook?.data?.payinWebhookUrl && (
              <div className="row p-2">
                <div className="col-12 text-center">
                  <small>No webhook URL configured</small>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payout Webhook Section */}
      <div className="row">
        <div className="col-md-12 col-sm-12 mb-4">
          <div className={styles.secondaryCard}>
            <div className="d-flex justify-content-between align-items-center">
              <h6>Payout Webhook</h6>
              {!responsePayoutWebhook?.data?.payoutWebhookUrl && (
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() =>
                    handleAddWebhook(
                      id,
                      "payout",
                      endPoints.mapping.payoutWebhook,
                      "Add"
                    )
                  }
                >
                  <i className="bi bi-plus-lg"></i> Add
                </button>
              )}
              {responsePayoutWebhook?.data?.payoutWebhookUrl && (
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() =>
                    handleAddWebhook(
                      id,
                      "payout",
                      endPoints.mapping.payoutWebhook,
                      "Edit",
                      responsePayoutWebhook?.data.payoutWebhookUrl
                    )
                  }
                >
                  <i className="bi bi-pencil-fill"></i> Edit
                </button>
              )}
            </div>
            {responsePayoutWebhook?.data?.payoutWebhookUrl && (
              <div className="row p-2">
                <table
                  className="table table-borderless table-sm"
                  id={styles.infotable}
                >
                  <thead className="hidden">
                    <tr>
                      <th></th>
                      <th></th>
                      <th style={{ width: 50 }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ width: 120 }}>URL</td>
                      <td>
                        {responsePayoutWebhook?.data.payoutWebhookUrl || "NA"}
                      </td>
                      <td>
                        <button
                          className="btn btn-sm text-danger"
                          onClick={() =>
                            handleViewDeleteWarning(
                              `${endPoints.mapping.payoutWebhook}/${id}`
                            )
                          }
                        >
                          <i className="bi bi-trash-fill"></i>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
            {!responsePayoutWebhook?.data?.payoutWebhookUrl && (
              <div className="row p-2">
                <div className="col-12 text-center">
                  <small>No webhook URL configured</small>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Webhooks;
