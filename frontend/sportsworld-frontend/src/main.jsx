//Application entry point rendering the main App component
import React from "react";
import ReactDOM from "react-dom/client";
import "./App.css";
import App from "./App.tsx";

//Render the App component inside a StrictMode wrapper for better error detection
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
