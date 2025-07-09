import { useState } from "react";
import styles from "../page.module.css";

const PayoutProfiles = ({ name, id }) => {
  const [active, setActive] = useState(1);

  // Template data for payout profiles based on the handwritten notes
  const payoutProfiles = [
    {
      id: 1,
      name: "Standard Payout Profile",
      description: "Default payout configuration",
      status: "Active",
      personalDetails: {
        currency: "USD",
        firstName: "Jane",
        lastName: "Smith",
        contactNumber: "+1987654321",
        email: "jane.smith@example.com",
        password: "********",
      },
      bankDetails: {
        acquirerPass: "ACQR_PASS_001",
        merchantIdOutlet: "MERCH_OUT_001",
        tokenEncryptionKey: "tok_enc_456",
        username: "payout_user",
        clientId: "payout_client_789",
        clientSecret: "payout_secret_012",
        clientCompCode: "COMP_CODE_123",
        certPasswordCode: "cert_pass_456",
      },
      virtualAccount: {
        vpa: "payout@bank",
        bankCode: "XYZ",
        acqrBankCode: "XYZ - IFSC",
        channelId: "CH_PAYOUT_001",
      },
      tokenDetails: {
        accessToken: "po_live_789...xyz",
        expires: "2024-12-31",
      },
    },
    {
      id: 2,
      name: "Instant Payout Profile",
      description: "Real-time payout configuration",
      status: "Active",
      personalDetails: {
        currency: "EUR",
        firstName: "Robert",
        lastName: "Johnson",
        contactNumber: "+1555666777",
        email: "robert.johnson@example.com",
        password: "********",
      },
      bankDetails: {
        acquirerPass: "ACQR_PASS_002",
        merchantIdOutlet: "MERCH_OUT_002",
        tokenEncryptionKey: "tok_enc_789",
        username: "instant_user",
        clientId: "instant_client_012",
        clientSecret: "instant_secret_345",
        clientCompCode: "COMP_CODE_456",
        certPasswordCode: "cert_pass_789",
      },
      virtualAccount: {
        vpa: "instant@bank",
        bankCode: "DEF",
        acqrBankCode: "DEF - IFSC",
        channelId: "CH_INSTANT_002",
      },
      tokenDetails: {
        accessToken: "po_instant_012...ghi",
        expires: "2025-06-30",
      },
    },
  ];

  const currentProfile = payoutProfiles[active - 1];

  const handleActiveProfile = (profileIndex) => {
    setActive(profileIndex);
  };

  return (
    <div className="row">
      <div className="col-12 mb-4">
        <div className={styles.secondaryCard}>
          <div className="d-flex justify-content-between align-items-center">
            <h6 className="d-flex gap-2">
              Payout Profiles
              <span>
                <i className="bi bi-pencil-square" id={styles.editicon}></i>
              </span>
            </h6>
            <i className="bi bi-plus-lg" id={styles.editicon}></i>
          </div>
          <div className="row p-2">
            <div className="d-flex gap-4 mb-2">
              <small className="text-muted">
                Manage payout profiles for {name}
              </small>
            </div>
            <div className="row">
              <div className="col-md-2 col-sm-12 d-flex flex-column">
                {payoutProfiles.map((profile, index) => (
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
                <div className="accordion" id="payoutAccordion">
                  {/* Personal Details */}
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="payoutPersonalHeading">
                      <button
                        className="accordion-button"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#payoutPersonalCollapse"
                        aria-expanded="true"
                        aria-controls="payoutPersonalCollapse"
                      >
                        Personal Details
                      </button>
                    </h2>
                    <div
                      id="payoutPersonalCollapse"
                      className="accordion-collapse collapse show"
                      aria-labelledby="payoutPersonalHeading"
                    >
                      <div
                        className={`accordion-body ${styles.accordionContent}`}
                      >
                        <div className="row">
                          <div className="col-lg-3 col-md-4 col-sm-6 mb-2">
                            <div className={styles.accordionLabel}>
                              Currency:
                            </div>
                            <div className={styles.accordionValue}>
                              {currentProfile.personalDetails.currency}
                            </div>
                          </div>
                          <div className="col-lg-3 col-md-4 col-sm-6 mb-2">
                            <div className={styles.accordionLabel}>
                              First Name:
                            </div>
                            <div className={styles.accordionValue}>
                              {currentProfile.personalDetails.firstName}
                            </div>
                          </div>
                          <div className="col-lg-3 col-md-4 col-sm-6 mb-2">
                            <div className={styles.accordionLabel}>
                              Last Name:
                            </div>
                            <div className={styles.accordionValue}>
                              {currentProfile.personalDetails.lastName}
                            </div>
                          </div>
                          <div className="col-lg-3 col-md-4 col-sm-6 mb-2">
                            <div className={styles.accordionLabel}>
                              Contact Number:
                            </div>
                            <div className={styles.accordionValue}>
                              {currentProfile.personalDetails.contactNumber}
                            </div>
                          </div>
                          <div className="col-lg-3 col-md-4 col-sm-6 mb-2">
                            <div className={styles.accordionLabel}>Email:</div>
                            <div className={styles.accordionValue}>
                              {currentProfile.personalDetails.email}
                            </div>
                          </div>
                          <div className="col-lg-3 col-md-4 col-sm-6 mb-2">
                            <div className={styles.accordionLabel}>
                              Password:
                            </div>
                            <div className={styles.accordionValue}>
                              {currentProfile.personalDetails.password}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bank Details */}
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="payoutBankHeading">
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#payoutBankCollapse"
                        aria-expanded="false"
                        aria-controls="payoutBankCollapse"
                      >
                        Bank Details
                      </button>
                    </h2>
                    <div
                      id="payoutBankCollapse"
                      className="accordion-collapse collapse"
                      aria-labelledby="payoutBankHeading"
                    >
                      <div
                        className={`accordion-body ${styles.accordionContent}`}
                      >
                        <div className="row">
                          <div className="col-lg-3 col-md-4 col-sm-6 mb-2">
                            <div className={styles.accordionLabel}>
                              Acquirer Pass:
                            </div>
                            <div className={styles.accordionValue}>
                              {currentProfile.bankDetails.acquirerPass}
                            </div>
                          </div>
                          <div className="col-lg-3 col-md-4 col-sm-6 mb-2">
                            <div className={styles.accordionLabel}>
                              Merchant ID/Outlet:
                            </div>
                            <div className={styles.accordionValue}>
                              {currentProfile.bankDetails.merchantIdOutlet}
                            </div>
                          </div>
                          <div className="col-lg-3 col-md-4 col-sm-6 mb-2">
                            <div className={styles.accordionLabel}>
                              Token/Encryption Key:
                            </div>
                            <div className={styles.accordionValue}>
                              {currentProfile.bankDetails.tokenEncryptionKey}
                            </div>
                          </div>
                          <div className="col-lg-3 col-md-4 col-sm-6 mb-2">
                            <div className={styles.accordionLabel}>
                              Username:
                            </div>
                            <div className={styles.accordionValue}>
                              {currentProfile.bankDetails.username}
                            </div>
                          </div>
                          <div className="col-lg-3 col-md-4 col-sm-6 mb-2">
                            <div className={styles.accordionLabel}>
                              Client ID:
                            </div>
                            <div className={styles.accordionValue}>
                              {currentProfile.bankDetails.clientId}
                            </div>
                          </div>
                          <div className="col-lg-3 col-md-4 col-sm-6 mb-2">
                            <div className={styles.accordionLabel}>
                              Client Secret:
                            </div>
                            <div className={styles.accordionValue}>
                              {currentProfile.bankDetails.clientSecret}
                            </div>
                          </div>
                          <div className="col-lg-3 col-md-4 col-sm-6 mb-2">
                            <div className={styles.accordionLabel}>
                              Client Comp Code:
                            </div>
                            <div className={styles.accordionValue}>
                              {currentProfile.bankDetails.clientCompCode}
                            </div>
                          </div>
                          <div className="col-lg-3 col-md-4 col-sm-6 mb-2">
                            <div className={styles.accordionLabel}>
                              Cert Password Code:
                            </div>
                            <div className={styles.accordionValue}>
                              {currentProfile.bankDetails.certPasswordCode}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Virtual Accounts */}
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="payoutVirtualHeading">
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#payoutVirtualCollapse"
                        aria-expanded="false"
                        aria-controls="payoutVirtualCollapse"
                      >
                        Virtual Account
                      </button>
                    </h2>
                    <div
                      id="payoutVirtualCollapse"
                      className="accordion-collapse collapse"
                      aria-labelledby="payoutVirtualHeading"
                    >
                      <div
                        className={`accordion-body ${styles.accordionContent}`}
                      >
                        <div className="row">
                          <div className="col-lg-3 col-md-4 col-sm-6 mb-2">
                            <div className={styles.accordionLabel}>VPA:</div>
                            <div className={styles.accordionValue}>
                              {currentProfile.virtualAccount.vpa}
                            </div>
                          </div>
                          <div className="col-lg-3 col-md-4 col-sm-6 mb-2">
                            <div className={styles.accordionLabel}>
                              Bank Code:
                            </div>
                            <div className={styles.accordionValue}>
                              {currentProfile.virtualAccount.bankCode}
                            </div>
                          </div>
                          <div className="col-lg-3 col-md-4 col-sm-6 mb-2">
                            <div className={styles.accordionLabel}>
                              ACQR Bank Code:
                            </div>
                            <div className={styles.accordionValue}>
                              {currentProfile.virtualAccount.acqrBankCode}
                            </div>
                          </div>
                          <div className="col-lg-3 col-md-4 col-sm-6 mb-2">
                            <div className={styles.accordionLabel}>
                              Channel ID:
                            </div>
                            <div className={styles.accordionValue}>
                              {currentProfile.virtualAccount.channelId}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Token Details */}
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="payoutTokenHeading">
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#payoutTokenCollapse"
                        aria-expanded="false"
                        aria-controls="payoutTokenCollapse"
                      >
                        Token Details
                      </button>
                    </h2>
                    <div
                      id="payoutTokenCollapse"
                      className="accordion-collapse collapse"
                      aria-labelledby="payoutTokenHeading"
                    >
                      <div
                        className={`accordion-body ${styles.accordionContent}`}
                      >
                        <div className="row">
                          <div className="col-lg-3 col-md-4 col-sm-6 mb-2">
                            <div className={styles.accordionLabel}>
                              Access Token:
                            </div>
                            <div className={styles.accordionValue}>
                              {currentProfile.tokenDetails.accessToken}
                            </div>
                          </div>
                          <div className="col-lg-3 col-md-4 col-sm-6 mb-2">
                            <div className={styles.accordionLabel}>
                              Expires:
                            </div>
                            <div className={styles.accordionValue}>
                              {currentProfile.tokenDetails.expires}
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
    </div>
  );
};

export default PayoutProfiles;
