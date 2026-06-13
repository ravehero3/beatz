import { useState } from "react";
import { Link } from "wouter";
import { Search, ArrowRight } from "lucide-react";
import { useListArtists, useGetFeaturedArtists } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ArtistsPage() {
  const [search, setSearch] = useState("");
  const { data: artists, isLoading } = useListArtists({ search: search || undefined, limit: 48 });
  const { data: featured, isLoading: featuredLoading } = useGetFeaturedArtists();

  return (
    <div style={{ paddingTop: "44px", minHeight: "100vh" }}>
      {/* Featured Artists */}
      {!search && (
        <div style={{ background: "rgba(248,248,248,0.8)", borderBottom: "1px solid rgba(0,0,0,0.05)", padding: "32px 24px" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 700, fontSize: "18px", color: "#0A0A0A", letterSpacing: "-0.02em" }}>Featured Artists</h2>
            </div>
            <div style={{ display: "flex", gap: "24px", overflowX: "auto", paddingBottom: "8px", scrollbarWidth: "none" }}>
              {featuredLoading
                ? Array(6).fill(0).map((_, i) => (
                  <div key={i} style={{ flexShrink: 0, textAlign: "center", width: "110px" }}>
                    <Skeleton style={{ width: "72px", height: "72px", borderRadius: "50%", margin: "0 auto 8px" }} />
                    <Skeleton style={{ height: "13px", width: "70px", margin: "0 auto 4px" }} />
                    <Skeleton style={{ height: "11px", width: "50px", margin: "0 auto" }} />
                  </div>
                ))
                : (featured ?? []).map((artist) => (
                  <Link key={artist.id} href={`/artists/${artist.slug ?? artist.id}`}>
                    <div style={{ flexShrink: 0, textAlign: "center", width: "110px", cursor: "pointer", transition: "transform 0.2s ease" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; }}
                    >
                      <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: "#E5E5E5", margin: "0 auto 10px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.10)" }}>
                        {artist.profilePictureUrl
                          ? <img src={artist.profilePictureUrl} alt={artist.displayName ?? ""} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          : <span style={{ fontSize: "24px", color: "#888" }}>♪</span>
                        }
                      </div>
                      <div style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 600, fontSize: "13px", color: "#0A0A0A" }}>{artist.displayName ?? "Artist"}</div>
                      {artist.beatCount != null && (
                        <div style={{ fontFamily: "'Figtree', sans-serif", fontSize: "11px", color: "#AAAAAA", marginTop: "2px" }}>{artist.beatCount} beats</div>
                      )}
                    </div>
                  </Link>
                ))
              }
            </div>
          </div>
        </div>
      )}

      <div style={{ borderBottom: "1px solid #F2F2F2", padding: "32px 24px 24px", background: "#FFFFFF" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <h1 style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 700, fontSize: "28px", color: "#0A0A0A", letterSpacing: "-0.02em", marginBottom: "20px" }}>Artists</h1>
          <div style={{ position: "relative", maxWidth: "400px" }}>
            <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#888888" }} />
            <input
              type="search"
              placeholder="Search artists..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-testid="input-search-artists"
              style={{ width: "100%", height: "40px", paddingLeft: "36px", paddingRight: "12px", borderRadius: "10px", border: "1px solid #E5E5E5", fontFamily: "'Figtree', sans-serif", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
              onFocus={(e) => (e.target.style.borderColor = "#0A0A0A")}
              onBlur={(e) => (e.target.style.borderColor = "#E5E5E5")}
            />
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "32px 24px" }}>
        {isLoading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "24px" }}>
            {Array(12).fill(0).map((_, i) => (
              <div key={i} style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "16px", padding: "24px", textAlign: "center" }}>
                <Skeleton style={{ width: "80px", height: "80px", borderRadius: "50%", margin: "0 auto 12px" }} />
                <Skeleton style={{ height: "16px", width: "120px", margin: "0 auto 6px" }} />
                <Skeleton style={{ height: "12px", width: "80px", margin: "0 auto" }} />
              </div>
            ))}
          </div>
        ) : (artists ?? []).length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 24px" }}>
            <div style={{ fontFamily: "'Figtree', sans-serif", fontSize: "16px", fontWeight: 600, color: "#0A0A0A", marginBottom: "8px" }}>No artists found</div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "24px" }}>
            {(artists ?? []).map((artist) => (
              <Link key={artist.id} href={`/artists/${artist.slug ?? artist.id}`}>
                <div
                  data-testid={`card-artist-${artist.id}`}
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid #E5E5E5",
                    borderRadius: "16px",
                    padding: "24px",
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "box-shadow 0.2s ease, transform 0.2s ease",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.10)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; (e.currentTarget as HTMLDivElement).style.transform = "none"; }}
                >
                  <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "#F2F2F2", margin: "0 auto 12px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {artist.profilePictureUrl
                      ? <img src={artist.profilePictureUrl} alt={artist.displayName ?? ""} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : <span style={{ fontSize: "28px", color: "#888888" }}>♪</span>
                    }
                  </div>
                  <div style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 700, fontSize: "15px", color: "#0A0A0A", marginBottom: "4px" }}>{artist.displayName ?? "Artist"}</div>
                  {artist.beatCount != null && (
                    <div style={{ fontFamily: "'Figtree', sans-serif", fontSize: "12px", color: "#888888" }}>{artist.beatCount} beats</div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
