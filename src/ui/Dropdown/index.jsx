import { useState, useRef, useEffect } from "react";
import styles from "./Dropdown.module.css";

export default function Dropdown({
  id,
  value,
  handleChange = () => {},
  data = [],
  placeholder = "Select",
  selected = {
    id: "",
    name: placeholder,
  },
  array = false, // If true, data is an array of objects with id and name properties
}) {
  // State for dropdown open/close status
  const [openDropdown, setOpenDropdown] = useState(false);

  // References to detect clicks outside of dropdowns
  const dropdownRef = useRef(null);
  // Handle clicking outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        openDropdown &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpenDropdown(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdown]);

  if (!id || !value) {
    return null;
  }

  const list = data.map((item) => ({
    id: item?.[id],
    name: array
      ? item?.[array[0] ?? value] + " " + (item?.[array[1]] ?? "")
      : item?.name || item?.[value] || "N/A",
  }));
  
  return (
    <div className={styles.dropdown} ref={dropdownRef}>
      <div
        className={styles.dropdownToggle}
        onClick={() => setOpenDropdown(openDropdown ? false : true)}
      >
        <span>{selected?.name}</span>
        <i
          className={`bi ${openDropdown ? "bi-chevron-up" : "bi-chevron-down"}`}
        ></i>
      </div>
      {openDropdown && (
        <div className={styles.dropdownMenu}>
          {list.map((item, index) => (
            <div
              key={index}
              className={styles.dropdownItem}
              onClick={() => {
                handleChange(item.id, item.name);
                setOpenDropdown(null);
              }}
            >
              {item?.name?.toUpperCase() || "N/A"}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
