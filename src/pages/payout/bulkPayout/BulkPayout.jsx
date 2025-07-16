import DashboardLayout from "../../../layouts/DashboardLayout";
import styles from "../../../styles/common/List.module.css";
import FileUploader from "./components/FileUploader";
const BulkPayout = () => {
  return (
    <DashboardLayout page="Bulk Payout" url="/dashboard/bulkpayout">
      <div className="row">
        <div className="col-md-4 col-sm-12 mb-3">
          <div className={styles.listing}>
            <FileUploader />
          </div>
        </div>
        <div className="col-md-8 col-sm-12 mb-3">
          <div className={styles.listing}>
            <div className={styles.filter}>
              <input type="search" placeholder="Search by name" />
            </div>
            <div className={styles.table}>
              <table className="table table-responsive-sm">
                <thead>
                  <tr>
                    <th>Business Name</th>
                    <th>File Name</th>
                  </tr>
                </thead>
                <tbody>
                  {/* {data.data.length > 0 ? (
                    data.data.map((item) => (
                      <tr key={item.countryId}>
                        <td>{item.countryId}</td>
                        <td>{item.countryName}</td>
                        <td>{item.isoCodeAlpha2}</td>
                        <td>{item.isoCodeAlpha3}</td>
                        <td>{item.unCode}</td>
                        <td>{item.currency}</td>
                        <td>{item.isdCode}</td>
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
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8}>No Country Added</td>
                    </tr>
                  )} */}
                </tbody>
              </table>
              <div className={styles.pagination}>
                <button className={styles.btn} id={styles.prev}>
                  Prev
                </button>
                <span>1/1</span>
                <button className={styles.btn} id={styles.next}>
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BulkPayout;
