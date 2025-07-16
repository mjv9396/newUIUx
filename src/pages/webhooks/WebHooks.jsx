/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import DashboardLayout from "../../layouts/DashboardLayout";
import { endpoints } from "../../services/apiEndpoints";
import styles from "../../styles/common/List.module.css";
import { Link } from "react-router-dom";
import usePost from "../../hooks/usePost";

import useDelete from "../../hooks/useDelete";
import { successMessage } from "../../utils/messges";

const WebHooks = () => {
  const { fetchData, error, data } = useFetch();

  const [type, setType] = useState(null);

  const handleEdit = (type) => {
    setType(type);
  };
  const {
    deleteData: deletePayin,
    data: deletePayinData,
    error: deletePayinError,
  } = useDelete();
  const handleDelete = async (type, userId) => {
    if (type === "payin") {
      await deletePayin(endpoints.webhook.payinWebhook + "/" + userId);
    } else if (type === "payout") {
      await deletePayin(endpoints.webhook.payoutWebhook + "/" + userId);
    }
  };
  useEffect(() => {
    if (deletePayinData && !deletePayinError) {
      successMessage("Data deleted success");
    }
  }, [deletePayinData, deletePayinError]);

  const {
    postData: payin,
    data: payinData,
    error: payinError,
  } = usePost(endpoints.webhook.payinWebhook);
  const {
    postData: payout,
    data: payoutData,
    error: payoutError,
  } = usePost(endpoints.webhook.payoutWebhook);
  const handleSaveUrl = async (e, type) => {
    setType(null);
    if (type === "payin") {
      await payin({ userId: 0, payinWebHookUrl: e.target.value });
    } else if (type === "payout") {
      await payout({ userId: 0, payoutWebHookUrl: e.target.value });
    }
  };

  useEffect(() => {
    if (payinData && !payinError) {
    successMessage(payinData.data || "payin url added successfully");
    }
  }, [payinData, payinError]);
  useEffect(() => {
    if (payoutData && !payoutError) {
      successMessage(payoutData.data || "payout url added successfully");
    }
  }, [payoutData, payoutError]);
  useEffect(() => {
    fetchData(endpoints.webhook.payinWebhook + "/" + 0);
  }, [deletePayinData, payinData, payoutData]);
  if (error)
    return (
      <DashboardLayout page="Webhooks" url="/dashboard/webhooks">
        <div className={styles.listing}>
          <p className="text-center">
            Failed to fetch data <Link to="/">Login</Link> again
          </p>
        </div>
      </DashboardLayout>
    );
  if (data) {
    return (
      <DashboardLayout page="Webhooks" url="/dashboard/webhooks">
        <div className={styles.listing}>
          <div className={styles.table}>
            {data.data ? (
              <table className="table table-responsive-sm" id="settlementList">
                <thead>
                  <tr>
                    <th style={{ width: 250 }}>Type</th>
                    <th>URL</th>
                    <th style={{ width: 150 }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Payin Webhook Url</td>
                    <td>
                      {type === "payin" ? (
                        <input
                          type="url"
                          defaultValue={data.data.payinWebHookUrl}
                          onBlur={(e) => handleSaveUrl(e, "payin")}
                          name="payin"
                          id="payin"
                          className="w-100"
                        />
                      ) : (
                        data.data.payinWebHookUrl || "NA"
                      )}
                    </td>
                    <td>
                      <span className="d-flex gap-3">
                        {data.data.payinWebHookUrl && (
                          <>
                            <i
                              className="bi bi-pencil-fill text-info"
                              onClick={() => handleEdit("payin")}
                            ></i>
                            <i
                              className="bi bi-trash-fill text-danger"
                              onClick={() =>
                                handleDelete("payin", data.data.userId)
                              }
                            ></i>
                          </>
                        )}
                        {!data.data.payinWebHookUrl && (
                          <i
                            className="bi bi-plus-circle text-success"
                            onClick={() => handleEdit("payin")}
                          ></i>
                        )}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>Payout Webhook Url</td>
                    <td>
                      {type === "payout" ? (
                        <input
                          type="url"
                          defaultValue={data.data.payoutWebHookUrl}
                          onBlur={(e) => handleSaveUrl(e, "payout")}
                          name="payout"
                          id="payout"
                        />
                      ) : (
                        data.data.payoutWebHookUrl || "NA"
                      )}
                    </td>
                    <td>
                      <span className="d-flex gap-3">
                        {data.data.payoutWebHookUrl && (
                          <>
                            <i
                              className="bi bi-pencil-fill text-info"
                              onClick={() => handleEdit("payout")}
                            ></i>
                            <i
                              className="bi bi-trash-fill text-danger"
                              onClick={() =>
                                handleDelete("payout", data.data.userId)
                              }
                            ></i>
                          </>
                        )}
                        {!data.data.payoutWebHookUrl && (
                          <i
                            className="bi bi-plus-circle text-success"
                            onClick={() => handleEdit("payout")}
                          ></i>
                        )}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <p>No Web hook Url Present</p>
            )}
          </div>
        </div>
      </DashboardLayout>
    );
  }
};

export default WebHooks;
