import DashboardLayout from "../../layouts/DashboardLayout";

/* eslint-disable react/prop-types */
const Loading = ({ loading = "Loading..." }) => {
  return <p className="text-center">{loading}</p>;
};

export default Loading;
