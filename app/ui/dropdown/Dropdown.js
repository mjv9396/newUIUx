"use client";
import { useRef, useState } from "react";
import styles from "./Dropdown.module.css";
import DropdownMenu from "./Dropdown-menu";
import ClickAwayListener from "react-click-away-listener";
export default function Dropdown({
  initialLabel,
  selectedValue,
  options = ["No data available"],
  onChange,
  id,
  value,
  search = false,
  onSearch,
}) {
  const [viewMenu, setViewMenu] = useState(false);
  const ref = useRef();
  return (
    <div
      className="d-flex justify-content-between position-relative align-items-center"
      style={{ width: "100%" }}
    >
      <input
        name="dropdown"
        className={
          selectedValue.name !== initialLabel
            ? styles.dropdown + " " + styles.active
            : styles.dropdown
        }
        value={selectedValue.name}
        readOnly
        onClick={() => setViewMenu(!viewMenu)}
      />
      <i
        className="bi bi-chevron-down"
        id={styles.icon}
        onClick={() => setViewMenu(!viewMenu)}
      ></i>
      {viewMenu && (
        <ClickAwayListener
          onClickAway={() => {
            setViewMenu(false);
          }}
        >
          <DropdownMenu
            viewMenu={viewMenu}
            selectedValue={selectedValue.name}
            ref={ref}
            handleView={() => setViewMenu(false)}
            optionData={options}
            onChange={onChange}
            id={id}
            value={value}
            search={search}
            handleSearch={onSearch}
          />
        </ClickAwayListener>
      )}
    </div>
  );
}
