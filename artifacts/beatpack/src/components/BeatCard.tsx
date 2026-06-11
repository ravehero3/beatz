import { Link } from "wouter";
import { Play, Pause } from "lucide-react";
import { formatCurrency } from "@/lib/format";

interface BeatCardProps {
  id: string;
  title: string;
  artistName?: string | null;
  artistSlug?: string | null;
  bpm?: number | null;
  musicalKey?: string | null;
  genre?: string | null;
  coverUrl?: string | null;
  priceBasic?: number | null;
  pricePremium?: number | null;
  priceExclusive?: number | null;
  isExclusiveSold?: boolean;
  isPlaying?: boolean;
  onPlay?: () => void;
}

export default function BeatCard({
  id,
  title,
  artistName,
  artistSlug,
  bpm,
  musicalKey,
  genre,
  coverUrl,
  priceBasic,
  pricePremium,
  priceExclusive,
  isExclusiveSold,
  isPlaying,
  onPlay,
}: BeatCardProps) {
  const lowestPrice = priceBasic ?? pricePremium ?? priceExclusive;

  return (
    <div
      data-testid={`card-beat-${id}`}
      style={{
        background: "#FFFFFF",
        border: "1px solid #E5E5E5",
        borderRadius: "16px",
        overflow: "hidden",
        transition: "box-shadow 0.2s ease, transform 0.2s ease",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.10)";
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
      }}
    >
      {/* Cover image */}
      <Link href={`/beats/${id}`}>
        <div
          style={{
            aspectRatio: "1",
            background: coverUrl ? undefined : "#F2F2F2",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {coverUrl ? (
            <img src={coverUrl} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <div style={{ textAlign: "center", color: "#AAAAAA" }}>
              <div style={{ fontSize: "32px", marginBottom: "4px" }}>♪</div>
              <div style={{ fontSize: "11px", fontFamily: "'Figtree', sans-serif" }}>No cover</div>
            </div>
          )}
          {/* Exclusive sold overlay */}
          {isExclusiveSold && (
            <div style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <span style={{
                background: "#0A0A0A",
                color: "#FFFFFF",
                padding: "4px 12px",
                borderRadius: "9999px",
                fontSize: "12px",
                fontFamily: "'Figtree', sans-serif",
                fontWeight: 600,
              }}>SOLD</span>
            </div>
          )}
        </div>
      </Link>

      {/* Info */}
      <div style={{ padding: "12px 16px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Link href={`/beats/${id}`} style={{ textDecoration: "none" }}>
              <div style={{
                fontFamily: "'Figtree', sans-serif",
                fontWeight: 600,
                fontSize: "14px",
                color: "#0A0A0A",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }} data-testid={`text-beat-title-${id}`}>
                {title}
              </div>
            </Link>
            {artistName && (
              <Link href={artistSlug ? `/artists/${artistSlug}` : "#"} style={{ textDecoration: "none" }}>
                <div style={{
                  fontFamily: "'Figtree', sans-serif",
                  fontSize: "12px",
                  color: "#888888",
                  marginTop: "2px",
                }}>
                  {artistName}
                </div>
              </Link>
            )}
          </div>
          {onPlay && (
            <button
              onClick={(e) => { e.preventDefault(); onPlay(); }}
              data-testid={`btn-play-${id}`}
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: isPlaying ? "#555555" : "#0A0A0A",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                flexShrink: 0,
                transition: "background 0.15s ease",
              }}
            >
              {isPlaying
                ? <Pause size={14} fill="#FFFFFF" color="#FFFFFF" />
                : <Play size={14} fill="#FFFFFF" color="#FFFFFF" />
              }
            </button>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px", flexWrap: "wrap" }}>
          {bpm && (
            <span style={{
              fontFamily: "'Figtree', sans-serif",
              fontSize: "11px",
              fontWeight: 500,
              color: "#888888",
              letterSpacing: "0.02em",
            }}>{bpm} BPM</span>
          )}
          {musicalKey && (
            <span style={{
              fontFamily: "'Figtree', sans-serif",
              fontSize: "11px",
              color: "#888888",
            }}>{musicalKey}</span>
          )}
          {genre && (
            <span style={{
              background: "#F2F2F2",
              borderRadius: "9999px",
              padding: "2px 8px",
              fontFamily: "'Figtree', sans-serif",
              fontSize: "11px",
              fontWeight: 500,
              color: "#444444",
            }}>{genre}</span>
          )}
        </div>

        {lowestPrice !== null && lowestPrice !== undefined && (
          <div style={{
            marginTop: "10px",
            fontFamily: "'Figtree', sans-serif",
            fontWeight: 700,
            fontSize: "14px",
            color: "#0A0A0A",
          }} data-testid={`text-price-${id}`}>
            from {formatCurrency(Number(lowestPrice))}
          </div>
        )}
      </div>
    </div>
  );
}
