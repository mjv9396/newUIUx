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
  console.log("🚀 ~ PayinAnalytics ~ data:", data)
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
    return (
      <div className="p-3">
        <div id="chart">
          <ReactApexChart
            options={state.options}
            series={state.series}
            type="line"
            height={350}
          />
        </div>
        <div id="html-dist"></div>
      </div>
    );
  }
};

export default PayinAnalytics;
