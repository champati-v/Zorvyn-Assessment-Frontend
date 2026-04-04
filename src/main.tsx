import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "next-themes";

import App from "./App";
import { Toaster } from "@/components/ui/sonner";
import "@/styles/index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <BrowserRouter>
        <App />
        <Toaster />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
