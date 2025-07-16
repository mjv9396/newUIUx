/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import useFetch from "../../hooks/useFetch";
import usePost from "../../hooks/usePost";
import DashboardLayout from "../../layouts/DashboardLayout";
import { endpoints } from "../../services/apiEndpoints";
import styles from "../../styles/common/Add.module.css";
import classes from "../../styles/common/List.module.css";
import Error from "../errors/Error";
import Loading from "../errors/Loading";

import { resellerMappingForm } from "../../forms/auth";
import { validateResellerMappingForm } from "../../formValidations/resellerMappingForm";
import useDelete from "../../hooks/useDelete";
import { errorMessage, successMessage } from "../../utils/messges";
const pagesize = 25;
const ResellerMapping = () => {
  const formRef = useRef(null);
  const [sucessAction, setSuccessAction] = useState(false);
  const {
    fetchData: getAllMerchant,
    data: allMerchant,
    error: merchantError,
    loading: merchantLoading,
  } = useFetch();
  const {
    postData: getAllReseller,
    data: allReseller,
    error: resellerError,
    loading: resellerLoading,
  } = usePost(endpoints.user.resellerlist);
  const {
    data: resellerMapping,
    postData: getResellerMapping,
    error: resellerMappingError,
  } = usePost(endpoints.user.resellerMappingList);
  useEffect(() => {
    getAllMerchant(endpoints.user.userList);
    getAllReseller({ keyword: "", start: 0, size: 1000 });
  }, []);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentReseller, setCurrentReseller] = useState("");
  const [keyword, setKeyword] = useState("");
  useEffect(() => {
    getResellerMapping({ keyword: keyword, userId: currentReseller });
  }, [keyword, sucessAction, currentReseller]);
  //form handlers
  const [formData, setFormData] = useState(resellerMappingForm);
  const [errors, setErrors] = useState({});
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "resellerId") {
      setCurrentReseller(value);
    }
    setFormData({ ...formData, [name]: value });
  };
  const { postData, data, error, loading } = usePost(
    endpoints.user.resellerMapping
  );
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateResellerMappingForm(formData);
    if (Object.keys(validationError).length > 0) {
      setErrors(validationError);
      return;
    }
    await postData(formData);
  };
  useEffect(() => {
    if (data && !error) {
      if (data.statusCode === 400) {
        errorMessage(data?.data || "Reseller Mapping already exists");
        return;
      }
      successMessage(data?.data || "Reseller Mapping added successfully");
      setFormData(resellerMappingForm);
      setErrors({});
      setSuccessAction(!sucessAction);
    }
  }, [error, data]);

  const handleKeyword = (e) => setKeyword(e.target.value);
  const handlePrev = () => {
    setCurrentPage((prev) => prev - 1);
  };
  const handleNext = () => {
    setCurrentPage((prev) => prev + 1);
  };

  // Delete handler
  const { deleteData, data: deleteReseller, error: deleteError } = useDelete();
  const handleDelete = async (id) => {
    await deleteData(endpoints.user.resellerMapping + "/" + id);
  };
  useEffect(() => {
    if (deleteReseller && !deleteError) {
      successMessage("Reseller Mapping Deleted Successfully");
      setSuccessAction(!sucessAction);
    }
  }, [deleteReseller, deleteError]);

  if (merchantLoading || resellerLoading)
    return <Loading loading="Loading Merchant, Reseller" />;
  if (merchantError) return <Error error="Error loading Merchants" />;
  if (resellerError) return <Error error="Error loading Reseller" />;
  if (resellerMappingError)
    return <Error error="Error loading Reseller Mapping" />;

  if (allMerchant && allReseller) {
    return (
      <DashboardLayout
        page="Reseller Mapping"
        url="/dashboard/reseller-mapping"
      >
        <div className={styles.listing}>
          <div className={styles.form}>
            <form onSubmit={handleSubmit} ref={formRef}>
              <div className="d-flex flex-wrap gap-3 align-items-center">
                <div className={styles.input}>
                  <label htmlFor="acqCode">
                    Reseller <span className="required">*</span>
                  </label>
                  <select
                    name="resellerId"
                    id="resellerId"
                    onChange={handleChange}
                    defaultValue=""
                    required
                  >
                    <option value="">--Select Reseller--</option>
                    {allReseller.data.content.length > 0 ? (
                      allReseller.data.content.map((item) => (
                        <option key={item.userId} value={item.userId}>
                          {item.firstName} {item.lastName}
                        </option>
                      ))
                    ) : (
                      <option>No reseller added</option>
                    )}
                  </select>
                  {errors.resellerId && (
                    <span className="errors">{errors.resellerId}</span>
                  )}
                </div>
                <div className={styles.input}>
                  <label htmlFor="merchantId">
                    Merchant <span className="required">*</span>
                  </label>
                  <select
                    name="merchantId"
                    id="merchantId"
                    onChange={handleChange}
                    defaultValue=""
                    required
                  >
                    <option value="">--Select Merchant--</option>
                    {allMerchant.data.length > 0 ? (
                      allMerchant.data.map((item) => (
                        <option key={item.userId} value={item.userId}>
                          {item.firstName} {item.lastName}
                        </option>
                      ))
                    ) : (
                      <option>No merchant added</option>
                    )}
                  </select>
                  {errors.merchantId && (
                    <span className="errors">{errors.merchantId}</span>
                  )}
                </div>
                <div className="d-flex gap-3 mt-2 mb-2 justify-content-end">
                  <button
                    className={
                      !loading
                        ? styles.submit + " " + styles.active
                        : styles.submit
                    }
                    type="submit"
                  >
                    {loading ? "Loading..." : "Map"}
                  </button>
                  <button
                    className={styles.clear}
                    type="reset"
                    onClick={() => setFormData(resellerMappingForm)}
                  >
                    clear
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className={classes.listing}>
          <div className={classes.filter}>
            <input
              type="search"
              placeholder="Search by reseller name"
              onChange={handleKeyword}
            />
          </div>
          <div className={classes.table}>
            <div style={{ overflowX: "auto" }}>
              <table className="table table-responsive-sm">
                <thead>
                  <tr>
                    <th>Reseller Name</th>
                    <th>Reseller Email</th>
                    <th>Reseller Phone No.</th>
                    <th>Reseller Business Name</th>
                    <th>Merchant Name</th>
                    <th>Merchant Email</th>
                    <th>Merchant Phone No.</th>
                    <th>Merchant Business Name</th>
                    <th style={{ minWidth: 50 }}>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {resellerMapping?.data.content.length > 0 ? (
                    resellerMapping?.data.content.map((item) => (
                      <tr key={item.resellerMerchantId}>
                        <td>
                          {item.resellerFirstName + item.resellerLastName}
                        </td>
                        <td>{item.resellerEmail}</td>
                        <td>{item.resellerPhoneNumber}</td>
                        <td>{item.resellerBusinessName}</td>
                        <td>
                          {item.merchantFirstName + item.merchantLastName}
                        </td>
                        <td>{item.merchantEmail}</td>
                        <td>{item.merchantPhoneNumber}</td>
                        <td>{item.merchantBusinessName}</td>
                        <td>
                          <i
                            className="bi bi-trash2-fill text-danger"
                            onClick={() =>
                              handleDelete(item.resellerMerchantId)
                            }
                          ></i>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8}>No Data Found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className={classes.pagination}>
              <button
                className={classes.btn}
                id={classes.prev}
                onClick={handlePrev}
                disabled={currentPage === 0}
              >
                Prev
              </button>
              <span>
                Result{" "}
                {resellerMapping?.data.totalElement === 0
                  ? currentPage
                  : currentPage * pagesize + 1}
                -
                {(currentPage + 1) * pagesize <
                resellerMapping?.data.totalElements
                  ? (currentPage + 1) * pagesize
                  : resellerMapping?.data.totalElements}{" "}
                of Total {resellerMapping?.data.totalElements}
              </span>
              <button
                className={classes.btn}
                id={classes.next}
                onClick={handleNext}
                disabled={
                  (currentPage + 1) * pagesize >=
                  resellerMapping?.data.totalElements
                }
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }
};

export default ResellerMapping;
