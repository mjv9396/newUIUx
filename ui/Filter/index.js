// components/PurchaseOrderFilters.js
"use client";
import { useState, useRef, useEffect } from "react";
import styles from "./Filters.module.css";
import Dropdown from "../Dropdown";
import DateRange from "../DateRange";

export default function Filters({
  role,
  isSubMerchant,
  selectedMerchant = {
    id: "",
    name: "Select Merchant",
  },
  merchantOptions = [],
  handleMerchantChange,
  selectedCurrency = {
    id: "",
    name: "Select Currency",
  },
  currencyOptions = [],
  handleCurrencyChange,
  selectedStatus = {
    id: "",
    name: "Select Status",
  },
  statusOptions = [],
  handleStatusChange,
  isMerchantDisabled = false,
  isCurrencyDisabled = false,
  isStatusDisabled = false,
  setDateRange,
}) {
  return (
    <div className={styles.filtersContainer}>
      <div className={styles.filterBox}>
        <div className={styles.filterControls}>
          <div className={styles.filterRow}>
            {/* Merchant Dropdown - only shown for non-submerchant roles */}
            {!isMerchantDisabled && (
              <Dropdown
                data={[
                  { userId: "", fullName: "All Merchant" },
                  ...merchantOptions,
                ]}
                placeholder="Select Merchant"
                selected={selectedMerchant}
                handleChange={handleMerchantChange}
                id="userId"
                value="fullName"
              />
            )}

            {/* Currency Type Dropdown */}
            {!isCurrencyDisabled && (
              <Dropdown
                data={[{ id: "", name: "All Currency" }, ...currencyOptions]}
                placeholder="Select Currency"
                selected={selectedCurrency}
                handleChange={handleCurrencyChange}
                id="id"
                value="name"
              />
            )}
            {/* Status Dropdown */}
            {!isStatusDisabled && (
              <Dropdown
                data={statusOptions}
                placeholder="Select Status"
                selected={selectedStatus}
                handleChange={handleStatusChange}
              />
            )}

            {/* Date Range */}

            <DateRange setDateRange={setDateRange} />

            {/* Apply Button - only shown when not in custom date range mode */}
            {/* {!(openDropdown && selectedDateRange === "Custom") && (
              <button className={styles.applyButton} onClick={applyFilters}>
                Apply
              </button>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
}
