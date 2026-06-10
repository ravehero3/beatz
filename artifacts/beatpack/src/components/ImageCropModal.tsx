import { useRef, useState, useCallback, useEffect } from "react";
import { X, Upload, ZoomIn, ZoomOut } from "lucide-react";

interface Props {
  onSave: (dataUrl: string) => void;
  onClose: () => void;
  initialUrl?: string;
}

export default function ImageCropModal({ onSave, onClose, initialUrl }: Props) {
  const [imgSrc, setImgSrc] = useState<string>(initialUrl ?? "");
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef<{ mx: number; my: number; ox: number; oy: number } | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const CROP_SIZE = 220;

  function handleFile(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      setImgSrc(e.target?.result as string);
      setScale(1);
      setOffset({ x: 0, y: 0 });
    };
    reader.readAsDataURL(file);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) handleFile(file);
  }

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (!imgSrc) return;
    e.preventDefault();
    setDragging(true);
    dragStart.current = { mx: e.clientX, my: e.clientY, ox: offset.x, oy: offset.y };
  }, [imgSrc, offset]);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging || !dragStart.current) return;
    setOffset({
      x: dragStart.current.ox + (e.clientX - dragStart.current.mx),
      y: dragStart.current.oy + (e.clientY - dragStart.current.my),
    });
  }, [dragging]);

  const onMouseUp = useCallback(() => {
    setDragging(false);
    dragStart.current = null;
  }, []);

  function handleSave() {
    if (!imgSrc || !canvasRef.current || !imgRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = CROP_SIZE;
    canvas.height = CROP_SIZE;
    ctx.clearRect(0, 0, CROP_SIZE, CROP_SIZE);
    ctx.beginPath();
    ctx.arc(CROP_SIZE / 2, CROP_SIZE / 2, CROP_SIZE / 2, 0, Math.PI * 2);
    ctx.clip();
    const img = imgRef.current;
    const naturalW = img.naturalWidth;
    const naturalH = img.naturalHeight;
    const baseSize = Math.min(naturalW, naturalH);
    const drawSize = baseSize * scale;
    const drawX = (CROP_SIZE - drawSize) / 2 + offset.x * (naturalW / CROP_SIZE) * scale;
    const drawY = (CROP_SIZE - drawSize) / 2 + offset.y * (naturalH / CROP_SIZE) * scale;
    ctx.drawImage(img, -drawX / scale, -drawY / scale, drawSize, drawSize);
    onSave(canvas.toDataURL("image/jpeg", 0.9));
  }

  useEffect(() => {
    function up() { setDragging(false); dragStart.current = null; }
    window.addEventListener("mouseup", up);
    return () => window.removeEventListener("mouseup", up);
  }, []);

  const F = "'Figtree', sans-serif";

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 2000,
        background: "rgba(0,0,0,0.6)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "24px",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: "#FFFFFF",
        borderRadius: "20px",
        padding: "32px",
        width: "100%",
        maxWidth: "420px",
        boxShadow: "0 32px 80px rgba(0,0,0,0.2)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h2 style={{ fontFamily: F, fontWeight: 700, fontSize: "18px", color: "#0A0A0A", letterSpacing: "-0.02em" }}>
            Nastavit profilový obrázek
          </h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#888888" }}>
            <X size={18} />
          </button>
        </div>

        {!imgSrc ? (
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
            style={{
              height: "200px",
              border: "2px dashed #E5E5E5",
              borderRadius: "16px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              cursor: "pointer",
              transition: "border-color 0.15s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = "#0A0A0A"}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = "#E5E5E5"}
          >
            <Upload size={28} color="#BBBBBB" />
            <span style={{ fontFamily: F, fontSize: "14px", color: "#888888" }}>
              Klikněte nebo přetáhněte obrázek
            </span>
            <span style={{ fontFamily: F, fontSize: "12px", color: "#BBBBBB" }}>JPG, PNG, WEBP</span>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: CROP_SIZE,
                height: CROP_SIZE,
                borderRadius: "50%",
                overflow: "hidden",
                position: "relative",
                cursor: dragging ? "grabbing" : "grab",
                background: "#F0F0F0",
                boxShadow: "0 0 0 3px #0A0A0A",
              }}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
            >
              <img
                ref={imgRef}
                src={imgSrc}
                alt="crop"
                draggable={false}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px)) scale(${scale})`,
                  transformOrigin: "center center",
                  maxWidth: "none",
                  maxHeight: "none",
                  width: CROP_SIZE,
                  height: CROP_SIZE,
                  objectFit: "cover",
                  userSelect: "none",
                }}
              />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <button
                onClick={() => setScale(s => Math.max(0.5, s - 0.1))}
                style={{ background: "#F2F2F2", border: "none", borderRadius: "50%", width: "32px", height: "32px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <ZoomOut size={14} />
              </button>
              <input
                type="range" min="0.5" max="2" step="0.05"
                value={scale}
                onChange={(e) => setScale(Number(e.target.value))}
                style={{ width: "120px" }}
              />
              <button
                onClick={() => setScale(s => Math.min(2, s + 0.1))}
                style={{ background: "#F2F2F2", border: "none", borderRadius: "50%", width: "32px", height: "32px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <ZoomIn size={14} />
              </button>
            </div>

            <button
              onClick={() => { setImgSrc(""); fileInputRef.current?.click(); }}
              style={{ fontFamily: F, fontSize: "13px", color: "#888888", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}
            >
              Změnit obrázek
            </button>
          </div>
        )}

        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
        <canvas ref={canvasRef} style={{ display: "none" }} />

        <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, height: "44px", borderRadius: "9999px",
              border: "1px solid #E5E5E5", background: "#FFFFFF",
              fontFamily: F, fontSize: "14px", fontWeight: 500, color: "#0A0A0A", cursor: "pointer",
            }}
          >
            Zrušit
          </button>
          <button
            onClick={handleSave}
            disabled={!imgSrc}
            style={{
              flex: 1, height: "44px", borderRadius: "9999px",
              border: "none", background: imgSrc ? "#0A0A0A" : "#E5E5E5",
              fontFamily: F, fontSize: "14px", fontWeight: 500, color: imgSrc ? "#FFFFFF" : "#AAAAAA",
              cursor: imgSrc ? "pointer" : "not-allowed",
            }}
          >
            Uložit
          </button>
        </div>
      </div>
    </div>
  );
}
