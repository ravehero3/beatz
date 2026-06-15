import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";
import { useGetArtistBySlug, getGetArtistBySlugQueryKey } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { useAuthStore } from "@/store/authStore";
import PlayerClassic from "@/components/players/PlayerClassic";
import PlayerMinimal from "@/components/players/PlayerMinimal";
import PlayerDeck from "@/components/players/PlayerDeck";

type ThemeKey = "light" | "grey" | "dark";
type PlayerKey = "classic" | "minimal" | "deck";

const THEMES = {
  light: { bg: "#FFFFFF", cardBg: "#F9F9F9", text: "#0A0A0A", muted: "#888888", border: "#E5E5E5", accent: "#0A0A0A", waveformPlayed: "#0A0A0A", waveformUnplayed: "#E5E5E5" },
  grey:  { bg: "#F5F5F5", cardBg: "#FFFFFF", text: "#0A0A0A", muted: "#666666", border: "#E0E0E0", accent: "#0A0A0A", waveformPlayed: "#0A0A0A", waveformUnplayed: "#CCCCCC" },
  dark:  { bg: "#0A0A0A", cardBg: "#141414", text: "#FFFFFF", muted: "#888888", border: "#1F1F1F", accent: "#FFFFFF", waveformPlayed: "#A78BFA", waveformUnplayed: "#2A2A2A" },
};

interface Beat {
  id: string; title: string; bpm?: number | null; key?: string | null;
  genre?: string | null; tags?: string[] | null; coverUrl?: string | null; audioPreviewUrl?: string | null;
  priceBasic?: number | null; artistSlug?: string | null; artistName?: string | null;
  plays?: number; createdAt?: string;
}

function SocialIcon({ href, children, borderColor, size = 36 }: { href: string; children: React.ReactNode; borderColor: string; size?: number }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "10px",
        border: `1.5px solid ${borderColor}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "opacity 0.15s",
        textDecoration: "none",
        flexShrink: 0,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.6")}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
    >
      {children}
    </a>
  );
}

export default function ArtistStorePage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug ?? "";
  const [activeTab, setActiveTab] = useState<"all" | "popular" | "new">("all");
  const { user } = useAuthStore();
  const [, setLocation] = useLocation();

  const { data: artist, isLoading } = useGetArtistBySlug(slug, {
    query: { enabled: !!slug, queryKey: getGetArtistBySlugQueryKey(slug) },
  });

  if (isLoading) {
    return (
      <div style={{ paddingTop: "44px" }}>
        <Skeleton style={{ height: "280px" }} />
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "32px 24px" }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "20px", marginBottom: "32px", marginTop: "-48px" }}>
            <Skeleton style={{ width: "96px", height: "96px", borderRadius: "50%", flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <Skeleton style={{ height: "24px", width: "200px", marginBottom: "8px" }} />
              <Skeleton style={{ height: "14px", width: "300px" }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div style={{ paddingTop: "44px", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 700, fontSize: "20px", color: "#0A0A0A", marginBottom: "8px" }}>Artist not found</div>
          <Link href="/artists" style={{ color: "#888888", fontSize: "14px", display: "flex", alignItems: "center", gap: "4px", justifyContent: "center" }}>
            <ArrowLeft size={14} /> Back to artists
          </Link>
        </div>
      </div>
    );
  }

  const rawBeats = (artist as any).beats ?? [];
  const themeKey: ThemeKey = ((artist as any).storeTemplate as ThemeKey) ?? "light";
  const playerKey: PlayerKey = ((artist as any).playerStyle as PlayerKey) ?? "classic";
  const theme = THEMES[themeKey] ?? THEMES.light;
  const isDark = themeKey === "dark";

  const logoUrl: string | null = (artist as any).logoUrl ?? null;
  const heroLogoUrl: string | null = (artist as any).heroLogoUrl ?? null;

  let beats: Beat[] = rawBeats.map((b: any) => ({ ...b, artistName: artist.displayName, artistSlug: artist.slug }));
  if (activeTab === "popular") beats = [...beats].sort((a, b) => (b.plays ?? 0) - (a.plays ?? 0));
  if (activeTab === "new") beats = [...beats].sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime());

  function onBuy(beat: Beat) {
    if (!user) { setLocation("/register"); return; }
    setLocation(`/checkout?beatId=${beat.id}&license=basic`);
  }

  const tabBorderColor = isDark ? "#1F1F1F" : "#E5E5E5";
  const tabActiveColor = theme.text;

  const socialBorder = isDark ? "#333333" : "#E5E5E5";
  const socialIconColor = theme.text;

  return (
    <div style={{ background: theme.bg, minHeight: "100vh", paddingTop: "44px" }}>
      {/* Banner */}
      <div style={{
        height: "300px",
        background: artist.bannerUrl ? `url(${artist.bannerUrl}) center/cover` : (isDark ? "#111111" : "#F0F0F0"),
        position: "relative",
      }}>
        {/* Bottom gradient bridge into page bg */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: "120px",
          background: `linear-gradient(to bottom, transparent 0%, ${theme.bg} 100%)`,
          pointerEvents: "none",
        }} />
      </div>

      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px" }}>
        {/* Artist header */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: "20px", marginTop: "-64px", marginBottom: "32px", flexWrap: "wrap" }}>
          <div style={{
            width: "96px", height: "96px", borderRadius: "50%",
            background: isDark ? "#1F1F1F" : "#FFFFFF",
            border: `4px solid ${theme.bg}`,
            overflow: "hidden", flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
          }}>
            {artist.profilePictureUrl
              ? <img src={artist.profilePictureUrl} alt={artist.displayName ?? ""} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : <span style={{ fontSize: "36px" }}>♪</span>
            }
          </div>
          <div style={{ flex: 1, minWidth: 0, paddingBottom: "8px" }}>
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={artist.displayName ?? ""}
                style={{ height: "40px", objectFit: "contain", maxWidth: "260px", marginBottom: "8px", display: "block" }}
              />
            ) : (
              <h1 style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 700, fontSize: "28px", color: theme.text, letterSpacing: "-0.02em", marginBottom: "4px" }}>
                {artist.displayName ?? "Artist"}
              </h1>
            )}
            {artist.bio && (
              <p style={{ fontFamily: "'Figtree', sans-serif", fontSize: "14px", color: theme.muted, marginBottom: "10px", maxWidth: "600px" }}>
                {artist.bio}
              </p>
            )}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {artist.socialInstagram && (
                <SocialIcon href={`https://instagram.com/${artist.socialInstagram}`} borderColor={socialBorder}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={socialIconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                </SocialIcon>
              )}
              {artist.socialYoutube && (
                <SocialIcon href={`https://youtube.com/${artist.socialYoutube}`} borderColor={socialBorder}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill={socialIconColor}>
                    <path d="M23 7s-.3-2-1.2-2.7c-1.1-1.2-2.4-1.2-3-1.3C16.2 3 12 3 12 3s-4.2 0-6.8.1c-.6.1-1.9.1-3 1.3C1.3 5 1 7 1 7S.7 9.1.7 11.3v2c0 2.1.3 4.3.3 4.3s.3 2 1.2 2.7c1.1 1.2 2.6 1.1 3.3 1.2C7.2 21.7 12 21.7 12 21.7s4.2 0 6.8-.2c.6-.1 1.9-.1 3-1.3.9-.7 1.2-2.7 1.2-2.7s.3-2.1.3-4.3v-2C23.3 9.1 23 7 23 7zm-13.5 8.5v-7.4l8.1 3.7-8.1 3.7z"/>
                  </svg>
                </SocialIcon>
              )}
              {artist.socialSoundcloud && (
                <SocialIcon href={`https://soundcloud.com/${artist.socialSoundcloud}`} borderColor={socialBorder}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill={socialIconColor}>
                    <path d="M11.56 8.87V17h8.76c1.04 0 1.68-.69 1.68-1.56 0-.76-.54-1.43-1.27-1.55v-.08c0-1.44-1.15-2.61-2.56-2.61-.28 0-.55.05-.8.13C16.9 9.87 15.47 9 13.83 9c-.87 0-1.67.29-2.27.87zM0 15.24c0 .97.77 1.76 1.72 1.76s1.72-.79 1.72-1.76V12.1a1.72 1.72 0 1 0-3.44 0v3.14zm5.01 1.52c0 .97.77 1.76 1.72 1.76s1.72-.79 1.72-1.76V10.2a1.72 1.72 0 1 0-3.44 0v6.56zm-2.5-.11c0 .97.77 1.76 1.72 1.76s1.72-.79 1.72-1.76v-4.35a1.72 1.72 0 1 0-3.44 0v4.35z"/>
                  </svg>
                </SocialIcon>
              )}
            </div>
          </div>
        </div>

        {/* Hero logo above beats */}
        {heroLogoUrl && (
          <div style={{ marginBottom: "24px" }}>
            <img
              src={heroLogoUrl}
              alt=""
              style={{ height: "56px", objectFit: "contain", maxWidth: "320px", display: "block" }}
            />
          </div>
        )}

        {/* Tab bar */}
        <div style={{ borderBottom: `1px solid ${tabBorderColor}`, marginBottom: "32px", display: "flex", gap: "24px" }}>
          {(["all", "popular", "new"] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} data-testid={`tab-${tab}`} style={{
              background: "none", border: "none",
              borderBottom: activeTab === tab ? `2px solid ${tabActiveColor}` : "2px solid transparent",
              padding: "12px 0",
              fontFamily: "'Figtree', sans-serif",
              fontWeight: activeTab === tab ? 600 : 400,
              fontSize: "14px",
              color: activeTab === tab ? theme.text : theme.muted,
              cursor: "pointer", transition: "all 0.15s ease", textTransform: "capitalize",
            }}>
              {tab === "all" ? "All Beats" : tab === "popular" ? "Popular" : "New"}
            </button>
          ))}
        </div>

        {/* Beats */}
        {beats.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 24px", color: theme.muted }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>♪</div>
            <div style={{ fontFamily: "'Figtree', sans-serif", fontSize: "15px" }}>No beats yet</div>
          </div>
        ) : playerKey === "classic" ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "20px", paddingBottom: "64px" }}>
            {beats.map((beat) => <PlayerClassic key={beat.id} beat={beat} theme={theme} onBuy={onBuy} />)}
          </div>
        ) : playerKey === "minimal" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", paddingBottom: "64px" }}>
            {beats.map((beat) => <PlayerMinimal key={beat.id} beat={beat} theme={theme} onBuy={onBuy} />)}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", paddingBottom: "64px" }}>
            {beats.map((beat) => <PlayerDeck key={beat.id} beat={beat} theme={theme} onBuy={onBuy} />)}
          </div>
        )}
      </div>
    </div>
  );
}
