/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Fragment, useEffect } from "react";
import styles from "./AddRule.module.css";
import { createPortal } from "react-dom";
import usePost from "../../../../hooks/usePost";
import { endpoints } from "../../../../services/apiEndpoints";
import { successMessage } from "../../../../utils/messges";
const Backdrop = () => {
  return <div className={styles.backdrop}></div>;
};

const Overlay = ({ userId, type, onSuccess, onClose }) => {
  const { postData, error, data } = usePost(endpoints.fraud.fraudPrevention);
  const handleSubmit = async (e) => {
    e.preventDefault();
    await postData({
      type,
      userId,
      value: e.target.value.value,
      value2: e.target.value2.value,
    });
  };
  useEffect(() => {
    if (data && !error) {
      successMessage("data added successfully");
      onSuccess();
      onClose();
    }
  }, [data, error]);
  return (
    <div className={styles.modal}>
      <div
        className="d-flex justify-content-between mb-1 position-sticky top-0 z-2 bg-white py-4"
        id={styles.title}
      >
        <h6>Add {type}</h6>
        <i className="bi bi-x" onClick={onClose}></i>
      </div>
      <div className={styles.detail}>
        <form onSubmit={handleSubmit}>
          <div className="">
            <label htmlFor="value">Card Number Start Range</label>
            <input
              type="text"
              id="value"
              name="value"
              placeholder="Enter Card Number Start"
            />
          </div>
          <div className="">
            <label htmlFor="value">Card Number End Range</label>
            <input
              type="text"
              id="value2"
              name="value2"
              placeholder="Enter Card Number End"
            />
          </div>
          <div className="d-flex mt-4">
            <button type="submit">Add</button>
          </div>
        </form>
      </div>
    </div>
  );
};
const AddCardRange = ({ userId, type, placeholder, onSuccess, onClick }) => {
  return (
    <Fragment>
      {createPortal(<Backdrop />, document.getElementById("backdrop"))}
      {createPortal(
        <Overlay
          userId={userId}
          type={type}
          onSuccess={onSuccess}
          onClose={onClick}
          placeholder={placeholder}
        />,
        document.getElementById("overlay")
      )}
    </Fragment>
  );
};

export default AddCardRange;
