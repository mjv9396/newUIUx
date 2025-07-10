import { useState } from "react";
import styles from "../page.module.css";

const PayinProfiles = ({ name, id, onAddPayin, response }) => {
  const [active, setActive] = useState(1);
  
  // Template data for payin profiles
  const payinProfiles = [
    {
      id: 1,
      name: "Standard Payin Profile",
      description: "Default payin configuration",
      status: "Active",
      personalDetails: {
        currency: "USD",
        firstName: "John",
        lastName: "Doe",
        contactNumber: "+1234567890",
        email: "john.doe@example.com",
        password: "********"
      },
      bankDetails: {
        bankName: "ABC Bank",
        accountNumber: "1234567890",
        ifscCode: "ABCD0123456",
        branch: "Main Branch",
        merchantId: "MERCH001",
        encryptionKey: "enc_key_123",
        clientId: "client_456",
        clientSecret: "secret_789"
      },
      virtualAccount: {
        bankCode: "ABC",
        channelId: "CH001"
      },
      tokenDetails: {
        accessToken: "pk_test_123...abc",
        expires: "2024-12-31"
      }
    },
    {
      id: 2,
      name: "Premium Payin Profile", 
      description: "High-volume payin configuration",
      status: "Active",
      personalDetails: {
        currency: "EUR",
        firstName: "Alice",
        lastName: "Smith",
        contactNumber: "+1987654321",
        email: "alice.smith@example.com",
        password: "********"
      },
      bankDetails: {
        bankName: "XYZ Bank",
        accountNumber: "9876543210",
        ifscCode: "XYZD0987654",
        branch: "Premium Branch",
        merchantId: "MERCH002",
        encryptionKey: "enc_key_456",
        clientId: "client_789",
        clientSecret: "secret_012"
      },
      virtualAccount: {
        bankCode: "XYZ",
        channelId: "CH002"
      },
      tokenDetails: {
        accessToken: "pk_live_456...def",
        expires: "2025-06-30"
      }
    }
  ];

  const currentProfile = payinProfiles[active - 1];

  const handleActiveProfile = (profileIndex) => {
    setActive(profileIndex);
  };

  return (
    <>
      <div className="row">
        <div className="col-12 mb-4">
          <div className={styles.secondaryCard}>
            <div className="d-flex justify-content-between align-items-center">
              <h6 className="d-flex gap-2">
                Payin Profiles
                <span>
                  <i
                    className="bi bi-pencil-square"
                    id={styles.editicon}
                  ></i>
                </span>
              </h6>
              <i
                className="bi bi-plus-lg"
                id={styles.editicon}
                onClick={onAddPayin}
                style={{ cursor: 'pointer' }}
              ></i>
            </div>
            <div className="row p-2">
              <div className="d-flex gap-4 mb-2">
                <small className="text-muted">Manage payin profiles for {name}</small>
              </div>
              <div className="row">
                <div className="col-md-2 col-sm-12 d-flex flex-column">
                  {payinProfiles.map((profile, index) => (
                    <button
                      className={
                        active === index + 1
                          ? styles.paymentcard + " " + styles.active
                          : styles.paymentcard
                      }
                      onClick={() => handleActiveProfile(index + 1)}
                      key={profile.id}
                    >
                      {profile.name}
                    </button>
                  ))}
                </div>
                <div className="col-md-10 col-sm-12">
                  <div className="accordion" id="payinAccordion">
                    {/* Personal Details */}
                    <div className="accordion-item">
                      <h2 className="accordion-header" id="personalHeading">
                        <button
                          className="accordion-button"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#personalCollapse"
                          aria-expanded="true"
                          aria-controls="personalCollapse"
                        >
                          Personal Details
                        </button>
                      </h2>
                      <div
                        id="personalCollapse"
                        className="accordion-collapse collapse show"
                        aria-labelledby="personalHeading"
                      >
                        <div className={`accordion-body ${styles.accordionContent}`}>
                          <div className="row">
                            <div className="col-lg-3 col-md-4 col-sm-6 mb-2">
                              <div className={styles.accordionLabel}>Currency:</div>
                              <div className={styles.accordionValue}>{currentProfile.personalDetails.currency}</div>
                            </div>
                            <div className="col-lg-3 col-md-4 col-sm-6 mb-2">
                              <div className={styles.accordionLabel}>First Name:</div>
                              <div className={styles.accordionValue}>{currentProfile.personalDetails.firstName}</div>
                            </div>
                            <div className="col-lg-3 col-md-4 col-sm-6 mb-2">
                              <div className={styles.accordionLabel}>Last Name:</div>
                              <div className={styles.accordionValue}>{currentProfile.personalDetails.lastName}</div>
                            </div>
                            <div className="col-lg-3 col-md-4 col-sm-6 mb-2">
                              <div className={styles.accordionLabel}>Contact Number:</div>
                              <div className={styles.accordionValue}>{currentProfile.personalDetails.contactNumber}</div>
                            </div>
                            <div className="col-lg-3 col-md-4 col-sm-6 mb-2">
                              <div className={styles.accordionLabel}>Email:</div>
                              <div className={styles.accordionValue}>{currentProfile.personalDetails.email}</div>
                            </div>
                            <div className="col-lg-3 col-md-4 col-sm-6 mb-2">
                              <div className={styles.accordionLabel}>Password:</div>
                              <div className={styles.accordionValue}>{currentProfile.personalDetails.password}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bank Details */}
                    <div className="accordion-item">
                      <h2 className="accordion-header" id="bankHeading">
                        <button
                          className="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#bankCollapse"
                          aria-expanded="false"
                          aria-controls="bankCollapse"
                        >
                          Bank Details
                        </button>
                      </h2>
                      <div
                        id="bankCollapse"
                        className="accordion-collapse collapse"
                        aria-labelledby="bankHeading"
                      >
                        <div className={`accordion-body ${styles.accordionContent}`}>
                          <div className="row">
                            <div className="col-lg-3 col-md-4 col-sm-6 mb-2">
                              <div className={styles.accordionLabel}>Acquirer Pass:</div>
                              <div className={styles.accordionValue}>{currentProfile.bankDetails.bankName}</div>
                            </div>
                            <div className="col-lg-3 col-md-4 col-sm-6 mb-2">
                              <div className={styles.accordionLabel}>Merchant ID/Outlet:</div>
                              <div className={styles.accordionValue}>{currentProfile.bankDetails.merchantId}</div>
                            </div>
                            <div className="col-lg-3 col-md-4 col-sm-6 mb-2">
                              <div className={styles.accordionLabel}>Token/Encryption Key:</div>
                              <div className={styles.accordionValue}>{currentProfile.bankDetails.encryptionKey}</div>
                            </div>
                            <div className="col-lg-3 col-md-4 col-sm-6 mb-2">
                              <div className={styles.accordionLabel}>Username:</div>
                              <div className={styles.accordionValue}>{currentProfile.bankDetails.accountNumber}</div>
                            </div>
                            <div className="col-lg-3 col-md-4 col-sm-6 mb-2">
                              <div className={styles.accordionLabel}>Client ID:</div>
                              <div className={styles.accordionValue}>{currentProfile.bankDetails.clientId}</div>
                            </div>
                            <div className="col-lg-3 col-md-4 col-sm-6 mb-2">
                              <div className={styles.accordionLabel}>Client Secret:</div>
                              <div className={styles.accordionValue}>{currentProfile.bankDetails.clientSecret}</div>
                            </div>
                            <div className="col-lg-3 col-md-4 col-sm-6 mb-2">
                              <div className={styles.accordionLabel}>Client Comp Code:</div>
                              <div className={styles.accordionValue}>{currentProfile.bankDetails.ifscCode}</div>
                            </div>
                            <div className="col-lg-3 col-md-4 col-sm-6 mb-2">
                              <div className={styles.accordionLabel}>Cert Password Code:</div>
                              <div className={styles.accordionValue}>{currentProfile.bankDetails.branch}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Virtual Accounts */}
                    <div className="accordion-item">
                      <h2 className="accordion-header" id="virtualHeading">
                        <button
                          className="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#virtualCollapse"
                          aria-expanded="false"
                          aria-controls="virtualCollapse"
                        >
                          Virtual Account
                        </button>
                      </h2>
                      <div
                        id="virtualCollapse"
                        className="accordion-collapse collapse"
                        aria-labelledby="virtualHeading"
                      >
                        <div className={`accordion-body ${styles.accordionContent}`}>
                          <div className="row">
                            <div className="col-lg-3 col-md-4 col-sm-6 mb-2">
                              <div className={styles.accordionLabel}>VPA:</div>
                              <div className={styles.accordionValue}>user@{currentProfile.virtualAccount.bankCode.toLowerCase()}</div>
                            </div>
                            <div className="col-lg-3 col-md-4 col-sm-6 mb-2">
                              <div className={styles.accordionLabel}>Bank Code:</div>
                              <div className={styles.accordionValue}>{currentProfile.virtualAccount.bankCode}</div>
                            </div>
                            <div className="col-lg-3 col-md-4 col-sm-6 mb-2">
                              <div className={styles.accordionLabel}>ACQR Bank Code:</div>
                              <div className={styles.accordionValue}>{currentProfile.virtualAccount.bankCode} - IFSC</div>
                            </div>
                            <div className="col-lg-3 col-md-4 col-sm-6 mb-2">
                              <div className={styles.accordionLabel}>Channel ID:</div>
                              <div className={styles.accordionValue}>{currentProfile.virtualAccount.channelId}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Token Details */}
                    <div className="accordion-item">
                      <h2 className="accordion-header" id="tokenHeading">
                        <button
                          className="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#tokenCollapse"
                          aria-expanded="false"
                          aria-controls="tokenCollapse"
                        >
                          Token Details
                        </button>
                      </h2>
                      <div
                        id="tokenCollapse"
                        className="accordion-collapse collapse"
                        aria-labelledby="tokenHeading"
                      >
                        <div className={`accordion-body ${styles.accordionContent}`}>
                          <div className="row">
                            <div className="col-lg-3 col-md-4 col-sm-6 mb-2">
                              <div className={styles.accordionLabel}>Access Token:</div>
                              <div className={styles.accordionValue}>{currentProfile.tokenDetails.accessToken}</div>
                            </div>
                            <div className="col-lg-3 col-md-4 col-sm-6 mb-2">
                              <div className={styles.accordionLabel}>Expires:</div>
                              <div className={styles.accordionValue}>{currentProfile.tokenDetails.expires}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PayinProfiles;
