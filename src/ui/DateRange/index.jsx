import { useState, useEffect, useRef } from "react";
import styles from "./DateRange.module.css";
import { dateFormatter } from "../../utils/dateFormatter";
import { errorMessage } from "../../utils/messges";

export default function DateRange({ setDateRange }) {
  // State for dropdown open/close status
  const [openDropdown, setOpenDropdown] = useState(null);

  // Sample data for the dropdowns - replace with your actual data
  const dateRangeOptions = [
    "Today",
    "Week",
    "Month",
    "Last 7D",
    "Last 30D",
    "Custom",
  ];

  // State for selected values
  const [selectedDateRange, setSelectedDateRange] = useState("Today");

  // State for custom date inputs
  const [customDateFrom, setCustomDateFrom] = useState("");
  const [customDateTo, setCustomDateTo] = useState("");

  // References to detect clicks outside of dropdowns
  const dateRangeDropdownRef = useRef(null);
  const menuRef = useRef(null);

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

  // Dynamically position dropdown to avoid overflow
  useEffect(() => {
    if (openDropdown && menuRef.current && dateRangeDropdownRef.current) {
      const menuRect = menuRef.current.getBoundingClientRect();
      const toggleRect = dateRangeDropdownRef.current.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      // Reset styles
      menuRef.current.style.left = "";
      menuRef.current.style.right = "";
      menuRef.current.style.top = "";
      menuRef.current.style.bottom = "";
      // Check horizontal overflow
      if (menuRect.right > windowWidth && toggleRect.left > windowWidth / 2) {
        // Open to the left
        menuRef.current.style.left = "auto";
        menuRef.current.style.right = "0";
      } else {
        // Open to the right (default)
        menuRef.current.style.left = "0";
        menuRef.current.style.right = "auto";
      }
      // Check vertical overflow
      if (
        menuRect.bottom > windowHeight &&
        windowHeight - toggleRect.bottom < menuRect.height
      ) {
        // Open upwards if not enough space below
        menuRef.current.style.top = "auto";
        menuRef.current.style.bottom = "100%";
      } else {
        // Open downwards (default)
        menuRef.current.style.top = "100%";
        menuRef.current.style.bottom = "auto";
      }
    }
  }, [openDropdown]);

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setOpenDropdown(!openDropdown);
  };

  // Handle selection in dropdown
  const handleSelect = (value) => {
    setSelectedDateRange(value);

    // logic to calculate dates as per range

    const today = new Date();
    let fromDate = new Date();
    let toDate = new Date();

    switch (value) {
      case "Today":
        // Start and end are both today
        fromDate = new Date(today);
        toDate = new Date(today);
        break;

      case "Week": {
        // Week = Previous Sunday to Next Sunday
        const day = today.getDay(); // Sunday = 0
        fromDate = new Date(today);
        fromDate.setDate(today.getDate() - day - 7); // Previous Sunday (before last)
        toDate = new Date(today);
        toDate.setDate(today.getDate() + (7 - day)); // Coming Sunday
        break;
      }

      case "Month":
        // Full current month: 1st to last day
        fromDate = new Date(today.getFullYear(), today.getMonth(), 1);
        toDate = new Date(today.getFullYear(), today.getMonth() + 1, 0); // last day of current month
        break;

      case "Last 7D":
        fromDate = new Date(today);
        fromDate.setDate(today.getDate() - 7);
        toDate = new Date(today);
        break;

      case "Last 30D":
        fromDate = new Date(today);
        fromDate.setDate(today.getDate() - 30);
        toDate = new Date(today);
        break;

      default:
        break;
    }
    // Set the date range in the parent component
    setDateRange([
      {
        startDate: dateFormatter(fromDate),
        endDate: dateFormatter(toDate),
      },
    ]);

    // Reset custom dates if not selecting "Custom"
    if (value !== "Custom") {
      setCustomDateFrom("");
      setCustomDateTo("");
    }

    // Don't close the dropdown if "Custom" date range is selected
    if (value !== "Custom") {
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

  // Calculate max date for "to" date picker (2 months from "from" date)
  const getMaxToDate = () => {
    if (!customDateFrom) return "";

    const fromDate = new Date(customDateFrom);
    const maxDate = new Date(fromDate);
    maxDate.setDate(fromDate.getDate() + 60); // Add 60 days (approximately 2 months)

    return maxDate.toISOString().split("T")[0];
  };

  // Calculate min date for "to" date picker (same as "from" date)
  const getMinToDate = () => {
    return customDateFrom || "";
  };

  // Handle date changes
  const handleDateChange = (e, dateType) => {
    if (dateType === "from") {
      setCustomDateFrom(e.target.value);
      // Reset "to" date if it becomes invalid
      if (customDateTo) {
        const fromDate = new Date(e.target.value);
        const toDate = new Date(customDateTo);
        const diffInTime = toDate.getTime() - fromDate.getTime();
        const diffInDays = diffInTime / (1000 * 3600 * 24);

        if (diffInDays > 60 || toDate < fromDate) {
          setCustomDateTo("");
        }
      }
    } else {
      setCustomDateTo(e.target.value);
    }
  };

  // Apply filters
  const applyFilters = () => {
    // Validate date range
    if (!customDateFrom || !customDateTo) {
      errorMessage("Please select both from and to dates");
      return;
    }

    const fromDate = new Date(customDateFrom);
    const toDate = new Date(customDateTo);

    // Check if from date is after to date
    if (fromDate > toDate) {
      errorMessage("From date cannot be after To date");
      return;
    }

    // Calculate the difference in months
    const diffInTime = toDate.getTime() - fromDate.getTime();
    const diffInDays = diffInTime / (1000 * 3600 * 24);

    // Check if difference is more than 2 months (approximately 60 days)
    // We use 60 days as an approximation for 2 months to handle varying month lengths
    if (diffInDays > 60) {
      errorMessage(
        "Date range cannot exceed 2 months. Please select a shorter range."
      );
      return;
    }

    // Process filter values - set range
    setDateRange([
      {
        startDate: dateFormatter(fromDate),
        endDate: dateFormatter(toDate),
      },
    ]);

    // Close the dropdown after applying
    setOpenDropdown(null);
  };

  // need to change direction and left top right valiues accordingly if overflowed of the by height or even width and if space available the at least 300pc width

  return (
    <div className={styles.dropdown} ref={dateRangeDropdownRef}>
      <div
        className={styles.dropdownToggle}
        role="button"
        tabIndex={0}
        onClick={toggleDropdown}
        onKeyDown={(e) =>
          (e.key === "Enter" || e.key === " ") && toggleDropdown()
        }
      >
        <span>{getDisplayDateRange()}</span>
        <i
          className={`bi ${openDropdown ? "bi-chevron-up" : "bi-chevron-down"}`}
        ></i>
      </div>
      {openDropdown && (
        <div ref={menuRef} className={styles.dropdownMenu}>
          <div className={styles.dateRangeOptions}>
            {dateRangeOptions.map((item) => (
              <div
                key={item}
                className={`${styles.dropdownItem} ${
                  selectedDateRange === item ? styles.selected : ""
                }`}
                onClick={() => handleSelect(item)}
                role="option"
                aria-selected={selectedDateRange === item}
                tabIndex={0}
                onKeyDown={(e) =>
                  (e.key === "Enter" || e.key === " ") && handleSelect(item)
                }
              >
                {item}
              </div>
            ))}
          </div>

          {selectedDateRange === "Custom" && (
            <div
              className={styles.dateRangeContainer}
              aria-modal="true"
              role="dialog"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => {
                if (e.key === "Escape") setOpenDropdown(false);
              }}
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
                min={getMinToDate()}
                max={getMaxToDate()}
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
