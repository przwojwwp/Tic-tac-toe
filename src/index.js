import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.scss";

import App from "./App";

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);