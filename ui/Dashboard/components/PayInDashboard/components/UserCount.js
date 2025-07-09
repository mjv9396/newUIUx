// components/StatCard.js
import styles from "../styles/StatCard.module.css";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function UserCounts({ title, color, userData }) {
  return (
    <div
      className={`${styles.statCard} card py-1 h-100 w-100`}
      style={{
        background: color === "teal" ? "#E5F6F3" : "#FEEAE9",
        flex: 0.5,
        minWidth: "300px",
      }}
    >
      <div className="card-body p-4">
        <h6 className={styles.title}>{title || "User Distribution"}</h6>

        {/* User Breakdown */}
        <div className="user-breakdown mb-3">
          {userData.map((user, index) => (
            <div
              key={index}
              className="d-flex justify-content-between align-items-center mb-1"
            >
              <span className="small">{user.type}</span>
              <span className="small fw-bold">{user.count}</span>
            </div>
          ))}
        </div>

        {/* <div className={styles.chart}>
          {typeof window !== "undefined" && (
            <Chart
              options={chartOptions}
              series={chartSeries}
              type="bar"
              height={200}
            />
          )}
        </div> */}
      </div>
    </div>
  );
}
