import { useState, useEffect } from "react";
import usePost from "../../../hooks/usePost";
import useFetch from "../../../hooks/useFetch";
import { endpoints } from "../../../services/apiEndpoints";
import { successMessage, errorMessage } from "../../../utils/messges";
import { apiClient } from "../../../services/httpRequest";
import styles from "../../../styles/common/Add.module.css";
import { GetUserRole, GetUserId, isAdmin } from "../../../services/cookieStore";
import VirtualAddressWhitelistModal from "./VirtualAddressWhitelistModal";

const VirtualAddressWhitelistTab = () => {
  const [selectedMerchant, setSelectedMerchant] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingWhitelist, setEditingWhitelist] = useState(null);

  // Get user role and info
  const userRole = GetUserRole();
  const currentUserId = GetUserId();
  const isMerchant = userRole === "MERCHANT";

  // Fetch merchants list (only for admin/reseller) using the same API as MerchantList
  const {
    postData: fetchMerchants,
    data: merchants,
    loading: merchantsLoading,
  } = usePost(endpoints.user.userList);

  // Fetch virtual address whitelist - TODO: Update endpoint when API is ready
  const {
    postData: getWhitelistData,
    data: whitelistData,
    loading: whitelistLoading,
  } = usePost(endpoints.user.virtualAddressWhitelistList);

  // Toggle whitelist status
  const [toggleLoading, setToggleLoading] = useState(false);

  // Fetch merchants on component mount
  useEffect(() => {
    if (isMerchant) {
      // For merchants, auto-select their own account
      setSelectedMerchant(currentUserId);
    } else {
      // For admin/reseller, fetch merchants list using POST API like MerchantList
      fetchMerchants({ keyword: "", start: 0, size: 1000 });
    }
  }, [isMerchant, currentUserId]);

  // Fetch whitelist when merchant is selected
  useEffect(() => {
    if (selectedMerchant) {
      getWhitelistData({
        userId: selectedMerchant,
      });
    }
  }, [selectedMerchant]);

  const handleToggleStatus = async (whitelistId, currentStatus) => {
    const newStatus = !currentStatus;
    setToggleLoading(true);

    try {
      // TODO: Update endpoint when API is ready
      const response = await apiClient.post(
        `${endpoints.user.updateVirtualAddressWhitelistStatus}/${whitelistId}?isActive=${newStatus}`,
        {}
      );

      if (response.data && response.data.statusCode < 400) {
        successMessage("Virtual address whitelist status updated successfully");
        if (selectedMerchant) {
          getWhitelistData({
            userId: selectedMerchant,
          });
        }
      } else {
        errorMessage("Failed to update whitelist status");
      }
    } catch (error) {
      errorMessage("An error occurred while updating whitelist status");
    } finally {
      setToggleLoading(false);
    }
  };

  const handleAddWhitelist = () => {
    if (!selectedMerchant) {
      errorMessage("Please select a merchant first");
      return;
    }
    setEditingWhitelist(null);
    setShowModal(true);
  };

  const handleEditWhitelist = (whitelist) => {
    setEditingWhitelist(whitelist);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingWhitelist(null);
  };

  const handleWhitelistSaved = () => {
    setShowModal(false);
    setEditingWhitelist(null);
    if (selectedMerchant) {
      getWhitelistData({
        userId: selectedMerchant,
      });
    }
  };

  return (
    <div>
      {/* Merchant Selection - Only show for admin/reseller */}
      {!isMerchant && (
        <div className="row mb-4">
          <div className="col-md-6 col-sm-12 mb-2 position-relative">
            <label htmlFor="merchantSelect">
              Select Merchant <span className="required">*</span>
            </label>
            <select
              name="merchantSelect"
              id="merchantSelect"
              value={selectedMerchant}
              onChange={(e) => setSelectedMerchant(e.target.value)}
              disabled={merchantsLoading}
            >
              <option value="" disabled>
                --Select Merchant--
              </option>
              {merchants?.data?.content?.length > 0 ? (
                merchants.data.content.map((merchant) => (
                  <option key={merchant.userId} value={merchant.userId}>
                    {merchant.businessName || merchant.firstName} -{" "}
                    {merchant.email}
                  </option>
                ))
              ) : (
                <option>No merchants available</option>
              )}
            </select>
          </div>
        </div>
      )}

      {/* Add Whitelist Button for Admin */}
      {isAdmin() && selectedMerchant && (
        <div className="row mb-4">
          <div className="col-12">
            <button
              className="btn btn-primary"
              onClick={handleAddWhitelist}
              disabled={whitelistLoading}
              style={{
                backgroundColor: "var(--primary)",
                borderColor: "var(--primary)",
              }}
            >
              <i className="bi bi-plus"></i> Add Virtual Address Whitelist
            </button>
          </div>
        </div>
      )}

      {/* Whitelist Table */}
      {selectedMerchant && (
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                {whitelistLoading ? (
                  <div className="text-center py-4">
                    <div className="spinner-border" aria-hidden="true">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table
                      className="table table-sm table-hover"
                      style={{ fontSize: "0.875rem" }}
                    >
                      <thead className="table-light">
                        <tr>
                          <th style={{ minWidth: "140px" }}>
                            Virtual Acc. No.
                          </th>
                          <th style={{ minWidth: "120px" }}>User Name</th>
                          <th style={{ minWidth: "150px" }}>User Email</th>
                          <th style={{ minWidth: "110px" }}>Mobile</th>
                          <th style={{ minWidth: "120px" }}>Account No.</th>
                          <th style={{ minWidth: "100px" }}>IFSC</th>
                          <th style={{ minWidth: "100px" }}>Status</th>
                          <th style={{ minWidth: "80px" }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {whitelistData?.data &&
                        whitelistData.data.length > 0 ? (
                          whitelistData.data.map((whitelist) => (
                            <tr key={whitelist.id}>
                              <td>
                                <small>{whitelist.virtualAccountNo}</small>
                              </td>
                              <td>
                                <small>{whitelist.userName}</small>
                              </td>
                              <td>
                                <small>{whitelist.userEmail}</small>
                              </td>
                              <td>
                                <small>{whitelist.userMobile}</small>
                              </td>
                              <td>
                                <small>{whitelist.accountNumber}</small>
                              </td>
                              <td>
                                <small>{whitelist.ifscCode}</small>
                              </td>
                              <td>
                                <div
                                  className="form-check form-switch"
                                  style={{ paddingLeft: "2.5em" }}
                                >
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={whitelist.active}
                                    onChange={() =>
                                      handleToggleStatus(
                                        whitelist.id,
                                        whitelist.active
                                      )
                                    }
                                    disabled={toggleLoading}
                                    style={{ cursor: "pointer" }}
                                  />
                                </div>
                              </td>
                              <td>
                                <button
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() => handleEditWhitelist(whitelist)}
                                  title="Edit Whitelist"
                                  style={{ padding: "0.25rem 0.5rem" }}
                                >
                                  <i className="bi bi-pencil"></i>
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={8} className="text-center text-muted">
                              <small>No virtual address whitelisted</small>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Whitelist Modal */}
      {showModal && (
        <VirtualAddressWhitelistModal
          show={showModal}
          onHide={handleModalClose}
          onSaved={handleWhitelistSaved}
          editingWhitelist={editingWhitelist}
          selectedMerchant={selectedMerchant}
        />
      )}
    </div>
  );
};

export default VirtualAddressWhitelistTab;
