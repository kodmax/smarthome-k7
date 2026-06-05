import { createRoot } from "react-dom/client";
import "./style.css";
import { Dashboard } from "./Dashboard";

createRoot(document.getElementById("app")!).render(<Dashboard />);
