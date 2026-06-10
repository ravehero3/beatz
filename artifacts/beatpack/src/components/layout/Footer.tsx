export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        height: "44px",
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderTop: "1px solid #F2F2F2",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 24px",
      }}
    >
      <span
        style={{
          fontFamily: "'Figtree', sans-serif",
          fontSize: "13px",
          fontWeight: 500,
          color: "#888888",
          letterSpacing: "0.01em",
        }}
      >
        beatpack.cz {year}
      </span>
    </footer>
  );
}
