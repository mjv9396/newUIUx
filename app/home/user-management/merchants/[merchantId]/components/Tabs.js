"use client";
import { useEffect, useState } from "react";
import styles from "../page.module.css";

const Tabs = ({ handleTabs }) => {
  const [tab, setTab] = useState(1);
  useEffect(() => {
    handleTabs(tab);
  }, [tab]);
  return (
    <div className="d-flex gap-4 flex-wrap">
      <button
        className={
          tab === 1 ? styles.button + " " + styles.active : styles.button
        }
        onClick={() => setTab(1)}
      >
        Operational
      </button>
      <button
        className={
          tab === 2 ? styles.button + " " + styles.active : styles.button
        }
        onClick={() => setTab(2)}
      >
        Business
      </button>
      <button
        className={
          tab === 5 ? styles.button + " " + styles.active : styles.button
        }
        onClick={() => setTab(5)}
      >
        KYC
      </button>
      <button
        className={
          tab === 3 ? styles.button + " " + styles.active : styles.button
        }
        onClick={() => setTab(3)}
      >
        Payin
      </button>
      <button
        className={
          tab === 10 ? styles.button + " " + styles.active : styles.button
        }
        onClick={() => setTab(10)}
      >
        Payout
      </button>
      
      <button
        className={
          tab === 6 ? styles.button + " " + styles.active : styles.button
        }
        onClick={() => setTab(6)}
      >
        Currency
      </button>
      <button
        className={
          tab === 7 ? styles.button + " " + styles.active : styles.button
        }
        onClick={() => setTab(7)}
      >
        Country
      </button>
      <button
        className={
          tab === 8 ? styles.button + " " + styles.active : styles.button
        }
        onClick={() => setTab(8)}
      >
        Web Hooks
      </button>
      <button
        className={
          tab === 9 ? styles.button + " " + styles.active : styles.button
        }
        onClick={() => setTab(9)}
      >
        Settlement Cycle
      </button>
      
    </div>
  );
};

export default Tabs;
