/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import ReactApexChart from "react-apexcharts";
import { useEffect, useState } from "react";
import { endpoints } from "../../../services/apiEndpoints";
import Loading from "../../errors/Loading";
import Error from "../../errors/Error";
import usePost from "../../../hooks/usePost";

const PayinMultiAnalytics = () => {
  // fetch chart data
  const { postData, data, error, loading } = usePost(
    endpoints.user.transactionChart
  );

  useEffect(() => {
    postData({});
  }, []);

  const [chartState, setChartState] = useState();

  useEffect(() => {
    if (data && !error) {
      const rawData = data.data;
      const keys = Object.keys(rawData);

      // Format data for count
      const countSuccessData = keys.map((key) => {
        const item = rawData[key];
        return [new Date(key).getTime(), item.SUCCESS?.totalCount || 0];
      });

      const countFailedData = keys.map((key) => {
        const item = rawData[key];
        return [new Date(key).getTime(), item.FAILED?.totalCount || 0];
      });

      const countPendingData = keys.map((key) => {
        const item = rawData[key];
        return [new Date(key).getTime(), item.PENDING?.totalCount || 0];
      });

      // Format data for amount
      const amountSuccessData = keys.map((key) => {
        const item = rawData[key];
        return [new Date(key).getTime(), item.SUCCESS?.totalAmount || 0];
      });

      const amountFailedData = keys.map((key) => {
        const item = rawData[key];
        return [new Date(key).getTime(), item.FAILED?.totalAmount || 0];
      });

      const amountPendingData = keys.map((key) => {
        const item = rawData[key];
        return [new Date(key).getTime(), item.PENDING?.totalAmount || 0];
      });

      const chartData = {
        series: [
          // Count lines
          {
            name: "Success Count",
            data: countSuccessData,
            type: "line",
            yAxisIndex: 0,
          },
          {
            name: "Failed Count",
            data: countFailedData,
            type: "line",
            yAxisIndex: 0,
          },
          {
            name: "Pending Count",
            data: countPendingData,
            type: "line",
            yAxisIndex: 0,
          },
          // Amount lines
          {
            name: "Success Amount",
            data: amountSuccessData,
            type: "line",
            yAxisIndex: 1,
          },
          {
            name: "Failed Amount",
            data: amountFailedData,
            type: "line",
            yAxisIndex: 1,
          },
          {
            name: "Pending Amount",
            data: amountPendingData,
            type: "line",
            yAxisIndex: 1,
          },
        ],
        options: {
          chart: {
            height: 280,
            type: "line",
            background: "transparent",
            fontFamily: "Inter, system-ui, sans-serif",
            toolbar: {
              show: true,
              tools: {
                download: true,
                selection: true,
                zoom: true,
                zoomin: true,
                zoomout: true,
                pan: true,
                reset: true,
              },
              theme: "light",
            },
            animations: {
              enabled: true,
              easing: "easeinout",
              speed: 800,
            },
          },
          colors: [
            "#10b981",
            "#ef4444",
            "#f59e0b", // Count lines (solid colors)
            "#10b981",
            "#ef4444",
            "#f59e0b", // Amount lines (dashed - will be styled)
          ],
          stroke: {
            width: [3, 3, 3, 3, 3, 3],
            curve: "smooth",
            dashArray: [0, 0, 0, 5, 5, 5], // First 3 solid, last 3 dashed
          },
          grid: {
            show: true,
            borderColor: "rgba(212, 175, 55, 0.1)",
            strokeDashArray: 4,
            xaxis: {
              lines: {
                show: true,
              },
            },
            yaxis: {
              lines: {
                show: true,
              },
            },
          },
          xaxis: {
            type: "datetime",
            labels: {
              style: {
                colors: "#2d5016",
                fontSize: "11px",
                fontWeight: 500,
              },
              format: "dd MMM",
            },
            axisBorder: {
              color: "rgba(212, 175, 55, 0.2)",
            },
            axisTicks: {
              color: "rgba(212, 175, 55, 0.2)",
            },
          },
          yaxis: [
            {
              title: {
                text: "Transaction Count",
                style: {
                  color: "#2d5016",
                  fontSize: "12px",
                  fontWeight: 600,
                },
              },
              labels: {
                style: {
                  colors: "#2d5016",
                  fontSize: "11px",
                  fontWeight: 500,
                },
                formatter: function (value) {
                  return Math.round(value);
                },
              },
              axisBorder: {
                show: true,
                color: "#10b981",
              },
              axisTicks: {
                show: true,
                color: "#10b981",
              },
            },
            {
              opposite: true,
              title: {
                text: "Transaction Amount (₹)",
                style: {
                  color: "#2d5016",
                  fontSize: "12px",
                  fontWeight: 600,
                },
              },
              labels: {
                style: {
                  colors: "#2d5016",
                  fontSize: "11px",
                  fontWeight: 500,
                },
                formatter: function (value) {
                  if (value >= 10000000)
                    return (value / 10000000).toFixed(1) + "Cr";
                  if (value >= 100000) return (value / 100000).toFixed(1) + "L";
                  if (value >= 1000) return (value / 1000).toFixed(1) + "K";
                  return Math.round(value);
                },
              },
              axisBorder: {
                show: true,
                color: "#d4af37",
              },
              axisTicks: {
                show: true,
                color: "#d4af37",
              },
            },
          ],
          legend: {
            show: true,
            position: "top",
            horizontalAlign: "center",
            labels: {
              colors: "#2d5016",
            },
            markers: {
              width: 12,
              height: 12,
              strokeWidth: 2,
              strokeColor: "#fff",
              radius: 6,
            },
          },
          tooltip: {
            theme: "light",
            shared: true,
            intersect: false,
            style: {
              fontSize: "12px",
              backgroundColor: "rgba(255, 255, 255, 0.95)",
            },
            marker: {
              show: true,
            },
            y: [
              {
                formatter: function (value, { seriesIndex }) {
                  if (seriesIndex <= 2) {
                    return Math.round(value) + " transactions";
                  } else {
                    return "₹" + value.toLocaleString();
                  }
                },
              },
            ],
          },
          dataLabels: {
            enabled: false,
          },
          markers: {
            size: 4,
            strokeColors: "#fff",
            strokeWidth: 2,
            hover: {
              size: 6,
            },
          },
        },
      };

      setChartState(chartData);
    }
  }, [data, error]);

  if (loading) return <Loading loading="Loading Chart data" />;
  if (error) return <Error error={error} />;

  if (data && chartState) {
    return (
      <div
        style={{
          padding: "16px",
          background: "rgba(255, 255, 255, 0.6)",
          borderRadius: "12px",
          border: "1px solid rgba(212, 175, 55, 0.2)",
          backdropFilter: "blur(15px)",
          boxShadow: "0 2px 12px rgba(45, 80, 22, 0.08)",
        }}
      >
        <div
          style={{
            marginBottom: "14px",
            borderBottom: "1px solid rgba(212, 175, 55, 0.1)",
            paddingBottom: "10px",
          }}
        >
          <h3
            style={{
              margin: "0",
              fontSize: "1rem",
              fontWeight: "700",
              color: "#2d5016",
              textAlign: "center",
            }}
          >
            Payin Txn Analysis
          </h3>
          <p
            style={{
              margin: "4px 0 0 0",
              fontSize: "0.75rem",
              color: "rgba(45, 80, 22, 0.7)",
              textAlign: "center",
              fontWeight: "500",
            }}
          >
            Transaction count (solid) & amount (dashed) trends
          </p>
        </div>
        <div id="chart">
          <ReactApexChart
            options={chartState.options}
            series={chartState.series}
            type="line"
            height={280}
          />
        </div>
      </div>
    );
  }

  return null;
};

export default PayinMultiAnalytics;
