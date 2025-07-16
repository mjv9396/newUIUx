import DashboardLayout from "../../layouts/DashboardLayout";
import KycForm from "./KycForm";

const KycVerification = () => {
  return (
    <DashboardLayout
      page="KYC Verification"
      url="/dashboard/verification"
    >
      <KycForm/>
    </DashboardLayout>
  );
};

export default KycVerification;
