// components/StatCard.js
import styles from "../styles/StatCard.module.css";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function StatCard({ title, value, percentage, trend, color }) {
  const chartOptions = {
    chart: {
      id: `sparkline-${title}`,
      type: "area",
      sparkline: {
        enabled: true,
      },
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.3,
        opacityTo: 0.1,
        stops: [0, 90, 100],
      },
    },
    colors: [color === "teal" ? "#4AC3A3" : "#F9A0A0"],
    tooltip: {
      enabled: false,
    },
  };

  const chartSeries = [
    {
      name: title,
      data: trend,
    },
  ];

  const isNegative = percentage < 0;

  return (
    <div
      className={`${styles.statCard} card h-100 w-100`}
      style={{
        background: color === "teal" ? "#E5F6F3" : "#FEEAE9",
        flex: 1,
        minWidth: "300px",
      }}
    >
      <div className="card-body p-4">
        <h6 className={styles.title}>{title}</h6>
        <div className="d-flex align-items-end mb-3">
          <h2 className={styles.value}>{value.toLocaleString()}</h2>
        </div>
        <div className={styles.chart}>
          {typeof window !== "undefined" && (
            <Chart
              options={chartOptions}
              series={chartSeries}
              type="area"
              height={80}
            />
          )}
        </div>
      </div>
    </div>
  );
}
