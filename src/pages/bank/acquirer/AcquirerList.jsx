import { useEffect, useState } from "react";
import useFetch from "../../../hooks/useFetch";
import styles from "../../../styles/common/List.module.css";
import { endpoints } from "../../../services/apiEndpoints";
import Loading from "../../errors/Loading";
import Error from "../../errors/Error";
import usePost from "../../../hooks/usePost";
import { successMessage } from "../../../utils/messges";
import { addAcquirer } from "../../../forms/payin";
const AcquirerList = () => {
  const { fetchData, data, error, loading } = useFetch();
  useEffect(() => {
    fetchData(endpoints.payin.acquirerList);
  }, []);

  // Update acquirer profile logic
  // API handlers
  const {
    postData: updateAcquirer,
    data: updateAcquirerData,
    error: updateAcquirerError,
  } = usePost(endpoints.payin.addAcquirer);
  // Change status
  const handleChangeStatus = async (item) => {
    item.isActive = item.isActive === "true" ? "false" : "true";
    await updateAcquirer(item);
  };

  useEffect(() => {
    if (updateAcquirerData && !updateAcquirerError) {
      successMessage("Status updated successfully");
    }
  }, [updateAcquirerError, updateAcquirerData]);

  // Edit logic
  const [edit, setEdit] = useState({ status: false, index: "" });
  const [formData, setFormData] = useState(addAcquirer);
  const handleEdit = async ({ acqId, acqName, acqCode, isActive }, index) => {
    setFormData({
      ...formData,
      acqId,
      acqName,
      acqCode,
      isActive,
    });
    setEdit({ status: true, index });
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const {
    postData: editAcquirer,
    data: editData,
    error: editError,
  } = usePost(endpoints.payin.addAcquirer);
  const handleSuccess = async () => {
    await editAcquirer(formData);
  };
  useEffect(() => {
    if (editData && !editError) {
      successMessage("Acquirer Edited Successfully");
      setFormData(addAcquirer);
      setEdit(false);
      fetchData(endpoints.payin.acquirerList);
    }
  }, [editData, editError]);
  if (loading) return <Loading />;
  if (error) return <Error error={error} />;
  if (data)
    return (
      <>
        <div className={styles.listing}>
          <div className={styles.filter}>
            <input type="search" placeholder="Search by country name" />
          </div>
          <div className={styles.table}>
            <table className="table table-responsive-sm">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Acquirer</th>
                  <th>Code</th>
                  <th style={{ minWidth: 80 }}>Status</th>
                  <th style={{ minWidth: 50 }}>Edit</th>
                </tr>
              </thead>
              <tbody>
                {data.data.length > 0 ? (
                  data.data.map((item) => (
                    <tr key={item.acqId}>
                      <td>{item.acqId}</td>
                      <td>
                        {edit.status && edit.index === item.acqId ? (
                          <input
                            type="text"
                            name="acqName"
                            id="acqName"
                            autoComplete="on"
                            maxLength={256}
                            onChange={handleChange}
                            defaultValue={item.acqName}
                          />
                        ) : (
                          item.acqName
                        )}
                      </td>
                      <td>{item.acqCode}</td>
                      <td>
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="flexSwitchCheckDefault"
                            defaultChecked={item.isActive === "true"}
                            onChange={() => handleChangeStatus(item)}
                          />
                        </div>
                      </td>
                      <td>
                        {(!edit.status || edit.index !== item.acqId) && (
                          <i
                            className="bi bi-pencil-square text-info"
                            onClick={() => handleEdit(item, item.acqId)}
                          ></i>
                        )}
                        {edit.status && edit.index === item.acqId && (
                          <>
                            <span className="d-flex gap-3">
                              <i
                                className="bi bi-check-circle text-success"
                                onClick={handleSuccess}
                              ></i>
                              <i
                                className="bi bi-x-circle text-danger"
                                onClick={() =>
                                  setEdit({ status: false, index: "" })
                                }
                              ></i>
                            </span>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4}>No Acquirer Added</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
};

export default AcquirerList;
