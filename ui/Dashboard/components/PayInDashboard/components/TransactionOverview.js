// components/TransactionOverview.js
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import styles from "../styles/TransactionOverview.module.css";

// Import ApexCharts dynamically to avoid SSR issues
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function TransactionOverview({ data }) {
  const [axis, setAxis] = useState([]);

  useEffect(() => {
    setAxis(data.xAxis);
  }, [data]);

  const [chartOptions, setChartOptions] = useState({
    chart: {
      id: "transactions",
      type: "area",
      toolbar: {
        show: false,
      },
      fontFamily: "'Inter', sans-serif",
    },
    colors: ["#5E5AEC", "#ED6B6B", "#4AC3A3"],
    stroke: {
      curve: "smooth",
      width: 3,
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: axis,
      axisBorder: {
        show: false,
      },
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
    legend: {
      position: "top",
      horizontalAlign: "right",
    },
    grid: {
      borderColor: "#f1f1f1",
    },
  });

  const [chartSeries, setChartSeries] = useState([]);

  useEffect(() => {
    if (data) {
      setChartSeries([
        {
          name: "Pending",
          data: data.pending,
        },
        {
          name: "Failed",
          data: data.failed,
        },
        {
          name: "Success",
          data: data.success,
        },
      ]);

      setChartOptions((prevOptions) => ({
        ...prevOptions,
        xaxis: {
          ...prevOptions.xaxis,
          categories: data.xAxis,
        },
      }));
      setAxis(data.xAxis);
    }
  }, [data]);

  return (
    <div className={`${styles.overviewCard} card h-100`}>
      <div className="card-body p-4">
        <div className="d-flex align-items-center mb-3">
          <div className={styles.iconBox}>
            <i className="bi bi-layers"></i>
          </div>
          <div className="ms-3">
            <h5 className="mb-0">24 Hrs txn</h5>
            <p className="text-muted mb-0">Overview of Profit</p>
          </div>
        </div>

        <div className={styles.chartContainer}>
          {typeof window !== "undefined" && (
            <Chart
              options={chartOptions}
              series={chartSeries}
              type="area"
              height={250}
            />
          )}
        </div>

        <div className="d-flex justify-content-end mt-2">
          <div className={styles.legend}>
            <span className={`${styles.dot} ${styles.pending}`}></span> Pending
            <span className={`${styles.dot} ${styles.failed} ms-3`}></span>{" "}
            Failed
            <span
              className={`${styles.dot} ${styles.success} ms-3`}
            ></span>{" "}
            Success
          </div>
        </div>
      </div>
    </div>
  );
}
