import React from "react";
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
    name: item?.[value],
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
              {item.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
