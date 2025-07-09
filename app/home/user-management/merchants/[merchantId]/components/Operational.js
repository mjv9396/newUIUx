import styles from "../page.module.css";
import useGetRequest from "@/app/hooks/useFetch";
import { useEffect } from "react";
import { endPoints } from "@/app/services/apiEndpoints";
import usePutRequest from "@/app/hooks/usePut";
import { useParams } from "next/navigation";
import { decryptParams } from "@/app/utils/decryptions";
import { successMsg } from "@/app/services/notify";
import { dateFormatter } from "@/app/utils/dateFormatter";
import SecretViewer from "@/app/ui/secretViewer/SecretViewer";
const Operational = ({ id, appId, secretId, merchant }) => {
  const param = useParams();
  const { putData, error, loading, response } = usePutRequest(
    endPoints.users.status + "/" + decryptParams(param.merchantId)
  );
  const {
    putData: verifiedPut,
    error: verifiedError,
    response: verifiedResponse,
  } = usePutRequest(
    endPoints.users.verified + "/" + decryptParams(param.merchantId)
  );
  const {
    putData: authPut,
    error: authError,
    loading: authLoading,
    response: authResponse,
  } = usePutRequest(
    endPoints.users.authStatus + "/" + decryptParams(param.merchantId)
  );

  const {
    loading: accountDetailLoading,
    error: accountDetailError,
    response: accountDetailResponse = [],
    getData: getAccountDetail,
  } = useGetRequest();

  useEffect(() => {
    getAccountDetail(
      endPoints.users.user + endPoints.users["account"]["details"] + "/" + id
    );
  }, [response, verifiedResponse, authResponse]);
  async function handleToggle(e) {
    e.preventDefault();
    await putData({});
  }
  async function handleToggleVerified(e) {
    e.preventDefault();
    await verifiedPut({});
  }
  async function handleToggleAuth(e) {
    e.preventDefault();
    await authPut({});
  }
  useEffect(() => {
    if (response && !error) {
      successMsg(response?.data.message);
    }
  }, [response, error]);
  useEffect(() => {
    if (verifiedResponse && !verifiedError) {
      successMsg(verifiedResponse?.data.message);
    }
  }, [verifiedResponse, verifiedError]);
  useEffect(() => {
    if (authResponse && !authError) {
      successMsg(authResponse?.data.message);
    }
  }, [authResponse, authError]);

  if (accountDetailLoading) return <p className="text-center">Loading...</p>;
  if (accountDetailError)
    return (
      <p className="text-center">
        Error: {error.message || "Something went wrong"}
      </p>
    );

  if (accountDetailResponse) {
    return (
      <div className="row">
        <div className=" mb-4">
          <div className={styles.secondaryCard}>
            <div className="d-flex justify-content-between align-items-center">
              <h6>Operational</h6>
            </div>
            <div className="row p-2">
              <table
                className="table table-borderless table-sm"
                id={styles.infotable}
              >
                <thead className="hidden">
                  <tr>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ width: 180 }}>Status</td>
                    <td>
                      {accountDetailResponse?.data.status ? (
                        <span className="d-flex">Active</span>
                      ) : (
                        <span className="d-flex">Inactive</span>
                      )}
                    </td>
                    <td>
                      {!merchant && (
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            name="status"
                            id="status"
                            checked={accountDetailResponse?.data.status}
                            onChange={handleToggle}
                          />
                        </div>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>Processing Mode</td>
                    <td>
                      {accountDetailResponse?.data.processingMode === "SALE" ? (
                        <span className="d-flex">SALE</span>
                      ) : (
                        <span className="d-flex">AUTH </span>
                      )}
                    </td>
                    <td>
                      {!merchant && (
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            name="auth"
                            id="auth"
                            checked={
                              accountDetailResponse?.data.processingMode ===
                              "SALE"
                            }
                            onChange={handleToggleAuth}
                          />
                        </div>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>Verified</td>
                    <td>
                      {accountDetailResponse?.data.verified ? (
                        <i className="bi bi-patch-check-fill text-success"></i>
                      ) : (
                        <i className="bi bi-patch-check"></i>
                      )}
                    </td>
                    <td>
                      {!merchant && (
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            name="verified"
                            id="verified"
                            checked={accountDetailResponse?.data.verified}
                            onChange={handleToggleVerified}
                          />
                        </div>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>App ID</td>
                    <td>{appId}</td>
                  </tr>
                  <tr>
                    <td> Secret Key</td>
                    <td>
                      <p>
                        <SecretViewer text={secretId} />
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default Operational;
