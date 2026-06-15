import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { ArrowLeft, X, Instagram, Youtube } from "lucide-react";
import { useGetArtistBySlug, getGetArtistBySlugQueryKey } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import PlayerPlaylist, { type PlaylistBeat } from "@/components/players/PlayerPlaylist";

type ThemeKey = "light" | "grey" | "dark";

const THEMES: Record<ThemeKey, {
  bg: string; cardBg: string; text: string; muted: string; border: string;
  accent: string; waveformPlayed: string; waveformUnplayed: string;
}> = {
  light: { bg: "#FFFFFF", cardBg: "#F9F9F9", text: "#0A0A0A", muted: "#888888", border: "#E5E5E5", accent: "#0A0A0A", waveformPlayed: "#0A0A0A", waveformUnplayed: "#E5E5E5" },
  grey:  { bg: "#F5F5F5", cardBg: "#FFFFFF", text: "#0A0A0A", muted: "#666666", border: "#E0E0E0", accent: "#0A0A0A", waveformPlayed: "#0A0A0A", waveformUnplayed: "#CCCCCC" },
  dark:  { bg: "#0A0A0A", cardBg: "#141414", text: "#FFFFFF", muted: "#888888", border: "#1F1F1F", accent: "#FFFFFF", waveformPlayed: "#A78BFA", waveformUnplayed: "#2A2A2A" },
};

const F = "'Figtree', sans-serif";

function SoundCloudIcon({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={color}>
      <path d="M11.56 8.87V17h8.76c1.04 0 1.68-.69 1.68-1.56 0-.76-.54-1.43-1.27-1.55v-.08c0-1.44-1.15-2.61-2.56-2.61-.28 0-.55.05-.8.13C16.9 9.87 15.47 9 13.83 9c-.87 0-1.67.29-2.27.87zM0 15.24c0 .97.77 1.76 1.72 1.76s1.72-.79 1.72-1.76V12.1a1.72 1.72 0 1 0-3.44 0v3.14zm5.01 1.52c0 .97.77 1.76 1.72 1.76s1.72-.79 1.72-1.76V10.2a1.72 1.72 0 1 0-3.44 0v6.56zm-2.5-.11c0 .97.77 1.76 1.72 1.76s1.72-.79 1.72-1.76v-4.35a1.72 1.72 0 1 0-3.44 0v4.35z"/>
    </svg>
  );
}

function YoutubeIcon({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={color}>
      <path d="M23 7s-.3-2-1.2-2.7c-1.1-1.2-2.4-1.2-3-1.3C16.2 3 12 3 12 3s-4.2 0-6.8.1c-.6.1-1.9.1-3 1.3C1.3 5 1 7 1 7S.7 9.1.7 11.3v2c0 2.1.3 4.3.3 4.3s.3 2 1.2 2.7c1.1 1.2 2.6 1.1 3.3 1.2C7.2 21.7 12 21.7 12 21.7s4.2 0 6.8-.2c.6-.1 1.9-.1 3-1.3.9-.7 1.2-2.7 1.2-2.7s.3-2.1.3-4.3v-2C23.3 9.1 23 7 23 7zm-13.5 8.5v-7.4l8.1 3.7-8.1 3.7z"/>
    </svg>
  );
}

function ArtistProfileModal({ artist, open, onClose }: {
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

        <div style={{
          width: "96px", height: "96px", borderRadius: "50%",
          background: "#F0F0F0", overflow: "hidden",
          margin: "0 auto 16px",
          border: "3px solid #EBEBEB",
          boxShadow: "0 4px 20px rgba(0,0,0,0.10)",
        }}>
          {artist.profilePictureUrl ? (
            <img
              src={artist.profilePictureUrl}
              alt={artist.displayName ?? ""}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "36px", color: "#CCCCCC" }}>
              ♪
            </div>
          )}
        </div>

        <div style={{ fontFamily: F, fontWeight: 700, fontSize: "20px", color: "#0A0A0A", letterSpacing: "-0.02em", marginBottom: "4px" }}>
          {artist.displayName ?? "Artist"}
        </div>
        <div style={{ fontFamily: F, fontSize: "13px", color: "#888888", marginBottom: artist.bio ? "14px" : "0" }}>
          @{artist.slug ?? ""}
          <span style={{ color: "#D4D4D4", margin: "0 6px" }}>·</span>
          beatpack.cz/{artist.slug}
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

export default function ArtistStorePage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug ?? "";
  const [, setLocation] = useLocation();
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const { data: artist, isLoading } = useGetArtistBySlug(slug, {
    query: { enabled: !!slug, queryKey: getGetArtistBySlugQueryKey(slug) },
  });

  if (isLoading) {
    return (
      <div style={{ paddingTop: "44px" }}>
        <Skeleton style={{ height: "340px" }} />
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 24px" }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "12px" }}>
              <Skeleton style={{ width: "52px", height: "52px", borderRadius: "10px", flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <Skeleton style={{ height: "16px", width: "200px", marginBottom: "8px" }} />
                <Skeleton style={{ height: "12px", width: "300px" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div style={{ paddingTop: "44px", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: F, fontWeight: 700, fontSize: "20px", color: "#0A0A0A", marginBottom: "8px" }}>Artist not found</div>
          <Link href="/artists" style={{ color: "#888888", fontSize: "14px", display: "flex", alignItems: "center", gap: "4px", justifyContent: "center" }}>
            <ArrowLeft size={14} /> Back to artists
          </Link>
        </div>
      </div>
    );
  }

  const rawBeats = (artist as any).beats ?? [];
  const themeKey: ThemeKey = ((artist as any).storeTemplate as ThemeKey) ?? "light";
  const theme = THEMES[themeKey] ?? THEMES.light;
  const isDark = themeKey === "dark";

  const logoUrl: string | null = (artist as any).logoUrl ?? null;
  const heroLogoUrl: string | null = (artist as any).heroLogoUrl ?? null;

  const beats: PlaylistBeat[] = rawBeats.map((b: any) => ({
    ...b,
    artistName: artist.displayName,
    artistSlug: artist.slug,
  }));

  const socialIconColor = isDark ? "#888888" : "#888888";

  return (
    <div style={{ background: theme.bg, minHeight: "100vh", paddingTop: "44px" }}>

      {/* ── SECTION 1: Hero ── */}
      <section style={{ position: "relative" }}>
        {/* Banner */}
        <div style={{
          height: "340px",
          background: artist.bannerUrl
            ? `url(${artist.bannerUrl}) center/cover no-repeat`
            : isDark ? "linear-gradient(135deg, #111111 0%, #1A1A1A 100%)" : "linear-gradient(135deg, #F0F0F0 0%, #E8E8E8 100%)",
          position: "relative",
        }}>
          {/* Bottom gradient */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: "200px",
            background: `linear-gradient(to bottom, transparent 0%, ${theme.bg} 100%)`,
            pointerEvents: "none",
          }} />
        </div>

        {/* Artist identity row */}
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px" }}>
          <div style={{
            display: "flex", alignItems: "flex-end", gap: "20px",
            marginTop: "-52px", paddingBottom: "28px", flexWrap: "wrap",
          }}>
            {/* Profile picture — clickable for modal */}
            <div
              onClick={() => setProfileModalOpen(true)}
              style={{
                width: "88px", height: "88px", borderRadius: "50%",
                background: isDark ? "#1F1F1F" : "#FFFFFF",
                border: `4px solid ${theme.bg}`,
                overflow: "hidden", flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 4px 20px rgba(0,0,0,0.18)",
                cursor: "pointer",
                transition: "opacity 0.15s ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.85"; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
              title="View profile"
            >
              {artist.profilePictureUrl ? (
                <img src={artist.profilePictureUrl} alt={artist.displayName ?? ""} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <span style={{ fontSize: "32px", opacity: 0.3 }}>♪</span>
              )}
            </div>

            <div style={{ flex: 1, minWidth: 0, paddingBottom: "4px" }}>
              {/* Logo or display name — also opens profile modal */}
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={artist.displayName ?? ""}
                  onClick={() => setProfileModalOpen(true)}
                  style={{
                    height: "36px", objectFit: "contain", maxWidth: "260px",
                    marginBottom: "8px", display: "block", cursor: "pointer",
                    opacity: 1, transition: "opacity 0.15s ease",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = "0.75"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = "1"; }}
                  title="View profile"
                />
              ) : (
                <h1
                  onClick={() => setProfileModalOpen(true)}
                  style={{
                    fontFamily: F, fontWeight: 700, fontSize: "26px", color: theme.text,
                    letterSpacing: "-0.02em", marginBottom: "4px",
                    cursor: "pointer", display: "inline-block",
                    borderBottom: `1px solid transparent`,
                    transition: "opacity 0.15s ease",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.7"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
                  title="View profile"
                >
                  {artist.displayName ?? "Artist"}
                </h1>
              )}

              <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                <span style={{ fontFamily: F, fontSize: "13px", color: theme.muted }}>
                  @{artist.slug} · {beats.length} beats
                </span>
                <div style={{ display: "flex", gap: "8px" }}>
                  {artist.socialInstagram && (
                    <a href={`https://instagram.com/${artist.socialInstagram}`} target="_blank" rel="noreferrer"
                      style={{ color: socialIconColor, transition: "opacity 0.15s" }}
                      onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.6"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
                    >
                      <Instagram size={16} />
                    </a>
                  )}
                  {artist.socialYoutube && (
                    <a href={`https://youtube.com/${artist.socialYoutube}`} target="_blank" rel="noreferrer"
                      style={{ color: socialIconColor, transition: "opacity 0.15s" }}
                      onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.6"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
                    >
                      <YoutubeIcon color={socialIconColor} />
                    </a>
                  )}
                  {artist.socialSoundcloud && (
                    <a href={`https://soundcloud.com/${artist.socialSoundcloud}`} target="_blank" rel="noreferrer"
                      style={{ color: socialIconColor, transition: "opacity 0.15s" }}
                      onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.6"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
                    >
                      <SoundCloudIcon color={socialIconColor} />
                    </a>
                  )}
                </div>
              </div>

              {artist.bio && (
                <p style={{ fontFamily: F, fontSize: "14px", color: theme.muted, marginTop: "8px", maxWidth: "520px", lineHeight: 1.55 }}>
                  {artist.bio}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: Playlist ── */}
      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px 80px" }}>
        {/* Hero logo above playlist */}
        {heroLogoUrl && (
          <div style={{ marginBottom: "20px" }}>
            <img
              src={heroLogoUrl}
              alt=""
              style={{ height: "48px", objectFit: "contain", maxWidth: "300px", display: "block" }}
            />
          </div>
        )}

        {/* Section heading */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: "12px", paddingBottom: "10px",
          borderBottom: `1px solid ${isDark ? "#1F1F1F" : "#EBEBEB"}`,
        }}>
          <h2 style={{ fontFamily: F, fontWeight: 700, fontSize: "16px", color: theme.text, letterSpacing: "-0.01em" }}>
            Beats
          </h2>
          <div style={{ display: "flex", gap: "20px" }}>
            {(["TITLE", "BPM", "KEY", "TAGS", "", ""] as const).map((h, i) => (
              <span key={i} style={{ fontFamily: F, fontSize: "11px", fontWeight: 600, color: theme.muted, letterSpacing: "0.06em", textTransform: "uppercase", opacity: h ? 1 : 0, userSelect: "none" }}>
                {h}
              </span>
            ))}
          </div>
        </div>

        {beats.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 24px" }}>
            <div style={{ fontSize: "40px", marginBottom: "12px", opacity: 0.3 }}>♪</div>
            <div style={{ fontFamily: F, fontSize: "15px", color: theme.muted }}>No beats yet</div>
          </div>
        ) : (
          <PlayerPlaylist beats={beats} theme={theme} maxRows={5} />
        )}
      </section>

      {/* Artist profile modal */}
      <ArtistProfileModal
        artist={{
          displayName: artist.displayName,
          profilePictureUrl: artist.profilePictureUrl,
          slug: artist.slug,
          bio: artist.bio,
        }}
        open={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />
    </div>
  );
}
