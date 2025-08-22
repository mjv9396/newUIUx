/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import { endpoints } from "../../../services/apiEndpoints";
import usePost from "../../../hooks/usePost";
import { useEffect, useState } from "react";

import { successMessage } from "../../../utils/messges";

const VerificationStatus = ({
  userId,
  emailVerificationState,
  phoneVerificationState,
  ...rest
}) => {
  const navigate = useNavigate();
  const { postData, data, error } = usePost(endpoints.user.updateUser);

  const [formData, setFormData] = useState({
    userId,
    emailVerificationState,
    phoneVerificationState,
  });
  const updateEmailStatus = async (e) => {
    const { name, value, checked } = e.target;
    setFormData({ ...formData, [name]: value });
    postData({
      userId: userId,
      emailVerificationState: checked ? "VERIFIED" : "UNVERIFIED",
    });
  };

  const updatePhoneStatus = async (e) => {
    const { checked } = e.target;
    postData({
      userId: userId,
      phoneVerificationState: checked ? "VERIFIED" : "UNVERIFIED",
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
      <h6>VerificationStatus</h6>

      <span className="d-flex  gap-3 mt-4">
        <span className="d-flex justify-content-center gap-3">
          <div> Email verification state</div>
          <div className="form-check form-switch">
            <input
              style={{ width: "40px" }}
              className="form-check-input"
              type="checkbox"
              id="flexSwitchCheckDefault"
              defaultChecked={emailVerificationState === "VERIFIED" ? true : false}
              onChange={updateEmailStatus}
              name="emailVerificationState"
            />
          </div>
        </span>
        <span className="d-flex justify-content-center gap-3">
          Phone verification state
          <div className="form-check form-switch">
            <input
              style={{ width: "40px" }}
              className="form-check-input"
              type="checkbox"
              id="flexSwitchCheckDefault"
              defaultChecked={phoneVerificationState === "VERIFIED" ? true : false}
              onChange={updatePhoneStatus}
              name="phoneVerificationState"
            />
          </div>
        </span>
      </span>
    </>
  );
};

export default VerificationStatus;
