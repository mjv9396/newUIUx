import { useState, useEffect } from "react";
import usePost from "../../../hooks/usePost";
import useFetch from "../../../hooks/useFetch";
import useDeleteWithBody from "../../../hooks/useDeleteWithbody";
import { endpoints } from "../../../services/apiEndpoints";
import { successMessage, errorMessage } from "../../../utils/messges";
import styles from "../../../styles/common/Add.module.css";
import { GetUserRole, GetUserId, isAdmin } from "../../../services/cookieStore";
import { validateIPAddress } from "../../../utils/validations";

const IPWhitelistTab = () => {
  const [selectedMerchant, setSelectedMerchant] = useState("");
  const [ipAddress, setIpAddress] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [ipError, setIpError] = useState("");

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

  // Fetch IP whitelist
  const {
    postData: getIPList,
    data: ipList,
    loading: ipListLoading,
  } = usePost(endpoints.user.whitelistIPList);

  // Add IP to whitelist
  const {
    postData: addIP,
    data: addIPData,
    loading: addIPLoading,
  } = usePost(endpoints.user.addWhitelistIP);

  // Delete IP from whitelist
  const {
    deleteData,
    data: deleteResponse,
    loading: deleteLoading,
  } = useDeleteWithBody();

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

  // Fetch IP list when merchant is selected
  useEffect(() => {
    if (selectedMerchant) {
      getIPList({ userId: selectedMerchant });
    }
  }, [selectedMerchant]);

  // Handle successful IP addition
  useEffect(() => {
    if (addIPData && !addIPLoading) {
      successMessage("IP address added successfully");
      setIpAddress("");
      setShowAddForm(false);
      if (selectedMerchant) {
        getIPList({ userId: selectedMerchant });
      }
    }
  }, [addIPData, addIPLoading]);

  // Handle successful IP deletion
  useEffect(() => {
    if (deleteResponse && !deleteLoading) {
      successMessage("IP address deleted successfully");
      if (selectedMerchant) {
        getIPList({ userId: selectedMerchant });
      }
    }
  }, [deleteResponse, deleteLoading]);

  const handleAddIP = async (e) => {
    e.preventDefault();

    if (!selectedMerchant) {
      errorMessage("Please select a merchant first");
      return;
    }

    // Validate IP address using validation function
    const validationError = validateIPAddress(ipAddress);
    if (validationError) {
      setIpError(validationError);
      errorMessage(validationError);
      return;
    }

    setIpError("");
    await addIP({
      userId: parseInt(selectedMerchant),
      ipAddress: ipAddress.trim(),
    });
  };

  const handleDeleteIP = async (payoutWhitelistId) => {
    if (window.confirm("Are you sure you want to delete this IP address?")) {
      await deleteData(endpoints.user.addWhitelistIP, { payoutWhitelistId });
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
          {/* <div className="col-md-6 col-sm-12 mb-2 d-flex align-items-end">
            {selectedMerchant && (
              <button
                className="btn btn-primary"
                onClick={() => setShowAddForm(true)}
                disabled={addIPLoading}
                style={{
                  backgroundColor: "var(--primary)",
                  borderColor: "var(--primary)",
                }}
              >
                <i className="bi bi-plus"></i> Add IP Address
              </button>
            )}
          </div> */}
        </div>
      )}
      {/* Add IP Button for Merchants */}
      {isAdmin() && selectedMerchant && (
        <div className="row mb-4">
          <div className="col-12">
            <button
              className="btn btn-primary"
              onClick={() => setShowAddForm(true)}
              disabled={addIPLoading}
              style={{
                backgroundColor: "var(--primary)",
                borderColor: "var(--primary)",
              }}
            >
              <i className="bi bi-plus"></i> Add IP Address
            </button>
          </div>
        </div>
      )}

      {/* Add IP Form */}
      {showAddForm && (
        <div className="row mb-4">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <h6>Add IP Address</h6>
                <form onSubmit={handleAddIP}>
                  <div className="row">
                    <div className="col-md-8">
                      <div className={styles.input}>
                        <label htmlFor="ipAddress">
                          IP Address <span className="required">*</span>
                        </label>
                        <input
                          type="text"
                          id="ipAddress"
                          value={ipAddress}
                          onChange={(e) => {
                            setIpAddress(e.target.value);
                            setIpError("");
                          }}
                          placeholder="e.g., 192.168.1.1"
                          maxLength={15}
                          required
                        />
                        {ipError && <span className="errors">{ipError}</span>}
                      </div>
                    </div>
                    <div className="col-md-4 d-flex align-items-end gap-2">
                      <button
                        type="submit"
                        className="btn btn-primary"
                        style={{
                          backgroundColor: "var(--primary)",
                          borderColor: "var(--primary)",
                        }}
                        disabled={addIPLoading}
                      >
                        {addIPLoading ? "Adding..." : "Add IP"}
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        style={{
                          backgroundColor: "var(--secondary)",
                          borderColor: "var(--secondary)",
                        }}
                        onClick={() => {
                          setShowAddForm(false);
                          setIpAddress("");
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* IP List Table */}
      {selectedMerchant && (
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                {/* <h6>IP Whitelist for Selected Merchant</h6> */}
                {ipListLoading ? (
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
                          <th style={{ minWidth: "150px" }}>IP Address</th>
                          <th style={{ minWidth: "120px" }}>Added Date</th>
                          <th style={{ minWidth: "80px" }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ipList?.data && ipList.data.length > 0 ? (
                          ipList.data.map((item) => (
                            <tr key={item.payoutWhitelistId}>
                              <td>
                                <strong>{item.ipAddress}</strong>
                              </td>
                              <td>
                                <small>
                                  {item.createdDate
                                    ? new Date(
                                        item.createdDate
                                      ).toLocaleDateString("en-GB", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                      })
                                    : "N/A"}
                                </small>
                              </td>
                              <td>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() =>
                                    handleDeleteIP(item.payoutWhitelistId)
                                  }
                                  disabled={deleteLoading}
                                  title="Delete IP Address"
                                  style={{ padding: "0.25rem 0.5rem" }}
                                >
                                  <i className="bi bi-trash-fill"></i>
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={3} className="text-center text-muted">
                              <small>No IP addresses whitelisted</small>
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
    </div>
  );
};

export default IPWhitelistTab;
