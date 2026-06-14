import { useEffect, useRef, useState } from "react";
import QRCodeLib from "qrcode";

interface QRCodeProps {
  data: string;
  size?: number;
  label?: string;
}

export default function QRCode({ data, size = 220, label }: QRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!canvasRef.current || !data) return;
    setError(false);
    QRCodeLib.toCanvas(canvasRef.current, data, {
      width: size,
      margin: 2,
      color: { dark: "#0A0A0A", light: "#FFFFFF" },
      errorCorrectionLevel: "M",
    }).catch(() => setError(true));
  }, [data, size]);

  if (error || !data) {
    return (
      <div style={{ width: size, height: size, background: "#F2F2F2", borderRadius: "12px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px" }}>
        <span style={{ fontSize: "32px" }}>QR</span>
        <span style={{ fontFamily: "'Figtree', sans-serif", fontSize: "11px", color: "#AAAAAA", textAlign: "center", padding: "0 12px" }}>
          {!data ? "Artist bank account not set" : "QR generation failed"}
        </span>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
      <div style={{ padding: "12px", background: "#FFFFFF", borderRadius: "16px", boxShadow: "0 2px 16px rgba(0,0,0,0.08)", border: "1px solid #E5E5E5" }}>
        <canvas ref={canvasRef} style={{ display: "block", borderRadius: "6px" }} />
      </div>
      {label && (
        <p style={{ fontFamily: "'Figtree', sans-serif", fontSize: "12px", color: "#888888", margin: 0, textAlign: "center" }}>{label}</p>
      )}
    </div>
  );
}
