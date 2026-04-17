import "./index.css";
import React from "react";
import { render } from "react-dom";
import { App } from "./App";
import { DarkModeProvider } from "./context/DarkModeContext";
import { AuthProvider } from "./context/AuthContext";
import { LabelsProvider } from "./context/LabelsContext";

render(
  <AuthProvider>
    <LabelsProvider>
      <DarkModeProvider>
        <App />
      </DarkModeProvider>
    </LabelsProvider>
  </AuthProvider>,
  document.getElementById("root")
);