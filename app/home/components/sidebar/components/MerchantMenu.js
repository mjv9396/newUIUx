"use client";
import { usePathname } from "next/navigation";
import classes from "../Sidebar.module.css";
import { useState } from "react";
import Link from "next/link";

const MerchantMenu = () => {
  // Logic for active links
  const router = usePathname();
  // Logic for toggle menu
  const [toggle, setToggle] = useState(true);
  const [type, setType] = useState();
  const [submenuToggle, setSubmenuToggle] = useState(false);
  const handleToggle = (id) => {
    if (id === type) {
      setToggle(!toggle);
    } else {
      setToggle(true);
    }
    setType(id);
    setSubmenuToggle(!setSubmenuToggle);
  };
  return (
    <ul className={classes.menu}>
      <li>
        <Link
          href="/home"
          className={router === "/home" ? classes.activelink : ""}
        >
          <span>
            <i className="bi bi-grid-3x3-gap mx-1"></i> Dashboard
          </span>
        </Link>
      </li>
      <li>
        <Link href="#" onClick={() => handleToggle("U")}>
          <span>
            <i className="bi bi-person mx-1"></i> User Management
          </span>
          <i className="bi bi-chevron-right"></i>
        </Link>
        <ul
          className={
            (toggle && type === "U") ||
            router.split("/")[2] === "user-management"
              ? classes.submenu + " " + classes.active
              : classes.submenu
          }
        >
          <li>
            <Link
              href="/home/team/sub-merchants"
              className={
                router === "/home/team/sub-merchants" ? classes.activelink : ""
              }
            >
              Sub Merchants
            </Link>
          </li>
        </ul>
      </li>
      <li>
        <Link href="#" onClick={() => handleToggle("T")}>
          <span>
            <i className="bi bi-cash-coin mx-1"></i> Transactions
          </span>
          <i className="bi bi-chevron-right"></i>
        </Link>
        <ul
          className={
            toggle && type === "T"
              ? classes.submenu + " " + classes.active
              : classes.submenu
          }
        >
          <li>
            <Link href="/home/transaction/orders">Orders</Link>
          </li>
          <li>
            <Link href="/home/transaction/payin">Transactions</Link>
          </li>
        </ul>
      </li>
      <li>
        <Link href="#" onClick={() => handleToggle("ST")}>
          <span>
            <i className="bi bi-hand-thumbs-up mx-1"></i> Settlement Report
          </span>
          <i className="bi bi-chevron-right"></i>
        </Link>
        <ul
          className={
            toggle && type === "ST"
              ? classes.submenu + " " + classes.active
              : classes.submenu
          }
        >
          <li>
            <Link href="/home/settlements/auth-settlement">Authorized</Link>
          </li>
          <li>
            <Link href="/home/settlements/sale-settlement">Captured(Sale)</Link>
          </li>
          <li>
            <Link href="/home/settlements/all-settlement">Settlements</Link>
          </li>
          <li>
            <Link href="/home/settlements/refund">Refund</Link>
          </li>
        </ul>
      </li>
      <li>
        <Link href="/home/payment-links">
          <span>
            <i className="bi bi-link-45deg mx-1"></i> Payment Link
          </span>
        </Link>
      </li>
      <li>
        <Link href="/home/remittance">
          <span>
            <i className="bi bi-currency-exchange mx-1"></i> Remittance
          </span>
        </Link>
      </li>
      <li>
        <Link href="/home/fraud-prevention">
          <span>
            <i className="bi bi-slash-circle mx-1"></i> Fraud Prevention
          </span>
        </Link>
      </li>
      <li>
        <Link href="/home/documentation">
          <span>
            <i className="bi bi-slash-circle mx-1"></i> API Documentation
          </span>
        </Link>
      </li>
      <li>
        <Link
          href="/home/reset-password"
          className={
            router === "/home/reset-password" ? classes.activelink : ""
          }
        >
          <span>
            <i className="bi bi-shield-lock mx-1"></i> Reset Password
          </span>
        </Link>
      </li>
    </ul>
  );
};

export default MerchantMenu;
