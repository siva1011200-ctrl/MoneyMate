import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App.jsx";

import "./index.css";

import ThemeProvider from "./context/ThemeProvider.jsx";
import AuthProvider from "./context/AuthProvider.jsx";
import FinanceProvider from "./context/FinanceProvider.jsx";


ReactDOM.createRoot(
  document.getElementById("root")
)
.render(

  <React.StrictMode>

    <ThemeProvider>

      <AuthProvider>

        <FinanceProvider>

          <App />

        </FinanceProvider>

      </AuthProvider>

    </ThemeProvider>

  </React.StrictMode>

);