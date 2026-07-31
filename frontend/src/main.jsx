import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./styles/theme.css";
import "./index.css";

import App from "./App.jsx";

import { LayoutProvider } from "@/context/LayoutContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <LayoutProvider>
      <App />
    </LayoutProvider>
  </StrictMode>
);