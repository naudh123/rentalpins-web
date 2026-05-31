"use client";

import { appPath } from "@/lib/config";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

// global-error replaces the root layout (including globals.css), so this must
// render its own <html>/<body> and rely on inline styles only.
export default function GlobalError({ reset }: Props) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
          background: "#F7F8FA",
          color: "#1E3A6E",
          padding: 24,
        }}
      >
        <div
          style={{
            maxWidth: 420,
            width: "100%",
            textAlign: "center",
            background: "#FFFFFF",
            border: "1px solid #E5E8EE",
            borderRadius: 16,
            padding: 32,
          }}
        >
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Something went wrong</h1>
          <p style={{ marginTop: 12, fontSize: 14, lineHeight: 1.6, color: "#5B6577" }}>
            The app ran into an unexpected error. Please try again.
          </p>
          <div style={{ marginTop: 24, display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => reset()}
              style={{
                padding: "10px 24px",
                borderRadius: 9999,
                border: "none",
                background: "#1E3A6E",
                color: "#FFFFFF",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Try again
            </button>
            <a
              href={appPath("/")}
              style={{
                padding: "10px 24px",
                borderRadius: 9999,
                border: "1px solid #C9D0DC",
                background: "#FFFFFF",
                color: "#1E3A6E",
                fontSize: 14,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Go home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
