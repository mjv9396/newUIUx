import AddSettlementCycle from "../modals/AddSettlementCycle";
import styles from "../page.module.css";
import { useEffect, useState } from "react";
import useGetRequest from "@/app/hooks/useFetch";
import { endPoints } from "@/app/services/apiEndpoints";

const SettlementCycle = ({ name, id, isMerchant }) => {
  const [successAction, setSuccessAction] = useState(false);
  const { getData, response = [] } = useGetRequest();
  useEffect(() => {
    getData(endPoints.mapping.settlementCycle + "/" + id);
  }, [successAction]);

  // Add Settlement Cycle Logic

  const [viewAddSettlementCycleModal, setViewAddSettlementCycleModal] =
    useState(false);
  return (
    <>
      {viewAddSettlementCycleModal && (
        <AddSettlementCycle
          name={name}
          id={id}
          onSuccess={() => setSuccessAction(!successAction)}
          onClose={() =>
            setViewAddSettlementCycleModal(!viewAddSettlementCycleModal)
          }
        />
      )}
      <div className="row">
        <div className="col-12 mb-3">
          <div className={styles.secondaryCard}>
            <div className="d-flex justify-content-between align-items-center">
              <h6>Settlement Cycle</h6>
              {!isMerchant && (
                <i
                  className="bi bi-plus-lg"
                  id={styles.editicon}
                  onClick={() => setViewAddSettlementCycleModal(true)}
                ></i>
              )}
            </div>
            <div className="row mt-2">
              <div className="col-12">
                <div className="text-center">
                  {(response?.data === null || response?.data.length === 0) && (
                    <small className="text-center">
                      Add Settlement Cycle to view
                    </small>
                  )}
                </div>
                {response?.data && (
                  <table
                    className="table table-responsive-sm overflow-auto"
                    id={styles.table}
                  >
                    <thead>
                      <tr>
                        <th>Settlement Type</th>
                        <th>Day</th>
                        <th>Settlement Time</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{response?.data.settlementType || "NA"}</td>
                        <td>{response?.data.day || "NA"}</td>
                        <td>{response?.data.settlementTime || "NA"}</td>
                        <td>
                          {response?.data.settlementActive
                            ? "Active"
                            : "Inactive"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettlementCycle;
