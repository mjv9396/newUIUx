import { useRef } from "react";
import styles from "../../styles/components/FileUploader.module.css";

export default function FileUploader({ onChange, accept, name }) {
  const inputRef = useRef();

  const handleClick = () => {
    inputRef.current.click();
  };

  return (
    <button
      type="button"
      className={styles.uploadButton}
      aria-label="Upload file"
      onClick={handleClick}
    >
      <i className="bi bi-upload"></i>
      {/* <span className={styles.uploadText}>Upload</span> */}
      <input
        ref={inputRef}
        type="file"
        name={name}
        className={styles.hiddenInput}
        onChange={onChange}
        accept={accept}
      />
    </button>
  );
}
