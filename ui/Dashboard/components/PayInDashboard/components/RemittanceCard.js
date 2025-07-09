// components/RemittanceCard.js
import styles from "../styles/RemittanceCard.module.css";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function RemittanceCard({ data }) {
  const chartOptions = {
    chart: {
      type: "radialBar",
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        hollow: {
          margin: 0,
          size: "70%",
        },
        track: {
          background: "#f2f2f2",
          strokeWidth: "100%",
          margin: 5,
        },
        dataLabels: {
          show: false,
        },
      },
    },
    colors: ["#5E5AEC", "#4AC3A3", "#F9A0A0"],
    stroke: {
      lineCap: "round",
    },
    labels: ["25%", "50%", "75%"],
  };

  const chartSeries = data.percentages;

  return (
    <div className={`${styles.card} card h-100`}>
      <div className={styles.content + " card-body p-4"}>
        <h5 className={styles.title}>Remittance</h5>
        {/* <p className="text-muted">Last 7 days</p> */}

        <div className={styles.chartContainer}>
          {typeof window !== "undefined" && (
            <Chart
              options={chartOptions}
              series={chartSeries}
              type="radialBar"
              height={220}
            />
          )}
        </div>

        <div className={styles.labels}>
          <div className={styles.labelItem}>
            <span className={`${styles.dot} ${styles.blue}`}></span>25%
          </div>
          <div className={styles.labelItem}>
            <span className={`${styles.dot} ${styles.teal}`}></span>50%
          </div>
          <div className={styles.labelItem}>
            <span className={`${styles.dot} ${styles.red}`}></span>75%
          </div>
        </div>
      </div>
    </div>
  );
}
