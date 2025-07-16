import DashboardLayout from "../../layouts/DashboardLayout";

/* eslint-disable react/prop-types */
const Loading = ({ loading = "Loading..." }) => {
  return (
    <DashboardLayout>
      <p className="text-center">{loading}</p>
    </DashboardLayout>
  );
};

export default Loading;
