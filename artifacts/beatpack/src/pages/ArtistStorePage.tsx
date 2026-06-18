import { useState, useRef, useCallback } from "react";
import { useParams, useLocation } from "wouter";
import { X, ShoppingCart, Heart, Instagram, Trash2, ChevronLeft, Package } from "lucide-react";
import { useGetArtistBySlug, getGetArtistBySlugQueryKey } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { useAudioStore } from "@/store/audioStore";
import { useCartStore, type LicenseType } from "@/store/cartStore";
import { formatCurrency } from "@/lib/format";

const F = "'Figtree', sans-serif";
const R = "'Roboto', sans-serif";

/* ─── Page-builder section types ──────────────────────────────── */
type SectionType = "hero" | "playlist" | "youtube" | "pricing" | "soundkit";
interface HeroSec { id: string; type: "hero"; bgUrl: string; logoUrl: string; logoSize: "sm" | "md" | "lg" }
interface PlaylistSec { id: string; type: "playlist"; bg: "white" | "black" | "light" | "dark" }
interface YoutubeSec { id: string; type: "youtube"; videoUrl: string }
interface PricingSec { id: string; type: "pricing"; freeLabel?: string; exclusiveLabel?: string; exclusivePrice?: number }
interface SoundKitItem { id: string; title: string; price: number; description?: string; imageUrl?: string }
interface SoundKitSec { id: string; type: "soundkit"; kits: SoundKitItem[] }
type PageSection = HeroSec | PlaylistSec | YoutubeSec | PricingSec | SoundKitSec;
interface PageConfig { sections: PageSection[]; footerEmail: string }

const LOGO_SIZES: Record<string, number> = { sm: 80, md: 140, lg: 220 };
const PLAYLIST_BGS: Record<string, string> = { white: "#FFFFFF", black: "#0A0A0A", light: "#F2F2F2", dark: "#1C1C1C" };

function extractYtId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?]+)/);
  return m ? m[1] : null;
}

/* ─── Sections-based public renderers ────────────────────────── */
function PublicHeroSection({ section }: { section: HeroSec }) {
  const logoSize = LOGO_SIZES[section.logoSize] ?? 140;
  return (
    <div style={{ width: "100%", minHeight: "480px", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", background: section.bgUrl ? "transparent" : "#0A0A0A" }}>
      {section.bgUrl && <img src={section.bgUrl} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />}
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.38)" }} />
      {section.logoUrl && (
        <img src={section.logoUrl} alt="" style={{ position: "relative", zIndex: 1, width: `${logoSize}px`, height: `${logoSize}px`, objectFit: "contain", filter: "drop-shadow(0 4px 24px rgba(0,0,0,0.5))" }} />
      )}
    </div>
  );
}

function PublicPlaylistSection({ section, beats, artist }: { section: PlaylistSec; beats: any[]; artist: any }) {
  const bgHex = PLAYLIST_BGS[section.bg] ?? "#FFFFFF";
  const isLight = section.bg === "white" || section.bg === "light";
  const textColor = isLight ? "#0A0A0A" : "#FFFFFF";
  const mutedColor = isLight ? "#888" : "rgba(255,255,255,0.4)";
  const borderColor = isLight ? "#F0F0F0" : "rgba(255,255,255,0.07)";
  const { currentBeat, isPlaying: storeIsPlaying, setTrack, toggle } = useAudioStore();
  const { addItem, items } = useCartStore();

  return (
    <div id="playlist-section" style={{ width: "100%", background: bgHex, padding: "56px 0" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 24px" }}>
        <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: "26px", color: textColor, letterSpacing: "-0.03em", marginBottom: "28px" }}>Beats</h2>
        {beats.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ fontFamily: F, fontSize: "14px", color: mutedColor }}>No beats uploaded yet</div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            {beats.map((beat: any, idx: number) => {
              const isCurrentTrack = currentBeat?.id === beat.id;
              const isPlaying = isCurrentTrack && storeIsPlaying;
              const inCart = items.some((i) => i.beatId === beat.id);
              const palette = PALETTES[idx % PALETTES.length];
              return (
                <div key={beat.id} style={{
                  display: "flex", alignItems: "center", gap: "14px", padding: "12px 16px",
                  borderRadius: "12px", background: isPlaying ? palette.light : "transparent",
                  borderLeft: `3px solid ${isPlaying ? palette.accent : "transparent"}`,
                  transition: "all 0.15s",
                }}
                  onMouseEnter={(e) => { if (!isPlaying) e.currentTarget.style.background = isLight ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.04)"; }}
                  onMouseLeave={(e) => { if (!isPlaying) e.currentTarget.style.background = "transparent"; }}
                >
                  <span style={{ fontFamily: R, fontSize: "12px", color: isPlaying ? palette.accent : mutedColor, width: "18px", textAlign: "center", flexShrink: 0 }}>{idx + 1}</span>
                  <button onClick={() => { if (isCurrentTrack) { toggle(); } else { setTrack({ id: beat.id, title: beat.title, artistName: artist.displayName ?? null, coverUrl: beat.coverUrl ?? null, audioUrl: beat.audioPreviewUrl ?? "" }); } }}
                    style={{ width: "36px", height: "36px", borderRadius: "50%", border: `2px solid ${palette.accent}`, background: isPlaying ? palette.accent : "transparent", color: isPlaying ? "#fff" : palette.accent, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.15s" }}>
                    {isPlaying ? <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor"><rect x="0" y="0" width="3.5" height="10" rx="1" /><rect x="6.5" y="0" width="3.5" height="10" rx="1" /></svg>
                      : <svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor" style={{ marginLeft: "1px" }}><path d="M0.5 1.5 L9.5 6 L0.5 10.5 Z" /></svg>}
                  </button>
                  <div style={{ width: "38px", height: "38px", borderRadius: "8px", background: palette.bar, overflow: "hidden", flexShrink: 0 }}>
                    {beat.coverUrl && <img src={beat.coverUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: F, fontWeight: 700, fontSize: "14px", color: textColor, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{beat.title}</div>
                    <div style={{ display: "flex", gap: "5px", marginTop: "2px" }}>
                      {beat.bpm && <span style={{ fontFamily: R, fontSize: "10px", fontWeight: 600, padding: "1px 5px", borderRadius: "4px", background: palette.bar, color: palette.accent }}>{beat.bpm} BPM</span>}
                      {beat.genre && <span style={{ fontFamily: R, fontSize: "10px", padding: "1px 5px", borderRadius: "4px", background: isLight ? "#F0F0F0" : "rgba(255,255,255,0.08)", color: mutedColor }}>{beat.genre}</span>}
                    </div>
                  </div>
                  {beat.priceBasic && <span style={{ fontFamily: F, fontWeight: 700, fontSize: "13px", color: textColor, flexShrink: 0 }}>{formatCurrency(Number(beat.priceBasic))}</span>}
                  <button
                    data-beat-cart={beat.id}
                    onClick={() => { const lic: LicenseType = "basic"; addItem({ beatId: beat.id, beatTitle: beat.title, artistName: artist.displayName ?? null, artistSlug: artist.slug, coverUrl: beat.coverUrl ?? null, license: lic, price: Number(beat.priceBasic ?? 0) }); }}
                    style={{ width: "32px", height: "32px", borderRadius: "50%", border: `1.5px solid ${inCart ? palette.accent : (isLight ? "#E5E5E5" : "rgba(255,255,255,0.15)")}`, background: inCart ? palette.light : "transparent", color: inCart ? palette.accent : mutedColor, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.15s" }}>
                    <ShoppingCart size={12} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function PublicYoutubeSection({ section }: { section: YoutubeSec }) {
  const ytId = extractYtId(section.videoUrl);
  if (!ytId) return null;
  return (
    <div style={{ width: "100%", background: "#0A0A0A", padding: "64px 0" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 24px" }}>
        <div style={{ borderRadius: "18px", overflow: "hidden", aspectRatio: "16/9", boxShadow: "0 24px 64px rgba(0,0,0,0.6)" }}>
          <iframe src={`https://www.youtube.com/embed/${ytId}`} style={{ width: "100%", height: "100%", border: "none" }} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
        </div>
      </div>
    </div>
  );
}

function PublicPricingSection({ section }: { section: PricingSec }) {
  function scrollToPlaylist() {
    const el = document.getElementById("playlist-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      const btns = el.querySelectorAll("[data-beat-cart]") as NodeListOf<HTMLElement>;
      btns.forEach((btn, i) => {
        setTimeout(() => {
          btn.style.transform = "scale(1.3)";
          btn.style.background = "#FFF9C4";
          setTimeout(() => { btn.style.transform = ""; btn.style.background = ""; }, 400);
        }, i * 60);
      });
    }
  }
  return (
    <div style={{ width: "100%", background: "#FAFAFA", padding: "72px 0" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 24px" }}>
        <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: "28px", color: "#0A0A0A", letterSpacing: "-0.03em", marginBottom: "10px" }}>Licensing</h2>
        <p style={{ fontFamily: R, fontSize: "15px", color: "#888", marginBottom: "36px", lineHeight: 1.6 }}>Choose the right license for your project</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          <div style={{ background: "#FFFFFF", border: "1.5px solid #EBEBEB", borderRadius: "22px", padding: "32px 28px", boxShadow: "0 2px 16px rgba(0,0,0,0.04)" }}>
            <div style={{ fontFamily: F, fontWeight: 700, fontSize: "11px", color: "#AAA", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "14px" }}>Free</div>
            <div style={{ fontFamily: F, fontWeight: 900, fontSize: "36px", color: "#0A0A0A", letterSpacing: "-0.04em", marginBottom: "10px" }}>0 Kč</div>
            <p style={{ fontFamily: R, fontSize: "14px", color: "#888", lineHeight: 1.65, marginBottom: "24px" }}>Download any beat for free for non-commercial use. No credit card needed.</p>
            <button onClick={scrollToPlaylist} style={{ width: "100%", height: "46px", borderRadius: "14px", border: "1.5px solid #E0E0E0", background: "transparent", fontFamily: F, fontSize: "14px", fontWeight: 600, color: "#0A0A0A", cursor: "pointer", transition: "all 0.15s" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#F5F5F5"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>
              {section.freeLabel ?? "Browse Free Beats"} ↓
            </button>
          </div>
          <div style={{ background: "#0A0A0A", border: "1.5px solid #0A0A0A", borderRadius: "22px", padding: "32px 28px", boxShadow: "0 12px 40px rgba(0,0,0,0.22)" }}>
            <div style={{ fontFamily: F, fontWeight: 700, fontSize: "11px", color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "14px" }}>Exclusive</div>
            <div style={{ fontFamily: F, fontWeight: 900, fontSize: "36px", color: "#FFFFFF", letterSpacing: "-0.04em", marginBottom: "10px" }}>{section.exclusivePrice ?? 4990} Kč</div>
            <p style={{ fontFamily: R, fontSize: "14px", color: "rgba(255,255,255,0.5)", lineHeight: 1.65, marginBottom: "24px" }}>{section.exclusiveLabel ?? "Full exclusive rights — beat removed from store after purchase."}</p>
            <button style={{ width: "100%", height: "46px", borderRadius: "14px", border: "none", background: "#FFFFFF", fontFamily: F, fontSize: "14px", fontWeight: 700, color: "#0A0A0A", cursor: "pointer", transition: "all 0.15s" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#F0F0F0"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#FFFFFF"; }}>
              Get Exclusive Rights
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PublicSoundKitSection({ section }: { section: SoundKitSec }) {
  if (section.kits.length === 0) return null;
  return (
    <div style={{ width: "100%", background: "#FFFFFF", padding: "72px 0" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 24px" }}>
        <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: "28px", color: "#0A0A0A", letterSpacing: "-0.03em", marginBottom: "10px" }}>Sound Kits</h2>
        <p style={{ fontFamily: R, fontSize: "15px", color: "#888", marginBottom: "36px" }}>Professional samples & loops for producers</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "20px" }}>
          {section.kits.map((kit) => (
            <div key={kit.id} style={{ border: "1.5px solid #F0F0F0", borderRadius: "18px", overflow: "hidden", background: "#FAFAFA", boxShadow: "0 2px 12px rgba(0,0,0,0.04)", transition: "transform 0.18s, box-shadow 0.18s" }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.09)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.04)"; }}>
              <div style={{ aspectRatio: "1", background: "#F0F0F0", overflow: "hidden" }}>
                {kit.imageUrl ? <img src={kit.imageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}><Package size={28} color="#CCC" /></div>}
              </div>
              <div style={{ padding: "18px" }}>
                <div style={{ fontFamily: F, fontWeight: 700, fontSize: "15px", color: "#0A0A0A", marginBottom: "6px" }}>{kit.title}</div>
                {kit.description && <p style={{ fontFamily: R, fontSize: "13px", color: "#888", lineHeight: 1.55, marginBottom: "12px" }}>{kit.description}</p>}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: F, fontWeight: 800, fontSize: "16px", color: "#0A0A0A" }}>{kit.price} Kč</span>
                  <button style={{ height: "36px", padding: "0 16px", borderRadius: "10px", border: "none", background: "#0A0A0A", fontFamily: F, fontSize: "12px", fontWeight: 600, color: "#fff", cursor: "pointer" }}>Buy</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SectionsStorePage({ artist, beats }: { artist: any; beats: any[] }) {
  const [cartOpen, setCartOpen] = useState(false);
  const { items } = useCartStore();

  let config: PageConfig | null = null;
  try { config = JSON.parse((artist as any).pageSections); } catch {}
  if (!config) return null;

  return (
    <div style={{ background: "#FFFFFF", minHeight: "100vh", fontFamily: F }}>
      {/* Store header */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, height: "60px", zIndex: 9000,
        background: "rgba(255,255,255,0.94)", backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)", borderBottom: "1px solid rgba(0,0,0,0.06)",
        display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px",
      }}>
        <Link href="/">
          <button style={{ display: "flex", alignItems: "center", gap: "4px", background: "transparent", border: "none", cursor: "pointer", color: "#888", fontFamily: F, fontSize: "13px", padding: "6px 8px", borderRadius: "8px" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#F5F5F5"; e.currentTarget.style.color = "#0A0A0A"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#888"; }}>
            <ChevronLeft size={18} />
          </button>
        </Link>
        <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
          {artist.heroLogoUrl ? (
            <img src={artist.heroLogoUrl} alt={artist.displayName ?? ""} style={{ height: "34px", maxWidth: "200px", objectFit: "contain" }} />
          ) : artist.logoUrl ? (
            <img src={artist.logoUrl} alt={artist.displayName ?? ""} style={{ height: "30px", maxWidth: "180px", objectFit: "contain" }} />
          ) : (
            <span style={{ fontFamily: F, fontWeight: 800, fontSize: "16px", color: "#0A0A0A", letterSpacing: "-0.02em" }}>{artist.displayName ?? ""}</span>
          )}
        </div>
        <button onClick={() => setCartOpen(true)} style={{
          height: "38px", padding: "0 14px", borderRadius: "9999px", border: `1.5px solid ${items.length > 0 ? "#0A0A0A" : "#E5E5E5"}`,
          background: items.length > 0 ? "#0A0A0A" : "transparent", color: items.length > 0 ? "#fff" : "#0A0A0A",
          fontFamily: F, fontSize: "13px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "7px",
        }}>
          <ShoppingCart size={14} /> {items.length > 0 ? items.length : "Cart"}
        </button>
      </header>

      {/* Page sections */}
      <div style={{ paddingTop: "60px" }}>
        {config.sections.map((section) => {
          switch (section.type) {
            case "hero": return <PublicHeroSection key={section.id} section={section as HeroSec} />;
            case "playlist": return <PublicPlaylistSection key={section.id} section={section as PlaylistSec} beats={beats} artist={artist} />;
            case "youtube": return <PublicYoutubeSection key={section.id} section={section as YoutubeSec} />;
            case "pricing": return <PublicPricingSection key={section.id} section={section as PricingSec} />;
            case "soundkit": return <PublicSoundKitSection key={section.id} section={section as SoundKitSec} />;
            default: return null;
          }
        })}
      </div>

      {/* Footer */}
      <footer style={{ background: "#0A0A0A", padding: "40px 24px", textAlign: "center" }}>
        {config.footerEmail && (
          <a href={`mailto:${config.footerEmail}`} style={{ fontFamily: F, fontSize: "15px", color: "rgba(255,255,255,0.65)", textDecoration: "none", display: "block", marginBottom: "8px", transition: "color 0.15s" }}
            onMouseEnter={(e) => e.currentTarget.style.color = "#FFFFFF"}
            onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.65)"}
          >{config.footerEmail}</a>
        )}
        <span style={{ fontFamily: F, fontSize: "12px", color: "rgba(255,255,255,0.25)" }}>beatpack.cz</span>
      </footer>

      <CartModal open={cartOpen} onClose={() => setCartOpen(false)} artistName={artist.displayName ?? "store"} />
    </div>
  );
}

/* ─── Beat colour palette ─────────────────────────────────────── */
const PALETTES = [
  { accent: "#7C3AED", light: "rgba(124,58,237,0.07)", played: "#7C3AED", bar: "rgba(124,58,237,0.18)" },
  { accent: "#DB2777", light: "rgba(219,39,119,0.07)", played: "#DB2777", bar: "rgba(219,39,119,0.18)" },
  { accent: "#EA580C", light: "rgba(234,88,12,0.07)",  played: "#EA580C", bar: "rgba(234,88,12,0.18)"  },
  { accent: "#16A34A", light: "rgba(22,163,74,0.07)",  played: "#16A34A", bar: "rgba(22,163,74,0.18)"  },
  { accent: "#2563EB", light: "rgba(37,99,235,0.07)",  played: "#2563EB", bar: "rgba(37,99,235,0.18)"  },
  { accent: "#9333EA", light: "rgba(147,51,234,0.07)", played: "#9333EA", bar: "rgba(147,51,234,0.18)" },
  { accent: "#D97706", light: "rgba(217,119,6,0.07)",  played: "#D97706", bar: "rgba(217,119,6,0.18)"  },
  { accent: "#0891B2", light: "rgba(8,145,178,0.07)",  played: "#0891B2", bar: "rgba(8,145,178,0.18)"  },
];

/* ─── Deterministic waveform bars ────────────────────────────── */
function genBars(seed: string, count: number): number[] {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) & 0xffffff;
  const bars: number[] = [];
  for (let i = 0; i < count; i++) {
    h = (h * 1664525 + 1013904223) & 0xffffffff;
    const unsigned = h >>> 0;
    bars.push(0.15 + ((unsigned & 0xff) / 255) * 0.85);
  }
  return bars;
}

function fmt(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/* ─── Icons ──────────────────────────────────────────────────── */
function SoundCloudIcon({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={color}>
      <path d="M11.56 8.87V17h8.76c1.04 0 1.68-.69 1.68-1.56 0-.76-.54-1.43-1.27-1.55v-.08c0-1.44-1.15-2.61-2.56-2.61-.28 0-.55.05-.8.13C16.9 9.87 15.47 9 13.83 9c-.87 0-1.67.29-2.27.87zM0 15.24c0 .97.77 1.76 1.72 1.76s1.72-.79 1.72-1.76V12.1a1.72 1.72 0 1 0-3.44 0v3.14zm5.01 1.52c0 .97.77 1.76 1.72 1.76s1.72-.79 1.72-1.76V10.2a1.72 1.72 0 1 0-3.44 0v6.56zm-2.5-.11c0 .97.77 1.76 1.72 1.76s1.72-.79 1.72-1.76v-4.35a1.72 1.72 0 1 0-3.44 0v4.35z" />
    </svg>
  );
}
function YoutubeIcon({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={color}>
      <path d="M23 7s-.3-2-1.2-2.7c-1.1-1.2-2.4-1.2-3-1.3C16.2 3 12 3 12 3s-4.2 0-6.8.1c-.6.1-1.9.1-3 1.3C1.3 5 1 7 1 7S.7 9.1.7 11.3v2c0 2.1.3 4.3.3 4.3s.3 2 1.2 2.7c1.1 1.2 2.6 1.1 3.3 1.2C7.2 21.7 12 21.7 12 21.7s4.2 0 6.8-.2c.6-.1 1.9-.1 3-1.3.9-.7 1.2-2.7 1.2-2.7s.3-2.1.3-4.3v-2C23.3 9.1 23 7 23 7zm-13.5 8.5v-7.4l8.1 3.7-8.1 3.7z" />
    </svg>
  );
}

/* ─── Waveform row ──────────────────────────────────────────── */
function BeatWaveformRow({
  beatId,
  isPlaying,
  palette,
}: {
  beatId: string;
  isPlaying: boolean;
  palette: (typeof PALETTES)[0];
}) {
  const bars = genBars(beatId, 80);
  const playedCount = isPlaying ? Math.floor(bars.length * 0.3) : 0;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "2px",
        flex: 1,
        height: "32px",
        overflow: "hidden",
      }}
    >
      {bars.map((h, i) => (
        <div
          key={i}
          style={{
            width: "2px",
            flexShrink: 0,
            borderRadius: "1px",
            height: `${Math.max(4, h * 28)}px`,
            background: i < playedCount ? palette.played : palette.bar,
            transition: "background 0.3s",
          }}
        />
      ))}
    </div>
  );
}

/* ─── Play / Pause button ────────────────────────────────────── */
function PlayBtn({
  isPlaying,
  color,
  onClick,
}: {
  isPlaying: boolean;
  color: string;
  onClick: () => void;
}) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: "38px",
        height: "38px",
        borderRadius: "50%",
        flexShrink: 0,
        background: isPlaying ? color : hov ? color : "transparent",
        border: `2px solid ${color}`,
        color: isPlaying || hov ? "#fff" : color,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "background 0.15s, color 0.15s",
      }}
    >
      {isPlaying ? (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
          <rect x="1" y="0" width="4" height="12" rx="1" />
          <rect x="7" y="0" width="4" height="12" rx="1" />
        </svg>
      ) : (
        <svg width="11" height="13" viewBox="0 0 11 13" fill="currentColor" style={{ marginLeft: "1px" }}>
          <path d="M0.5 1.5 L10.5 6.5 L0.5 11.5 Z" />
        </svg>
      )}
    </button>
  );
}

/* ─── Beat row ───────────────────────────────────────────────── */
function BeatRow({
  beat,
  index,
  palette,
  artistSlug,
}: {
  beat: any;
  index: number;
  palette: (typeof PALETTES)[0];
  artistSlug: string | null;
}) {
  const { currentBeat, isPlaying: storeIsPlaying, setTrack, toggle } = useAudioStore();
  const { addItem, items } = useCartStore();
  const [cartFlash, setCartFlash] = useState(false);
  const [hov, setHov] = useState(false);

  const isCurrentTrack = currentBeat?.id === beat.id;
  const isPlaying = isCurrentTrack && storeIsPlaying;
  const inCart = items.some((i) => i.beatId === beat.id);

  function togglePlay() {
    if (isCurrentTrack) {
      toggle();
    } else {
      setTrack({
        id: beat.id,
        title: beat.title,
        artistName: beat.artistName ?? null,
        coverUrl: beat.coverUrl ?? null,
        audioUrl: beat.audioPreviewUrl ?? "",
      });
    }
  }

  function handleAddToCart() {
    const license: LicenseType =
      beat.priceBasic != null && Number(beat.priceBasic) > 0
        ? "basic"
        : beat.pricePremium != null && Number(beat.pricePremium) > 0
        ? "premium"
        : "exclusive";
    const price =
      license === "basic"
        ? Number(beat.priceBasic)
        : license === "premium"
        ? Number(beat.pricePremium)
        : Number(beat.priceExclusive);
    addItem({
      beatId: beat.id,
      beatTitle: beat.title,
      artistName: beat.artistName ?? null,
      artistSlug: artistSlug,
      coverUrl: beat.coverUrl ?? null,
      license,
      price,
    });
    setCartFlash(true);
    setTimeout(() => setCartFlash(false), 1500);
  }

  const tags: string[] = beat.tags ?? [];
  const durationSec: number | null = beat.durationSeconds ?? null;

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "10px 16px",
        borderRadius: "12px",
        background: isPlaying ? palette.light : hov ? "rgba(0,0,0,0.025)" : "transparent",
        borderLeft: `3px solid ${isPlaying || hov ? palette.accent : "transparent"}`,
        transition: "background 0.15s, border-color 0.15s",
        marginLeft: "-19px",
        marginRight: "-4px",
      }}
    >
      {/* Index */}
      <span
        style={{
          fontFamily: F,
          fontSize: "12px",
          fontWeight: 600,
          color: isPlaying ? palette.accent : "#AAAAAA",
          width: "18px",
          textAlign: "center",
          flexShrink: 0,
        }}
      >
        {index + 1}
      </span>

      {/* Play button */}
      <PlayBtn isPlaying={isPlaying} color={palette.accent} onClick={togglePlay} />

      {/* Cover */}
      <div
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "8px",
          flexShrink: 0,
          overflow: "hidden",
          background: palette.bar,
          border: `1.5px solid ${isPlaying ? palette.accent : "transparent"}`,
        }}
      >
        {beat.coverUrl ? (
          <img src={beat.coverUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", opacity: 0.4 }}>♪</div>
        )}
      </div>

      {/* Title + meta */}
      <div style={{ minWidth: "140px", flexShrink: 0 }}>
        <div
          style={{
            fontFamily: F,
            fontWeight: 700,
            fontSize: "14px",
            color: "#0A0A0A",
            letterSpacing: "-0.01em",
            marginBottom: "2px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {beat.title}
        </div>
        <div style={{ display: "flex", gap: "5px", flexWrap: "nowrap" }}>
          {beat.bpm && (
            <span
              style={{
                fontFamily: F,
                fontSize: "10px",
                fontWeight: 600,
                padding: "1px 6px",
                borderRadius: "4px",
                background: palette.bar,
                color: palette.accent,
              }}
            >
              {beat.bpm} BPM
            </span>
          )}
          {beat.key && (
            <span
              style={{
                fontFamily: F,
                fontSize: "10px",
                fontWeight: 600,
                padding: "1px 6px",
                borderRadius: "4px",
                background: "#F0F0F0",
                color: "#666666",
              }}
            >
              {beat.key}
            </span>
          )}
          {tags.slice(0, 1).map((tag: string) => (
            <span
              key={tag}
              style={{
                fontFamily: F,
                fontSize: "10px",
                padding: "1px 6px",
                borderRadius: "4px",
                background: "#F0F0F0",
                color: "#888888",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Waveform */}
      <div style={{ flex: 1, overflow: "hidden", minWidth: 0 }}>
        <BeatWaveformRow beatId={beat.id} isPlaying={isPlaying} palette={palette} />
      </div>

      {/* Duration */}
      <span
        style={{
          fontFamily: F,
          fontSize: "12px",
          color: "#AAAAAA",
          flexShrink: 0,
          minWidth: "34px",
          textAlign: "right",
        }}
      >
        {durationSec != null ? fmt(durationSec) : "—"}
      </span>

      {/* Price */}
      {beat.priceBasic != null && Number(beat.priceBasic) > 0 && (
        <span
          style={{
            fontFamily: F,
            fontSize: "13px",
            fontWeight: 700,
            color: "#0A0A0A",
            flexShrink: 0,
            minWidth: "60px",
            textAlign: "right",
          }}
        >
          {formatCurrency(Number(beat.priceBasic))}
        </span>
      )}

      {/* Add to cart */}
      <button
        onClick={handleAddToCart}
        title={inCart ? "V košíku" : "Přidat do košíku"}
        style={{
          width: "34px",
          height: "34px",
          borderRadius: "50%",
          border: `1.5px solid ${inCart || cartFlash ? palette.accent : "#E5E5E5"}`,
          background: inCart || cartFlash ? palette.light : "transparent",
          color: inCart || cartFlash ? palette.accent : "#888888",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          transition: "all 0.15s",
        }}
      >
        <ShoppingCart size={14} />
      </button>
    </div>
  );
}

/* ─── Profile modal ──────────────────────────────────────────── */
function ProfileModal({ artist, open, onClose }: {
  artist: { displayName?: string | null; profilePictureUrl?: string | null; slug?: string | null; bio?: string | null };
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 9998,
        background: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "24px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#FFFFFF",
          borderRadius: "24px",
          padding: "32px 28px",
          width: "100%", maxWidth: "320px",
          textAlign: "center",
          boxShadow: "0 32px 80px rgba(0,0,0,0.2)",
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: "14px", right: "14px",
            width: "28px", height: "28px", borderRadius: "50%",
            background: "#F5F5F5", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <X size={13} />
        </button>

        <div
          style={{
            width: "100px", height: "100px", borderRadius: "50%",
            background: "#F0F0F0", overflow: "hidden",
            margin: "0 auto 16px",
            border: "3px solid #EBEBEB",
            boxShadow: "0 4px 20px rgba(0,0,0,0.10)",
          }}
        >
          {artist.profilePictureUrl ? (
            <img src={artist.profilePictureUrl} alt={artist.displayName ?? ""} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "38px", color: "#CCCCCC" }}>♪</div>
          )}
        </div>

        <div style={{ fontFamily: F, fontWeight: 700, fontSize: "20px", color: "#0A0A0A", letterSpacing: "-0.02em", marginBottom: "4px" }}>
          {artist.displayName ?? "Artist"}
        </div>
        <div style={{ fontFamily: F, fontSize: "13px", color: "#888888", marginBottom: artist.bio ? "14px" : "0" }}>
          @{artist.slug ?? ""}
        </div>
        {artist.bio && (
          <p style={{ fontFamily: F, fontSize: "13px", color: "#666666", lineHeight: 1.55, marginTop: "10px" }}>
            {artist.bio}
          </p>
        )}
      </div>
    </div>
  );
}

/* ─── Cart modal (Nakupní košík) ─────────────────────────────── */
const LICENSE_LABELS: Record<string, string> = {
  basic: "Základní",
  premium: "Prémiová",
  exclusive: "Exkluzivní",
};

function CartModal({
  open,
  onClose,
  artistName,
}: {
  open: boolean;
  onClose: () => void;
  artistName: string;
}) {
  const { items, removeItem, updateLicense } = useCartStore();
  const [, setLocation] = useLocation();

  if (!open) return null;

  const total = items.reduce((s, i) => s + i.price, 0);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,0.45)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        display: "flex", alignItems: "flex-start", justifyContent: "flex-end",
        padding: "0",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#FFFFFF",
          width: "100%",
          maxWidth: "420px",
          height: "100vh",
          overflowY: "auto",
          boxShadow: "-8px 0 40px rgba(0,0,0,0.12)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid #F0F0F0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: "18px", color: "#0A0A0A", letterSpacing: "-0.02em", marginBottom: "2px" }}>
              Nákupní košík
            </h2>
            <p style={{ fontFamily: F, fontSize: "12px", color: "#888888" }}>
              {items.length === 0 ? "Košík je prázdný" : `${items.length} ${items.length === 1 ? "beat" : items.length < 5 ? "beaty" : "beatů"} · obchod ${artistName}`}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: "32px", height: "32px", borderRadius: "50%",
              background: "#F5F5F5", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <X size={14} />
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, padding: "16px 20px", display: "flex", flexDirection: "column", gap: "12px" }}>
          {items.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <div style={{ fontSize: "40px", marginBottom: "12px", opacity: 0.25 }}>🛒</div>
              <div style={{ fontFamily: F, fontSize: "14px", color: "#AAAAAA" }}>Zatím jste nic nepřidali</div>
              <div style={{ fontFamily: F, fontSize: "12px", color: "#CCCCCC", marginTop: "6px" }}>Klikněte na ikonu košíku u beatu</div>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.beatId}
                style={{
                  background: "#F9F9F9",
                  borderRadius: "14px",
                  padding: "14px",
                  border: "1px solid #F0F0F0",
                }}
              >
                <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  {/* Cover */}
                  <div style={{ width: "48px", height: "48px", borderRadius: "8px", flexShrink: 0, overflow: "hidden", background: "#E5E5E5" }}>
                    {item.coverUrl ? (
                      <img src={item.coverUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", opacity: 0.3 }}>♪</div>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: F, fontWeight: 700, fontSize: "14px", color: "#0A0A0A", marginBottom: "4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {item.beatTitle}
                    </div>
                    <div style={{ fontFamily: F, fontSize: "12px", color: "#888888", marginBottom: "8px" }}>
                      {item.artistName ?? ""}
                    </div>

                    {/* License selector */}
                    <select
                      value={item.license}
                      onChange={(e) => {
                        const lic = e.target.value as LicenseType;
                        const beat = (window as any).__storeBeat?.[item.beatId];
                        const price =
                          lic === "basic" ? (beat?.priceBasic ?? item.price)
                          : lic === "premium" ? (beat?.pricePremium ?? item.price)
                          : (beat?.priceExclusive ?? item.price);
                        updateLicense(item.beatId, lic, Number(price));
                      }}
                      style={{
                        fontFamily: F, fontSize: "12px", padding: "4px 8px",
                        borderRadius: "6px", border: "1px solid #E5E5E5",
                        background: "#FFFFFF", color: "#444444", cursor: "pointer",
                        outline: "none",
                      }}
                    >
                      <option value="basic">Základní licence</option>
                      <option value="premium">Prémiová licence</option>
                      <option value="exclusive">Exkluzivní licence</option>
                    </select>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.beatId)}
                    style={{
                      width: "28px", height: "28px", borderRadius: "8px",
                      background: "transparent", border: "none", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#CCCCCC", flexShrink: 0,
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "#EF4444"; e.currentTarget.style.background = "#FEF2F2"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "#CCCCCC"; e.currentTarget.style.background = "transparent"; }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                {/* Price + checkout */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "12px", paddingTop: "10px", borderTop: "1px solid #EBEBEB" }}>
                  <span style={{ fontFamily: F, fontWeight: 800, fontSize: "16px", color: "#0A0A0A", letterSpacing: "-0.02em" }}>
                    {formatCurrency(item.price)}
                  </span>
                  <button
                    onClick={() => {
                      onClose();
                      setLocation(`/checkout?beatId=${item.beatId}&license=${item.license}`);
                    }}
                    style={{
                      height: "34px", padding: "0 16px", borderRadius: "9999px",
                      background: "#0A0A0A", color: "#FFFFFF", border: "none",
                      fontFamily: F, fontSize: "12px", fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Zaplatit
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer total */}
        {items.length > 0 && (
          <div style={{ padding: "16px 20px", borderTop: "1px solid #F0F0F0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <span style={{ fontFamily: F, fontSize: "14px", color: "#888888" }}>Celkem</span>
              <span style={{ fontFamily: F, fontWeight: 800, fontSize: "20px", color: "#0A0A0A", letterSpacing: "-0.02em" }}>
                {formatCurrency(total)}
              </span>
            </div>
            <p style={{ fontFamily: F, fontSize: "11px", color: "#AAAAAA", lineHeight: 1.5 }}>
              Každý beat se platí zvlášť. Klikněte na „Zaplatit" u každého beatu výše.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Store header ────────────────────────────────────────────── */
function StoreHeader({
  artist,
  onLogoClick,
  onCartClick,
}: {
  artist: any;
  onLogoClick: () => void;
  onCartClick: () => void;
}) {
  const { items } = useCartStore();
  const [heartActive, setHeartActive] = useState(false);

  const heroLogoUrl: string | null = (artist as any).heroLogoUrl ?? null;
  const logoUrl: string | null = (artist as any).logoUrl ?? null;

  return (
    <header
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        height: "60px",
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        zIndex: 9000,
      }}
    >
      {/* Left — back to home */}
      <Link href="/">
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "#888888",
            fontFamily: F,
            fontSize: "13px",
            padding: "6px",
            borderRadius: "8px",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#F5F5F5"; e.currentTarget.style.color = "#0A0A0A"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#888888"; }}
        >
          <ChevronLeft size={18} />
        </button>
      </Link>

      {/* Center — artist logo / name */}
      <button
        onClick={onLogoClick}
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "4px 8px",
          borderRadius: "8px",
          maxWidth: "220px",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "#F5F5F5"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
        title="Zobrazit profil"
      >
        {heroLogoUrl ? (
          <img
            src={heroLogoUrl}
            alt={artist.displayName ?? ""}
            style={{ height: "34px", maxWidth: "200px", objectFit: "contain" }}
          />
        ) : logoUrl ? (
          <img
            src={logoUrl}
            alt={artist.displayName ?? ""}
            style={{ height: "30px", maxWidth: "180px", objectFit: "contain" }}
          />
        ) : (
          <span
            style={{
              fontFamily: F,
              fontWeight: 800,
              fontSize: "17px",
              color: "#0A0A0A",
              letterSpacing: "-0.02em",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px",
            }}
          >
            {artist.displayName ?? "Store"}
          </span>
        )}
      </button>

      {/* Right — heart + cart */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <button
          onClick={() => setHeartActive((v) => !v)}
          style={{
            width: "38px",
            height: "38px",
            borderRadius: "50%",
            background: heartActive ? "#FEF2F2" : "transparent",
            border: `1.5px solid ${heartActive ? "#FCA5A5" : "#E5E5E5"}`,
            color: heartActive ? "#EF4444" : "#888888",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => { if (!heartActive) { e.currentTarget.style.background = "#F5F5F5"; e.currentTarget.style.borderColor = "#D4D4D4"; } }}
          onMouseLeave={(e) => { if (!heartActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "#E5E5E5"; } }}
          title="Sledovat obchod"
        >
          <Heart size={15} fill={heartActive ? "#EF4444" : "none"} />
        </button>

        <button
          onClick={onCartClick}
          style={{
            height: "38px",
            padding: "0 14px",
            borderRadius: "9999px",
            background: items.length > 0 ? "#0A0A0A" : "transparent",
            border: `1.5px solid ${items.length > 0 ? "#0A0A0A" : "#E5E5E5"}`,
            color: items.length > 0 ? "#FFFFFF" : "#0A0A0A",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "7px",
            transition: "all 0.15s",
            fontFamily: F,
            fontSize: "13px",
            fontWeight: 600,
          }}
          onMouseEnter={(e) => {
            if (items.length === 0) {
              e.currentTarget.style.background = "#F5F5F5";
              e.currentTarget.style.borderColor = "#D4D4D4";
            }
          }}
          onMouseLeave={(e) => {
            if (items.length === 0) {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.borderColor = "#E5E5E5";
            }
          }}
          title="Nákupní košík"
        >
          <ShoppingCart size={15} />
          {items.length > 0 && (
            <span>{items.length}</span>
          )}
        </button>
      </div>
    </header>
  );
}

/* ─── Main page ──────────────────────────────────────────────── */
export default function ArtistStorePage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug ?? "";
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const { data: artist, isLoading } = useGetArtistBySlug(slug, {
    query: { enabled: !!slug, queryKey: getGetArtistBySlugQueryKey(slug) },
  });

  if (isLoading) {
    return (
      <div style={{ paddingTop: "60px", background: "#FFFFFF", minHeight: "100vh" }}>
        {/* Fake header */}
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: "60px", background: "rgba(255,255,255,0.92)", borderBottom: "1px solid rgba(0,0,0,0.06)", zIndex: 9000 }} />
        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 24px" }}>
          <Skeleton style={{ height: "28px", width: "200px", marginBottom: "8px" }} />
          <Skeleton style={{ height: "14px", width: "140px", marginBottom: "32px" }} />
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "14px" }}>
              <Skeleton style={{ width: "38px", height: "38px", borderRadius: "50%" }} />
              <Skeleton style={{ width: "42px", height: "42px", borderRadius: "8px" }} />
              <div style={{ flex: 1 }}>
                <Skeleton style={{ height: "14px", width: "160px", marginBottom: "6px" }} />
                <Skeleton style={{ height: "10px", width: "280px" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div style={{ paddingTop: "60px", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#FFFFFF" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: F, fontWeight: 700, fontSize: "20px", color: "#0A0A0A", marginBottom: "8px" }}>Obchod nenalezen</div>
          <Link href="/artists" style={{ color: "#888888", fontSize: "14px", display: "flex", alignItems: "center", gap: "4px", justifyContent: "center" }}>
            ← Zpět na umělce
          </Link>
        </div>
      </div>
    );
  }

  const rawBeats = (artist as any).beats ?? [];
  const beats = rawBeats.map((b: any) => ({
    ...b,
    artistName: artist.displayName,
    artistSlug: artist.slug,
  }));

  // If artist has a page-builder layout, render the sections-based store
  if ((artist as any).pageSections) {
    return <SectionsStorePage artist={artist} beats={beats} />;
  }

  return (
    <div
      style={{
        background: "#FFFFFF",
        minHeight: "100vh",
        paddingTop: "60px",
        fontFamily: F,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background gradient blobs — matching home page hero aesthetic */}
      <div
        style={{
          position: "fixed",
          top: "-120px",
          right: "-80px",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "radial-gradient(ellipse at center, rgba(167,139,250,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "fixed",
          bottom: "-80px",
          left: "-60px",
          width: "420px",
          height: "420px",
          borderRadius: "50%",
          background: "radial-gradient(ellipse at center, rgba(251,113,133,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Custom store header */}
      <StoreHeader
        artist={artist}
        onLogoClick={() => setProfileModalOpen(true)}
        onCartClick={() => setCartOpen(true)}
      />

      {/* Page content */}
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 24px 100px", position: "relative", zIndex: 1 }}>

        {/* Artist identity */}
        <div style={{ marginBottom: "36px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
            <h1
              style={{
                fontFamily: F,
                fontWeight: 900,
                fontSize: "28px",
                color: "#0A0A0A",
                letterSpacing: "-0.03em",
                lineHeight: 1,
              }}
            >
              {artist.displayName ?? "Artist"}
            </h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            <span style={{ fontFamily: F, fontSize: "13px", color: "#AAAAAA" }}>
              {beats.length} {beats.length === 1 ? "beat" : beats.length < 5 ? "beaty" : "beatů"}
            </span>
            {artist.socialInstagram && (
              <a href={`https://instagram.com/${artist.socialInstagram}`} target="_blank" rel="noreferrer"
                style={{ color: "#AAAAAA", transition: "color 0.15s", display: "flex", alignItems: "center", gap: "4px" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#0A0A0A"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#AAAAAA"; }}
              >
                <Instagram size={14} />
              </a>
            )}
            {artist.socialYoutube && (
              <a href={`https://youtube.com/${artist.socialYoutube}`} target="_blank" rel="noreferrer"
                style={{ color: "#AAAAAA", transition: "color 0.15s", display: "flex", alignItems: "center" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#0A0A0A"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#AAAAAA"; }}
              >
                <YoutubeIcon color="currentColor" />
              </a>
            )}
            {artist.socialSoundcloud && (
              <a href={`https://soundcloud.com/${artist.socialSoundcloud}`} target="_blank" rel="noreferrer"
                style={{ color: "#AAAAAA", transition: "color 0.15s", display: "flex", alignItems: "center" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#0A0A0A"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#AAAAAA"; }}
              >
                <SoundCloudIcon color="currentColor" />
              </a>
            )}
          </div>
          {artist.bio && (
            <p style={{ fontFamily: F, fontSize: "14px", color: "#666666", marginTop: "10px", maxWidth: "480px", lineHeight: 1.6 }}>
              {artist.bio}
            </p>
          )}
        </div>

        {/* Column headers */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "18px 38px 40px 1fr 1fr 34px 60px 34px",
            gap: "12px",
            alignItems: "center",
            padding: "0 16px 8px",
            marginLeft: "-19px",
            borderBottom: "1px solid #F0F0F0",
            marginBottom: "4px",
          }}
        >
          {["#", "", "", "NÁZEV", "VLNA", "ČAS", "CENA", ""].map((h, i) => (
            <span
              key={i}
              style={{
                fontFamily: F,
                fontSize: "10px",
                fontWeight: 600,
                color: "#CCCCCC",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                textAlign: i >= 5 ? "right" : "left",
              }}
            >
              {h}
            </span>
          ))}
        </div>

        {/* Beat rows */}
        {beats.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 24px" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px", opacity: 0.2 }}>♪</div>
            <div style={{ fontFamily: F, fontSize: "15px", color: "#888888" }}>Žádné beaty zatím</div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            {beats.map((beat: any, idx: number) => (
              <BeatRow
                key={beat.id}
                beat={beat}
                index={idx}
                palette={PALETTES[idx % PALETTES.length]}
                artistSlug={artist.slug ?? null}
              />
            ))}
          </div>
        )}
      </div>

      {/* Profile modal */}
      <ProfileModal
        artist={{
          displayName: artist.displayName,
          profilePictureUrl: artist.profilePictureUrl,
          slug: artist.slug,
          bio: artist.bio,
        }}
        open={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />

      {/* Cart modal */}
      <CartModal
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        artistName={artist.displayName ?? "obchod"}
      />
    </div>
  );
}
