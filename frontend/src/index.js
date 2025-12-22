import React from "react";
import ReactDOM from "react-dom/client";
import "@/index.css";
import App from "@/App";

// Suppress ResizeObserver loop error - this is a harmless browser warning
// that appears when ResizeObserver can't deliver all observations in a single animation frame
const suppressResizeObserverError = () => {
  const errorHandler = (e) => {
    if (e.message && e.message.includes('ResizeObserver loop')) {
      e.stopImmediatePropagation();
      e.preventDefault();
      return true;
    }
  };
  
  window.addEventListener('error', errorHandler);
  
  // Also handle unhandled promise rejections with this error
  window.addEventListener('unhandledrejection', (e) => {
    if (e.reason && e.reason.message && e.reason.message.includes('ResizeObserver loop')) {
      e.preventDefault();
      return true;
    }
  });
};

suppressResizeObserverError();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
