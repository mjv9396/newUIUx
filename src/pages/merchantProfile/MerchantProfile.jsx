import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import useFetch from "../../hooks/useFetch";
import { endpoints } from "../../services/apiEndpoints";
import { GetUserId } from "../../services/cookieStore";
import styles from "../../styles/merchantProfile/MerchantProfile.module.css";

const MerchantProfile = () => {
  const { fetchData, data, loading, error } = useFetch();

  // KYC Documents
  const {
    fetchData: fetchKycDocuments,
    data: kycDocuments,
    loading: kycLoading,
    error: kycError,
  } = useFetch();
  const [viewDocument, setViewDocument] = useState(false);
  const [documentUrl, setDocumentUrl] = useState("");

  useEffect(() => {
    fetchData(endpoints.user.fullProfile);

    // Fetch KYC documents for the current merchant
    const userId = GetUserId();
    if (userId) {
      fetchKycDocuments(endpoints.kyc.getAllDocument + userId);
    }
  }, []);

  const handleViewDocument = (documentUrl) => {
    setDocumentUrl(documentUrl);
    setViewDocument(true);
  };

  if (loading) {
    return (
      <DashboardLayout page="Merchant Profile" url="/merchant-profile">
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "400px" }}
        >
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2 text-muted">Loading profile...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout page="Merchant Profile" url="/merchant-profile">
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle me-2"></i>
          Error loading profile: {error.message || "Something went wrong"}
        </div>
      </DashboardLayout>
    );
  }

  const profileData = data?.data;

  // Safely get KYC documents array
  const documentsArray =
    kycDocuments?.data && Array.isArray(kycDocuments.data)
      ? kycDocuments.data
      : [];

  // Debug: Log the actual structure (remove this after debugging)
  if (kycDocuments && !kycLoading) {
    console.log("KYC Documents API Response:", kycDocuments);
    console.log("KYC Documents Data Type:", typeof kycDocuments.data);
    console.log("Is KYC Data Array:", Array.isArray(kycDocuments.data));
  }

  if (!profileData) {
    return (
      <DashboardLayout page="Merchant Profile" url="/merchant-profile">
        <div className="alert alert-warning" role="alert">
          <i className="bi bi-info-circle me-2"></i>
          No profile data available
        </div>
      </DashboardLayout>
    );
  }

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return "N/A";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const formatDate = (dateArray) => {
    if (!dateArray || !Array.isArray(dateArray)) return "N/A";
    try {
      const date = new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);
      return date.toLocaleDateString("en-IN");
    } catch {
      return "N/A";
    }
  };

  const formatDateTime = (dateArray) => {
    if (!dateArray || !Array.isArray(dateArray)) return "N/A";
    try {
      const date = new Date(
        dateArray[0],
        dateArray[1] - 1,
        dateArray[2],
        dateArray[3],
        dateArray[4],
        dateArray[5]
      );
      return date.toLocaleString("en-IN");
    } catch {
      return "N/A";
    }
  };

  return (
    <DashboardLayout page="Merchant Profile" url="/merchant-profile">
      <div className={styles.profileContainer}>
        {/* Header Section */}
        <div className={styles.profileHeader}>
          <div className={styles.profileAvatar}>
            <i className="bi bi-person-circle"></i>
          </div>
          <div className={styles.profileInfo}>
            <h2>
              {profileData.firstName} {profileData.lastName}
            </h2>
            <p className="text-muted">{profileData.businessName}</p>
            <div className="d-flex gap-2 flex-wrap">
              <span
                className={`badge ${
                  profileData.userAccountState === "ACTIVE"
                    ? "bg-success"
                    : "bg-warning"
                } text-white`}
              >
                {profileData.userAccountState}
              </span>

              {/* Cert-In Compliance Badge */}
              <span
                className={`badge ${
                  profileData.certInCompliant === true
                    ? "bg-info"
                    : "bg-secondary"
                } text-white`}
                title={
                  profileData.certInCompliant === true
                    ? "This merchant is Cert-In compliant"
                    : "This merchant is not Cert-In compliant"
                }
              >
                <i className="bi bi-shield-check me-1"></i>
                {profileData.certInCompliant === true
                  ? "Cert-In Compliant"
                  : "Not Cert-In Compliant"}
              </span>
            </div>
          </div>
          <div className={styles.profileStats}>
            <div className={styles.statItem}>
              <h4>{formatCurrency(profileData.accountBalance)}</h4>
              <p>Account Balance</p>
            </div>
            <div className={styles.statItem}>
              <h4>{profileData.appId}</h4>
              <p>App ID</p>
            </div>
          </div>
        </div>

        <div className="row g-4 mt-4">
          {/* General Information */}
          <div className="col-lg-6">
            <div className={styles.profileCard}>
              <div className={styles.cardHeader}>
                <h5>
                  <i className="bi bi-person me-2"></i>General Information
                </h5>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.infoRow}>
                  <span>User ID:</span>
                  <span>{profileData.userId}</span>
                </div>
                <div className={styles.infoRow}>
                  <span>Email:</span>
                  <span>{profileData.email}</span>
                </div>
                <div className={styles.infoRow}>
                  <span>Phone:</span>
                  <span>{profileData.phoneNumber}</span>
                </div>
                <div className={styles.infoRow}>
                  <span>Username:</span>
                  <span>{profileData.username}</span>
                </div>
                <div className={styles.infoRow}>
                  <span>Role:</span>
                  <span className="text-primary fw-semibold">
                    {profileData.role}
                  </span>
                </div>
                <div className={styles.infoRow}>
                  <span>Address:</span>
                  <span>{profileData.address || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Business Information */}
          <div className="col-lg-6">
            <div className={styles.profileCard}>
              <div className={styles.cardHeader}>
                <h5>
                  <i className="bi bi-building me-2"></i>Business Information
                </h5>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.infoRow}>
                  <span>Business Name:</span>
                  <span>{profileData.businessName || "N/A"}</span>
                </div>
                <div className={styles.infoRow}>
                  <span>Organization Type:</span>
                  <span>{profileData.organisationType || "N/A"}</span>
                </div>
                <div className={styles.infoRow}>
                  <span>Business Description:</span>
                  <span>{profileData.businessDescription || "N/A"}</span>
                </div>
                <div className={styles.infoRow}>
                  <span>Website:</span>
                  <span>{profileData.website || "N/A"}</span>
                </div>
                <div className={styles.infoRow}>
                  <span>Business Model:</span>
                  <span>{profileData.businessModel || "N/A"}</span>
                </div>
                <div className={styles.infoRow}>
                  <span>Industry Category:</span>
                  <span>{profileData.industryCategory || "N/A"}</span>
                </div>
                <div className={styles.infoRow}>
                  <span>Industry Sub-Category:</span>
                  <span>{profileData.industrySubCategory || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Operation Address */}
          <div className="col-lg-6">
            <div className={styles.profileCard}>
              <div className={styles.cardHeader}>
                <h5>
                  <i className="bi bi-geo-alt me-2"></i>Operation Address
                </h5>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.infoRow}>
                  <span>Address:</span>
                  <span>{profileData.operationAddress || "N/A"}</span>
                </div>
                <div className={styles.infoRow}>
                  <span>City:</span>
                  <span>{profileData.operationCity || "N/A"}</span>
                </div>
                <div className={styles.infoRow}>
                  <span>State:</span>
                  <span>{profileData.operationState || "N/A"}</span>
                </div>
                <div className={styles.infoRow}>
                  <span>Postal Code:</span>
                  <span>{profileData.operationPostalCode || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bank Details */}
          <div className="col-lg-6">
            <div className={styles.profileCard}>
              <div className={styles.cardHeader}>
                <h5>
                  <i className="bi bi-bank me-2"></i>Bank Details
                </h5>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.infoRow}>
                  <span>Bank Name:</span>
                  <span>{profileData.bankName || "N/A"}</span>
                </div>
                <div className={styles.infoRow}>
                  <span>Branch Name:</span>
                  <span>{profileData.branchName || "N/A"}</span>
                </div>
                <div className={styles.infoRow}>
                  <span>Account Number:</span>
                  <span>{profileData.accountNo || "N/A"}</span>
                </div>
                <div className={styles.infoRow}>
                  <span>IFSC Code:</span>
                  <span>{profileData.ifscCode || "N/A"}</span>
                </div>
                <div className={styles.infoRow}>
                  <span>Account Holder Name:</span>
                  <span>{profileData.accHolderName || "N/A"}</span>
                </div>
                <div className={styles.infoRow}>
                  <span>Currency:</span>
                  <span>{profileData.currency || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Company Registration */}
          <div className="col-lg-6">
            <div className={styles.profileCard}>
              <div className={styles.cardHeader}>
                <h5>
                  <i className="bi bi-file-earmark-text me-2"></i>Company
                  Registration
                </h5>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.infoRow}>
                  <span>GST Number:</span>
                  <span>{profileData.gstNumber || "N/A"}</span>
                </div>
                <div className={styles.infoRow}>
                  <span>CIN:</span>
                  <span>{profileData.cin || "N/A"}</span>
                </div>
                <div className={styles.infoRow}>
                  <span>TAN:</span>
                  <span>{profileData.tan || "N/A"}</span>
                </div>
                <div className={styles.infoRow}>
                  <span>PAN Card:</span>
                  <span>{profileData.panCard || "N/A"}</span>
                </div>
                <div className={styles.infoRow}>
                  <span>Company PAN:</span>
                  <span>{profileData.companyPan || "N/A"}</span>
                </div>
                <div className={styles.infoRow}>
                  <span>Incorporation Date:</span>
                  <span>{formatDate(profileData.incorporationDate)}</span>
                </div>
                <div className={styles.infoRow}>
                  <span>Registration Number:</span>
                  <span>{profileData.registrationNo || "N/A"}</span>
                </div>
                <div className={styles.infoRow}>
                  <span>Registration Date:</span>
                  <span>{formatDate(profileData.registrationDate)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction Limits */}
          <div className="col-lg-6">
            <div className={styles.profileCard}>
              <div className={styles.cardHeader}>
                <h5>
                  <i className="bi bi-cash-stack me-2"></i>Transaction Limits
                </h5>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.infoRow}>
                  <span>Payout Transaction Limit:</span>
                  <span>{formatCurrency(profileData.payoutTxnLimit)}</span>
                </div>
                <div className={styles.infoRow}>
                  <span>Payout Beneficiary Limit:</span>
                  <span>
                    {formatCurrency(profileData.payoutBenificaryLimit)}
                  </span>
                </div>
                <div className={styles.infoRow}>
                  <span>Higher Amount Limit:</span>
                  <span>
                    {formatCurrency(profileData.payoutHigherAmountLimit)}
                  </span>
                </div>
                <div className={styles.infoRow}>
                  <span>Higher Amount Count Limit:</span>
                  <span>{profileData.payoutHigerAmountCountLimit}</span>
                </div>
              </div>
            </div>
          </div>

          {/* API Configuration */}
          <div className="col-lg-6">
            <div className={styles.profileCard}>
              <div className={styles.cardHeader}>
                <h5>
                  <i className="bi bi-key me-2"></i>API Configuration
                </h5>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.infoRow}>
                  <span>App ID:</span>
                  <span className="font-monospace">{profileData.appId}</span>
                </div>
                <div className={styles.infoRow}>
                  <span>Secret Key:</span>
                  <span className="font-monospace">
                    {profileData.secretkey}
                  </span>
                </div>
                <div className={styles.infoRow}>
                  <span>Merchant Hosted:</span>
                  <span
                    className={`text-${
                      profileData.merchantHostedFlag ? "success" : "secondary"
                    } fw-semibold`}
                  >
                    ● {profileData.merchantHostedFlag ? "Yes" : "No"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Reserve & Risk */}
          <div className="col-lg-6">
            <div className={styles.profileCard}>
              <div className={styles.cardHeader}>
                <h5>
                  <i className="bi bi-shield-check me-2"></i>Reserve & Risk
                  Management
                </h5>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.infoRow}>
                  <span>RR Days:</span>
                  <span>{profileData.rrDays} days</span>
                </div>
                <div className={styles.infoRow}>
                  <span>RR Value:</span>
                  <span>{formatCurrency(profileData.rrValue)}</span>
                </div>
                <div className={styles.infoRow}>
                  <span>RR Active:</span>
                  <span
                    className={`text-${
                      profileData.rractive ? "success" : "secondary"
                    } fw-semibold`}
                  >
                    ● {profileData.rractive ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className={styles.infoRow}>
                  <span>Fixed:</span>
                  <span
                    className={`text-${
                      profileData.fix ? "info" : "secondary"
                    } fw-semibold`}
                  >
                    ● {profileData.fix ? "Yes" : "No"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Partnership Details (if applicable) */}
          {(profileData.totalPartners ||
            profileData.managingPartner ||
            profileData.partnershipDeedDate) && (
            <div className="col-lg-6">
              <div className={styles.profileCard}>
                <div className={styles.cardHeader}>
                  <h5>
                    <i className="bi bi-people me-2"></i>Partnership Details
                  </h5>
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.infoRow}>
                    <span>Total Partners:</span>
                    <span>{profileData.totalPartners || "N/A"}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span>Managing Partner:</span>
                    <span>{profileData.managingPartner || "N/A"}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span>Partnership Deed Date:</span>
                    <span>{formatDate(profileData.partnershipDeedDate)}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span>Commencement Date:</span>
                    <span>{formatDate(profileData.commencementDate)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Additional Information */}
          <div className="col-lg-6">
            <div className={styles.profileCard}>
              <div className={styles.cardHeader}>
                <h5>
                  <i className="bi bi-info-circle me-2"></i>Additional
                  Information
                </h5>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.infoRow}>
                  <span>LLPIN:</span>
                  <span>{profileData.llpin || "N/A"}</span>
                </div>
                <div className={styles.infoRow}>
                  <span>FCRA Registration:</span>
                  <span>{profileData.fcraRegNo || "N/A"}</span>
                </div>
                <div className={styles.infoRow}>
                  <span>Last OTP Generated:</span>
                  <span>{formatDateTime(profileData.otpGeneratedTime)}</span>
                </div>
                <div className={styles.infoRow}>
                  <span>Email Verification:</span>
                  <span
                    className={`text-${
                      profileData.emailVerificationState === "VERIFIED"
                        ? "success"
                        : "warning"
                    } fw-semibold`}
                  >
                    ● {profileData.emailVerificationState || "N/A"}
                  </span>
                </div>
                <div className={styles.infoRow}>
                  <span>Phone Verification:</span>
                  <span
                    className={`text-${
                      profileData.phoneVerificationState === "VERIFIED"
                        ? "success"
                        : "warning"
                    } fw-semibold`}
                  >
                    ● {profileData.phoneVerificationState || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* KYC Documents */}
          <div className="col-12">
            <div className={styles.profileCard}>
              <div className={styles.cardHeader}>
                <h5>
                  <i className="bi bi-file-earmark-check me-2"></i>KYC Documents
                </h5>
              </div>
              <div className={styles.cardBody}>
                {kycLoading ? (
                  <div className="text-center py-3">
                    <div
                      className="spinner-border spinner-border-sm text-primary"
                      role="status"
                    >
                      <span className="visually-hidden">
                        Loading documents...
                      </span>
                    </div>
                    <p className="mt-2 text-muted small">
                      Loading KYC documents...
                    </p>
                  </div>
                ) : kycError ? (
                  <div className="alert alert-warning" role="alert">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    Error loading KYC documents:{" "}
                    {kycError.message || "Something went wrong"}
                  </div>
                ) : documentsArray.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-sm">
                      <thead>
                        <tr>
                          <th>Sr. No.</th>
                          <th>Document Type</th>
                          <th>Document Number</th>
                          <th>Document Name</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {documentsArray.map((doc, index) => (
                          <tr key={doc.documentId}>
                            <td>{index + 1}</td>
                            <td>{doc.documentType}</td>
                            <td>{doc.documentNumber || "N/A"}</td>
                            <td>{doc.documentName}</td>
                            <td>
                              {doc.verified ? (
                                <span className="badge bg-success">
                                  Verified
                                </span>
                              ) : doc.rejectedReasion ? (
                                <span className="badge bg-danger">
                                  Rejected
                                </span>
                              ) : (
                                <span className="badge bg-warning">
                                  Pending
                                </span>
                              )}
                              {doc.rejectedReasion && (
                                <div className="text-danger small mt-1">
                                  <i className="bi bi-exclamation-circle me-1"></i>
                                  {doc.rejectedReasion}
                                </div>
                              )}
                            </td>
                            <td>
                              <button
                                className="btn btn-outline-primary btn-sm"
                                onClick={() =>
                                  handleViewDocument(doc.documentUrl)
                                }
                                title="View Document"
                                disabled={!doc.documentUrl}
                              >
                                <i className="bi bi-eye"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <i className="bi bi-file-earmark-x fa-2x text-muted mb-3"></i>
                    <p className="text-muted">No KYC documents found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Document Viewer Modal */}
        {viewDocument && (
          <div
            className="modal fade show"
            style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    <i className="bi bi-file-earmark-text me-2"></i>
                    Document Viewer
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setViewDocument(false)}
                  ></button>
                </div>
                <div className="modal-body text-center">
                  {documentUrl ? (
                    <img
                      src={documentUrl}
                      alt="Document"
                      className="img-fluid"
                      style={{ maxHeight: "70vh", width: "auto" }}
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "block";
                      }}
                    />
                  ) : (
                    <div className="alert alert-warning">
                      <i className="bi bi-exclamation-triangle me-2"></i>
                      Document not available
                    </div>
                  )}
                  <div
                    style={{ display: "none" }}
                    className="alert alert-danger"
                  >
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    Failed to load document image
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setViewDocument(false)}
                  >
                    Close
                  </button>
                  {documentUrl && (
                    <a
                      href={documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                    >
                      <i className="bi bi-download me-2"></i>
                      View Original
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MerchantProfile;
