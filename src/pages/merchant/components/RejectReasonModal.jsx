import { Fragment, useState } from "react";
import { createPortal } from "react-dom";
import styles from "../../../styles/common/Modal.module.css";

const Backdrop = () => <div className={styles.backdrop}></div>;

const Overlay = ({ onSubmit, onClose, loading }) => {
  const [reason, setReason] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(reason);
  };
  return (
    <div className={styles.modal}>
      <div className="d-flex justify-content-between mb-1 position-sticky top-0 z-2 bg-white py-4" id={styles.title}>
        <h6>Reject Document</h6>
        <i className="bi bi-x" onClick={onClose}></i>
      </div>
      <div className={styles.detail}>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="reason">Reason</label>
            <textarea
              id="reason"
              name="reason"
              className="form-control"
              value={reason}
              onChange={e => setReason(e.target.value)}
              required
              rows={3}
            />
          </div>
          <button type="submit" className="btn btn-danger" disabled={loading}>
            {loading ? "Rejecting..." : "Reject"}
          </button>
        </form>
      </div>
    </div>
  );
};

const RejectReasonModal = ({ onSubmit, onClose, loading }) => (
  <Fragment>
    {createPortal(<Backdrop />, document.getElementById("backdrop"))}
    {createPortal(
      <Overlay onSubmit={onSubmit} onClose={onClose} loading={loading} />, document.getElementById("overlay")
    )}
  </Fragment>
);

export default RejectReasonModal;

