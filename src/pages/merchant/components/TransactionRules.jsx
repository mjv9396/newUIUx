/* eslint-disable react/prop-types */
import { useEffect, useState, useCallback } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import usePost from "../../../hooks/usePost";
import { endpoints } from "../../../services/apiEndpoints";
import styles from "../../../styles/merchant/Merchant.module.css";
import dragStyles from "../../../styles/DragDrop.module.css";
import DraggableTableRow from "../../../components/DraggableTableRow";
import { useNavigate } from "react-router-dom";
import { successMessage } from "../../../utils/messges";

const TransactionRules = ({
  userId,
  payoutTxnLimit,
  payoutBenificaryLimit,
  payoutHigherAmountLimit,
  payoutHigerAmountCountLimit,
  ...rest
}) => {
  const navigate = useNavigate();

  // Payout Form handlers
  const [payoutFormData, setPayoutFormData] = useState({
    userId,
    payoutTxnLimit,
    payoutBenificaryLimit,
    payoutHigherAmountLimit,
    payoutHigerAmountCountLimit,
  });

  // Payin Form handlers
  const [payinFormData, setPayinFormData] = useState({
    userId,
    payinDailyAmountLimit: "",
  });

  // Acquirer limits data
  const [payinAcqLimits, setPayinAcqLimits] = useState([]);
  const [payoutAcqLimits, setPayoutAcqLimits] = useState([]);

  // API hooks for fetching acquirer limits
  const {
    postData: getPayinAcqLimits,
    data: payinAcqLimitsData,
    error: payinAcqLimitsError,
  } = usePost(endpoints.user.payinAcqLimits);

  const {
    postData: getPayoutAcqLimits,
    data: payoutAcqLimitsData,
    error: payoutAcqLimitsError,
  } = usePost(endpoints.user.payoutAcqLimits);

  // API hooks for updating limits and priorities
  const {
    postData: updatePayinAcqLimit,
    data: updatePayinLimitData,
    loading: updatePayinLimitLoading,
    error: updatePayinLimitError,
  } = usePost(endpoints.user.updatePayinAcqLimit);

  const {
    postData: updatePayoutAcqLimit,
    data: updatePayoutLimitData,
    loading: updatePayoutLimitLoading,
    error: updatePayoutLimitError,
  } = usePost(endpoints.user.updatePayoutAcqLimit);

  const {
    postData: updatePayinPriorities,
    data: payinPriorityData,
    loading: payinPriorityLoading,
    error: payinPriorityError,
  } = usePost(endpoints.user.updatePayinPriorities);

  const {
    postData: updatePayoutPriorities,
    data: payoutPriorityData,
    loading: payoutPriorityLoading,
    error: payoutPriorityError,
  } = usePost(endpoints.user.updatePayoutPriorities);

  const { postData, data, error } = usePost(endpoints.user.updatePayoutLimits);

  // Fetch acquirer limits on component mount
  useEffect(() => {
    getPayinAcqLimits({ userId });
    getPayoutAcqLimits({ userId });
  }, [userId]);

  // Handle payin acquirer limits data
  useEffect(() => {
    if (payinAcqLimitsData && !payinAcqLimitsError) {
      const sorted = [...payinAcqLimitsData.data].sort((a, b) => {
        const priorityA = parseInt(a.priority) || 999999;
        const priorityB = parseInt(b.priority) || 999999;
        return priorityA - priorityB;
      });
      setPayinAcqLimits(sorted);
    }
  }, [payinAcqLimitsData, payinAcqLimitsError]);

  // Handle payout acquirer limits data
  useEffect(() => {
    if (payoutAcqLimitsData && !payoutAcqLimitsError) {
      const sorted = [...payoutAcqLimitsData.data].sort((a, b) => {
        const priorityA = parseInt(a.priority) || 999999;
        const priorityB = parseInt(b.priority) || 999999;
        return priorityA - priorityB;
      });
      setPayoutAcqLimits(sorted);
    }
  }, [payoutAcqLimitsData, payoutAcqLimitsError]);

  // Handle form changes
  const handlePayoutChange = (e) => {
    const { name, value } = e.target;
    setPayoutFormData({ ...payoutFormData, [name]: parseInt(value) });
  };

  const handlePayinChange = (e) => {
    const { name, value } = e.target;
    setPayinFormData({ ...payinFormData, [name]: parseInt(value) });
  };

  // Drag and drop handlers for payin
  const movePayinRow = useCallback((dragIndex, hoverIndex) => {
    setPayinAcqLimits((prevList) => {
      const draggedItem = prevList[dragIndex];
      const newList = [...prevList];
      newList.splice(dragIndex, 1);
      newList.splice(hoverIndex, 0, draggedItem);
      return newList;
    });
  }, []);

  // Drag and drop handlers for payout
  const movePayoutRow = useCallback((dragIndex, hoverIndex) => {
    setPayoutAcqLimits((prevList) => {
      const draggedItem = prevList[dragIndex];
      const newList = [...prevList];
      newList.splice(dragIndex, 1);
      newList.splice(hoverIndex, 0, draggedItem);
      return newList;
    });
  }, []);

  // Handle drag end for payin
  const handlePayinDragEnd = useCallback(async () => {
    const updatedPriorities = payinAcqLimits.map((item, index) => ({
      userId,
      acqCode: item.acqCode,
      acqProfileId: item.acqProfileId,
      priority: (index + 1).toString(),
    }));

    try {
      await updatePayinPriorities(updatedPriorities);

      // Update local state to reflect new priorities
      setPayinAcqLimits((prevList) =>
        prevList.map((item, index) => ({
          ...item,
          priority: (index + 1).toString(),
        }))
      );
    } catch (error) {
      console.error("Failed to update payin priorities:", error);
    }
  }, [payinAcqLimits, userId]);

  // Handle drag end for payout
  const handlePayoutDragEnd = useCallback(async () => {
    const updatedPriorities = payoutAcqLimits.map((item, index) => ({
      userId,
      acqCode: item.acqCode,
      acqProfileId: item.acqProfileId,
      priority: (index + 1).toString(),
    }));

    try {
      await updatePayoutPriorities(updatedPriorities);

      // Update local state to reflect new priorities
      setPayoutAcqLimits((prevList) =>
        prevList.map((item, index) => ({
          ...item,
          priority: (index + 1).toString(),
        }))
      );
    } catch (error) {
      console.error("Failed to update payout priorities:", error);
    }
  }, [payoutAcqLimits, userId]);

  // Handle amount limit update for payin table
  const handlePayinUpdateLimit = async (item, newLimit) => {
    await handleUpdateLimit(item, newLimit, "payin");
  };

  // Handle amount limit update for payout table
  const handlePayoutUpdateLimit = async (item, newLimit) => {
    await handleUpdateLimit(item, newLimit, "payout");
  };

  // Handle amount limit update
  const handleUpdateLimit = async (item, newLimit, tableType = "auto") => {
    const updateData = {
      acqProfileId: item.acqProfileId,
      userId,
      acqCode: item.acqCode,
      amountLimit: newLimit,
    };

    try {
      // Determine which API to call
      let isPayinTable = false;

      if (tableType === "payin") {
        isPayinTable = true;
      } else if (tableType === "payout") {
        isPayinTable = false;
      } else {
        // Fallback: auto-detect based on acqMapId existence
        isPayinTable = payinAcqLimits.some(
          (acq) => acq.acqMapId === item.acqMapId
        );
      }

      if (isPayinTable) {
        await updatePayinAcqLimit(updateData);
        // Update only payin local state
        setPayinAcqLimits((prevList) =>
          prevList.map((acq) =>
            acq.acqMapId === item.acqMapId
              ? { ...acq, amountLimit: newLimit }
              : acq
          )
        );
      } else {
        await updatePayoutAcqLimit(updateData);
        // Update only payout local state
        setPayoutAcqLimits((prevList) =>
          prevList.map((acq) =>
            acq.acqMapId === item.acqMapId
              ? { ...acq, amountLimit: newLimit }
              : acq
          )
        );
      }
    } catch (error) {
      console.error("Failed to update amount limit:", error);
    }
  };

  // Handle API responses
  useEffect(() => {
    if (updatePayinLimitData) {
      if (updatePayinLimitData.statusCode < 400) {
        successMessage("Payin amount limit updated successfully");
        // Refresh the data
        getPayinAcqLimits({ userId });
      } else {
        // Show error message from response data
        successMessage(
          updatePayinLimitData.data || "Failed to update payin amount limit"
        );
      }
    }
    if (updatePayinLimitError) {
      successMessage("Failed to update payin amount limit");
    }
  }, [updatePayinLimitData, updatePayinLimitError]);

  useEffect(() => {
    if (updatePayoutLimitData) {
      if (updatePayoutLimitData.statusCode < 400) {
        successMessage("Payout amount limit updated successfully");
        // Refresh the data
        getPayoutAcqLimits({ userId });
      } else {
        // Show error message from response data
        successMessage(
          updatePayoutLimitData.data || "Failed to update payout amount limit"
        );
      }
    }
    if (updatePayoutLimitError) {
      successMessage("Failed to update payout amount limit");
    }
  }, [updatePayoutLimitData, updatePayoutLimitError]);

  useEffect(() => {
    if (payinPriorityData) {
      if (payinPriorityData.statusCode < 400) {
        successMessage("Payin priorities updated successfully");
      } else {
        successMessage(
          payinPriorityData.data || "Failed to update payin priorities"
        );
      }
    }
    if (payinPriorityError) {
      successMessage("Failed to update payin priorities");
    }
  }, [payinPriorityData, payinPriorityError]);

  useEffect(() => {
    if (payoutPriorityData) {
      if (payoutPriorityData.statusCode < 400) {
        successMessage("Payout priorities updated successfully");
      } else {
        successMessage(
          payoutPriorityData.data || "Failed to update payout priorities"
        );
      }
    }
    if (payoutPriorityError) {
      successMessage("Failed to update payout priorities");
    }
  }, [payoutPriorityData, payoutPriorityError]);

  const handleUpdatePayoutData = async () => {
    postData(payoutFormData);
  };

  const handleUpdatePayinData = async () => {
    // Implement payin daily limit update
    successMessage("Payin rules will be implemented in next version");
  };

  useEffect(() => {
    if (data && !error) {
      const updatedState = { ...rest, ...payoutFormData };
      successMessage("details updated successfully");
      navigate("/update-merchant", { state: updatedState });
    }
  }, [error, data]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        {/* Payin Transaction Rules Section */}
        <h6>Payin Transaction Rules</h6>
        <div className="row mt-4">
          <div className="col-md-6 col-sm-12 mb-3">
            <div className={styles.input} style={{ minWidth: "100%" }}>
              <label htmlFor="payinDailyAmountLimit">
                Daily Amount Limit <span className="required">*</span>
              </label>
              <input
                type="text"
                name="payinDailyAmountLimit"
                id="payinDailyAmountLimit"
                placeholder="Enter daily amount limit"
                onChange={handlePayinChange}
              />
            </div>
          </div>
          <div className="d-flex justify-content-end mt-3">
            <button className={styles.update} onClick={handleUpdatePayinData}>
              Update Payin Rules
            </button>
          </div>
        </div>

        {/* Payin Acquirer Limits Table */}
        {payinAcqLimits.length > 0 && (
          <div className="mt-5">
            <h6>Payin Acquirer Limits</h6>
            <p className={dragStyles.tableDragInfo}>
              <i className="bi bi-info-circle"></i> Drag rows to reorder
              priority. Click edit icon to update amount limits.
              {(payinPriorityLoading || updatePayinLimitLoading) && (
                <i className="bi bi-arrow-repeat spin ms-2"></i>
              )}
            </p>
            <div className={styles.table}>
              <table className="table table-responsive-sm">
                <thead>
                  <tr>
                    <th>Drag</th>
                    <th>Acq Name</th>
                    <th>Profile Name</th>
                    <th>Priority</th>
                    <th>Amount Limit</th>
                  </tr>
                </thead>
                <tbody>
                  {payinAcqLimits.map((item, index) => (
                    <DraggableTableRow
                      key={item.acqMapId}
                      index={index}
                      item={item}
                      moveRow={movePayinRow}
                      onDragEnd={handlePayinDragEnd}
                      onUpdateLimit={handlePayinUpdateLimit}
                      isUpdating={updatePayinLimitLoading}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Payout Transaction Rules Section */}
        <h6 className="mt-5">Payout Transaction Rules</h6>
        <div className="row mt-4">
          <div className="row">
            <div className=" col-md-6 col-sm-12 mb-3">
              <div className={styles.input} style={{ minWidth: "100%" }}>
                {" "}
                <label htmlFor="payoutTxnLimit">
                  Payout Transaction Limit Per Day count{" "}
                  <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="payoutTxnLimit"
                  id="payoutTxnLimit"
                  defaultValue={payoutTxnLimit}
                  placeholder="Enter payout transaction Limit"
                  onChange={handlePayoutChange}
                />
              </div>
            </div>
            <div className=" col-md-6 col-sm-12 mb-3">
              <div className={styles.input} style={{ minWidth: "100%" }}>
                {" "}
                <label htmlFor="payoutBenificaryLimit">
                  Per Payout Benificary Limit Per Day Count{" "}
                  <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="payoutBenificaryLimit"
                  id="payoutBenificaryLimit"
                  defaultValue={payoutBenificaryLimit}
                  placeholder="Enter Payout Benificary Limit"
                  onChange={handlePayoutChange}
                />
              </div>
            </div>
            <div className="col-md-6 col-sm-12 mb-3">
              <div className={styles.input} style={{ minWidth: "100%" }}>
                {" "}
                <label htmlFor="payoutHigherAmountLimit">
                  Per Payout Higher Amount Limit Count{" "}
                  <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="payoutHigherAmountLimit"
                  id="payoutHigherAmountLimit"
                  defaultValue={payoutHigherAmountLimit}
                  placeholder="Enter Payout Higher Amount Limit"
                  onChange={handlePayoutChange}
                />
              </div>
            </div>
            <div className=" col-md-6 col-sm-12 mb-3">
              <div className={styles.input} style={{ minWidth: "100%" }}>
                {" "}
                <label htmlFor="payoutHigerAmountCountLimit">
                  Per Payout Transaction Higher Amount Limit{" "}
                  <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="payoutHigerAmountCountLimit"
                  id="payoutHigerAmountCountLimit"
                  placeholder="Enter Payout Higher Amount Limit"
                  defaultValue={payoutHigerAmountCountLimit}
                  onChange={handlePayoutChange}
                  pattern="^\d+(\.\d{1,2})?$"
                  title="Enter a valid number amount with up to 2 decimal places"
                />
              </div>
            </div>
            <div className="d-flex justify-content-end mt-3">
              <button
                className={styles.update}
                onClick={handleUpdatePayoutData}
              >
                Update Payout Rules
              </button>
            </div>
          </div>
        </div>

        {/* Payout Acquirer Limits Table */}
        {payoutAcqLimits.length > 0 && (
          <div className="mt-5">
            <h6>Payout Acquirer Limits</h6>
            <p className={dragStyles.tableDragInfo}>
              <i className="bi bi-info-circle"></i> Drag rows to reorder
              priority. Click edit icon to update amount limits.
              {(payoutPriorityLoading || updatePayoutLimitLoading) && (
                <i className="bi bi-arrow-repeat spin ms-2"></i>
              )}
            </p>
            <div className={styles.table}>
              <table className="table table-responsive-sm">
                <thead>
                  <tr>
                    <th>Drag</th>
                    <th>Acq Name</th>
                    <th>Profile Name</th>
                    <th>Priority</th>
                    <th>Amount Limit</th>
                  </tr>
                </thead>
                <tbody>
                  {payoutAcqLimits.map((item, index) => (
                    <DraggableTableRow
                      key={item.acqMapId}
                      index={index}
                      item={item}
                      moveRow={movePayoutRow}
                      onDragEnd={handlePayoutDragEnd}
                      onUpdateLimit={handlePayoutUpdateLimit}
                      isUpdating={updatePayoutLimitLoading}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DndProvider>
  );
};

export default TransactionRules;
