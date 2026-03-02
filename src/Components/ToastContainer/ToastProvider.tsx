"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ToastProvider() {
  return (
    <ToastContainer
      position="bottom-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      pauseOnHover
      draggable
      style={{
        fontSize: "clamp(12px, 3vw, 15px)",
        maxWidth: "min(90vw, 380px)",
        width: "auto",
      }}
      toastStyle={{
        borderRadius: "8px",
        padding: "10px 14px",
        lineHeight: "1.4",
      }}
    />
  );
}
