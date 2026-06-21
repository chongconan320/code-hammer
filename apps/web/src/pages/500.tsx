export default function InternalErrorPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 24,
        fontFamily: "system-ui, sans-serif",
        color: "#17211b",
        background: "#f7faf8",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: 420,
          border: "1px solid #d9e3dc",
          borderRadius: 8,
          background: "#ffffff",
          padding: 24,
          boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
        }}
      >
        <p style={{ margin: 0, color: "#64716a", fontWeight: 700 }}>500</p>
        <h1 style={{ margin: "8px 0 0", fontSize: 28 }}>
          Something went wrong
        </h1>
        <p style={{ margin: "8px 0 0", color: "#64716a", lineHeight: 1.5 }}>
          The service did not respond after a retry. Please try again.
        </p>
        <button
          onClick={() => window.location.assign("/workspace")}
          style={{
            marginTop: 20,
            minHeight: 40,
            border: 0,
            borderRadius: 6,
            background: "#1f6b45",
            color: "#ffffff",
            padding: "0 16px",
            fontWeight: 700,
            cursor: "pointer",
          }}
          type="button"
        >
          Back to workspace
        </button>
      </section>
    </main>
  );
}
