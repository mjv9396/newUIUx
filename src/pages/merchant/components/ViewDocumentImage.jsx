import { Fragment, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import useFetch from "../../../hooks/useFetch";
import usePost from "../../../hooks/usePost";
import { endpoints } from "../../../services/apiEndpoints";
import styles from "../../../styles/common/Modal.module.css";
import RejectReasonModal from "./RejectReasonModal";

const Backdrop = () => {
    return <div className={styles.backdrop}></div>;
};
const Overlay = ({docUrl, docId, userId, onClose, isVerified, rejectReason }) => {

    const { postData: acceptDoc, loading: acceptLoading } = usePost(
        endpoints.kyc.verifyDocument
    );
    const { postData: rejectDoc, loading: rejectLoading } = usePost(
        endpoints.kyc.rejectDocument
    );
    const [showRejectModal, setShowRejectModal] = useState(false);



    const handleAccept = async () => {
        console.log("Accepting document", userId, docId);
        await acceptDoc({ userId: String(userId), documentId: String(docId) });
        onClose();
    };

    const handleOpenRejectReason = () => {
        setShowRejectModal(true);
    };

    const handleReject = async (reason) => {
        await rejectDoc({
            userId: String(userId),
            documentId: String(docId),
            reason,
        });
        setShowRejectModal(false);
        onClose();
    };

    return (
        <div className={styles.modal}>
            <div
                className="d-flex justify-content-between mb-1 position-sticky top-0 z-2 bg-white py-4"
                id={styles.title}
            >
                <h6>Document</h6>
                <span className="d-flex align-items-center gap-2">
                  {/* Action buttons or status based on verification/rejection */}
                  {isVerified ? (
                    <span className="badge bg-success">Verified</span>
                  ) : rejectReason ? (
                    <>
                      <span className="badge bg-danger">Rejected</span>
                      <span className="ms-2 text-danger">{rejectReason}</span>
                    </>
                  ) : (
                    <>
                      <button
                        className="btn btn-success btn-sm"
                        onClick={handleAccept}
                        disabled={acceptLoading}
                      >
                        Accept
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={handleOpenRejectReason}
                      >
                        Reject
                      </button>
                    </>
                  )}
                  <div className="">&nbsp;</div>
                  <i className="bi bi-x" id={styles.cross} onClick={onClose}></i>
                </span>
            </div>
            <div className={styles.detail}>
                {docUrl && (
                    <img
                        src={docUrl}
                        width="60vw"
                        height="80vh"
                        loading="lazy"
                        style={{
                            overflow: "hidden",
                            width: "100%",
                            height: "100%",
                            zoom: ".7",
                        }}
                    ></img>
                )}
            </div>
            {showRejectModal && (
                <RejectReasonModal
                    onSubmit={handleReject}
                    onClose={() => setShowRejectModal(false)}
                    loading={rejectLoading}
                />
            )}
        </div>
    );
};
const ViewDocumentImage = ({docUrl, docId, userId, onClose,  isVerified, rejectReason }) => {
    return (
        <Fragment>
            {createPortal(<Backdrop />, document.getElementById("backdrop"))}
            {createPortal(
                <Overlay docUrl={docUrl} docId={docId} userId={userId} onClose={onClose} isVerified={isVerified} rejectReason={rejectReason} />,
                document.getElementById("overlay")
            )}
        </Fragment>
    );
};

export default ViewDocumentImage;
