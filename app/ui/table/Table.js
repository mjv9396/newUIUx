import Search from "@/app/home/components/search/Search";
import styles from "./Table.module.css";
import AddButton from "@/app/home/components/addButton/AddButton";
import useTableExports from "@/app/hooks/useTableExports";
import DownloadDetailModal from "./DownloadDetailModal";
const Table = ({
  headers = [],
  currentPage = 0,
  pageSize = 25,
  totalElement = 0,
  children,
  handleNext,
  handlePrev,
  icon = "",
  link = "",
  download = true,
  onChange,
  search = true,
  pagination = true,
  data = [],
  downloadUrl = null,
  userName,
  dateFrom,
  dateTo,
  status,
  currencyCode,
  merchantName,
  source = "report",
}) => {
  const {
    exportToExcel,
    exportToCSV,
    exportToPDF,
    showModal,
    handleViewModal,
  } = useTableExports(headers, data);
  return (
    <>
      {showModal && (
        <DownloadDetailModal
          downloadUrl={downloadUrl}
          downloadData={{ userName, dateFrom, dateTo, status, currencyCode, merchantName }}
          onClose={handleViewModal}
          source={source}
        />
      )}
      <div className={styles.table}>
        <div className={styles.export}>
          <span className="d-flex gap-3 align-items-center">
            {download &&
              [
                {
                  onClick: handleViewModal,
                  icon: "bi-filetype-xlsx",
                  label: "Export To Excel",
                },
                // { onClick: exportToCSV, icon: "bi-filetype-csv", label: "CSV" },
                // { onClick: exportToPDF, icon: "bi-filetype-pdf", label: "PDF" },
              ].map(({ onClick, icon, label }) => (
                <button key={label} onClick={onClick}>
                  <i className={`bi ${icon}`}></i> {label}
                </button>
              ))}
          </span>

          <span className="d-flex align-items-center gap-2">
            {search && <Search onChange={onChange} />}
            {link && <AddButton icon={icon} link={link} />}
          </span>
        </div>

        <div style={{ overflow: "auto" }}>
          <table>
            <thead>
              <tr>
                {headers.map((item) => (
                  <th key={item}>{item}</th>
                ))}
              </tr>
            </thead>
            {children}
          </table>
        </div>
        {pagination && (
          <div className={styles.pagination}>
            <button onClick={handlePrev} disabled={currentPage === 0}>
              Prev
            </button>
            <span>
              Result{" "}
              {totalElement === 0 ? currentPage : currentPage * pageSize + 1}-
              {(currentPage + 1) * pageSize < totalElement
                ? (currentPage + 1) * pageSize
                : totalElement}{" "}
              of Total {totalElement}
            </span>
            <button
              onClick={handleNext}
              disabled={(currentPage + 1) * pageSize >= totalElement}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Table;
