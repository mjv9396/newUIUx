// components/TotalTransactions.js
import styles from "../styles/TotalTransactions.module.css";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function Settlements({ data, symbol }) {
  const chartOptions = {
    chart: {
      height: 390,
      type: "radialBar",
    },
    plotOptions: {
      radialBar: {
        offsetY: 0,
        startAngle: 0,
        endAngle: 270,
        hollow: {
          margin: 5,
          size: "20%",
          background: "transparent",
          image: undefined,
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            show: false,
          },
        },
        barLabels: {
          enabled: true,
          useSeriesColors: true,
          offsetX: -8,
          fontSize: "10px",
          formatter: function (seriesName, opts) {
            return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex];
          },
        },
      },
    },
    colors: ["#1ab7ea", "#0084ff", "#39539E", "#0077B5"],
    labels: [
      "Settled Amount",
      "Settled Count",
      "Unsettled Amount",
      "Unsettled Count",
    ],
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            show: false,
          },
        },
      },
    ],
  };

  const chartSeries = [
    data.totalSettleAmount,
    data.totalSettleCount,
    data.totalUnsettleAmount,
    data.totalUnsettleCount,
  ];

  return (
    <div className={`${styles.card} card h-100`}>
      <div className="card-body p-4">
        <h5 className={styles.title}>Total TXNs</h5>
        {/* <p className="text-muted">Last check on {data.lastCheck}</p> */}

        <div className="d-flex flex-column-reverse w-100 justify-content-between">
          <div className={styles.footer}>
            <div className={styles.statsList}>
              <div className={styles.statsItem}>
                <div className={`${styles.statsIcon} ${styles.blue}`}>
                  <i className="bi bi-shop"></i>
                </div>
                <div className={styles.statsContent}>
                  <div className={styles.statsValue}>
                    {symbol} {data.totalSettleAmount}
                  </div>
                  <div className={styles.statsLabel}>
                    Total {data.totalSettleCount} Settled Transactions
                  </div>
                </div>
              </div>

              <div className={styles.statsItem}>
                <div className={`${styles.statsIcon} ${styles.pink}`}>
                  <i className="bi bi-circle"></i>
                </div>
                <div className={styles.statsContent}>
                  <div className={styles.statsValue}>
                    {symbol} {data.totalUnsettleAmount}
                  </div>
                  <div className={styles.statsLabel}>
                    Total {data.totalUnsettleCount} Unsettled Transactions
                  </div>
                </div>
              </div>

              {/* <div className={styles.statsItem}>
                <div className={`${styles.statsIcon} ${styles.teal}`}>
                  <i className="bi bi-box-seam"></i>
                </div>
                <div className={styles.statsContent}>
                  <div className={styles.statsValue}>
                    {data.delivered} orders
                  </div>
                  <div className={styles.statsLabel}>Delivered</div>
                </div>
              </div> */}
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

            <p className={styles.learnMore}>Settlements</p>
            {/* <div className={styles.chartValue}>{data.total}</div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
