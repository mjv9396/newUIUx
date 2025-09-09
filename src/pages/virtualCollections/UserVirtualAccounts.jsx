/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import styles from "../../styles/dashboard/Dashboard.module.css";
import listStyles from "../../styles/common/List.module.css";
import useFetch from "../../hooks/useFetch";
import usePost from "../../hooks/usePost";
import { endpoints } from "../../services/apiEndpoints";
import { dateFormatter } from "../../utils/dateFormatter";
import { formatToINRCurrency } from "../../utils/formatToINRCurrency ";
import { isAdmin, isMerchant, GetUserId } from "../../services/cookieStore";
import { successMessage } from "../../utils/messges";
import Filters from "../../ui/Filter";

const UserVirtualAccounts = () => {
  const [merchantId, setMerchantId] = useState("");
  const [loading, setLoading] = useState(false);

  // Date range state
  const [range, setRange] = useState([
    {
      startDate: new Date(), // Today
      endDate: new Date(), // Today
      key: "selection",
    },
  ]);

  // Fetch merchant list for admin only
  const { fetchData: getAllMerchant, data: allMerchant } = useFetch();

  useEffect(() => {
    // Only fetch merchants if user is admin
    if (isAdmin()) {
      getAllMerchant(endpoints.user.userList);
    }
  }, []);

  // Fetch virtual balance data
  const {
    postData: getVirtualBalance,
    data: virtualBalanceData,
    error: virtualBalanceError,
  } = usePost(endpoints.user.virtualBalance);

  // Fetch virtual accounts data
  const {
    error: virtualAccountError,
    fetchData: getVirtualAccountDashboard,
    data: virtualAccountDashboardData,
    loading: virtualAccountLoading,
  } = useFetch();

  const [virtualAccountData, setVirtualAccountData] = useState();

  // Get virtual accounts function
  const getVirtualAccounts = async () => {
    const userId = isAdmin() ? merchantId : GetUserId();

    if (userId) {
      setLoading(true);
      try {
        await getVirtualAccountDashboard(
          endpoints.payin.virtualAccountSummary + userId
        );
      } catch (err) {
        console.error("Error fetching virtual accounts:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  // Fetch virtual balance
  const fetchVirtualBalance = () => {
    getVirtualBalance({
      userId: isAdmin() ? merchantId : GetUserId(),
      startDate: dateFormatter(range[0].startDate),
      endDate: dateFormatter(range[0].endDate),
    });
  };

  // Update virtual account data when API response comes
  useEffect(() => {
    if (virtualAccountDashboardData && !virtualAccountError) {
      setVirtualAccountData(virtualAccountDashboardData);
    }
  }, [virtualAccountDashboardData, virtualAccountError]);

  // Fetch data when merchant or date range changes
  useEffect(() => {
    const userId = isAdmin() ? merchantId : GetUserId();
    if (userId) {
      getVirtualAccounts();
      fetchVirtualBalance();
    }
  }, [merchantId, range]);

  // Initial data fetch for merchants (get their own data immediately)
  useEffect(() => {
    if (isMerchant()) {
      getVirtualAccounts();
      fetchVirtualBalance();
    }
  }, []);

  // Copy to clipboard function
  const handleCopy = (text, message, event) => {
    event.stopPropagation();
    navigator.clipboard.writeText(text);
    successMessage(message);
  };

  // Virtual Account Card Component
  const VirtualAccountCard = ({ virtualAccount }) => {
    return (
      <div className={`${styles.virtualCard} mb-3`}>
        <h4>{virtualAccount.name || "Virtual Account"}</h4>

        {virtualAccount.virtualUpi ? (
          <>
            <small>
              Virtual VPA{" "}
              <i
                onClick={(e) =>
                  handleCopy(
                    virtualAccount.virtualUpi,
                    "VPA copied to clipboard",
                    e
                  )
                }
                className="bi bi-copy"
              ></i>
            </small>
            <h5>{virtualAccount.virtualUpi}</h5>
          </>
        ) : (
          <>
            <small>
              Account Number{" "}
              <i
                onClick={(e) =>
                  handleCopy(
                    virtualAccount.virtualAccountNo,
                    "Account Number copied to clipboard",
                    e
                  )
                }
                className="bi bi-copy"
              ></i>
            </small>
            <h5>{virtualAccount.virtualAccountNo}</h5>

            {virtualAccount.virtualIfsc && (
              <>
                <small>
                  IFSC Code{" "}
                  <i
                    onClick={(e) =>
                      handleCopy(
                        virtualAccount.virtualIfsc,
                        "IFSC Code copied to clipboard",
                        e
                      )
                    }
                    className="bi bi-copy"
                  ></i>
                </small>
                <h5>{virtualAccount.virtualIfsc}</h5>
              </>
            )}
          </>
        )}

        {virtualAccount.balance !== undefined && (
          <div className="mt-2">
            <small>Current Balance</small>
            <h5 style={{ color: "var(--primary)", fontSize: "16px" }}>
              {formatToINRCurrency(virtualAccount.balance)}
            </h5>
          </div>
        )}
      </div>
    );
  };

  return (
    <DashboardLayout
      page="User Virtual Accounts"
      url="/dashboard/user-virtual-accounts"
    >
      {/* Filters - Only show merchant selector for admin */}
      {isAdmin() && (
        <div className="d-flex flex-wrap gap-3 align-items-center mt-3 justify-content-end">
          <Filters
            handleMerchantChange={(e) => {
              setMerchantId(e);
            }}
            selectedMerchant={{
              id: merchantId,
              name:
                (allMerchant?.data?.find((item) => item.userId === merchantId)
                  ?.firstName ?? "Select") +
                " " +
                (allMerchant?.data?.find((item) => item.userId === merchantId)
                  ?.lastName ?? "Merchant"),
            }}
            isMerchantDisabled={false}
            merchantOptions={allMerchant?.data}
            setDateRange={setRange}
            isCurrencyDisabled
          />
        </div>
      )}

      {/* Date range filter for merchants */}
      {isMerchant() && (
        <div className="d-flex flex-wrap gap-3 align-items-center mt-3 justify-content-end">
          <Filters
            setDateRange={setRange}
            isCurrencyDisabled
            isMerchantDisabled={true} // Hide merchant selector for merchants
          />
        </div>
      )}

      {/* Virtual Balance Summary - Show only when data is available and conditions are met */}
      {virtualBalanceData && ((isAdmin() && merchantId) || isMerchant()) && (
        <div className="row mt-4">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">
                  <i className="bi bi-wallet2 me-2"></i>
                  Virtual Account Balance Summary
                  {isAdmin() && merchantId && (
                    <small className="text-muted ms-2">
                      (
                      {
                        allMerchant?.data?.find(
                          (item) => item.userId === merchantId
                        )?.firstName
                      }{" "}
                      {
                        allMerchant?.data?.find(
                          (item) => item.userId === merchantId
                        )?.lastName
                      }
                      )
                    </small>
                  )}
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-4">
                    <div className="text-center p-3 border rounded">
                      <h6 className="text-muted mb-2">Total Virtual Balance</h6>
                      <h4 className="text-primary mb-0">
                        {formatToINRCurrency(
                          virtualBalanceData.data?.totalVirtualBalance || 0
                        )}
                      </h4>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="text-center p-3 border rounded">
                      <h6 className="text-muted mb-2">Today's Collections</h6>
                      <h4 className="text-success mb-0">
                        {formatToINRCurrency(
                          virtualBalanceData.data?.todayCollection || 0
                        )}
                      </h4>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="text-center p-3 border rounded">
                      <h6 className="text-muted mb-2">Active Accounts</h6>
                      <h4 className="text-info mb-0">
                        {virtualAccountData?.data?.length || 0}
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {(loading || virtualAccountLoading) && (
        <div className={listStyles.table}>
          <p className="text-center">
            Please wait while we fetch your virtual accounts
          </p>
        </div>
      )}

      {/* Virtual Accounts Grid - Show only when data is available and conditions are met */}
      {virtualAccountData &&
        !loading &&
        !virtualAccountLoading &&
        ((isAdmin() && merchantId) || isMerchant()) && (
          <div className="row mt-4">
            <div className="col-12">
              <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">
                    <i className="bi bi-credit-card-2-front me-2"></i>
                    Virtual Accounts ({virtualAccountData.data?.length || 0})
                    {isAdmin() && merchantId && (
                      <small className="text-muted ms-2">
                        (
                        {
                          allMerchant?.data?.find(
                            (item) => item.userId === merchantId
                          )?.firstName
                        }{" "}
                        {
                          allMerchant?.data?.find(
                            (item) => item.userId === merchantId
                          )?.lastName
                        }
                        )
                      </small>
                    )}
                  </h5>
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => {
                      getVirtualAccounts();
                      fetchVirtualBalance();
                    }}
                    disabled={loading}
                  >
                    <i className="bi bi-arrow-clockwise me-1"></i>
                    Refresh
                  </button>
                </div>
                <div className="card-body">
                  {virtualAccountData.data &&
                  virtualAccountData.data.length > 0 ? (
                    <div className="row">
                      {virtualAccountData.data.map((virtualAccount, index) => (
                        <div
                          key={index}
                          className="col-lg-4 col-md-6 col-sm-12 mb-3"
                        >
                          <VirtualAccountCard virtualAccount={virtualAccount} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-5">
                      <i className="bi bi-credit-card-2-front fa-3x text-muted mb-3"></i>
                      <h5 className="text-muted">No Virtual Accounts Found</h5>
                      <p className="text-muted">
                        {isAdmin() && !merchantId
                          ? "Please select a merchant to view their virtual accounts"
                          : "No virtual accounts are currently available"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

      {/* Error States */}
      {virtualAccountError && (
        <div className="row mt-4">
          <div className="col-12">
            <div className="alert alert-danger" role="alert">
              <i className="bi bi-exclamation-triangle me-2"></i>
              Error loading virtual accounts. Please try again.
            </div>
          </div>
        </div>
      )}

      {virtualBalanceError && (
        <div className="row mt-4">
          <div className="col-12">
            <div className="alert alert-warning" role="alert">
              <i className="bi bi-exclamation-triangle me-2"></i>
              Error loading virtual balance data. Some information may not be
              available.
            </div>
          </div>
        </div>
      )}

      {/* Admin: No Merchant Selected */}
      {isAdmin() && !merchantId && !loading && (
        <div className="row mt-4">
          <div className="col-12">
            <div className="card">
              <div className="card-body text-center py-5">
                <i className="bi bi-person-check fa-3x text-muted mb-3"></i>
                <h5 className="text-muted">Select a Merchant</h5>
                <p className="text-muted">
                  Please select a merchant from the filter above to view their
                  virtual accounts
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin: Show message when merchant is required but not selected for balance data */}
      {isAdmin() && !merchantId && virtualBalanceData && (
        <div className="row mt-4">
          <div className="col-12">
            <div className="alert alert-info" role="alert">
              <i className="bi bi-info-circle me-2"></i>
              Please select a merchant to view virtual account balance and
              details
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default UserVirtualAccounts;
