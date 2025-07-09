// components/TransactionStats.js
import styles from "../styles/TransactionStats.module.css";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function TransactionStats({ data, symbol }) {
  // Use the provided data or fallback to example data
  const transactionData = data || {
    failedCount: "67",
    pendingCount: "20",
    failedAmount: "457.6",
    successCount: "200",
    successAmount: "4567.00",
    pendingAmount: "76576.989",
  };

  // Parse string values to numbers
  const parsedData = {
    counts: {
      success: parseInt(transactionData.successCount, 10),
      pending: parseInt(transactionData.pendingCount, 10),
      failed: parseInt(transactionData.failedCount, 10),
    },
    amounts: {
      success: parseFloat(transactionData.successAmount),
      pending: parseFloat(transactionData.pendingAmount),
      failed: parseFloat(transactionData.failedAmount),
    },
  };

  // Calculate totals
  const totalCount =
    parsedData.counts.success +
    parsedData.counts.pending +
    parsedData.counts.failed;
  const totalAmount =
    parsedData.amounts.success +
    parsedData.amounts.pending +
    parsedData.amounts.failed;

  // Format for currency display
  const formatCurrency = (value) => {
    return (
        symbol +
        value
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            .replace(/(\.\d{2})\d+/, "$1")
        );
  };

  const chartLabels = ["Success", "Pending", "Failed"];
  const chartColors = ["#2ecc71", "#f39c12", "#e74c3c"];

  // Bar chart options for amounts
  const barChartOptions = {
    chart: {
      type: "bar",
      height: 350,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        borderRadius: 4,
        distributed: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    colors: chartColors,
    xaxis: {
      categories: chartLabels,
      labels: {
        style: {
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      title: {
        text: "Transaction Amount",
      },
      labels: {
        formatter: function (val) {
          return formatCurrency(val).replace("$", "");
        },
      },
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return formatCurrency(val);
        },
      },
    },
  };

  // Pie chart options for counts
  const pieChartOptions = {
    labels: chartLabels,
    colors: chartColors,
    chart: {
      type: "donut",
    },
    legend: {
      position: "bottom",
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 250,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total Transactions",
              formatter: function () {
                return totalCount;
              },
            },
          },
        },
      },
    },
    dataLabels: {
      formatter: function (val, opts) {
        return opts.w.config.series[opts.seriesIndex];
      },
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + " transactions";
        },
      },
    },
  };

  return (
    <div className="card shadow-sm rounded-4 overflow-hidden border-0 w-100">
      <div className="p-4 bg-white d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Transaction Statistics</h5>
        <div className="badge bg-light text-dark">
          Total: {formatCurrency(totalAmount)}
        </div>
      </div>
      <div className="card-body">
        {/* Charts row - will stack on mobile */}
        <div className="row">
          <div className="col-lg-7 col-12 mb-4">
            <div className="mb-2 text-center">
              <h6 className="text-muted">Transaction Amounts</h6>
            </div>
            {typeof window !== "undefined" && (
              <Chart
                options={barChartOptions}
                series={[
                  {
                    name: "Transaction Amount",
                    data: [
                      parsedData.amounts.success,
                      parsedData.amounts.pending,
                      parsedData.amounts.failed,
                    ],
                  },
                ]}
                type="bar"
                height={350}
              />
            )}
          </div>
          <div className="col-lg-5 col-12">
            <div className="mb-2 text-center">
              <h6 className="text-muted">Transaction Counts</h6>
            </div>
            {typeof window !== "undefined" && (
              <Chart
                options={pieChartOptions}
                series={[
                  parsedData.counts.success,
                  parsedData.counts.pending,
                  parsedData.counts.failed,
                ]}
                type="donut"
                height={350}
              />
            )}
          </div>
        </div>

        {/* Status cards - will stack on mobile with appropriate spacing */}
        {/* <div className="row mt-4">
          <div className="col-md-4 col-12 mb-3">
            <div className="card border-0 bg-light h-100">
              <div className="card-body text-center">
                <div className="d-flex align-items-center justify-content-center">
                  <div className="rounded-circle me-2" style={{ width: "10px", height: "10px", backgroundColor: "#2ecc71" }}></div>
                  <h6 className="text-success mb-0">Successful</h6>
                </div>
                <h3 className="mt-2">{parsedData.counts.success}</h3>
                <p className="mb-0">{formatCurrency(parsedData.amounts.success)}</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 col-12 mb-3">
            <div className="card border-0 bg-light h-100">
              <div className="card-body text-center">
                <div className="d-flex align-items-center justify-content-center">
                  <div className="rounded-circle me-2" style={{ width: "10px", height: "10px", backgroundColor: "#f39c12" }}></div>
                  <h6 className="text-warning mb-0">Pending</h6>
                </div>
                <h3 className="mt-2">{parsedData.counts.pending}</h3>
                <p className="mb-0">{formatCurrency(parsedData.amounts.pending)}</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 col-12 mb-3">
            <div className="card border-0 bg-light h-100">
              <div className="card-body text-center">
                <div className="d-flex align-items-center justify-content-center">
                  <div className="rounded-circle me-2" style={{ width: "10px", height: "10px", backgroundColor: "#e74c3c" }}></div>
                  <h6 className="text-danger mb-0">Failed</h6>
                </div>
                <h3 className="mt-2">{parsedData.counts.failed}</h3>
                <p className="mb-0">{formatCurrency(parsedData.amounts.failed)}</p>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}
