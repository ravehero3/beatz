import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation } from "wouter";
import {
  GripVertical, Plus, Trash2, Edit3, Eye, Save, ArrowLeft,
  ImageIcon, Music, Youtube, DollarSign, Package, X, Upload,
  BarChart2, ShoppingBag, Settings, User, Mail, Check, Loader2,
  ChevronRight, Monitor,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";

const F = "'Figtree', sans-serif";
const R = "'Roboto', sans-serif";

/* ─── Types ─────────────────────────────────────────────────────────── */

type SectionType = "hero" | "playlist" | "youtube" | "pricing" | "soundkit";

interface HeroSection {
  id: string; type: "hero";
  bgUrl: string; logoUrl: string; logoSize: "sm" | "md" | "lg";
}
interface PlaylistSection {
  id: string; type: "playlist";
  bg: "white" | "black" | "light" | "dark";
}
interface YoutubeSection {
  id: string; type: "youtube";
  videoUrl: string;
}
interface PricingSection {
  id: string; type: "pricing";
  freeLabel?: string; exclusiveLabel?: string; exclusivePrice?: number;
}
interface SoundKit {
  id: string; title: string; price: number; description?: string; imageUrl?: string;
}
interface SoundKitSection {
  id: string; type: "soundkit"; kits: SoundKit[];
}
type Section = HeroSection | PlaylistSection | YoutubeSection | PricingSection | SoundKitSection;

interface PageConfig {
  sections: Section[];
  footerEmail: string;
}

function uid() { return Math.random().toString(36).slice(2, 10); }

function extractYtId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?]+)/);
  return m ? m[1] : null;
}

const LOGO_SIZES: Record<string, number> = { sm: 80, md: 140, lg: 220 };

const PLAYLIST_BGS = [
  { value: "white" as const, label: "White", hex: "#FFFFFF" },
  { value: "black" as const, label: "Black", hex: "#0A0A0A" },
  { value: "light" as const, label: "Light Grey", hex: "#F2F2F2" },
  { value: "dark" as const, label: "Dark Grey", hex: "#1C1C1C" },
];

const SECTION_OPTS = [
  { type: "hero" as SectionType, Icon: ImageIcon, label: "Hero", desc: "Full-width background image with centered logo" },
  { type: "playlist" as SectionType, Icon: Music, label: "Beat Playlist", desc: "Interactive beat player with your tracks" },
  { type: "youtube" as SectionType, Icon: Youtube, label: "YouTube Video", desc: "Showcase one of your YouTube videos" },
  { type: "pricing" as SectionType, Icon: DollarSign, label: "Beat Pricing", desc: "FREE and Exclusive licensing option cards" },
  { type: "soundkit" as SectionType, Icon: Package, label: "Sound Kits", desc: "Upload and sell your sound kits" },
];

const ADMIN_NAV = [
  { href: "/studio", Icon: BarChart2, label: "Dashboard" },
  { href: "/studio/beats", Icon: Music, label: "Beats" },
  { href: "/studio/orders", Icon: ShoppingBag, label: "Orders" },
  { href: "/studio/earnings", Icon: DollarSign, label: "Earnings" },
  { href: "/studio/profile", Icon: User, label: "Profile" },
  { href: "/studio/settings", Icon: Settings, label: "Settings" },
];

/* ─── Upload helper ──────────────────────────────────────────────── */
async function uploadFile(file: File, token: string | null): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/upload", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: fd,
  });
  const data = await res.json();
  if (!data.url) throw new Error("Upload failed");
  return data.url;
}

/* ─── Primitives ─────────────────────────────────────────────────── */

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: F, fontSize: "12px", fontWeight: 600, color: "#555", marginBottom: "6px" }}>
      {children}
    </div>
  );
}

function FInput({ value, onChange, placeholder, type = "text" }: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <input
      type={type} value={value} placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: "100%", height: "40px", padding: "0 12px", borderRadius: "10px",
        border: "1px solid #E5E5E5", fontFamily: F, fontSize: "14px", outline: "none",
        boxSizing: "border-box", background: "#FAFAFA", color: "#0A0A0A",
        transition: "border-color 0.15s",
      }}
      onFocus={(e) => (e.target.style.borderColor = "#0A0A0A")}
      onBlur={(e) => (e.target.style.borderColor = "#E5E5E5")}
    />
  );
}

function ImageUploader({ value, onChange, token, label, circle, aspect = "16/6" }: {
  value: string; onChange: (url: string) => void; token: string | null;
  label: string; circle?: boolean; aspect?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [hov, setHov] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  async function handle(file: File) {
    setUploading(true);
    try { const url = await uploadFile(file, token); onChange(url); }
    catch {}
    finally { setUploading(false); }
  }

  const size = circle ? "88px" : "100%";
  return (
    <div>
      <Label>{label}</Label>
      <div
        onClick={() => ref.current?.click()}
        onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
        style={{
          width: size, aspectRatio: circle ? "1" : aspect, borderRadius: circle ? "50%" : "12px",
          border: value ? "none" : "2px dashed #DEDEDE", overflow: "hidden", cursor: "pointer",
          position: "relative", background: value ? "transparent" : "#F9F9F9",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}
      >
        {value && <img src={value} alt="" style={{ width: "100%", height: "100%", objectFit: circle ? "cover" : "contain" }} />}
        <div style={{
          position: "absolute", inset: 0, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: "4px",
          background: value ? (hov ? "rgba(0,0,0,0.55)" : "transparent") : "transparent",
          transition: "background 0.2s", pointerEvents: "none",
        }}>
          {(!value || hov) && (uploading
            ? <Loader2 size={18} color={value ? "#fff" : "#AAA"} style={{ animation: "spin 1s linear infinite" }} />
            : <><Upload size={16} color={value ? "#fff" : "#CCC"} />
              <span style={{ fontFamily: F, fontSize: "11px", color: value ? "#fff" : "#AAA" }}>
                {value ? "Change" : "Click to upload"}
              </span></>
          )}
        </div>
        <input ref={ref} type="file" accept="image/*" style={{ display: "none" }}
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handle(f); e.target.value = ""; }} />
      </div>
    </div>
  );
}

function ModalWrap({ onClose, title, children, onSave }: {
  onClose: () => void; title: string; children: React.ReactNode; onSave: () => void;
}) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(10,10,10,0.45)", backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: "24px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#FFFFFF", borderRadius: "20px", width: "100%", maxWidth: "480px",
          boxShadow: "0 32px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.06)",
          maxHeight: "88vh", overflowY: "auto", display: "flex", flexDirection: "column",
        }}
      >
        <div style={{
          padding: "22px 24px 18px", borderBottom: "1px solid #F0F0F0",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          position: "sticky", top: 0, background: "#FFFFFF", zIndex: 1, borderRadius: "20px 20px 0 0",
        }}>
          <span style={{ fontFamily: F, fontWeight: 700, fontSize: "16px", color: "#0A0A0A", letterSpacing: "-0.02em" }}>{title}</span>
          <button onClick={onClose} style={{
            width: "30px", height: "30px", borderRadius: "50%", border: "none",
            background: "#F5F5F5", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          }}><X size={13} color="#666" /></button>
        </div>

        <div style={{ padding: "24px", flex: 1 }}>{children}</div>

        <div style={{
          padding: "16px 24px", borderTop: "1px solid #F0F0F0",
          display: "flex", justifyContent: "flex-end", gap: "10px",
          position: "sticky", bottom: 0, background: "#FFFFFF", borderRadius: "0 0 20px 20px",
        }}>
          <button onClick={onClose} style={{
            height: "38px", padding: "0 18px", borderRadius: "10px", border: "1px solid #E5E5E5",
            background: "#FAFAFA", fontFamily: F, fontSize: "13px", color: "#666", cursor: "pointer",
          }}>Cancel</button>
          <button onClick={onSave} style={{
            height: "38px", padding: "0 20px", borderRadius: "10px", border: "none",
            background: "#0A0A0A", fontFamily: F, fontSize: "13px", fontWeight: 600, color: "#fff", cursor: "pointer",
          }}>Save changes</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Section Edit Modals ─────────────────────────────────────────── */

function HeroModal({ section, token, onSave, onClose }: {
  section: HeroSection; token: string | null;
  onSave: (s: HeroSection) => void; onClose: () => void;
}) {
  const [draft, setDraft] = useState({ ...section });
  return (
    <ModalWrap title="Edit Hero Section" onClose={onClose} onSave={() => onSave(draft)}>
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <ImageUploader label="Background Image" value={draft.bgUrl} onChange={(url) => setDraft({ ...draft, bgUrl: url })} token={token} aspect="16/7" />
        <div style={{ display: "flex", gap: "16px", alignItems: "flex-end" }}>
          <ImageUploader label="Logo / Watermark" value={draft.logoUrl} onChange={(url) => setDraft({ ...draft, logoUrl: url })} token={token} circle aspect="1" />
          <div style={{ flex: 1 }}>
            <Label>Logo Size</Label>
            <div style={{ display: "flex", gap: "8px" }}>
              {(["sm", "md", "lg"] as const).map((sz) => (
                <button key={sz} onClick={() => setDraft({ ...draft, logoSize: sz })} style={{
                  flex: 1, height: "36px", borderRadius: "8px", border: `1.5px solid ${draft.logoSize === sz ? "#0A0A0A" : "#E5E5E5"}`,
                  background: draft.logoSize === sz ? "#0A0A0A" : "#FAFAFA",
                  color: draft.logoSize === sz ? "#fff" : "#666",
                  fontFamily: F, fontSize: "12px", fontWeight: 600, cursor: "pointer",
                }}>
                  {sz === "sm" ? "Small" : sz === "md" ? "Medium" : "Large"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ModalWrap>
  );
}

function PlaylistModal({ section, onSave, onClose }: {
  section: PlaylistSection; onSave: (s: PlaylistSection) => void; onClose: () => void;
}) {
  const [draft, setDraft] = useState({ ...section });
  return (
    <ModalWrap title="Edit Beat Playlist" onClose={onClose} onSave={() => onSave(draft)}>
      <div>
        <Label>Section Background</Label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "4px" }}>
          {PLAYLIST_BGS.map((opt) => (
            <button key={opt.value} onClick={() => setDraft({ ...draft, bg: opt.value })} style={{
              height: "52px", borderRadius: "12px",
              border: `2px solid ${draft.bg === opt.value ? "#0A0A0A" : "#E5E5E5"}`,
              background: opt.hex, cursor: "pointer", display: "flex", alignItems: "center",
              justifyContent: "center", gap: "8px", transition: "border-color 0.15s",
              boxShadow: draft.bg === opt.value ? "0 0 0 3px rgba(10,10,10,0.08)" : "none",
            }}>
              <span style={{
                fontFamily: F, fontSize: "13px", fontWeight: 600,
                color: opt.value === "white" || opt.value === "light" ? "#0A0A0A" : "#FFFFFF",
              }}>{opt.label}</span>
              {draft.bg === opt.value && <Check size={14} color={opt.value === "white" || opt.value === "light" ? "#0A0A0A" : "#FFFFFF"} />}
            </button>
          ))}
        </div>
        <p style={{ fontFamily: F, fontSize: "12px", color: "#AAA", marginTop: "14px", lineHeight: 1.6 }}>
          Your uploaded beats will appear here automatically. The playlist fills the full width of the page.
        </p>
      </div>
    </ModalWrap>
  );
}

function YoutubeModal({ section, onSave, onClose }: {
  section: YoutubeSection; onSave: (s: YoutubeSection) => void; onClose: () => void;
}) {
  const [draft, setDraft] = useState({ ...section });
  const ytId = extractYtId(draft.videoUrl);
  return (
    <ModalWrap title="Edit YouTube Section" onClose={onClose} onSave={() => onSave(draft)}>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div>
          <Label>YouTube Video URL</Label>
          <FInput value={draft.videoUrl} onChange={(v) => setDraft({ ...draft, videoUrl: v })} placeholder="https://www.youtube.com/watch?v=..." />
        </div>
        {ytId && (
          <div style={{ borderRadius: "12px", overflow: "hidden", aspectRatio: "16/9" }}>
            <iframe
              src={`https://www.youtube.com/embed/${ytId}`}
              style={{ width: "100%", height: "100%", border: "none" }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}
        {!ytId && draft.videoUrl && (
          <div style={{
            background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "10px",
            padding: "12px", fontFamily: F, fontSize: "13px", color: "#DC2626",
          }}>
            Could not detect a valid YouTube URL. Please use the full video link.
          </div>
        )}
      </div>
    </ModalWrap>
  );
}

function PricingModal({ section, onSave, onClose }: {
  section: PricingSection; onSave: (s: PricingSection) => void; onClose: () => void;
}) {
  const [draft, setDraft] = useState({ ...section });
  return (
    <ModalWrap title="Edit Pricing Section" onClose={onClose} onSave={() => onSave(draft)}>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div>
          <Label>Free Card Button Label</Label>
          <FInput value={draft.freeLabel ?? "Browse Free Beats"} onChange={(v) => setDraft({ ...draft, freeLabel: v })} placeholder="Browse Free Beats" />
        </div>
        <div>
          <Label>Exclusive Card Heading</Label>
          <FInput value={draft.exclusiveLabel ?? "Exclusive License"} onChange={(v) => setDraft({ ...draft, exclusiveLabel: v })} placeholder="Exclusive License" />
        </div>
        <div>
          <Label>Exclusive Price (Kč)</Label>
          <FInput type="number" value={String(draft.exclusivePrice ?? 4990)} onChange={(v) => setDraft({ ...draft, exclusivePrice: Number(v) })} placeholder="4990" />
        </div>
        <div style={{ background: "#F9F9F9", borderRadius: "12px", padding: "14px" }}>
          <p style={{ fontFamily: F, fontSize: "12px", color: "#888", lineHeight: 1.65, margin: 0 }}>
            The <strong>FREE</strong> card will scroll users down to your beat playlist and briefly highlight the download buttons. The <strong>EXCLUSIVE</strong> card shows your custom heading and price.
          </p>
        </div>
      </div>
    </ModalWrap>
  );
}

function SoundKitModal({ section, token, onSave, onClose }: {
  section: SoundKitSection; token: string | null;
  onSave: (s: SoundKitSection) => void; onClose: () => void;
}) {
  const [kits, setKits] = useState<SoundKit[]>(section.kits);

  function addKit() {
    setKits([...kits, { id: uid(), title: "", price: 0, description: "", imageUrl: "" }]);
  }
  function updateKit(id: string, patch: Partial<SoundKit>) {
    setKits(kits.map((k) => k.id === id ? { ...k, ...patch } : k));
  }
  function removeKit(id: string) { setKits(kits.filter((k) => k.id !== id)); }

  return (
    <ModalWrap title="Edit Sound Kits" onClose={onClose} onSave={() => onSave({ ...section, kits })}>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {kits.map((kit, i) => (
          <div key={kit.id} style={{
            border: "1px solid #E8E8E8", borderRadius: "14px", padding: "16px",
            background: "#FAFAFA",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
              <span style={{ fontFamily: F, fontWeight: 600, fontSize: "13px", color: "#0A0A0A" }}>Kit {i + 1}</span>
              <button onClick={() => removeKit(kit.id)} style={{
                width: "26px", height: "26px", borderRadius: "8px", border: "none",
                background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#CCC",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "#EF4444"; e.currentTarget.style.background = "#FEF2F2"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "#CCC"; e.currentTarget.style.background = "transparent"; }}
              ><Trash2 size={13} /></button>
            </div>
            <div style={{ display: "flex", gap: "12px", marginBottom: "10px" }}>
              <ImageUploader label="Cover" value={kit.imageUrl ?? ""} onChange={(url) => updateKit(kit.id, { imageUrl: url })} token={token} circle aspect="1" />
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
                <div>
                  <Label>Title</Label>
                  <FInput value={kit.title} onChange={(v) => updateKit(kit.id, { title: v })} placeholder="808s Vol. 1" />
                </div>
                <div>
                  <Label>Price (Kč)</Label>
                  <FInput type="number" value={String(kit.price)} onChange={(v) => updateKit(kit.id, { price: Number(v) })} placeholder="990" />
                </div>
              </div>
            </div>
          </div>
        ))}
        <button onClick={addKit} style={{
          height: "44px", borderRadius: "12px", border: "1.5px dashed #E0E0E0",
          background: "#FAFAFA", fontFamily: F, fontSize: "13px", fontWeight: 600,
          color: "#888", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
          transition: "border-color 0.15s, color 0.15s",
        }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#0A0A0A"; e.currentTarget.style.color = "#0A0A0A"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E0E0E0"; e.currentTarget.style.color = "#888"; }}
        >
          <Plus size={15} /> Add Sound Kit
        </button>
      </div>
    </ModalWrap>
  );
}

/* ─── Section Type Picker ─────────────────────────────────────────── */

function SectionTypePicker({ onPick, onClose }: {
  onPick: (type: SectionType) => void; onClose: () => void;
}) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(10,10,10,0.5)", backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: "24px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#FFFFFF", borderRadius: "22px", width: "100%", maxWidth: "520px",
          boxShadow: "0 40px 100px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.06)",
          overflow: "hidden",
        }}
      >
        <div style={{ padding: "22px 24px 16px", borderBottom: "1px solid #F0F0F0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: F, fontWeight: 700, fontSize: "16px", color: "#0A0A0A", letterSpacing: "-0.02em" }}>Add a Section</div>
            <div style={{ fontFamily: F, fontSize: "12px", color: "#AAA", marginTop: "2px" }}>Choose what type of section to add</div>
          </div>
          <button onClick={onClose} style={{
            width: "30px", height: "30px", borderRadius: "50%", border: "none",
            background: "#F5F5F5", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          }}><X size={13} color="#666" /></button>
        </div>
        <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
          {SECTION_OPTS.map(({ type, Icon, label, desc }) => (
            <button
              key={type}
              onClick={() => { onPick(type); onClose(); }}
              style={{
                display: "flex", alignItems: "center", gap: "14px",
                padding: "14px 16px", borderRadius: "14px", border: "1.5px solid #F0F0F0",
                background: "#FAFAFA", cursor: "pointer", textAlign: "left",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#F2F2F2";
                e.currentTarget.style.borderColor = "#E0E0E0";
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.06)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#FAFAFA";
                e.currentTarget.style.borderColor = "#F0F0F0";
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div style={{
                width: "42px", height: "42px", borderRadius: "12px", background: "#F0F0F0",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <Icon size={18} color="#333" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: F, fontWeight: 600, fontSize: "14px", color: "#0A0A0A" }}>{label}</div>
                <div style={{ fontFamily: R, fontSize: "12px", color: "#888", marginTop: "2px" }}>{desc}</div>
              </div>
              <ChevronRight size={16} color="#CCC" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Canvas Section Previews ─────────────────────────────────────── */

function HeroPreview({ section }: { section: HeroSection }) {
  const logoSize = LOGO_SIZES[section.logoSize] ?? 140;
  return (
    <div style={{
      width: "100%", height: "380px", position: "relative", overflow: "hidden",
      background: section.bgUrl ? "transparent" : "linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      {section.bgUrl && (
        <img src={section.bgUrl} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      )}
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.35)" }} />
      {!section.bgUrl && !section.logoUrl && (
        <div style={{ position: "relative", textAlign: "center" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
            <ImageIcon size={22} color="rgba(255,255,255,0.5)" />
          </div>
          <p style={{ fontFamily: F, fontSize: "13px", color: "rgba(255,255,255,0.4)", margin: 0 }}>Click Edit to add a background image and logo</p>
        </div>
      )}
      {section.logoUrl && (
        <img src={section.logoUrl} alt="" style={{
          position: "relative", zIndex: 1,
          width: `${logoSize}px`, height: `${logoSize}px`, objectFit: "contain",
          filter: "drop-shadow(0 4px 20px rgba(0,0,0,0.4))",
        }} />
      )}
    </div>
  );
}

function PlaylistPreview({ section, beats }: { section: PlaylistSection; beats: any[] }) {
  const bgHex = PLAYLIST_BGS.find((b) => b.value === section.bg)?.hex ?? "#FFFFFF";
  const isLight = section.bg === "white" || section.bg === "light";
  const textColor = isLight ? "#0A0A0A" : "#FFFFFF";
  const mutedColor = isLight ? "#888" : "rgba(255,255,255,0.45)";
  const borderColor = isLight ? "#F0F0F0" : "rgba(255,255,255,0.08)";

  return (
    <div style={{ width: "100%", background: bgHex, padding: "48px 40px" }}>
      <div style={{ maxWidth: "860px", margin: "0 auto" }}>
        <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: "22px", color: textColor, letterSpacing: "-0.03em", marginBottom: "24px" }}>
          Beats
        </h2>
        {beats.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px 0" }}>
            <Music size={32} color={mutedColor} style={{ margin: "0 auto 12px", display: "block" }} />
            <p style={{ fontFamily: F, fontSize: "14px", color: mutedColor, margin: 0 }}>Upload beats in My Beats to see them here</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            {beats.slice(0, 4).map((beat: any, i: number) => (
              <div key={beat.id} style={{
                display: "flex", alignItems: "center", gap: "12px", padding: "10px 0",
                borderBottom: i < Math.min(beats.length, 4) - 1 ? `1px solid ${borderColor}` : "none",
              }}>
                <span style={{ fontFamily: R, fontSize: "12px", color: mutedColor, width: "20px", textAlign: "center" }}>{i + 1}</span>
                <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: borderColor, overflow: "hidden", flexShrink: 0 }}>
                  {beat.coverUrl && <img src={beat.coverUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: F, fontWeight: 600, fontSize: "13px", color: textColor, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{beat.title}</div>
                  <div style={{ fontFamily: R, fontSize: "11px", color: mutedColor }}>{beat.bpm ? `${beat.bpm} BPM` : ""} {beat.genre ?? ""}</div>
                </div>
                {beat.priceBasic && <span style={{ fontFamily: F, fontSize: "12px", fontWeight: 700, color: textColor, flexShrink: 0 }}>{Math.round(beat.priceBasic / 100)} Kč</span>}
              </div>
            ))}
            {beats.length > 4 && (
              <p style={{ fontFamily: F, fontSize: "12px", color: mutedColor, textAlign: "center", marginTop: "12px" }}>+{beats.length - 4} more beats</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function YoutubePreview({ section }: { section: YoutubeSection }) {
  const ytId = extractYtId(section.videoUrl);
  return (
    <div style={{ width: "100%", background: "#0A0A0A", padding: "56px 40px" }}>
      <div style={{ maxWidth: "860px", margin: "0 auto" }}>
        {ytId ? (
          <div style={{ borderRadius: "16px", overflow: "hidden", aspectRatio: "16/9", boxShadow: "0 24px 60px rgba(0,0,0,0.5)" }}>
            <iframe
              src={`https://www.youtube.com/embed/${ytId}`}
              style={{ width: "100%", height: "100%", border: "none" }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <div style={{
            aspectRatio: "16/9", borderRadius: "16px", border: "1.5px dashed rgba(255,255,255,0.15)",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px",
          }}>
            <Youtube size={32} color="rgba(255,255,255,0.25)" />
            <p style={{ fontFamily: F, fontSize: "13px", color: "rgba(255,255,255,0.3)", margin: 0 }}>Paste a YouTube link in the editor to embed your video</p>
          </div>
        )}
      </div>
    </div>
  );
}

function PricingPreview({ section }: { section: PricingSection }) {
  return (
    <div style={{ width: "100%", background: "#FAFAFA", padding: "56px 40px" }}>
      <div style={{ maxWidth: "860px", margin: "0 auto" }}>
        <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: "22px", color: "#0A0A0A", letterSpacing: "-0.03em", marginBottom: "8px" }}>Licensing</h2>
        <p style={{ fontFamily: R, fontSize: "14px", color: "#888", marginBottom: "32px" }}>Choose the right license for your project</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          {/* Free card */}
          <div style={{
            background: "#FFFFFF", border: "1.5px solid #EBEBEB", borderRadius: "20px", padding: "28px 24px",
            boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
          }}>
            <div style={{ fontFamily: F, fontWeight: 700, fontSize: "11px", color: "#888", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "12px" }}>Free</div>
            <div style={{ fontFamily: F, fontWeight: 800, fontSize: "28px", color: "#0A0A0A", letterSpacing: "-0.04em", marginBottom: "8px" }}>0 Kč</div>
            <p style={{ fontFamily: R, fontSize: "13px", color: "#888", lineHeight: 1.6, marginBottom: "20px" }}>
              Download any beat for free for non-commercial use. No credit card needed.
            </p>
            <div style={{
              height: "42px", borderRadius: "12px", border: "1.5px solid #E0E0E0",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: F, fontSize: "13px", fontWeight: 600, color: "#0A0A0A",
            }}>
              {section.freeLabel ?? "Browse Free Beats"} ↓
            </div>
          </div>
          {/* Exclusive card */}
          <div style={{
            background: "#0A0A0A", border: "1.5px solid #0A0A0A", borderRadius: "20px", padding: "28px 24px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
          }}>
            <div style={{ fontFamily: F, fontWeight: 700, fontSize: "11px", color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "12px" }}>Exclusive</div>
            <div style={{ fontFamily: F, fontWeight: 800, fontSize: "28px", color: "#FFFFFF", letterSpacing: "-0.04em", marginBottom: "8px" }}>
              {section.exclusivePrice ?? 4990} Kč
            </div>
            <p style={{ fontFamily: R, fontSize: "13px", color: "rgba(255,255,255,0.5)", lineHeight: 1.6, marginBottom: "20px" }}>
              {section.exclusiveLabel ?? "Full ownership — beat removed from store after purchase."}
            </p>
            <div style={{
              height: "42px", borderRadius: "12px", background: "#FFFFFF",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: F, fontSize: "13px", fontWeight: 600, color: "#0A0A0A",
            }}>
              Get Exclusive Rights
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SoundKitPreview({ section }: { section: SoundKitSection }) {
  return (
    <div style={{ width: "100%", background: "#FFFFFF", padding: "56px 40px" }}>
      <div style={{ maxWidth: "860px", margin: "0 auto" }}>
        <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: "22px", color: "#0A0A0A", letterSpacing: "-0.03em", marginBottom: "8px" }}>Sound Kits</h2>
        <p style={{ fontFamily: R, fontSize: "14px", color: "#888", marginBottom: "32px" }}>Professional samples & loops for producers</p>
        {section.kits.length === 0 ? (
          <div style={{
            border: "1.5px dashed #E0E0E0", borderRadius: "16px", padding: "48px",
            display: "flex", flexDirection: "column", alignItems: "center", gap: "10px",
          }}>
            <Package size={28} color="#CCC" />
            <p style={{ fontFamily: F, fontSize: "13px", color: "#CCC", margin: 0 }}>Add sound kits in the editor to display them here</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
            {section.kits.map((kit) => (
              <div key={kit.id} style={{
                border: "1.5px solid #F0F0F0", borderRadius: "16px", overflow: "hidden",
                background: "#FAFAFA", boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
              }}>
                <div style={{ aspectRatio: "1", background: "#F0F0F0", overflow: "hidden" }}>
                  {kit.imageUrl
                    ? <img src={kit.imageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}><Package size={24} color="#CCC" /></div>
                  }
                </div>
                <div style={{ padding: "14px" }}>
                  <div style={{ fontFamily: F, fontWeight: 700, fontSize: "14px", color: "#0A0A0A", marginBottom: "4px" }}>{kit.title || "Untitled Kit"}</div>
                  <div style={{ fontFamily: F, fontWeight: 700, fontSize: "13px", color: "#0A0A0A", marginBottom: "10px" }}>{kit.price} Kč</div>
                  <div style={{
                    height: "34px", borderRadius: "10px", background: "#0A0A0A",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: F, fontSize: "12px", fontWeight: 600, color: "#FFFFFF",
                  }}>Buy Now</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function renderSectionPreview(section: Section, beats: any[]) {
  switch (section.type) {
    case "hero": return <HeroPreview section={section} />;
    case "playlist": return <PlaylistPreview section={section} beats={beats} />;
    case "youtube": return <YoutubePreview section={section} />;
    case "pricing": return <PricingPreview section={section} />;
    case "soundkit": return <SoundKitPreview section={section} />;
  }
}

function getSectionLabel(type: SectionType) {
  return SECTION_OPTS.find((o) => o.type === type)?.label ?? type;
}
function getSectionIcon(type: SectionType) {
  return SECTION_OPTS.find((o) => o.type === type)?.Icon ?? ImageIcon;
}

/* ─── Canvas Section Card ─────────────────────────────────────────── */

function CanvasSectionCard({
  section, index, total, beats,
  onEdit, onDelete, onMoveUp, onMoveDown,
  dragHandleProps,
}: {
  section: Section; index: number; total: number; beats: any[];
  onEdit: () => void; onDelete: () => void;
  onMoveUp: () => void; onMoveDown: () => void;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
}) {
  const [hov, setHov] = useState(false);
  const Icon = getSectionIcon(section.type);

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: "relative", width: "100%",
        transition: "transform 0.18s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.18s",
        transform: hov ? "scale(1.004)" : "scale(1)",
        boxShadow: hov ? "0 8px 40px rgba(0,0,0,0.10)" : "none",
        borderRadius: "4px", overflow: "hidden",
      }}
    >
      {/* Section content */}
      {renderSectionPreview(section, beats)}

      {/* Hover overlay */}
      {hov && (
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          border: "2px solid rgba(10,10,10,0.15)", borderRadius: "4px",
          transition: "opacity 0.15s",
        }} />
      )}

      {/* Floating controls (top-right) */}
      <div style={{
        position: "absolute", top: "12px", right: "12px", zIndex: 10,
        display: "flex", gap: "6px",
        opacity: hov ? 1 : 0, transition: "opacity 0.15s",
      }}>
        {index > 0 && (
          <ToolBtn onClick={onMoveUp} title="Move up">↑</ToolBtn>
        )}
        {index < total - 1 && (
          <ToolBtn onClick={onMoveDown} title="Move down">↓</ToolBtn>
        )}
        <ToolBtn onClick={onEdit} title="Edit section"><Edit3 size={13} /></ToolBtn>
        <ToolBtn onClick={onDelete} title="Delete section" danger><Trash2 size={13} /></ToolBtn>
      </div>

      {/* Section label badge (top-left) */}
      <div style={{
        position: "absolute", top: "12px", left: "12px", zIndex: 10,
        display: "flex", alignItems: "center", gap: "6px",
        background: "rgba(255,255,255,0.92)", backdropFilter: "blur(8px)",
        borderRadius: "8px", padding: "5px 10px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
        opacity: hov ? 1 : 0, transition: "opacity 0.15s",
      }}>
        <Icon size={12} color="#333" />
        <span style={{ fontFamily: F, fontSize: "11px", fontWeight: 600, color: "#333" }}>{getSectionLabel(section.type)}</span>
      </div>

      {/* Drag handle (left edge) */}
      <div
        {...dragHandleProps}
        title="Drag to reorder"
        style={{
          position: "absolute", top: "50%", left: "-1px", transform: "translateY(-50%)",
          width: "22px", height: "48px", borderRadius: "0 8px 8px 0",
          background: "rgba(255,255,255,0.88)", backdropFilter: "blur(8px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "grab", boxShadow: "2px 0 8px rgba(0,0,0,0.08)",
          opacity: hov ? 1 : 0, transition: "opacity 0.15s", zIndex: 10,
        }}
      >
        <GripVertical size={13} color="#999" />
      </div>
    </div>
  );
}

function ToolBtn({ onClick, title, danger, children }: {
  onClick: () => void; title?: string; danger?: boolean; children: React.ReactNode;
}) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      title={title}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        width: "30px", height: "30px", borderRadius: "8px", border: "none",
        background: hov ? (danger ? "#EF4444" : "#0A0A0A") : "rgba(255,255,255,0.92)",
        color: hov ? "#fff" : (danger ? "#EF4444" : "#333"),
        backdropFilter: "blur(8px)", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
        transition: "all 0.15s", fontFamily: F, fontSize: "13px", fontWeight: 700,
      }}
    >{children}</button>
  );
}

/* ─── Empty Section Add Button ────────────────────────────────────── */

function AddSectionButton({ onAdd }: { onAdd: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onAdd}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        width: "100%", minHeight: "120px",
        border: `2px dashed ${hov ? "#C0C0C0" : "#E8E8E8"}`,
        borderRadius: "12px", cursor: "pointer",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px",
        background: hov ? "#FAFAFA" : "transparent",
        transition: "all 0.18s",
        transform: hov ? "scale(1.01)" : "scale(1)",
      }}
    >
      <div style={{
        width: "36px", height: "36px", borderRadius: "10px",
        background: hov ? "#F0F0F0" : "#F5F5F5",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "background 0.15s",
      }}>
        <Plus size={18} color={hov ? "#0A0A0A" : "#CCC"} />
      </div>
      <span style={{ fontFamily: F, fontSize: "13px", fontWeight: 500, color: hov ? "#444" : "#BBB" }}>
        Add a section
      </span>
    </div>
  );
}

/* ─── Main StudioPageBuilder ─────────────────────────────────────── */

export default function StudioPageBuilder() {
  const { token, user } = useAuthStore();
  const [location] = useLocation();
  const [artist, setArtist] = useState<any>(null);
  const [beats, setBeats] = useState<any[]>([]);
  const [config, setConfig] = useState<PageConfig>({ sections: [], footerEmail: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [footerEditing, setFooterEditing] = useState(false);
  const [footerDraft, setFooterDraft] = useState("");
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  const dragSrcIdx = useRef<number | null>(null);

  // Load artist data
  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const r = await fetch("/api/artists/me", { headers: { Authorization: `Bearer ${token}` } });
        const data = await r.json();
        setArtist(data);
        if (data.pageSections) {
          try {
            const parsed = JSON.parse(data.pageSections);
            setConfig(parsed);
            setFooterDraft(parsed.footerEmail ?? "");
          } catch {}
        }
        // Load beats for this artist
        if (data.slug) {
          const br = await fetch(`/api/artists/${data.slug}`);
          const bd = await br.json();
          setBeats(bd.beats ?? []);
        }
      } catch {}
      setLoading(false);
    }
    load();
  }, [token]);

  async function save(cfg: PageConfig) {
    setSaving(true);
    setSaved(false);
    try {
      await fetch("/api/artists/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ pageSections: JSON.stringify(cfg) }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {}
    setSaving(false);
  }

  function addSection(type: SectionType) {
    let section: Section;
    switch (type) {
      case "hero": section = { id: uid(), type: "hero", bgUrl: "", logoUrl: "", logoSize: "md" }; break;
      case "playlist": section = { id: uid(), type: "playlist", bg: "white" }; break;
      case "youtube": section = { id: uid(), type: "youtube", videoUrl: "" }; break;
      case "pricing": section = { id: uid(), type: "pricing", freeLabel: "Browse Free Beats", exclusiveLabel: "Exclusive License", exclusivePrice: 4990 }; break;
      case "soundkit": section = { id: uid(), type: "soundkit", kits: [] }; break;
    }
    const next: PageConfig = { ...config, sections: [...config.sections, section] };
    setConfig(next);
    setEditingSection(section);
  }

  function updateSection(updated: Section) {
    const next: PageConfig = { ...config, sections: config.sections.map((s) => s.id === updated.id ? updated : s) };
    setConfig(next);
    setEditingSection(null);
    save(next);
  }

  function deleteSection(id: string) {
    const next: PageConfig = { ...config, sections: config.sections.filter((s) => s.id !== id) };
    setConfig(next);
    save(next);
  }

  function moveSection(from: number, to: number) {
    if (to < 0 || to >= config.sections.length) return;
    const arr = [...config.sections];
    const [item] = arr.splice(from, 1);
    arr.splice(to, 0, item);
    const next: PageConfig = { ...config, sections: arr };
    setConfig(next);
    save(next);
  }

  function saveFooter() {
    const next: PageConfig = { ...config, footerEmail: footerDraft };
    setConfig(next);
    setFooterEditing(false);
    save(next);
  }

  // Drag & Drop
  function onDragStart(idx: number) { dragSrcIdx.current = idx; }
  function onDragOver(e: React.DragEvent, idx: number) {
    e.preventDefault();
    setDragOverIdx(idx);
  }
  function onDrop(toIdx: number) {
    const from = dragSrcIdx.current;
    if (from === null || from === toIdx) { setDragOverIdx(null); dragSrcIdx.current = null; return; }
    const arr = [...config.sections];
    const [item] = arr.splice(from, 1);
    arr.splice(toIdx, 0, item);
    const next: PageConfig = { ...config, sections: arr };
    setConfig(next);
    save(next);
    setDragOverIdx(null);
    dragSrcIdx.current = null;
  }
  function onDragEnd() { setDragOverIdx(null); dragSrcIdx.current = null; }

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#FAFAFA" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
          <Loader2 size={28} color="#CCC" style={{ animation: "spin 1s linear infinite" }} />
          <span style={{ fontFamily: F, fontSize: "13px", color: "#AAA" }}>Loading builder…</span>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const storeUrl = artist?.slug ? `/artists/${artist.slug}` : null;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F0F0F0", paddingTop: "44px" }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
      `}</style>

      {/* ── Left Admin Panel ───────────────────────────────── */}
      <div style={{
        width: "260px", flexShrink: 0,
        background: "rgba(255,255,255,0.9)", backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderRight: "1px solid rgba(0,0,0,0.07)",
        position: "fixed", top: "44px", bottom: 0, left: 0,
        display: "flex", flexDirection: "column", overflowY: "auto", zIndex: 100,
      }}>
        {/* Panel header */}
        <div style={{ padding: "18px 16px 14px", borderBottom: "1px solid #F0F0F0" }}>
          <div style={{ fontFamily: F, fontWeight: 800, fontSize: "14px", color: "#0A0A0A", letterSpacing: "-0.02em" }}>
            Page Builder
          </div>
          <div style={{ fontFamily: F, fontSize: "11px", color: "#AAA", marginTop: "2px" }}>
            {artist?.displayName ?? "Your Store"}
          </div>
        </div>

        {/* Admin Nav */}
        <div style={{ padding: "10px 8px", borderBottom: "1px solid #F0F0F0" }}>
          {ADMIN_NAV.map(({ href, Icon, label }) => {
            const isActive = href === "/studio/store" ? true : false;
            return (
              <Link key={href} href={href}>
                <div style={{
                  display: "flex", alignItems: "center", gap: "10px",
                  padding: "8px 10px", borderRadius: "8px",
                  background: "transparent",
                  fontFamily: F, fontSize: "13px", color: "#555",
                  cursor: "pointer", textDecoration: "none", marginBottom: "1px",
                  transition: "background 0.12s, color 0.12s",
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#F5F5F5"; e.currentTarget.style.color = "#0A0A0A"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#555"; }}
                >
                  <Icon size={14} />
                  {label}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Page sections list */}
        <div style={{ flex: 1, padding: "14px 12px", display: "flex", flexDirection: "column", gap: "6px" }}>
          <div style={{ fontFamily: F, fontWeight: 700, fontSize: "11px", color: "#AAA", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "4px", paddingLeft: "4px" }}>
            Page Sections
          </div>

          {config.sections.length === 0 && (
            <div style={{ padding: "20px 8px", textAlign: "center" }}>
              <p style={{ fontFamily: F, fontSize: "12px", color: "#CCC", lineHeight: 1.6 }}>No sections yet. Add your first section below.</p>
            </div>
          )}

          {config.sections.map((section, idx) => {
            const Icon = getSectionIcon(section.type);
            return (
              <div key={section.id}
                draggable
                onDragStart={() => onDragStart(idx)}
                onDragOver={(e) => onDragOver(e, idx)}
                onDrop={() => onDrop(idx)}
                onDragEnd={onDragEnd}
                style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  padding: "8px 10px", borderRadius: "10px",
                  background: dragOverIdx === idx ? "#F0F0F0" : "#FAFAFA",
                  border: `1px solid ${dragOverIdx === idx ? "#D0D0D0" : "#EBEBEB"}`,
                  cursor: "grab", transition: "all 0.12s",
                }}
              >
                <GripVertical size={13} color="#CCC" style={{ flexShrink: 0 }} />
                <div style={{
                  width: "26px", height: "26px", borderRadius: "7px", background: "#F0F0F0",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <Icon size={12} color="#555" />
                </div>
                <span style={{ fontFamily: F, fontSize: "12px", fontWeight: 500, color: "#333", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {getSectionLabel(section.type)}
                </span>
                <div style={{ display: "flex", gap: "2px" }}>
                  <MiniBtn onClick={() => setEditingSection(section)} title="Edit"><Edit3 size={11} /></MiniBtn>
                  <MiniBtn onClick={() => deleteSection(section.id)} title="Delete" danger><Trash2 size={11} /></MiniBtn>
                </div>
              </div>
            );
          })}

          <button
            onClick={() => setPickerOpen(true)}
            style={{
              height: "38px", borderRadius: "10px", border: "1.5px dashed #E0E0E0",
              background: "transparent", fontFamily: F, fontSize: "12px", fontWeight: 600,
              color: "#AAA", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
              marginTop: "4px", transition: "all 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#0A0A0A"; e.currentTarget.style.color = "#0A0A0A"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E0E0E0"; e.currentTarget.style.color = "#AAA"; }}
          >
            <Plus size={13} /> Add Section
          </button>
        </div>

        {/* Footer settings */}
        <div style={{ padding: "14px 12px", borderTop: "1px solid #F0F0F0" }}>
          <div style={{ fontFamily: F, fontWeight: 700, fontSize: "11px", color: "#AAA", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "8px", paddingLeft: "4px" }}>
            Footer
          </div>
          {footerEditing ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <FInput value={footerDraft} onChange={setFooterDraft} placeholder="your@email.com" />
              <div style={{ display: "flex", gap: "6px" }}>
                <button onClick={() => setFooterEditing(false)} style={{ flex: 1, height: "32px", borderRadius: "8px", border: "1px solid #E5E5E5", background: "#FAFAFA", fontFamily: F, fontSize: "11px", color: "#888", cursor: "pointer" }}>Cancel</button>
                <button onClick={saveFooter} style={{ flex: 1, height: "32px", borderRadius: "8px", border: "none", background: "#0A0A0A", fontFamily: F, fontSize: "11px", fontWeight: 600, color: "#fff", cursor: "pointer" }}>Save</button>
              </div>
            </div>
          ) : (
            <button onClick={() => { setFooterDraft(config.footerEmail); setFooterEditing(true); }} style={{
              width: "100%", height: "36px", borderRadius: "10px", border: "1px solid #EBEBEB",
              background: "#FAFAFA", fontFamily: F, fontSize: "12px", color: "#555",
              cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", padding: "0 10px",
              transition: "all 0.12s",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#F0F0F0"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#FAFAFA"; }}
            >
              <Mail size={13} color="#AAA" />
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, textAlign: "left" }}>
                {config.footerEmail || "Add contact email…"}
              </span>
              <Edit3 size={11} color="#CCC" />
            </button>
          )}
        </div>

        {/* Bottom actions */}
        <div style={{ padding: "12px", borderTop: "1px solid #F0F0F0", display: "flex", flexDirection: "column", gap: "8px" }}>
          <button onClick={() => save(config)} style={{
            height: "40px", borderRadius: "10px", border: "none",
            background: saved ? "#16A34A" : "#0A0A0A",
            fontFamily: F, fontSize: "13px", fontWeight: 600, color: "#fff",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "7px",
            transition: "background 0.3s",
          }}>
            {saving ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : saved ? <Check size={14} /> : <Save size={14} />}
            {saving ? "Saving…" : saved ? "Saved!" : "Save Page"}
          </button>
          {storeUrl && (
            <a href={storeUrl} target="_blank" rel="noreferrer" style={{
              height: "36px", borderRadius: "10px", border: "1px solid #E5E5E5",
              fontFamily: F, fontSize: "12px", color: "#666",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
              textDecoration: "none", transition: "all 0.12s",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#F5F5F5"; e.currentTarget.style.color = "#0A0A0A"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#666"; }}
            >
              <Eye size={13} /> View Live Page
            </a>
          )}
          <Link href="/">
            <div style={{
              height: "32px", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
              fontFamily: F, fontSize: "12px", color: "#AAA", cursor: "pointer",
              transition: "color 0.12s",
            }}
              onMouseEnter={(e) => e.currentTarget.style.color = "#333"}
              onMouseLeave={(e) => e.currentTarget.style.color = "#AAA"}
            >
              <ArrowLeft size={12} /> Back to Beatpack
            </div>
          </Link>
        </div>
      </div>

      {/* ── Right Canvas ───────────────────────────────────── */}
      <div style={{ marginLeft: "260px", flex: 1, overflowY: "auto", background: "#E8E8E8", minHeight: "100vh" }}>
        <div style={{ padding: "24px" }}>

          {/* Canvas toolbar */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            marginBottom: "20px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Monitor size={15} color="#888" />
              <span style={{ fontFamily: F, fontSize: "12px", color: "#888" }}>
                Canvas Preview — edits save automatically
              </span>
            </div>
            {storeUrl && (
              <a href={storeUrl} target="_blank" rel="noreferrer" style={{
                height: "32px", padding: "0 14px", borderRadius: "8px",
                background: "rgba(255,255,255,0.8)", border: "1px solid rgba(0,0,0,0.1)",
                fontFamily: F, fontSize: "12px", color: "#555",
                display: "flex", alignItems: "center", gap: "6px", textDecoration: "none",
              }}>
                <Eye size={12} /> Live Page
              </a>
            )}
          </div>

          {/* Canvas frame */}
          <div style={{
            background: "#FFFFFF", borderRadius: "16px",
            boxShadow: "0 8px 40px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.06)",
            overflow: "hidden", minHeight: "500px",
            animation: "fadeIn 0.3s ease",
          }}>
            {/* Canvas top bar (mimics browser chrome) */}
            <div style={{
              height: "40px", background: "#F5F5F5", borderBottom: "1px solid #EBEBEB",
              display: "flex", alignItems: "center", padding: "0 14px", gap: "6px",
            }}>
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#FF5F56" }} />
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#FFBD2E" }} />
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#27C93F" }} />
              <div style={{ flex: 1, height: "22px", background: "#EBEBEB", borderRadius: "6px", margin: "0 12px", display: "flex", alignItems: "center", padding: "0 10px" }}>
                <span style={{ fontFamily: R, fontSize: "11px", color: "#AAA" }}>
                  {storeUrl ? `beatpack.cz${storeUrl}` : "your-store"}
                </span>
              </div>
            </div>

            {/* Page header preview */}
            <div style={{
              height: "52px", background: "#FFFFFF", borderBottom: "1px solid #F5F5F5",
              display: "flex", alignItems: "center", padding: "0 40px", justifyContent: "space-between",
            }}>
              <div style={{ fontFamily: F, fontWeight: 800, fontSize: "15px", color: "#0A0A0A", letterSpacing: "-0.03em" }}>
                {artist?.displayName ?? "Your Name"}
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <div style={{ height: "28px", padding: "0 12px", borderRadius: "8px", border: "1px solid #EBEBEB", display: "flex", alignItems: "center" }}>
                  <span style={{ fontFamily: F, fontSize: "11px", color: "#888" }}>Beats</span>
                </div>
                <div style={{ height: "28px", padding: "0 12px", borderRadius: "8px", background: "#0A0A0A", display: "flex", alignItems: "center" }}>
                  <span style={{ fontFamily: F, fontSize: "11px", fontWeight: 600, color: "#fff" }}>Cart (0)</span>
                </div>
              </div>
            </div>

            {/* Sections */}
            {config.sections.length === 0 ? (
              <div style={{ padding: "60px 40px" }}>
                <div style={{ maxWidth: "500px", margin: "0 auto", textAlign: "center" }}>
                  <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "#F5F5F5", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                    <Plus size={24} color="#CCC" />
                  </div>
                  <div style={{ fontFamily: F, fontWeight: 700, fontSize: "18px", color: "#0A0A0A", letterSpacing: "-0.02em", marginBottom: "8px" }}>
                    Your page is empty
                  </div>
                  <p style={{ fontFamily: R, fontSize: "14px", color: "#888", lineHeight: 1.6, marginBottom: "24px" }}>
                    Add sections from the left panel to build your artist page. Each section fills the full width.
                  </p>
                  <button onClick={() => setPickerOpen(true)} style={{
                    height: "44px", padding: "0 24px", borderRadius: "12px", border: "none",
                    background: "#0A0A0A", fontFamily: F, fontSize: "14px", fontWeight: 600, color: "#fff",
                    cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "8px",
                  }}>
                    <Plus size={15} /> Add First Section
                  </button>
                </div>
              </div>
            ) : (
              <div>
                {config.sections.map((section, idx) => (
                  <div
                    key={section.id}
                    draggable
                    onDragStart={() => onDragStart(idx)}
                    onDragOver={(e) => onDragOver(e, idx)}
                    onDrop={() => onDrop(idx)}
                    onDragEnd={onDragEnd}
                    style={{
                      outline: dragOverIdx === idx && dragSrcIdx.current !== idx ? "2px solid #0A0A0A" : "none",
                      outlineOffset: "2px",
                    }}
                  >
                    <CanvasSectionCard
                      section={section}
                      index={idx}
                      total={config.sections.length}
                      beats={beats}
                      onEdit={() => setEditingSection(section)}
                      onDelete={() => deleteSection(section.id)}
                      onMoveUp={() => moveSection(idx, idx - 1)}
                      onMoveDown={() => moveSection(idx, idx + 1)}
                    />
                  </div>
                ))}
                {/* Add section button at bottom */}
                <div style={{ padding: "24px 40px" }}>
                  <AddSectionButton onAdd={() => setPickerOpen(true)} />
                </div>
              </div>
            )}

            {/* Page footer preview */}
            <div style={{
              background: "#0A0A0A", padding: "32px 40px",
              display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "6px",
              borderTop: config.sections.length === 0 ? "none" : undefined,
            }}>
              {config.footerEmail ? (
                <a href={`mailto:${config.footerEmail}`} style={{ fontFamily: F, fontSize: "14px", color: "rgba(255,255,255,0.7)", textDecoration: "none" }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "#FFFFFF"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.7)"}
                >
                  {config.footerEmail}
                </a>
              ) : (
                <span style={{ fontFamily: F, fontSize: "13px", color: "rgba(255,255,255,0.2)", cursor: "pointer" }}
                  onClick={() => { setFooterDraft(""); setFooterEditing(true); }}
                >
                  + Add contact email
                </span>
              )}
              <span style={{ fontFamily: F, fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>beatpack.cz</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Modals ─────────────────────────────────────────── */}
      {pickerOpen && (
        <SectionTypePicker onPick={addSection} onClose={() => setPickerOpen(false)} />
      )}

      {editingSection && editingSection.type === "hero" && (
        <HeroModal section={editingSection as HeroSection} token={token} onSave={updateSection} onClose={() => setEditingSection(null)} />
      )}
      {editingSection && editingSection.type === "playlist" && (
        <PlaylistModal section={editingSection as PlaylistSection} onSave={updateSection} onClose={() => setEditingSection(null)} />
      )}
      {editingSection && editingSection.type === "youtube" && (
        <YoutubeModal section={editingSection as YoutubeSection} onSave={updateSection} onClose={() => setEditingSection(null)} />
      )}
      {editingSection && editingSection.type === "pricing" && (
        <PricingModal section={editingSection as PricingSection} onSave={updateSection} onClose={() => setEditingSection(null)} />
      )}
      {editingSection && editingSection.type === "soundkit" && (
        <SoundKitModal section={editingSection as SoundKitSection} token={token} onSave={updateSection} onClose={() => setEditingSection(null)} />
      )}
    </div>
  );
}

/* ─── Mini button helper ─────────────────────────────────────────── */
function MiniBtn({ onClick, title, danger, children }: {
  onClick: () => void; title?: string; danger?: boolean; children: React.ReactNode;
}) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      title={title}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        width: "22px", height: "22px", borderRadius: "6px", border: "none",
        background: hov ? (danger ? "#FEF2F2" : "#F0F0F0") : "transparent",
        color: hov ? (danger ? "#EF4444" : "#333") : "#CCC",
        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all 0.12s",
      }}
    >{children}</button>
  );
}
