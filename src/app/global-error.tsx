"use client";

/**
 * Boundary global — catch les erreurs dans le root layout (layout.tsx lui-même).
 * Doit rendre son propre <html><body> car le layout n'est pas appliqué ici.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="fr">
      <body
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          background: "#0B0F19",
          color: "#fff",
          margin: 0,
        }}
      >
        <div style={{ maxWidth: 480, padding: 24, textAlign: "center" }}>
          <p style={{ color: "#94a3b8", fontSize: 14, marginBottom: 8 }}>Erreur fatale</p>
          <h1 style={{ fontSize: 28, marginBottom: 16 }}>Application interrompue</h1>
          <p style={{ color: "#cbd5e1", marginBottom: 24 }}>
            {error.message || "Une erreur critique est survenue au niveau racine."}
          </p>
          {error.digest && (
            <p style={{ color: "#64748b", fontSize: 12, marginBottom: 24 }}>
              ID : {error.digest}
            </p>
          )}
          <button
            onClick={reset}
            style={{
              padding: "10px 24px",
              background: "#1FBEAF",
              color: "#fff",
              border: 0,
              borderRadius: 8,
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            Recharger
          </button>
        </div>
      </body>
    </html>
  );
}
