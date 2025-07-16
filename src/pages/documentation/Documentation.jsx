// import { useEffect, useRef } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
// import { pdfViewer } from "../../utils/pdfViewer";
import styles from "../../styles/common/List.module.css";
const Documentation = () => {
  // const pdfRef = useRef(null);
  // useEffect(() => {
  //   getPdfFile();
  // }, []);
  // const getPdfFile = async () => {
  //   await pdfViewer("./documentation.pdf", pdfRef);
  // };
  const handleDownload = (name, path) => {
    const link = document.createElement("a");
    link.href = `${path}`; // Replace with your actual PDF file URL
    link.download = `atmoon_api_documentation_${name}.pdf`; // Desired file name
    link.click();
  };

  return (
    <DashboardLayout page="Documentation" url="/dashboard/documentation">
      <h6>Atmoon Documentation</h6>
      <div className="text-center">No documentation available</div>
      {/* <div className="row">
        <div className="col-md-4 col-sm-12 mb-3">
          <div
            className={styles.listing}
            onClick={() => handleDownload("non-seamless", "./non-seamless.pdf")}
          >
            <h5 className="text-center">Non Seamless Integration</h5>
          </div>
        </div>
        <div className="col-md-4 col-sm-12 mb-3">
          <div
            className={styles.listing}
            onClick={() => handleDownload("payout", "./payout.pdf")}
          >
            <h5 className="text-center">Payout Integration</h5>
          </div>
        </div>
        <div className="col-md-4 col-sm-12 mb-3">
          <div
            className={styles.listing}
            onClick={() => handleDownload("seamless", "./seamless.pdf")}
          >
            <h5 className="text-center">Seamless Integration</h5>
          </div>
        </div>
      </div> */}
      {/* <div className="d-flex justify-content-end gap-3 position-relative">
        <button className={styles.download} onClick={handleDownload}>
          Download
        </button>
      </div>
      <div
        className="container w-100 h-100 object-fit-contain"
        ref={pdfRef}
      ></div> */}
    </DashboardLayout>
  );
};

export default Documentation;
