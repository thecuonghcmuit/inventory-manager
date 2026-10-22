"use client";

import { Toaster } from "react-hot-toast";

/** App-wide toast host, themed with the gildedglow.css tokens. */
export default function AppToaster() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          fontFamily: "var(--font-body)",
          fontSize: 14,
          fontWeight: 500,
          color: "var(--ink)",
          background: "var(--surface)",
          border: "1px solid var(--gray-200)",
          borderRadius: "var(--r-md)",
          boxShadow: "var(--shadow-lg)",
          padding: "10px 14px",
        },
        success: { iconTheme: { primary: "var(--success)", secondary: "#fff" } },
        error: { iconTheme: { primary: "var(--danger)", secondary: "#fff" } },
      }}
    />
  );
}
