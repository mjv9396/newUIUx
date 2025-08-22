import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/login/Login";
import TermsNCondition from "./pages/termsNcondition/TermsNCondition";
import PrivacyPolicy from "./pages/privacyPolicy/PrivacyPolicy";
import ProtectedLayout from "./layouts/ProtectedLayout";
import Dashboard from "./pages/dashboard/Dashboard";
import SessionOut from "./pages/errors/SessionOut";
import NotFound from "./pages/errors/NotFound";
import Country from "./pages/payin/country/Tabs";
import Currency from "./pages/payin/currency/Tabs";
import PaymentType from "./pages/payin/paymentType/Tabs";
import MopType from "./pages/payin/mopType/Tabs";
import Acquirer from "./pages/bank/acquirer/Tabs";
import AcquirerProfile from "./pages/bank/payinAcquirerProfile/Tabs";
import Profile from "./pages/profile/Profile";
import ChargingDetails from "./pages/payin/chargingDetails/Tabs";
import MerchantList from "./pages/merchant/MerchantList";
import UpdateMerchant from "./pages/merchant/UpdateMerchant";
import PayoutAcquirerProfile from "./pages/bank/payoutAcquirerProfile/Tabs";
import PayoutChargingDetails from "./pages/payout/chargingDetails/Tabs";
import TransactionList from "./pages/payout/transactions/TransactionList";
import LoadMoney from "./pages/payout/loadMoney/Tabs";
import BeneficiaryList from "./pages/payout/beneficiaries/BeneficiaryList";
import PayinTransactionList from "./pages/payin/transactions/TransactionList";
import AddBankAccount from "./pages/payout/bankAccount/AddBankAccount";
import AddVPA from "./pages/payout/vpa/AddVPA";
import BulkPayout from "./pages/payout/bulkPayout/BulkPayout";
import Refund from "./pages/payin/refund/Refund";
import ChargeBack from "./pages/payin/chargeBack/ChargeBack";
import KycVerification from "./pages/kycVerification/KycVerification";
import SendMoney from "./pages/payout/sendMoney/SendMoney";
import VPAExist from "./pages/payout/singlePay/VPAExist";
import FraudPrevention from "./pages/fraudPrevention/FraudPrevention";
import SettlementList from "./pages/payin/settlement/SettlementList";
import LoginHostory from "./pages/loginHistory/LoginHostory";
import ResetPassword from "./pages/resetPassword/ResetPassword";
import Documentation from "./pages/documentation/Documentation";
import WebHooks from "./pages/webhooks/WebHooks";
import ViewReports from "./pages/payin/generateReport/ViewReports";
import AccountStatement from "./pages/accountStatement/AccountStatement";
import RemittanceReport from "./pages/remittanceReport/RemittanceReport";
import Reseller from "./pages/reseller/Tabs";
import ResellerMapping from "./pages/reseller/ResellerMapping";
import PayinTransaction from "./pages/updateTransaction/PayinTransaction";
import PayoutTransaction from "./pages/updateTransaction/PayoutTransaction";
import Dispute from "./pages/payin/dispute/Dispute";
import ReconciliationReport from "./pages/reconciliationReport/ReconciliationReport";
import { Toaster } from "sonner";
import Analytics from "./pages/analytics/Analytics";
import ActiveUserLayout from "./layouts/ActiveUserLayout";
import VirtualAccountList from "./pages/virtualAccount/VirtualAccountList";
import AcquirerAccountStatement from "./pages/virtualAccount/acquirerAccountStatement/Tabs";
import Unauthorised from "./pages/errors/Unauthorised";
import LoginLayout from "./layouts/LoginLayout";
import { CheckCookieTimeout } from "./services/cookieStore";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <CheckCookieTimeout/>
      <Routes>
        <Route
          exact
          path="/"
          element={
            <LoginLayout>
              <Login />
            </LoginLayout>
          }
        />
        <Route
          exact
          path="/terms-and-conditions"
          element={<TermsNCondition />}
        />
        <Route exact path="/privacy-policy" element={<PrivacyPolicy />} />
        {/* All protected routes goes here */}
        <Route
          exact
          path="/dashboard"
          element={
            <ProtectedLayout allowedRoles={["ADMIN", "MERCHANT", "RESELLER"]}>
              <ActiveUserLayout>
                <Dashboard />
              </ActiveUserLayout>
            </ProtectedLayout>
          }
        />
        <Route
          exact
          path="/reconciliation"
          element={
            <ProtectedLayout allowedRoles={[]}>
              <ActiveUserLayout>
                <ReconciliationReport />
              </ActiveUserLayout>
            </ProtectedLayout>
          }
        />
        <Route
          exact
          path="/analytics"
          element={
            <ProtectedLayout allowedRoles={["ADMIN", "MERCHANT", "RESELLER"]}>
              <ActiveUserLayout>
                <Analytics />
              </ActiveUserLayout>
            </ProtectedLayout>
          }
        />
        <Route
          exact
          path="/virtual-account"
          element={
            <ProtectedLayout allowedRoles={["ADMIN", "MERCHANT", "RESELLER"]}>
              <ActiveUserLayout>
                <VirtualAccountList />
              </ActiveUserLayout>
            </ProtectedLayout>
          }
        />
        <Route
          exact
          path="/check-account-balance"
          element={
            <ProtectedLayout allowedRoles={["ADMIN"]}>
              <ActiveUserLayout>
                <AcquirerAccountStatement />
              </ActiveUserLayout>
            </ProtectedLayout>
          }
        />
        <Route
          exact
          path="/kyc-verification"
          element={
            <ProtectedLayout allowedRoles={["MERCHANT"]}>
              <KycVerification />
            </ProtectedLayout>
          }
        />
        <Route
          exact
          path="/login-history"
          element={
            <ProtectedLayout allowedRoles={["ADMIN", "MERCHANT", "RESELLER"]}>
              <LoginHostory />
            </ProtectedLayout>
          }
        />
        <Route
          exact
          path="/update-password"
          element={
            <ProtectedLayout allowedRoles={["ADMIN", "MERCHANT", "RESELLER"]}>
              <ResetPassword />
            </ProtectedLayout>
          }
        />
        <Route
          exact
          path="/documentation"
          element={
            <ProtectedLayout allowedRoles={["MERCHANT"]}>
              <ActiveUserLayout>
                <Documentation />
              </ActiveUserLayout>
            </ProtectedLayout>
          }
        />
        <Route
          exact
          path="/webhooks"
          element={
            <ProtectedLayout allowedRoles={["MERCHANT"]}>
              <ActiveUserLayout>
                <WebHooks />
              </ActiveUserLayout>
            </ProtectedLayout>
          }
        />
        {/* Bank Routes */}
        <Route
          exact
          path="/acquirer"
          element={
            <ProtectedLayout allowedRoles={["ADMIN"]}>
              <ActiveUserLayout>
                <Acquirer />
              </ActiveUserLayout>
            </ProtectedLayout>
          }
        />
        <Route
          exact
          path="/payin/acquirer-profile"
          element={
            <ProtectedLayout allowedRoles={["ADMIN"]}>
              <ActiveUserLayout>
                <AcquirerProfile />
              </ActiveUserLayout>
            </ProtectedLayout>
          }
        />
        <Route
          exact
          path="/payout/acquirer-profile"
          element={
            <ProtectedLayout allowedRoles={["ADMIN"]}>
              <ActiveUserLayout>
                <PayoutAcquirerProfile />
              </ActiveUserLayout>
            </ProtectedLayout>
          }
        />
        {/* Payin Routes */}
        <Route
          exact
          path="/payin/country"
          element={
            <ProtectedLayout allowedRoles={["ADMIN"]}>
              <ActiveUserLayout>
                <Country />
              </ActiveUserLayout>
            </ProtectedLayout>
          }
        />
        <Route
          exact
          path="/payin/currency"
          element={
            <ProtectedLayout allowedRoles={["ADMIN"]}>
              <ActiveUserLayout>
                <Currency />
              </ActiveUserLayout>
            </ProtectedLayout>
          }
        />
        <Route
          exact
          path="/payin/payment-type"
          element={
            <ProtectedLayout allowedRoles={["ADMIN"]}>
              <ActiveUserLayout>
                <PaymentType />
              </ActiveUserLayout>
            </ProtectedLayout>
          }
        />
        <Route
          exact
          path="/payin/mop-type"
          element={
            <ProtectedLayout allowedRoles={["ADMIN"]}>
              <ActiveUserLayout>
                <MopType />
              </ActiveUserLayout>
            </ProtectedLayout>
          }
        />
        <Route
          exact
          path="/payin/profile"
          element={
            <ProtectedLayout allowedRoles={["ADMIN", "MERCHANT", "RESELLER"]}>
              <ActiveUserLayout>
                <Profile />
              </ActiveUserLayout>
            </ProtectedLayout>
          }
        />
        <Route
          exact
          path="/payin/charging-detail"
          element={
            <ProtectedLayout allowedRoles={["ADMIN"]}>
              <ActiveUserLayout>
                <ChargingDetails />
              </ActiveUserLayout>
            </ProtectedLayout>
          }
        />
        <Route
          exact
          path="/payin/transactions"
          element={
            <ProtectedLayout allowedRoles={["ADMIN", "MERCHANT", "RESELLER"]}>
              <ActiveUserLayout>
                <PayinTransactionList />
              </ActiveUserLayout>
            </ProtectedLayout>
          }
        />
        <Route
          exact
          path="/payin/refund"
          element={
            <ProtectedLayout allowedRoles={[]}>
              <ActiveUserLayout>
                <Refund />
              </ActiveUserLayout>
            </ProtectedLayout>
          }
        />
        <Route
          exact
          path="/payin/chargeBack"
          element={
            <ProtectedLayout allowedRoles={["ADMIN", "MERCHANT", "RESELLER"]}>
              <ActiveUserLayout>
                <ChargeBack />
              </ActiveUserLayout>
            </ProtectedLayout>
          }
        />
        <Route
          exact
          path="/dispute"
          element={
            <ProtectedLayout allowedRoles={["ADMIN", "MERCHANT", "RESELLER"]}>
              <ActiveUserLayout>
                <Dispute />
              </ActiveUserLayout>
            </ProtectedLayout>
          }
        />
        <Route
          exact
          path="/payin/settlement"
          element={
            <ProtectedLayout allowedRoles={["ADMIN", "MERCHANT", "RESELLER"]}>
              <ActiveUserLayout>
                <SettlementList />
              </ActiveUserLayout>
            </ProtectedLayout>
          }
        />
        {/* Payin routes end here */}
        {/* Payout routes */}
        <Route
          exact
          path="/payout/charging-detail"
          element={
            <ProtectedLayout allowedRoles={["ADMIN"]}>
              <ActiveUserLayout>
                <PayoutChargingDetails />
              </ActiveUserLayout>
            </ProtectedLayout>
          }
        />
        <Route
          exact
          path="/payout/load-money"
          element={
            <ProtectedLayout allowedRoles={["ADMIN", "MERCHANT"]}>
              <ActiveUserLayout>
                <LoadMoney />
              </ActiveUserLayout>
            </ProtectedLayout>
          }
        />
        <Route
          exact
          path="/payout/beneficiaries"
          element={
            <ProtectedLayout allowedRoles={["ADMIN", "MERCHANT"]}>
              <ActiveUserLayout>
                <BeneficiaryList />
              </ActiveUserLayout>
            </ProtectedLayout>
          }
        />
        <Route
          exact
          path="/payout/transactions"
          element={
            <ProtectedLayout allowedRoles={["ADMIN", "MERCHANT", "RESELLER"]}>
              <ActiveUserLayout>
                <TransactionList />
              </ActiveUserLayout>
            </ProtectedLayout>
          }
        />
        <Route
          exact
          path="/payout/add-beneficiaries"
          element={
            <ProtectedLayout allowedRoles={["MERCHANT"]}>
              <ActiveUserLayout>
                <AddBankAccount />
              </ActiveUserLayout>
            </ProtectedLayout>
          }
        />
        <Route
          exact
          path="/payout/add-vpa"
          element={
            <ProtectedLayout allowedRoles={["MERCHANT"]}>
              <ActiveUserLayout>
                <AddVPA />
              </ActiveUserLayout>
            </ProtectedLayout>
          }
        />
        <Route
          exact
          path="/payout/bulk-payout"
          element={
            <ProtectedLayout allowedRoles={["MERCHANT"]}>
              <ActiveUserLayout>
                <BulkPayout />
              </ActiveUserLayout>
            </ProtectedLayout>
          }
        />
        <Route
          exact
          path="/payout/send-money"
          element={
            <ProtectedLayout allowedRoles={["MERCHANT"]}>
              <ActiveUserLayout>
                <SendMoney />
              </ActiveUserLayout>
            </ProtectedLayout>
          }
        />
        <Route
          exact
          path="/payout/single-payout"
          element={
            <ProtectedLayout allowedRoles={["MERCHANT"]}>
              <ActiveUserLayout>
                <VPAExist />
              </ActiveUserLayout>
            </ProtectedLayout>
          }
        />
        {/* Payout routes ends here */}
        <Route
          exact
          path="/merchant-list"
          element={
            <ProtectedLayout allowedRoles={["ADMIN", "RESELLER"]}>
              <ActiveUserLayout>
                <MerchantList />
              </ActiveUserLayout>
            </ProtectedLayout>
          }
        />
        <Route
          exact
          path="/update-merchant"
          element={
            <ProtectedLayout allowedRoles={["ADMIN", "RESELLER"]}>
              <ActiveUserLayout>
                <UpdateMerchant />
              </ActiveUserLayout>
            </ProtectedLayout>
          }
        />
        <Route
          exact
          path="/view-reports"
          element={
            <ProtectedLayout allowedRoles={["ADMIN", "MERCHANT", "RESELLER"]}>
              <ActiveUserLayout>
                <ViewReports />
              </ActiveUserLayout>
            </ProtectedLayout>
          }
        />
        <Route
          exact
          path="/account-statement"
          element={
            <ProtectedLayout allowedRoles={["ADMIN", "MERCHANT", "RESELLER"]}>
              <ActiveUserLayout>
                <AccountStatement />
              </ActiveUserLayout>
            </ProtectedLayout>
          }
        />
        <Route
          exact
          path="/remittance-report"
          element={
            <ProtectedLayout allowedRoles={["ADMIN", "MERCHANT", "RESELLER"]}>
              <ActiveUserLayout>
                <RemittanceReport />
              </ActiveUserLayout>
            </ProtectedLayout>
          }
        />
        <Route
          exact
          path="/fraud-prevention"
          element={
            <ProtectedLayout allowedRoles={["ADMIN", "MERCHANT", "RESELLER"]}>
              <ActiveUserLayout>
                <FraudPrevention />
              </ActiveUserLayout>
            </ProtectedLayout>
          }
        />
        <Route
          exact
          path="/reseller"
          element={
            <ProtectedLayout allowedRoles={["ADMIN", "RESELLER"]}>
              <ActiveUserLayout>
                <Reseller />
              </ActiveUserLayout>
            </ProtectedLayout>
          }
        />
        <Route
          exact
          path="/reseller-mapping"
          element={
            <ProtectedLayout allowedRoles={["ADMIN", "RESELLER"]}>
              <ActiveUserLayout>
                <ResellerMapping />
              </ActiveUserLayout>
            </ProtectedLayout>
          }
        />
        <Route
          exact
          path="/update-transaction/payin"
          element={
            <ProtectedLayout allowedRoles={["ADMIN", "MERCHANT", "RESELLER"]}>
              <ActiveUserLayout>
                <PayinTransaction />
              </ActiveUserLayout>
            </ProtectedLayout>
          }
        />
        <Route
          exact
          path="/update-transaction/payout"
          element={
            <ProtectedLayout allowedRoles={["ADMIN", "MERCHANT", "RESELLER"]}>
              <ActiveUserLayout>
                <PayoutTransaction />
              </ActiveUserLayout>
            </ProtectedLayout>
          }
        />
        <Route
          exact
          path="/chargeback"
          element={
            <ProtectedLayout allowedRoles={["MERCHANT", "RESELLER"]}>
              <ActiveUserLayout>
                <ChargeBack />
              </ActiveUserLayout>
            </ProtectedLayout>
          }
        />
        {/* All error routes */}
        <Route exact path="/unauthorised" element={<Unauthorised />} />
        <Route exact path="/session-out" element={<SessionOut />} />
        <Route exact path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
