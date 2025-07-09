import useGetRequest from "@/app/hooks/useFetch";
import styles from "../page.module.css";
import { useEffect, useState } from "react";
import { endPoints } from "@/app/services/apiEndpoints";
import AddBank from "../modals/AddBank";
import UpdateBusiness from "../modals/UpdateBusiness";
import ViewLogo from "../documents/viewLogo";
import UpdateBank from "../modals/UpdateBank";

const Business = ({ name, id, role, loginLogo, brandLogo, pageLogo }) => {
  const [logoId, setLogoId] = useState(null);


  // Request for business details
  const {
    error: errorBusiness,
    response: responseBusiness,
    getData: getBusinessDetail,
  } = useGetRequest();
  const [successEdit, setSuccessEdit] = useState(null);
  useEffect(() => {
    getBusinessDetail(
      endPoints.users.user + endPoints.users.account["business"] + "/" + id
    );
  }, [successEdit]);
  // Request to fetch bank details
  const {
    error: errorBank,
    response: responseBank,
    getData: getBankDetail,
  } = useGetRequest();
  useEffect(() => {
    getBankDetail(
      endPoints.users.user + endPoints.users.account["bank"] + "/" + id
    );
  }, [successEdit]);
  const [viewAddBankModal, setViewAddBankModal] = useState(false);
  const [viewUpdateBankModal, setViewUpdateBankModal] = useState(false);
  const [viewUpdateBusinessModal, setViewUpdateBusinessModal] = useState(false);
  const handleViewUpdateBusiness = () => {
    setViewUpdateBusinessModal(true);
  };

  // Conditional rendering of page on fetched data
  if (errorBusiness || errorBank) {
    return (
      <p className="text-center">
        Something went wrong while fetching data. Please refresh the browser.
      </p>
    );
  }

  return (
    <>
      
      {viewAddBankModal && (
        <AddBank
          name={name}
          id={id}
          onSuccess={() => setSuccessEdit(!successEdit)}
          onClose={() => setViewAddBankModal(!viewAddBankModal)}
        />
      )}
      {viewUpdateBankModal && (
        <UpdateBank
          name={name}
          id={id}
          onSuccess={() => setSuccessEdit(!successEdit)}
          responseBank={responseBank?.data?.[0]}
          onClose={() => setViewUpdateBankModal(!viewUpdateBankModal)}
        />
      )}
      {viewUpdateBusinessModal && (
        <UpdateBusiness
          name={name}
          id={id}
          onSuccess={() => setSuccessEdit(!successEdit)}
          responseBusiness={responseBusiness?.data}
          onClose={() => setViewUpdateBusinessModal(!viewUpdateBusinessModal)}
        />
      )}
      <div className="row">
        <div className="col-12 mb-4">
          <div className={styles.secondaryCard}>
            <div className="d-flex justify-content-between align-items-center">
              <h6>Business Details</h6>
              <i
                className="bi bi-pencil-fill"
                id={styles.editicon}
                onClick={handleViewUpdateBusiness}
              ></i>
            </div>
            <div className="row p-2">
              <div className="col-md-6">
                <table
                  className="table table-borderless table-sm"
                  id={styles.infotable}
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
                      <td>{responseBusiness?.data.businessName || "-"}</td>
                    </tr>
                    <tr>
                      <td>Registration No</td>
                      <td>
                        {responseBusiness?.data.companyRegistrationNo || "-"}
                      </td>
                    </tr>
                    <tr>
                      <td>Email Id</td>
                      <td>{responseBusiness?.data.businessEmail || "-"}</td>
                    </tr>
                    <tr>
                      <td>Phone</td>
                      <td style={{ color: "#82ca9d" }}>
                        {responseBusiness?.data.phone || "-"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="col-md-6">
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
                      <td>Address</td>
                      <td>{responseBusiness?.data.businessAddress || "-"}</td>
                    </tr>
                    <tr>
                      <td>Website</td>
                      <td>{responseBusiness?.data.websiteUrl || "-"}</td>
                    </tr>
                    <tr>
                      <td>PAN/SSN</td>
                      <td>{responseBusiness?.data.panSsn || "-"}</td>
                    </tr>
                    <tr>
                      <td>GST/VAT</td>
                      <td>{responseBusiness?.data.gstVat || "-"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12 mb-4">
          <div className={styles.secondaryCard}>
            <div className="d-flex justify-content-between align-items-center">
              <h6>Bank Details 
                {/* <span className="text-success">
                  ( Available Balance : )
                </span> */}
              </h6>

              {JSON.stringify(responseBank)}

              {role && responseBank?.data?.length <1 || !responseBank?.data ? (
                <i
                  className="bi bi-plus-lg"
                  title="Add Bank"
                  onClick={() => setViewAddBankModal(true)}
                  id={styles.editicon}
                ></i>
              ):
              (
                <i
                  className="bi bi-pencil-fill"
                  id={styles.editicon}
                  onClick={() => setViewUpdateBankModal(true)}
                ></i>
              )}
            </div>
            <div className="row p-2">
              <div className="col-12 overflow-auto">
                {responseBank?.data === null && (
                  <small className="text-center">No Bank Data Available</small>
                )}
                {responseBank?.data && responseBank?.data.length > 0 && (
                  <table className="table table-sm" id={styles.table}>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Branch</th>
                        <th>Account Number</th>
                        <th>IFSC Code</th>
                        <th>Card Number</th>
                        <th>VPA</th>
                      </tr>
                    </thead>
                    <tbody>
                      {responseBank?.data !== null &&
                        responseBank?.data.length > 0 &&
                        responseBank?.data.map((bank) => (
                          <tr key={bank.bankDetailId}>
                            <td>{bank.bankName}</td>
                            <td>{bank.branchName}</td>
                            <td>{bank.bankAccountNumber}</td>
                            <td>{bank.ifscCode}</td>
                            <td>{bank.cardNumber}</td>
                            <td>{bank.vpa}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Business;
