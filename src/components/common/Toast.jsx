import React from "react";
import { Toaster } from "react-hot-toast";

export const Toast = ({ position = "top-right" }) => {
  return (
    <Toaster
      position={position}
      toastOptions={{
        duration: 3000,
        style: {
          background: "#1f2937",
          color: "#fff",
          fontSize: "14px",
          borderRadius: "8px",
          padding: "12px 16px",
        },
        success: {
          style: {
            background: "#10b981",
          },
        },
        error: {
          style: {
            background: "#ef4444",
          },
        },
      }}
    />
  );
};

export const showToast = {
  success: (message) => require("react-hot-toast").default.success(message),
  error: (message) => require("react-hot-toast").default.error(message),
  loading: (message) => require("react-hot-toast").default.loading(message),
};
