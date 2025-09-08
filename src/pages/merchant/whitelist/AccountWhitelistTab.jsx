import { useState, useEffect } from "react";
import usePost from "../../../hooks/usePost";
import { endpoints } from "../../../services/apiEndpoints";
import { successMessage, errorMessage } from "../../../utils/messges";
import { apiClient } from "../../../services/httpRequest";
import styles from "../../../styles/common/Add.module.css";
import AccountWhitelistModal from "./AccountWhitelistModal";
import { GetUserRole, GetUserId } from "../../../services/cookieStore";

const AccountWhitelistTab = () => {
  const [selectedMerchant, setSelectedMerchant] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);

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

  // Fetch account whitelist
  const {
    postData: getAccountList,
    data: accountList,
    loading: accountListLoading,
  } = usePost(endpoints.user.searchBankAccount);

  // Toggle account status using PUT for dynamic URL
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

  // Fetch account list when merchant is selected
  useEffect(() => {
    if (selectedMerchant) {
      getAccountList({
        userId: selectedMerchant,
      });
    }
  }, [selectedMerchant]);

  const handleToggleStatus = async (accountId, currentStatus) => {
    const newStatus = !currentStatus;
    setToggleLoading(true);

    try {
      const response = await apiClient.post(
        `${endpoints.user.updateBankAccountStatus}/${accountId}?isActive=${newStatus}`,
        {}
      );

      if (response.data && response.data.statusCode < 400) {
        successMessage("Account status updated successfully");
        if (selectedMerchant) {
          getAccountList({
            userId: selectedMerchant,
          });
        }
      } else {
        errorMessage("Failed to update account status");
      }
    } catch (error) {
      errorMessage("An error occurred while updating account status");
    } finally {
      setToggleLoading(false);
    }
  };

  const handleAddAccount = () => {
    if (!selectedMerchant) {
      errorMessage("Please select a merchant first");
      return;
    }
    setEditingAccount(null);
    setShowModal(true);
  };

  const handleEditAccount = (account) => {
    setEditingAccount(account);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingAccount(null);
  };

  const handleAccountSaved = () => {
    setShowModal(false);
    setEditingAccount(null);
    if (selectedMerchant) {
      getAccountList({
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
          <div className="col-md-6 col-sm-12 mb-2 d-flex align-items-end">
            {selectedMerchant && (
              <button
                className="btn btn-primary"
                onClick={handleAddAccount}
                disabled={accountListLoading}
                style={{
                  backgroundColor: "var(--primary)",
                  borderColor: "var(--primary)",
                }}
              >
                <i className="bi bi-plus"></i> Add Bank Account
              </button>
            )}
          </div>
        </div>
      )}

      {/* Add Account Button for Merchants */}
      {isMerchant && selectedMerchant && (
        <div className="row mb-4">
          <div className="col-12">
            <button
              className="btn btn-primary"
              onClick={handleAddAccount}
              disabled={accountListLoading}
              style={{
                backgroundColor: "var(--primary)",
                borderColor: "var(--primary)",
              }}
            >
              <i className="bi bi-plus"></i> Add Bank Account
            </button>
          </div>
        </div>
      )}

      {/* Account List Table */}
      {selectedMerchant && (
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <h6>Bank Account Whitelist for Selected Merchant</h6>
                {accountListLoading ? (
                  <div className="text-center py-4">
                    <div className="spinner-border" aria-hidden="true">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <div className={styles.table}>
                    <table className="table table-responsive-sm">
                      <thead>
                        <tr>
                          <th>Account Number</th>
                          <th>Account Holder Name</th>
                          <th>Bank Name</th>
                          <th>IFSC Code</th>
                          <th>Branch</th>
                          <th>Account Type</th>
                          <th>Status</th>
                          <th>Verified</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {accountList?.data && accountList.data.length > 0 ? (
                          accountList.data.map((account) => (
                            <tr key={account.id}>
                              <td>{account.accountNumber}</td>
                              <td>{account.accountHolderName}</td>
                              <td>{account.bankName}</td>
                              <td>{account.ifscCode}</td>
                              <td>{account.branch}</td>
                              <td>
                                <span className="badge bg-secondary">
                                  {account.accountType}
                                </span>
                              </td>
                              <td>
                                <div className="form-check form-switch">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={account.active}
                                    onChange={() =>
                                      handleToggleStatus(
                                        account.id,
                                        account.active
                                      )
                                    }
                                    disabled={toggleLoading}
                                  />
                                  <label className="form-check-label">
                                    <span
                                      className={`badge ${
                                        account.active
                                          ? "bg-success"
                                          : "bg-danger"
                                      }`}
                                    >
                                      {account.active ? "Active" : "Inactive"}
                                    </span>
                                  </label>
                                </div>
                              </td>
                              <td>
                                <span
                                  className={`badge ${
                                    account.verified
                                      ? "bg-success"
                                      : "bg-warning"
                                  }`}
                                >
                                  {account.verified ? "Verified" : "Pending"}
                                </span>
                              </td>
                              <td>
                                <button
                                  className="btn btn-sm btn-outline-primary me-1"
                                  onClick={() => handleEditAccount(account)}
                                  title="Edit Account"
                                >
                                  <i className="bi bi-pencil"></i>
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={9} className="text-center">
                              No bank accounts whitelisted
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

      {/* Account Modal */}
      {showModal && (
        <AccountWhitelistModal
          show={showModal}
          onHide={handleModalClose}
          onSaved={handleAccountSaved}
          editingAccount={editingAccount}
          selectedMerchant={selectedMerchant}
        />
      )}
    </div>
  );
};

export default AccountWhitelistTab;
