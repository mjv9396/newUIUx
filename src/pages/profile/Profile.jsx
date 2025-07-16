import DashboardLayout from "../../layouts/DashboardLayout";
import styles from "../../styles/profile/Profile.module.css";
import avatar from "../../assets/avatar.png";
import useFetch from "../../hooks/useFetch";
import { useEffect, useState } from "react";
import { endpoints } from "../../services/apiEndpoints";
import Loading from "../errors/Loading";
import Error from "../errors/Error";
import { GetUserRole } from "../../services/cookieStore";
const Profile = () => {
  //Fetch current user data
  const { fetchData, data, error, loading } = useFetch();
  useEffect(() => {
    fetchData(endpoints.user.profile);
  }, []);

  //   initialize a formdata
  useEffect(() => {
    if (data) setFormData(data.data);
  }, [data]);
  const [formData, setFormData] = useState({});

  if (loading) return <Loading />;
  if (error) return <Error error={error} />;
  if (data) {
    return (
      <DashboardLayout page="My Profile" url="/dashboard/profile">
        <div className={styles.maincard}>
          <div className="row">
            <div
              className="col-md-6 col-sm-12"
              style={{ borderRight: "3px dashed gray" }}
            >
              <div className={styles.info}>
                <img src={avatar} alt="profile-image" loading="lazy" />
                <span className="d-flex flex-column">
                  <h5>
                    {formData.firstName} {formData.lastName}{" "}
                    {formData.userAccountState === "ACTIVE" ? (
                      <i
                        className="bi bi-patch-check-fill text-success"
                        title="active"
                      ></i>
                    ) : (
                      <i
                        className="bi bi-exclamation-circle-fill text-bg-danger"
                        title="Inactive"
                      ></i>
                    )}
                  </h5>

                  <span className={styles.designation}>{formData.role}</span>
                  <span className={styles.employeeid}>
                    APP ID: <code> {formData.appId || "NA"}</code>
                  </span>
                  <span className={styles.employeeid}>
                    SECRET KEY: <code>{formData.secretkey || "NA"}</code>
                  </span>
                </span>
              </div>
            </div>
            <div className="col-md-6 col-sm-12">
              <div className={styles.detail}>
                <table className="table table-borderless table-sm">
                  <thead className="hidden">
                    <tr>
                      <th></th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Username:</td>
                      <td>{formData.username || "NA"} </td>
                    </tr>
                    <tr>
                      <td>Phone:</td>
                      <td>
                        {formData.phoneNumber || "NA"}{" "}
                        {formData.phoneVerificationState && (
                          <i className="bi bi-patch-check-fill text-success"></i>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td>Email:</td>
                      <td>
                        {formData.email || "NA"}{" "}
                        {formData.emailVerificationState && (
                          <i className="bi bi-patch-check-fill text-success"></i>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td>Address:</td>
                      <td>{formData.address || "NA"}</td>
                    </tr>
                    <tr>
                      <td>Pancard:</td>
                      <td>{formData.panCard || "NA"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        {GetUserRole() !== "ADMIN" && (
          <div className="row">
            <div className="col-md-6 col-sm-12 mb-4">
              <div className={styles.secondaryCard}>
                <div className="d-flex justify-content-between align-items-center">
                  <h6>Business Details</h6>
                </div>
                <div className="row p-2">
                  <div className="col-12">
                    <table
                      className="table table-borderless table-sm"
                      id={styles.table}
                    >
                      <thead className="hidden">
                        <tr>
                          <th></th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style={{ width: 180 }}>Business Name</td>
                          <td>{formData.businessName || "NA"}</td>
                        </tr>
                        <tr>
                          <td style={{ width: 180 }}>Business</td>
                          <td>{formData.business || "NA"}</td>
                        </tr>
                        <tr>
                          <td style={{ width: 180 }}>Business Modal</td>
                          <td>{formData.businessModel || "NA"}</td>
                        </tr>
                        <tr>
                          <td style={{ width: 180 }}>Industry Category</td>
                          <td>{formData.industryCategory || "NA"}</td>
                        </tr>
                        <tr>
                          <td style={{ width: 180 }}>Industry Sub-Category</td>
                          <td>{formData.industrySubCategory || "NA"}</td>
                        </tr>
                        <tr>
                          <td style={{ width: 180 }}>Company Profile</td>
                          <td>{formData.companyprof || "NA"}</td>
                        </tr>
                        <tr>
                          <td>PAN Card</td>
                          <td>{formData.panCard || "NA"}</td>
                        </tr>
                        <tr>
                          <td>GST Number</td>
                          <td>{formData.gstNumber || "NA"}</td>
                        </tr>
                        <tr>
                          <td>CIN</td>
                          <td>{formData.cin || "NA"}</td>
                        </tr>
                        <tr>
                          <td>TAN</td>
                          <td>{formData.tan || "NA"}</td>
                        </tr>
                        <tr>
                          <td>Operational Address</td>
                          <td>
                            {formData.operationAddress || "NA"}{" "}
                            {formData.operationState} {formData.operationCity}{" "}
                            {formData.operationPostalCode}
                          </td>
                        </tr>
                        <tr>
                          <td>Website</td>
                          <td>{formData.website || "NA"}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-sm-12 mb-4">
              <div className="row mb-2">
                <div className={styles.secondaryCard}>
                  <div className="d-flex justify-content-between align-items-center">
                    <h6>Bank Details</h6>
                  </div>
                  <div className="row p-2">
                    <div className="col-12">
                      <table
                        className="table table-borderless table-sm"
                        id={styles.table}
                      >
                        <thead className="hidden">
                          <tr>
                            <th></th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Account Number</td>
                            <td>{formData.accountNo || "NA"}</td>
                          </tr>
                          <tr>
                            <td>Account Holder Name</td>
                            <td>{formData.accHolderName || "NA"}</td>
                          </tr>
                          <tr>
                            <td>Bank Name</td>
                            <td>{formData.bankName || "NA"}</td>
                          </tr>
                          <tr>
                            <td>Branch Name</td>
                            <td>{formData.branchName || "NA"}</td>
                          </tr>
                          <tr>
                            <td>IFSC Code</td>
                            <td>{formData.ifscCode || "NA"}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className={styles.secondaryCard}>
                  <div className="d-flex justify-content-between align-items-center">
                    <h6>Payout Details</h6>
                  </div>
                  <div className="row p-2">
                    <div className="col-12">
                      <table
                        className="table table-borderless table-sm"
                        id={styles.table}
                      >
                        <thead className="hidden">
                          <tr>
                            <th></th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Account Balance</td>
                            <td>{formData.accountBalance || "NA"}</td>
                          </tr>
                          <tr>
                            <td>Transaction Limit</td>
                            <td>{formData.payoutTxnLimit || "NA"}</td>
                          </tr>
                          <tr>
                            <td>Benificary Limit</td>
                            <td>{formData.payoutBenificaryLimit || "NA"}</td>
                          </tr>
                          <tr>
                            <td>Higher Amount Limit</td>
                            <td>{formData.payoutHigherAmountLimit || "NA"}</td>
                          </tr>
                          <tr>
                            <td>Higher Amount Count Limit</td>
                            <td>
                              {formData.payoutHigerAmountCountLimit || "NA"}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </DashboardLayout>
    );
  }
};

export default Profile;
