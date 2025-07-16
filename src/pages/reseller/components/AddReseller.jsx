import { useEffect, useState } from "react";
import styles from "../../../styles/common/Add.module.css";
import { addResellerForm } from "../../../forms/auth";
import usePost from "../../../hooks/usePost";
import { endpoints } from "../../../services/apiEndpoints";

import { validateAddResellerForm } from "../../../formValidations/resellerForm";
import { staticData } from "../../login/components/IndustryTypeData";
import { successMessage } from "../../../utils/messges";

const AddReseller = () => {
  //form handlers
  const [formData, setFormData] = useState(addResellerForm);
  const [errors, setErrors] = useState({});
  const [industrySubCategory, setIndustrySubCategory] = useState([]);

  const handleChange = (e) => {
    const { name, value, selectedIndex } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === "industryCategory")
      setIndustrySubCategory(staticData[selectedIndex - 1].sub);
  };

  // API handlers
  const { postData, data, error, loading } = usePost(endpoints.user.reseller);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateAddResellerForm(formData);
    if (Object.keys(validationError).length > 0) {
      setErrors(validationError);
      return;
    }
    await postData(formData);
  };
  useEffect(() => {
    if (data && !error) {
      successMessage("Reseller added successfully");
      setFormData(addResellerForm);
      setIndustrySubCategory([]);
      setErrors({});
    }
  }, [error, data]);
  return (
    <div className={styles.listing}>
      <div className={styles.form}>
        <h6>Add New Reseller</h6>
        <form onSubmit={handleSubmit}>
          <div className="d-flex flex-wrap gap-3 align-items-center mt-3">
            <div className={styles.input}>
              <label htmlFor="firstName">
                First Name <span className="required">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter first name"
                autoComplete="off"
                name="firstName"
                id="firstName"
                onChange={handleChange}
                value={formData.firstName}
              />
              {errors.firstName && (
                <span className="errors">{errors.firstName}</span>
              )}
            </div>
            <div className={styles.input}>
              <label htmlFor="lastName">
                Last Name <span className="required">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter last name"
                autoComplete="off"
                name="lastName"
                id="lastName"
                onChange={handleChange}
                value={formData.lastName}
              />
              {errors.lastName && (
                <span className="errors">{errors.lastName}</span>
              )}
            </div>
            <div className={styles.input}>
              <label htmlFor="email">
                Email <span className="required">*</span>
              </label>
              <input
                type="email"
                placeholder="Enter email address"
                autoComplete="off"
                name="email"
                id="email"
                onChange={handleChange}
                value={formData.email}
              />
              {errors.email && <span className="errors">{errors.email}</span>}
            </div>
            <div className={styles.input}>
              <label htmlFor="phoneNumber">
                Phone Number <span className="required">*</span>
              </label>
              <input
                type="number"
                placeholder="Enter contact number"
                autoComplete="off"
                name="phoneNumber"
                id="phoneNumber"
                onChange={handleChange}
                value={formData.phoneNumber}
              />
              {errors.phoneNumber && (
                <span className="errors">{errors.phoneNumber}</span>
              )}
            </div>
            <div className={styles.input}>
              <label htmlFor="organisationType">
                Organisation Type <span className="required">*</span>
              </label>
              <select
                name="organisationType"
                id="organisationType"
                onChange={handleChange}
                defaultValue=""
              >
                <option value="" disabled>
                  --Select Organisation type--
                </option>
                <option value="Individual/Freelance">
                  Individual/Freelance
                </option>
                <option value="Sole Proprietership">Sole Proprietership</option>
                <option value="Partnership">Partnership</option>
                <option value="Public/Private Limited Company">
                  Public/Private Limited Company
                </option>
                <option value="Trust/NGO/Societies">Trust/NGO/Societies</option>
                <option value="LLP">LLP</option>
              </select>
              {errors.organisationType && (
                <span className="errors">{errors.organisationType}</span>
              )}
            </div>
            <div className={styles.input}>
              <label htmlFor="businessName">
                Business Name <span className="required">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter business name"
                autoComplete="off"
                name="businessName"
                id="businessName"
                onChange={handleChange}
                value={formData.businessName}
              />
              {errors.businessName && (
                <span className="errors">{errors.businessName}</span>
              )}
            </div>
            <div className={styles.input}>
              <label htmlFor="industryCategory">
                Industry Category <span className="required">*</span>
              </label>
              <select
                name="industryCategory"
                id="industryCategory"
                defaultValue=""
                onChange={handleChange}
              >
                <option value="" disabled>
                  --Select industry category--
                </option>
                {staticData.map((item) => (
                  <option value={item.name} key={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
              {errors.industryCategory && (
                <span className="errors">{errors.industryCategory}</span>
              )}
            </div>
            <div className={styles.input}>
              <label htmlFor="industrySubCategory">
                Industry Sub-category <span className="required">*</span>
              </label>
              <select
                name="industrySubCategory"
                id="industrySubCategory"
                defaultValue=""
                onChange={handleChange}
              >
                <option value="" disabled>
                  --Select industry sub category--
                </option>
                {industrySubCategory.map((item) => (
                  <option value={item} key={item}>
                    {item}
                  </option>
                ))}
              </select>
              {errors.industrySubCategory && (
                <span className="errors">{errors.industrySubCategory}</span>
              )}
            </div>
            <div className={styles.input}>
              <label htmlFor="password">
                Password <span className="required">*</span>
              </label>
              <input
                type="password"
                placeholder="Enter password"
                autoComplete="off"
                name="password"
                id="password"
                onChange={handleChange}
                value={formData.password}
              />
              {errors.password && (
                <span className="errors">{errors.password}</span>
              )}
            </div>
          </div>
          <div className="d-flex gap-3 mt-2 mb-2 justify-content-end">
            <button
              className={
                !loading ? styles.submit + " " + styles.active : styles.submit
              }
              type="submit"
            >
              Add
            </button>
            <button
              className={styles.clear}
              type="reset"
              onClick={() => setFormData(addResellerForm)}
            >
              clear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddReseller;
