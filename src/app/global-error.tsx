"use client";

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="es">
      <body
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
          color: "#ededed",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
          padding: "0 1.5rem",
          margin: 0,
        }}
      >
        <h1 style={{ fontSize: "2rem", fontWeight: 300, marginBottom: "1rem" }}>
          Error critico
        </h1>
        <p style={{ color: "#888888", maxWidth: "28rem", marginBottom: "2rem" }}>
          La aplicacion encontro un error y no pudo continuar. Por favor,
          reintenta.
        </p>
        <button
          onClick={reset}
          style={{
            background: "#ededed",
            color: "#0a0a0a",
            border: "none",
            padding: "0.9rem 2.5rem",
            fontSize: "0.75rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Reintentar
        </button>
      </body>
    </html>
  );
}
