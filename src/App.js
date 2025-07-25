import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import CheckoutPage from "./components/checkoutpage/CheckoutPage.tsx";
import InformationCollection from "./components/informationCollection/InformationCollection.tsx";
import LoaderPage from "./components/loader/LoaderPage.tsx";
import ResponsePage from "./components/responsePage/ResponsePage.tsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<InformationCollection />} />
        <Route path="/pay/*" element={<CheckoutPage />} />
        <Route path="/loader" element={<LoaderPage />} />
        <Route path="/response-page" element={<ResponsePage />} />
        {/* <Route path="/" element={<CheckoutPage />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
