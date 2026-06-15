import { useLanguageStore } from "@/store/languageStore";

export default function Footer() {
  const year = new Date().getFullYear();
  const { lang, toggle } = useLanguageStore();

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
        justifyContent: "space-between",
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

      <button
        onClick={toggle}
        style={{
          fontFamily: "'Figtree', sans-serif",
          fontSize: "11px",
          fontWeight: 600,
          color: "#444444",
          background: "none",
          border: "1px solid #E5E5E5",
          borderRadius: "6px",
          cursor: "pointer",
          letterSpacing: "0.08em",
          padding: "2px 8px",
          height: "22px",
          lineHeight: "18px",
          transition: "border-color 0.15s ease, color 0.15s ease",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#0A0A0A"; e.currentTarget.style.color = "#0A0A0A"; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E5E5E5"; e.currentTarget.style.color = "#444444"; }}
      >
        {lang === "en" ? "EN" : "CS"}
      </button>
    </footer>
  );
}
