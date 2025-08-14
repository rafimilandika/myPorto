import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import Sheet from "./component/sheet/Sheet.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Sheet />
  </StrictMode>
);
