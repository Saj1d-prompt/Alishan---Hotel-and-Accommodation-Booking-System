import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "@/App";
import LayoutProvider from "@/context/LayoutProvider";

import "@/index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <LayoutProvider>
      <App />
    </LayoutProvider>
  </StrictMode>
);