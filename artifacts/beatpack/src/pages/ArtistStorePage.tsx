import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { Instagram, Youtube, Music, ArrowLeft } from "lucide-react";
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

  let beats: Beat[] = rawBeats.map((b: any) => ({ ...b, artistName: artist.displayName, artistSlug: artist.slug }));
  if (activeTab === "popular") beats = [...beats].sort((a, b) => (b.plays ?? 0) - (a.plays ?? 0));
  if (activeTab === "new") beats = [...beats].sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime());

  function onBuy(beat: Beat) {
    if (!user) { setLocation("/register"); return; }
    setLocation(`/checkout?beatId=${beat.id}&license=basic`);
  }

  const tabBorderColor = themeKey === "dark" ? "#1F1F1F" : "#E5E5E5";
  const tabActiveColor = theme.text;

  return (
    <div style={{ background: theme.bg, minHeight: "100vh", paddingTop: "44px" }}>
      {/* Banner */}
      <div style={{
        height: "280px",
        background: artist.bannerUrl ? `url(${artist.bannerUrl}) center/cover` : (themeKey === "dark" ? "#111111" : "#F2F2F2"),
        position: "relative",
      }} />

      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px" }}>
        {/* Artist header */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: "20px", marginTop: "-48px", marginBottom: "32px", flexWrap: "wrap" }}>
          <div style={{
            width: "96px", height: "96px", borderRadius: "50%",
            background: themeKey === "dark" ? "#1F1F1F" : "#FFFFFF",
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
            <h1 style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 700, fontSize: "28px", color: theme.text, letterSpacing: "-0.02em", marginBottom: "4px" }}>
              {artist.displayName ?? "Artist"}
            </h1>
            {artist.bio && (
              <p style={{ fontFamily: "'Figtree', sans-serif", fontSize: "14px", color: theme.muted, marginBottom: "8px", maxWidth: "600px" }}>
                {artist.bio}
              </p>
            )}
            <div style={{ display: "flex", gap: "12px" }}>
              {artist.socialInstagram && (
                <a href={`https://instagram.com/${artist.socialInstagram}`} target="_blank" rel="noreferrer">
                  <Instagram size={18} color={theme.muted} />
                </a>
              )}
              {artist.socialYoutube && (
                <a href={`https://youtube.com/${artist.socialYoutube}`} target="_blank" rel="noreferrer">
                  <Youtube size={18} color={theme.muted} />
                </a>
              )}
              {artist.socialSoundcloud && (
                <a href={`https://soundcloud.com/${artist.socialSoundcloud}`} target="_blank" rel="noreferrer">
                  <Music size={18} color={theme.muted} />
                </a>
              )}
            </div>
          </div>
        </div>

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
