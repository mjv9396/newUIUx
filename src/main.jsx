import { createRoot } from "react-dom/client";
import "./index.css";
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import App from "./App.jsx";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

createRoot(document.getElementById("root")).render(<App />);
