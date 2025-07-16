import { useEffect } from "react";
import useFetch from "../../../hooks/useFetch";
import styles from "../../../styles/common/List.module.css";
import { endpoints } from "../../../services/apiEndpoints";
import Loading from "../../errors/Loading";
import Error from "../../errors/Error";
import DashboardLayout from "../../../layouts/DashboardLayout";
import useFileDownload from "../../../hooks/useFileDownload";

const ViewReports = () => {
  const {
    fetchData: getAllReports,
    data: allReports,
    loading: loadingAllReports,
    error: errorAllReports,
  } = useFetch();

  useEffect(() => {
    getAllReports(endpoints.payin.getReports);
  }, []);

  const { fetchData, loading } = useFileDownload();
  const handleDownloadReport = async (reportId, name) => {
    await fetchData(`${endpoints.payin.downloadReport}${reportId}`, name);
  };

  if (loadingAllReports) return <Loading />;
  if (errorAllReports) return <Error error={errorAllReports} />;
  if (allReports)
    return (
      <DashboardLayout page="View Reports" url="/dashboard/view-reports">
        <div className={styles.listing}>
          <div className={styles.table}>
            <table className="table table-responsive-sm">
              <thead>
                <tr>
                  <th>Report Id</th>
                  <th>Report Name</th>
                  <th>Report Type</th>
                  <th>Updated Date</th>
                  <th>Download</th>
                </tr>
              </thead>
              <tbody>
                {allReports.data.length > 0 ? (
                  allReports.data.map((item) => (
                    <tr key={item.reportId}>
                      <td>{item.reportId}</td>
                      <td>{item.fileName}</td>
                      <td>{item.reportTypes}</td>
                      <td>{item.updatedDate ? item.updatedDate : "NA"}</td>
                      <td>
                        <button
                          className={styles.btn}
                          disabled={loading}
                          onClick={() =>
                            handleDownloadReport(item.reportId, item.fileName)
                          }
                        >
                          {loading ? "Downloading..." : "Download"}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5}>No Reports Available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </DashboardLayout>
    );
};

export default ViewReports;
