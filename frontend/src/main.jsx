import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "@/App";
import LayoutProvider from "@/context/LayoutProvider";

import "@/styles/theme.css";
import "@/index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <LayoutProvider>
      <App />
    </LayoutProvider>
  </StrictMode>
);