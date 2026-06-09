import { useState } from "react";
import { useParams } from "wouter";
import { Instagram, Youtube, Music, ArrowLeft } from "lucide-react";
import { useGetArtistBySlug, getGetArtistBySlugQueryKey } from "@workspace/api-client-react";
import BeatCard from "@/components/BeatCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";

export default function ArtistStorePage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug ?? "";
  const [activeTab, setActiveTab] = useState<"all" | "popular" | "new">("all");

  const { data: artist, isLoading } = useGetArtistBySlug(slug, {
    query: { enabled: !!slug, queryKey: getGetArtistBySlugQueryKey(slug) },
  });

  if (isLoading) {
    return (
      <div style={{ paddingTop: "44px" }}>
        <Skeleton style={{ height: "300px" }} />
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

  const beats = (artist as any).beats ?? [];
  let filteredBeats = beats;
  if (activeTab === "popular") filteredBeats = [...beats].sort((a: any, b: any) => (b.plays ?? 0) - (a.plays ?? 0));
  if (activeTab === "new") filteredBeats = [...beats].sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div style={{ paddingTop: "44px" }}>
      {/* Banner */}
      <div style={{
        height: "300px",
        background: artist.bannerUrl ? `url(${artist.bannerUrl}) center/cover` : "#F2F2F2",
        position: "relative",
      }} />

      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px" }}>
        {/* Artist info */}
        <div style={{
          display: "flex",
          alignItems: "flex-end",
          gap: "20px",
          marginTop: "-48px",
          marginBottom: "32px",
          flexWrap: "wrap",
        }}>
          <div style={{
            width: "96px",
            height: "96px",
            borderRadius: "50%",
            background: "#FFFFFF",
            border: "4px solid #FFFFFF",
            overflow: "hidden",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(0,0,0,0.10)",
          }}>
            {artist.profilePictureUrl
              ? <img src={artist.profilePictureUrl} alt={artist.displayName ?? ""} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : <span style={{ fontSize: "36px" }}>♪</span>
            }
          </div>
          <div style={{ flex: 1, minWidth: 0, paddingBottom: "8px" }}>
            <h1 style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 700, fontSize: "28px", color: "#0A0A0A", letterSpacing: "-0.02em", marginBottom: "4px" }}>
              {artist.displayName ?? "Artist"}
            </h1>
            {artist.bio && (
              <p style={{ fontFamily: "'Figtree', sans-serif", fontSize: "14px", color: "#888888", marginBottom: "8px", maxWidth: "600px" }}>
                {artist.bio}
              </p>
            )}
            <div style={{ display: "flex", gap: "12px" }}>
              {artist.socialInstagram && (
                <a href={`https://instagram.com/${artist.socialInstagram}`} target="_blank" rel="noreferrer">
                  <Instagram size={18} color="#888888" />
                </a>
              )}
              {artist.socialYoutube && (
                <a href={`https://youtube.com/${artist.socialYoutube}`} target="_blank" rel="noreferrer">
                  <Youtube size={18} color="#888888" />
                </a>
              )}
              {artist.socialSoundcloud && (
                <a href={`https://soundcloud.com/${artist.socialSoundcloud}`} target="_blank" rel="noreferrer">
                  <Music size={18} color="#888888" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Tab bar */}
        <div style={{ borderBottom: "1px solid #F2F2F2", marginBottom: "32px", display: "flex", gap: "24px" }}>
          {(["all", "popular", "new"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              data-testid={`tab-${tab}`}
              style={{
                background: "none",
                border: "none",
                borderBottom: activeTab === tab ? "2px solid #0A0A0A" : "2px solid transparent",
                padding: "12px 0",
                fontFamily: "'Figtree', sans-serif",
                fontWeight: activeTab === tab ? 600 : 400,
                fontSize: "14px",
                color: activeTab === tab ? "#0A0A0A" : "#888888",
                cursor: "pointer",
                transition: "all 0.15s ease",
                textTransform: "capitalize",
              }}
            >
              {tab === "all" ? "All Beats" : tab === "popular" ? "Popular" : "New"}
            </button>
          ))}
        </div>

        {/* Beats grid */}
        {filteredBeats.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 24px", color: "#888888" }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>♪</div>
            <div style={{ fontFamily: "'Figtree', sans-serif", fontSize: "15px" }}>No beats yet</div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "24px", paddingBottom: "64px" }}>
            {filteredBeats.map((beat: any) => (
              <BeatCard
                key={beat.id}
                id={beat.id}
                title={beat.title}
                artistName={artist.displayName}
                artistSlug={artist.slug}
                bpm={beat.bpm}
                genre={beat.genre}
                coverUrl={beat.coverUrl}
                priceBasic={beat.priceBasic !== undefined ? Number(beat.priceBasic) : null}
                isExclusiveSold={beat.isExclusiveSold}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
