import { useState, useEffect } from "react";
import styles from "../../../styles/common/Add.module.css";
import { endpoints } from "../../../services/apiEndpoints";
import useFetch from "../../../hooks/useFetch";
import usePost from "../../../hooks/usePost";

const Balances = () => {
  const [selectedAcquirer, setSelectedAcquirer] = useState("");
  const [selectedProfile, setSelectedProfile] = useState("");
  // Fetch balance using POST API
  const {
    postData: getBalanceEnquiry,
    data: balanceData,
    error: balanceError,
    loading: balanceLoading,
  } = usePost(endpoints.bank.balanceEnquiry);

  const [errors, setErrors] = useState({});

  // Fetch acquirers list using existing endpoint
  const {
    fetchData: getAllAcquirer,
    data: allAcquirer,
    error: acquirerError,
    loading: acquirerLoading,
  } = useFetch();

  // Fetch acquirer profiles based on selected acquirer code
  const {
    fetchData: getAcquirerProfileByCode,
    data: acquirerProfileList,
    error: profilesError,
    loading: profilesLoading,
  } = useFetch();

  useEffect(() => {
    getAllAcquirer(endpoints.payin.acquirerList);
  }, []);

  // Handle acquirer selection
  const handleAcquirerChange = (e) => {
    const value = e.target.value;
    setSelectedAcquirer(value);
    setSelectedProfile(""); // Reset profile selection

    // Clear previous balance data when acquirer changes
    if (balanceData) {
      // Reset balance data if it exists
      setErrors({});
    }

    // Fetch acquirer profiles when acquirer is selected
    if (value) {
      getAcquirerProfileByCode(
        `${endpoints.bank.acquirerProfileByAcqCode}?acqCode=${value}`
      );
    }
  };

  // Handle profile selection
  const handleProfileChange = (e) => {
    setSelectedProfile(e.target.value);
  };

  // Fetch balance when profile is selected
  const fetchBalance = async () => {
    if (!selectedProfile) return;

    if (selectedProfile.trim() === "") {
      setErrors({ ...errors, selectedProfile: "Select Acquirer Profile" });
      return;
    }
    setErrors({});

    // Call balance enquiry API with acqProfileId
    await getBalanceEnquiry({ acqProfileId: selectedProfile });
  };

  // console.log(selectedAcquirer, selectedProfile, balanceData);

  useEffect(() => {
    if (selectedProfile) {
      fetchBalance();
    }
  }, [selectedProfile]);

  // Check if balance API call was successful
  const isBalanceSuccess = balanceData && balanceData.statusCode < 400;
  const isBalanceError = balanceData && balanceData.statusCode >= 400;
  const balanceValue = isBalanceSuccess ? balanceData.data : null;
  const balanceErrorMessage = isBalanceError
    ? balanceData.error?.detailMessage || balanceData.data
    : null;

  if (acquirerError) return <div>Error loading Acquirers</div>;
  if (profilesError) return <div>Error loading Profiles</div>;
  if (acquirerLoading) return <div>Loading Acquirer List...</div>;

  if (allAcquirer) {
    return (
      <div className={styles.listing}>
        <div className="row">
          <div className="col-md-6 col-sm-12 mb-2 position-relative">
            <label htmlFor="selectedAcquirer">
              Acquirer <span className="required">*</span>
            </label>
            <select
              name="selectedAcquirer"
              id="selectedAcquirer"
              onChange={handleAcquirerChange}
              value={selectedAcquirer}
            >
              <option value="" disabled>
                --Select Acquirer--
              </option>
              {allAcquirer.data.length > 0 ? (
                allAcquirer.data.map((item) => (
                  <option key={item.acqCode} value={item.acqCode}>
                    {item.acqName}
                  </option>
                ))
              ) : (
                <option>No acquirer added</option>
              )}
            </select>
            {errors.selectedAcquirer && (
              <span className="errors">{errors.selectedAcquirer}</span>
            )}
          </div>
          <div className="col-md-6 col-sm-12 mb-2 position-relative">
            <label htmlFor="selectedProfile">
              Acquirer Profile <span className="required">*</span>
            </label>
            <select
              name="selectedProfile"
              id="selectedProfile"
              onChange={handleProfileChange}
              value={selectedProfile}
              disabled={!selectedAcquirer || profilesLoading}
            >
              <option value="" disabled>
                {!selectedAcquirer
                  ? "--Please select acquirer first--"
                  : profilesLoading
                  ? "--Loading profiles--"
                  : "--Select acquirer profile--"}
              </option>
              {acquirerProfileList?.data?.length > 0
                ? acquirerProfileList.data.map((item) => (
                    <option key={item.acqProfileId} value={item.acqProfileId}>
                      {item.firstName} {item.lastName}
                    </option>
                  ))
                : selectedAcquirer &&
                  !profilesLoading && (
                    <option>No acquirer profile added</option>
                  )}
            </select>
            {errors.selectedProfile && (
              <span className="errors">{errors.selectedProfile}</span>
            )}
          </div>
        </div>

        {/* Balance Display */}
        {selectedProfile && (
          <div className="row mt-4">
            <div className="col-12">
              <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Account Balance</h5>
                  {balanceLoading && (
                    <div
                      className={`spinner-border spinner-border-sm ${styles.primarySpinner}`}
                      role="status"
                    >
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  )}
                </div>

                <div className="card-body">
                  {balanceLoading ? (
                    <div className="text-center py-4">
                      <div
                        className={`spinner-border ${styles.primarySpinner}`}
                        role="status"
                      >
                        <span className="visually-hidden">
                          Loading balance...
                        </span>
                      </div>
                      <p className="mt-2 text-muted">
                        Fetching escrow account balance...
                      </p>
                    </div>
                  ) : balanceError && !balanceData ? (
                    <div className={styles.dangerAlert} role="alert">
                      <i className="bi bi-exclamation-triangle me-2"></i>
                      Failed to fetch escrow account balance. Please try again.
                    </div>
                  ) : isBalanceError ? (
                    <div className={styles.dangerAlert} role="alert">
                      <i className="bi bi-exclamation-triangle me-2"></i>
                      {balanceErrorMessage ||
                        "Failed to fetch escrow account balance"}
                    </div>
                  ) : isBalanceSuccess ? (
                    <div className="row">
                      <div className="col-md-12">
                        <div className="text-center p-4 border rounded">
                          {/* <label className="form-label text-muted mb-3">
                            Account Balance
                          </label> */}
                          <div className={`h3 mb-2 ${styles.primaryText}`}>
                            ₹{" "}
                            {balanceValue
                              ? parseFloat(balanceValue).toLocaleString()
                              : "0.00"}
                          </div>
                          <small className="text-muted">
                            Acquirer: {selectedAcquirer || "N/A"}
                          </small>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <i className="bi bi-chart-line fa-3x text-muted mb-3"></i>
                      <p className="text-muted">Escrow Account Not Found</p>
                    </div>
                  )}

                  {isBalanceSuccess && (
                    <div className="text-center mt-3 pt-3 border-top">
                      <small className="text-muted">
                        <i className="bi bi-clock me-1"></i>
                        Last updated: {new Date().toLocaleString()}
                      </small>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Refresh Button */}
        {selectedAcquirer && selectedProfile && balanceData && (
          <div className="row mt-3">
            <div className="col-12 text-end">
              <button
                className={styles.refreshBtn}
                onClick={fetchBalance}
                disabled={balanceLoading}
              >
                <i className="bi bi-arrow-clockwise me-2"></i>
                Refresh Account Balance
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
};

export default Balances;
