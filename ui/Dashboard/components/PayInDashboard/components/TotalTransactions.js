// components/TotalTransactions.js
import styles from "../styles/TotalTransactions.module.css";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function TotalTransactions({ data }) {
  
  const chartOptions = {
    chart: {
      type: "radialBar",
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 135,
        hollow: {
          margin: 0,
          size: "70%",
        },
        track: {
          background: "#f2f2f2",
          strokeWidth: "90%",
          margin: 5,
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            offsetY: -2,
            fontSize: "22px",
            fontWeight: 600,
            formatter: function (val) {
              return val;
            },
          },
        },
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "horizontal",
        shadeIntensity: 0.5,
        gradientToColors: ["#4AC3A3"],
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100],
      },
    },
    stroke: {
      dashArray: 4,
    },
    colors: ["#F9A0A0"],
  };

  const chartSeries = [data.progress];

  return (
    <div className={`${styles.card} card h-100`}>
      <div className="card-body p-4">
        <h5 className={styles.title}>Total TXNs</h5>
        <p className="text-muted">Last check on {data.lastCheck}</p>

        <div className="d-flex w-100 justify-content-between">
          <div className={styles.footer}>
            <div className={styles.statsList}>
              <div className={styles.statsItem}>
                <div className={`${styles.statsIcon} ${styles.blue}`}>
                  <i className="bi bi-shop"></i>
                </div>
                <div className={styles.statsContent}>
                  <div className={styles.statsValue}>
                    {data.transactions.count} Txn , {data.transactions.value}$
                  </div>
                  <div className={styles.statsLabel}>Processing</div>
                </div>
              </div>

              <div className={styles.statsItem}>
                <div className={`${styles.statsIcon} ${styles.pink}`}>
                  <i className="bi bi-circle"></i>
                </div>
                <div className={styles.statsContent}>
                  <div className={styles.statsValue}>{data.onHold} orders</div>
                  <div className={styles.statsLabel}>On hold</div>
                </div>
              </div>

              <div className={styles.statsItem}>
                <div className={`${styles.statsIcon} ${styles.teal}`}>
                  <i className="bi bi-box-seam"></i>
                </div>
                <div className={styles.statsContent}>
                  <div className={styles.statsValue}>
                    {data.delivered} orders
                  </div>
                  <div className={styles.statsLabel}>Delivered</div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.chartContainer}>
            {typeof window !== "undefined" && (
              <Chart
                options={chartOptions}
                series={chartSeries}
                type="radialBar"
                height={200}
              />
            )}

            <p className={styles.learnMore}>
              Learn insigs how to manage
              <br />
              all aspects of your startup.
            </p>
            {/* <div className={styles.chartValue}>{data.total}</div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
