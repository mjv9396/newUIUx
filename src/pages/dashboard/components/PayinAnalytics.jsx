/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import ReactApexChart from "react-apexcharts";
import { useEffect, useState } from "react";
import { endpoints } from "../../../services/apiEndpoints";
import Loading from "../../errors/Loading";
import Error from "../../errors/Error";
import usePost from "../../../hooks/usePost";
import { formatDashboardData } from "../../../utils/formatDashboardData";

const PayinAnalytics = ({ type, value, min, max }) => {
  // fetch chart data
  const { postData, data, error, loading } = usePost(
    endpoints.user.transactionChart
  );
  useEffect(() => {
    postData({});
  }, []);

  useEffect(() => {
    if (data && !error) {
      const chartData = formatDashboardData(data.data, type, value, min, max);
      setState(chartData);
    }
  }, [data, error]);

  const [state, setState] = useState();
  if (loading) return <Loading loading="Loading Chart data" />;
  if (error) return <Error error={error} />;
  if (data && state) {
    // Enhanced chart options for green/golden theme
    const enhancedOptions = {
      ...state.options,
      chart: {
        ...state.options.chart,
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
      colors: ["#003B5C", "#0077A8", "#00A99D", "#4DD0E1", "#80DEEA"],
      stroke: {
        width: 3,
        curve: "smooth",
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
        ...state.options.xaxis,
        labels: {
          style: {
            colors: "#003B5C",
            fontSize: "12px",
            fontWeight: 500,
          },
        },
        axisBorder: {
          color: "rgba(0, 169, 157, 0.2)",
        },
        axisTicks: {
          color: "rgba(0, 169, 157, 0.2)",
        },
      },
      yaxis: {
        ...state.options.yaxis,
        labels: {
          style: {
            colors: "#003B5C",
            fontSize: "12px",
            fontWeight: 500,
          },
        },
      },
      legend: {
        ...state.options.legend,
        labels: {
          colors: "#003B5C",
        },
      },
      tooltip: {
        theme: "light",
        style: {
          fontSize: "12px",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
        },
        marker: {
          show: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      markers: {
        size: 5,
        colors: ["#003B5C", "#0077A8", "#00A99D"],
        strokeColors: "#fff",
        strokeWidth: 2,
        hover: {
          size: 7,
        },
      },
    };

    return (
      <div
        style={{
          padding: "14px",
          background: "rgba(255, 255, 255, 0.5)",
          borderRadius: "8px",
          border: "1px solid rgba(212, 175, 55, 0.1)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div
          style={{
            marginBottom: "12px",
            borderBottom: "1px solid rgba(212, 175, 55, 0.1)",
            paddingBottom: "8px",
          }}
        >
          <h3
            style={{
              margin: "0",
              fontSize: "0.95rem",
              fontWeight: "700",
              color: "#003B5C",
              textAlign: "center",
            }}
          >
            {type === "Count" ? "Transaction Count" : "Transaction Amount"}
          </h3>
          <p
            style={{
              margin: "2px 0 0 0",
              fontSize: "0.7rem",
              color: "rgba(0, 59, 92, 0.7)",
              textAlign: "center",
              fontWeight: "500",
            }}
          >
            {type === "Count" ? "Daily volume trends" : "Daily value trends"}
          </p>
        </div>
        <div id="chart">
          <ReactApexChart
            options={enhancedOptions}
            series={state.series}
            type="line"
            height={220}
          />
        </div>
        <div id="html-dist"></div>
      </div>
    );
  }
};

export default PayinAnalytics;
