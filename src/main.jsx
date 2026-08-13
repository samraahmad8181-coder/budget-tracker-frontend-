import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import App from "./App";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UserProvider } from "@/context/userContext"; // adjust path if needed

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <UserProvider>
        <TooltipProvider>
          <App />
        </TooltipProvider>
      </UserProvider>
    </BrowserRouter>
  </StrictMode>
);