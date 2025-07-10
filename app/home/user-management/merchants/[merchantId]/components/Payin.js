import { useEffect, useState } from "react";
import styles from "../page.module.css";
import AddTdr from "../modals/AddTdr";
import AddAmountLimit from "../modals/AddAmountLimit";
import useGetRequest from "@/app/hooks/useFetch";
import { endPoints } from "@/app/services/apiEndpoints";
import useDeleteRequest from "@/app/hooks/useDelete";
import DeleteWarning from "@/app/ui/modals/DeleteWarning";
import { successMsg } from "@/app/services/notify";
import Label from "@/app/ui/label/Label";
import usePostRequest from "@/app/hooks/usePost";
import UpdatePriority from "../modals/UpdatePriority";
import UpdatePayInTdr from "../modals/UpdatePayInTdr";
const Payin = ({ name, id }) => {
  const [active, setActive] = useState(1);
  const [viewAddTdrModal, setViewAddTdrModal] = useState(false);
  const [viewAddAmtLimitModal, setViewAddAmtLimitModal] = useState(false);
  const [viewEdit, setViewEdit] = useState(false);
  const [updateData, setUpdateData] = useState([]);
  const [successAction, setSuccessAction] = useState(false);
  const [viewPriorityModal, setViewPriorityModal] = useState(false);
  const {
    getData: getAllAcquirer,
    response: acquirers = [],
    error: acquirerError,
    loading: acquirersLoading,
  } = useGetRequest();
  useEffect(() => {
    getAllAcquirer(endPoints.mapping.merchantAcquirer + id);
  }, [successAction]);

  useEffect(() => {
    if (
      acquirers &&
      !acquirerError &&
      acquirers.data &&
      acquirers?.data?.length > 0
    ) {
      postData({ merchantId: id, acquirerId: acquirers.data[0].userId });
    }
  }, [acquirers]);
  // Logic to get All payment Type details using acquirer
  const [paymentDetails, setPaymentDetails] = useState([]);
  const {
    postData,
    error,
    loading,
    response = [],
  } = usePostRequest(endPoints.mapping.merchantTdrPaymentDetail);

  const [paymentType, setPaymentType] = useState();
  const [mopType, setMopType] = useState([]);
  const handlePaymentTypeDetail = async (acquirerId) => {
    await postData({ merchantId: id, acquirerId });
    setPaymentType([]);
    setMopType([]);
  };

  useEffect(() => {
    if (response && !error) {
      setMopType(response.data.data[0] ? response.data.data[0].mopType : []);
    }
  }, [response, error]);
  // handle Mop Type on selecting payment type
  const handleActivePaymentType = (mopType, active) => {
    setMopType(mopType);
    setActive(active);
  };
  const [activeMop, setActiveMop] = useState(false);
  const handleActiveMopType = (index) => {
    setActiveMop(index);
  };

  const {
    getData: getAllMinAmtLimit,
    error: minAmtLimitError,
    response: minAmtLimitResponse = [],
  } = useGetRequest();
  useEffect(() => {
    getAllMinAmtLimit(endPoints.mapping.minAmtLimit + "/" + id);
  }, []);

  // Logics for deleting data
  const [viewDeleteWarning, setViewDeleteWarning] = useState(false);
  const [merchantChargeId, setMerchantChargeId] = useState([]);
  const handleViewDeleteWarning = (id) => {
    setViewDeleteWarning(true);
    setMerchantChargeId(id);
  };
  const handleViewUpdatePayInTdr = (data) => {
    setViewEdit(true);
    setUpdateData(data);
  };
  const {
    response: deleteResponse,
    error: deleteError,
    loading: deleteLoading,
    deleteData,
  } = useDeleteRequest();

  const handleConfirmDelete = async () => {
    await deleteData(endPoints.mapping.deleteMerchantTdr + merchantChargeId);
  };
  useEffect(() => {
    if (deleteResponse && !deleteError) {
      successMsg("Delete Successfully");
      setViewDeleteWarning(false);
      setMerchantChargeId(null);
    }
  }, [deleteResponse, deleteError]);

  // if (minAmtLimitLoading) return <p className="text-center">Loading...</p>;
  // if (minAmtLimitError)
  //   return (
  //     <p className="text-center">
  //       Error: {error.message || "Something Went Wrong"}
  //     </p>
  //   );

  return (
    <>
      {viewAddTdrModal && (
        <AddTdr
          name={name}
          id={id}
          onClose={() => setViewAddTdrModal(!viewAddTdrModal)}
          onSuccess={() => setSuccessAction(!successAction)}
        />
      )}
      {viewAddAmtLimitModal && (
        <AddAmountLimit
          name={name}
          id={id}
          onSuccess={() =>
            getAllAcquirer(endPoints.mapping.merchantAcquirer + id)
          }
          onClose={() => {
            setViewAddAmtLimitModal(!viewAddAmtLimitModal);
            getAllMinAmtLimit(endPoints.mapping.minAmtLimit + "/" + id);
          }}
          data={minAmtLimitResponse?.data}
        />
      )}
      {viewDeleteWarning && (
        <DeleteWarning
          onClose={() => setViewDeleteWarning(!viewDeleteWarning)}
          onConfirm={handleConfirmDelete}
        />
      )}
      {viewEdit && (
        <UpdatePayInTdr
          updateData={updateData}
          onSuccess={() => setSuccessAction(!successAction)}
          onClose={() => setViewEdit(!viewEdit)}
        />
      )}
      {viewPriorityModal && (
        <UpdatePriority
          acquirerList={acquirers?.data}
          onClose={() => setViewPriorityModal(!viewPriorityModal)}
        />
      )}
      <div className="row">
        <div className="col-12 mb-4">
          <div className={styles.secondaryCard}>
            <div className="d-flex justify-content-between align-items-center">
              <h6 className="d-flex gap-2">
                TDR Settings
                {/* pencil  */}
                <span>
                  <i
                    onClick={() => setViewPriorityModal(!viewPriorityModal)}
                    className="bi bi-pencil-square"
                    id={styles.editicon}
                  ></i>
                </span>
              </h6>
              <i
                className="bi bi-plus-lg"
                id={styles.editicon}
                onClick={() => setViewAddTdrModal(true)}
              ></i>
            </div>
            <div className="row p-2">
              {(acquirers?.data === null || acquirers?.data?.length === 0) && (
                <div className="col-12 text-center">
                  <small className="text-center">Add Details to view</small>
                </div>
              )}
              {acquirers?.data?.length > 0 && (
                <>
                  <div className="d-flex gap-4 mb-2">
                    {acquirers?.data.map((acquirer, index) => (
                      <div
                        className="d-flex align-items-center gap-1"
                        key={acquirer.userId}
                      >
                        <input
                          type="radio"
                          name="acquirer"
                          id={acquirer.userId}
                          defaultChecked={index === 0}
                          onChange={() =>
                            handlePaymentTypeDetail(acquirer.userId)
                          }
                        />
                        <Label htmlFor="" label={acquirer.fullName} />{" "}
                        <sup>P-{acquirer.priority}</sup>
                      </div>
                    ))}
                  </div>
                  <div className="row">
                    <div className="col-md-2 col-sm-12 d-flex flex-column">
                      {response?.data.data.map((paymentType, index) => (
                        <button
                          className={
                            active === index + 1
                              ? styles.paymentcard + " " + styles.active
                              : styles.paymentcard
                          }
                          onClick={() =>
                            handleActivePaymentType(
                              paymentType.mopType,
                              index + 1
                            )
                          }
                          key={paymentType.paymentTypeId}
                        >
                          {paymentType.paymentTypeName}
                        </button>
                      ))}
                    </div>
                    <div className="col-md-10 col-sm-12">
                      <div className="accordion" id="accordionExample">
                        {mopType?.length > 0 &&
                          mopType.map((type, index) => (
                            <div
                              className="accordion-item"
                              key={type.mopTypeId}
                            >
                              <h2
                                className="accordion-header"
                                id={`headingOne${index}`}
                              >
                                <button
                                  className={
                                    index === 0
                                      ? `accordion-button`
                                      : `accordion-button collapsed`
                                  }
                                  type="button"
                                  data-bs-toggle="collapse"
                                  data-bs-target={`#collapseOne${index}`}
                                  aria-expanded="true"
                                  aria-controls={`collapseOne${index}`}
                                  onClick={handleActiveMopType}
                                >
                                  {type.mopTypeName}
                                  <span>({type.mopTypeCode})</span>
                                </button>
                              </h2>
                              <div
                                id={`collapseOne${index}`}
                                className={
                                  index === 0
                                    ? `accordion-collapse collapse show`
                                    : `accordion-collapse collapse`
                                }
                                aria-labelledby="headingOne"
                                data-bs-parent={`collapseOne${index}`}
                              >
                                <div className="accordion-body">
                                  <table className="table" id={styles.table}>
                                    <thead>
                                      <tr>
                                        <th>PG Charges</th>
                                        <th>Bank Charges</th>
                                        <th>Merchant Charge</th>
                                        <th>Vendor Charge</th>
                                        <th>Min Amount Limit</th>
                                        <th>Max Amount Limit</th>
                                        <th>Action</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {type.merchantCharges.map(
                                        (charge, index) => (
                                          <tr key={charge?.merchantChargeId}>
                                            <td>{charge?.pgCharge ?? 0}{!charge?.fixCharge && "%"}</td>
                                            <td>{charge?.bankCharge ?? 0} {!charge?.fixCharge && "%"}</td>
                                            <td>{charge?.merchantCharge ?? 0} {!charge?.fixCharge && "%"}</td>
                                            <td>{charge?.vendorCharge ?? 0} {!charge?.fixCharge && "%"}</td>
                                            <td>
                                              {charge?.minimumAmountLimit}
                                            </td>
                                            <td>
                                              {charge?.maximumAmountLimit}
                                            </td>
                                            <td>
                                              <div className="d-flex gap-1">
                                                <i
                                                  style={{ cursor: "pointer" }}
                                                  onClick={() =>
                                                    handleViewUpdatePayInTdr(
                                                      charge
                                                    )
                                                  }
                                                  className="bi bi-pencil"
                                                ></i>
                                                {index !== 0 && (
                                                  <i
                                                    style={{
                                                      cursor: "pointer",
                                                    }}
                                                    onClick={() =>
                                                      handleViewDeleteWarning(
                                                        charge?.merchantChargeId
                                                      )
                                                    }
                                                    className="bi bi-trash text-danger"
                                                  ></i>
                                                )}
                                              </div>
                                            </td>
                                          </tr>
                                        )
                                      )}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <div className={styles.secondaryCard}>
            <div className="d-flex justify-content-between align-items-center">
              <h6>Amount Limit</h6>
              {minAmtLimitResponse?.data ? (
                <i
                  className="bi bi-pencil"
                  id={styles.editicon}
                  onClick={() => setViewAddAmtLimitModal(true)}
                ></i>
              ) : (
                <i
                  className="bi bi-pencil"
                  id={styles.editicon}
                  onClick={() => setViewAddAmtLimitModal(true)}
                ></i>
              )}
            </div>

            <div className="row p-2">
              <div className="col-12 text-center overflow-auto">
                {!minAmtLimitResponse?.data && (
                  <small className="text-center">Add Details to view</small>
                )}
                {minAmtLimitResponse?.data && (
                  <table
                    className="table table-responsive-sm overflow-auto"
                    id={styles.table}
                  >
                    <thead>
                      <tr>
                        {/* <th>Merchant</th> */}

                        <th>Daily Count Limit</th>
                        <th>Daily Amount Limit</th>

                        <th>Minimum Amount Limit / Txn</th>
                        <th style={{ whiteSpace: "nowrap" }}>
                          Maximum Amount Limit / Txn{" "}
                        </th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr key={minAmtLimitResponse.data.amountLimitId}>
                        {/* <td>
                          {minAmtLimitResponse.data?.merchant?.fullName || "-"}
                        </td> */}

                        <td>{minAmtLimitResponse.data.dailyCountLimit || 0}</td>
                        <td>
                          {minAmtLimitResponse.data.dailyAmountLimit || 0}
                        </td>
                        <td>
                          {minAmtLimitResponse.data.minimumAmountPerTxn || 0}
                        </td>
                        <td>
                          {minAmtLimitResponse.data.maximumAmountPerTxn || 0}
                        </td>

                        <td className="d-flex gap-1 justify-content-center">
                          <button
                            disabled={deleteLoading}
                            className="table_delete"
                            onClick={() =>
                              handleViewDeleteWarning(
                                minAmtLimitResponse.data.amountLimitId,
                                index
                              )
                            }
                          >
                            <i className="bi bi-trash-fill text-danger"></i>
                            <small>Delete</small>
                          </button>
                        </td>
                      </tr>
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

export default Payin;
