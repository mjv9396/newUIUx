/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import styles from "../../../styles/merchant/Merchant.module.css";
import usePost from "../../../hooks/usePost";
import { endpoints } from "../../../services/apiEndpoints";
import { useNavigate } from "react-router-dom";
import { successMessage } from "../../../utils/messges";

const CompanyDetails = ({
  userId,
  industryCategory,
  industrySubCategory,
  organisationType,
  gstNumber,
  cin,
  tan,
  companyPan,
  companyprof,
  website,
  businessName,
  ...rest
}) => {
  const navigate = useNavigate();
  // Form handlers
  const [formData, setFormData] = useState({
    userId,
    industryCategory,
    industrySubCategory,
    organisationType,
    gstNumber,
    cin,
    tan,
    companyPan,
    companyprof,
    website,
    businessName,
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const { postData, data, error } = usePost(endpoints.user.updateUser);

  const handleUpdateData = async () => {
    postData(formData);
  };
  useEffect(() => {
    if (data && !error) {
      const updatedState = { ...rest, ...formData };
      successMessage("details updated successfully");
      navigate("/update-merchant", { state: updatedState });
    }
  }, [error, data]);
  return (
    <div>
      <h6>Company Details</h6>
      <div className="d-flex flex-wrap gap-3">
        <div className={styles.input}>
          <label htmlFor="industryCategory">Industry Category</label>
          <input
            type="text"
            name="industryCategory"
            id="industryCategory"
            value={industryCategory}
            disabled
            readOnly
          />
        </div>
        <div className={styles.input}>
          <label htmlFor="industrySubCategory">Industry Sub Category</label>
          <input
            type="text"
            name="industrySubCategory"
            id="industrySubCategory"
            value={industrySubCategory}
            disabled
            readOnly
          />
        </div>
        <div className={styles.input}>
          <label htmlFor="organisationType">Organisation Type</label>
          <input
            type="text"
            name="organisationType"
            id="organisationType"
            value={organisationType}
            disabled
            readOnly
          />
        </div>
        <div className={styles.input}>
          <label htmlFor="gstNumber">GST Number</label>
          <input
            type="text"
            name="gstNumber"
            id="gstNumber"
            placeholder="Enter GST Number"
            autoComplete="on"
            maxLength={256}
            defaultValue={gstNumber}
            onChange={handleChange}
          />
        </div>
        <div className={styles.input}>
          <label htmlFor="cin">CIN Number</label>
          <input
            type="text"
            name="cin"
            id="cin"
            placeholder="Enter CIN Number"
            autoComplete="on"
            maxLength={256}
            defaultValue={cin}
            onChange={handleChange}
          />
        </div>
        <div className={styles.input}>
          <label htmlFor="tan">TAN Number</label>
          <input
            type="text"
            name="tan"
            id="tan"
            placeholder="Enter TAN Number"
            autoComplete="on"
            maxLength={256}
            defaultValue={tan}
            onChange={handleChange}
          />
        </div>
        <div className={styles.input}>
          <label htmlFor="companyPan">Company PAN</label>
          <input
            type="text"
            name="companyPan"
            id="companyPan"
            placeholder="Enter Company PAN"
            autoComplete="on"
            maxLength={256}
            defaultValue={companyPan}
            onChange={handleChange}
          />
        </div>
        <div className={styles.input}>
          <label htmlFor="companyprof">Company Prof</label>
          <input
            type="text"
            name="companyprof"
            id="companyprof"
            placeholder="Enter Company Prof"
            autoComplete="on"
            maxLength={256}
            defaultValue={companyprof}
            onChange={handleChange}
          />
        </div>
        <div className={styles.input}>
          <label htmlFor="website">Website</label>
          <input
            type="text"
            name="website"
            id="website"
            placeholder="Enter Website"
            autoComplete="on"
            maxLength={256}
            defaultValue={website}
            onChange={handleChange}
          />
        </div>
        <div className={styles.input}>
          <label htmlFor="businessName">Business Name</label>
          <input
            type="text"
            name="businessName"
            id="businessName"
            placeholder="Enter Business Name"
            autoComplete="on"
            maxLength={256}
            defaultValue={businessName}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="d-flex justify-content-end mt-3">
        <button className={styles.update} onClick={handleUpdateData}>
          Update
        </button>
      </div>
    </div>
  );
};

export default CompanyDetails;
