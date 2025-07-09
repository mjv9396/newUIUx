import React, { useEffect, useRef, useState } from "react";
import styles from "./DateRange.module.css";
import { dateFormatter } from "@/app/utils/dateFormatter";

export default function DateRange({ setDateRange }) {
  // State for dropdown open/close status
  const [openDropdown, setOpenDropdown] = useState(null);

  // Sample data for the dropdowns - replace with your actual data
  const dateRangeOptions = [
    "Today",
    "Last 30 Days",
    "Last 60 Days",
    "Last 90 Days",
    "Custom",
  ];

  // State for selected values
  const [selectedDateRange, setSelectedDateRange] = useState("Today");

  // State for custom date inputs
  const [customDateFrom, setCustomDateFrom] = useState("");
  const [customDateTo, setCustomDateTo] = useState("");

  // References to detect clicks outside of dropdowns
  const dateRangeDropdownRef = useRef(null);

  // Handle clicking outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        openDropdown &&
        dateRangeDropdownRef.current &&
        !dateRangeDropdownRef.current.contains(event.target)
      ) {
        setOpenDropdown(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdown]);

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setOpenDropdown(openDropdown ? false : true);
  };

  // Handle selection in dropdown
  const handleSelect = (value) => {
    setSelectedDateRange(value);

    // logic to calculate dates as per range

    const today = new Date();
    let fromDate, toDate;
    switch (value) {
      case "Last 7 Days":
        fromDate = new Date(today);
        fromDate.setDate(today.getDate() - 7);
        toDate = today;
        break;
      case "Last 30 Days":
        fromDate = new Date(today);
        fromDate.setDate(today.getDate() - 30);
        toDate = today;
        break;
      case "Last 60 Days":
        fromDate = new Date(today);
        fromDate.setDate(today.getDate() - 60);
        toDate = today;
        break;
      case "Last 90 Days":
        fromDate = new Date(today);
        fromDate.setDate(today.getDate() - 90);
        toDate = today;
        break;
      default:
        break;
    }
    // Set the date range in the parent component
    setDateRange({
      dateFrom: dateFormatter(fromDate),
      dateTo: dateFormatter(toDate),
    });

    // Reset custom dates if not selecting "Custom"
    if (value !== "Custom") {
      setCustomDateFrom("");
      setCustomDateTo("");
    }

    // Don't close the dropdown if "Custom" date range is selected
    if (!(value === "Custom")) {
      setOpenDropdown(null);
    }
  };

  // Format date range to display in the dropdown toggle
  const getDisplayDateRange = () => {
    if (selectedDateRange === "Custom") {
      if (customDateFrom && customDateTo) {
        return `${new Date(customDateFrom).toLocaleDateString()} - ${new Date(
          customDateTo
        ).toLocaleDateString()}`;
      } else if (customDateFrom) {
        return `From: ${new Date(customDateFrom).toLocaleDateString()}`;
      } else if (customDateTo) {
        return `To: ${new Date(customDateTo).toLocaleDateString()}`;
      }
      return "Custom Range";
    }
    return selectedDateRange;
  };

  // Handle date changes
  const handleDateChange = (e, dateType) => {
    if (dateType === "from") {
      setCustomDateFrom(e.target.value);
    } else {
      setCustomDateTo(e.target.value);
    }
  };

  // Apply filters
  const applyFilters = () => {
    // Process filter values
    // set range

    const fromDate = new Date(customDateFrom);
    const toDate = new Date(customDateTo);
    setDateRange({
      dateFrom: dateFormatter(fromDate),
      dateTo: dateFormatter(toDate),
    });

    // Close the dropdown after applying
    setOpenDropdown(null);
  };

  return (
    <div
      style={{
        minWidth: "200px",
      }}
      className={styles.dropdown}
      ref={dateRangeDropdownRef}
    >
      <div
        className={styles.dropdownToggle}
        onClick={() => toggleDropdown("dateRange")}
      >
        <span>{getDisplayDateRange()}</span>
        <i
          className={`bi ${openDropdown ? "bi-chevron-up" : "bi-chevron-down"}`}
        ></i>
      </div>
      {openDropdown && (
        <div className={styles.dropdownMenu}>
          {dateRangeOptions.map((item, index) => (
            <div
              key={index}
              className={`${styles.dropdownItem} ${
                selectedDateRange === item ? styles.selected : ""
              }`}
              onClick={() => handleSelect(item, "dateRange")}
            >
              {item}
            </div>
          ))}

          {selectedDateRange === "Custom" && (
            <div
              className={styles.dateRangeContainer}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.datePickerLabel}>From:</div>
              <input
                type="date"
                className={styles.datePicker}
                value={customDateFrom}
                onChange={(e) => handleDateChange(e, "from")}
              />

              <div className={styles.datePickerLabel}>To:</div>
              <input
                type="date"
                className={styles.datePicker}
                value={customDateTo}
                onChange={(e) => handleDateChange(e, "to")}
              />

              <button
                className={styles.applyDateRangeButton}
                onClick={applyFilters}
                disabled={!customDateFrom || !customDateTo}
              >
                Apply Range
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
