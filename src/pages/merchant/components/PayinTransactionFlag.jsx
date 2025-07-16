/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import usePost from "../../../hooks/usePost";
import { endpoints } from "../../../services/apiEndpoints";
import { useEffect, useState } from "react";
import { successMessage } from "../../../utils/messges";

const PayinTransactionFlag = ({ userId, merchantHostedFlag, ...rest }) => {
  const navigate = useNavigate();
  const { postData, data, error } = usePost(endpoints.user.updateUser);

  const [formData, setFormData] = useState({
    userId,
    merchantHostedFlag,
  });
  const updateFlagStatus = async (e) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked });

    await postData({
      userId: userId,
      merchantHostedFlag: checked,
    });
  };
  useEffect(() => {
    if (data && !error) {
      const updatedState = { ...rest, ...formData };
      successMessage("details updated successfully");
      navigate("/update-merchant", { state: updatedState });
    }
  }, [error, data]);
  return (
    <>
      <h6>Payin Transaction Flag</h6>
      <span className="d-flex  gap-3 mt-4">
        <span className="d-flex justify-content-center gap-3">
          <div>Merchant Hosted Flag</div>
          <div className="form-check form-switch">
            <input
              style={{ width: "40px" }}
              className="form-check-input"
              type="checkbox"
              id="flexSwitchCheckDefault"
              defaultChecked={merchantHostedFlag}
              onChange={updateFlagStatus}
              name="merchantHostedFlag"
            />
          </div>
        </span>
      </span>
    </>
  );
};

export default PayinTransactionFlag;
