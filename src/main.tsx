import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { queryClient } from "@/lib/queryClient";
import { router } from "./router";

const container = document.getElementById("root");
if (!container) throw new Error("Root element missing");

createRoot(container).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}><RouterProvider router={router} /></QueryClientProvider>
  </StrictMode>,
);
