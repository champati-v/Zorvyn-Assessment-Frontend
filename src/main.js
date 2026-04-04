import { jsx as _jsx } from "react/jsx-runtime";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import App from "./App";
import "@/styles/index.css";
ReactDOM.createRoot(document.getElementById("root")).render(_jsx(React.StrictMode, { children: _jsx(ThemeProvider, { attribute: "class", defaultTheme: "dark", enableSystem: true, disableTransitionOnChange: true, children: _jsx(BrowserRouter, { children: _jsx(App, {}) }) }) }));
