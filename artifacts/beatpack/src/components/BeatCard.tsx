import { useState } from "react";
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
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{ position: "relative" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Bloom layer — blurred image bleeds behind card as colored ambient glow */}
      {coverUrl && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: "-18px",
            borderRadius: "32px",
            backgroundImage: `url(${coverUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(28px) saturate(160%)",
            opacity: isHovered ? 0.22 : 0,
            transition: "opacity 0.35s ease",
            zIndex: 0,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Card */}
      <div
        data-testid={`card-beat-${id}`}
        style={{
          position: "relative",
          zIndex: 1,
          background: "rgba(255,255,255,0.92)",
          backdropFilter: isHovered ? "blur(8px)" : "none",
          border: isHovered ? "1px solid rgba(255,255,255,0.7)" : "1px solid #E8E8E8",
          borderRadius: "16px",
          overflow: "hidden",
          transition: "box-shadow 0.28s ease, transform 0.28s cubic-bezier(0.16,1,0.3,1), border-color 0.2s ease",
          cursor: "pointer",
          boxShadow: isHovered
            ? "0 20px 44px rgba(0,0,0,0.13), 0 8px 16px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.04)"
            : "0 1px 4px rgba(0,0,0,0.05)",
          transform: isHovered ? "translateY(-5px) scale(1.01)" : "translateY(0) scale(1)",
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
              overflow: "hidden",
            }}
          >
            {coverUrl ? (
              <img
                src={coverUrl}
                alt={title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "transform 0.35s cubic-bezier(0.16,1,0.3,1)",
                  transform: isHovered ? "scale(1.04)" : "scale(1)",
                }}
              />
            ) : (
              <div style={{ textAlign: "center", color: "#AAAAAA" }}>
                <div style={{ fontSize: "32px", marginBottom: "4px" }}>♪</div>
                <div style={{ fontSize: "11px", fontFamily: "'Figtree', sans-serif" }}>No cover</div>
              </div>
            )}

            {/* Glass metadata strip — frosted overlay on image */}
            {(bpm || musicalKey || genre) && (
              <div style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                padding: "20px 10px 8px",
                background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%)",
                display: "flex",
                gap: "5px",
                flexWrap: "wrap",
                alignItems: "flex-end",
                opacity: isHovered ? 1 : 0,
                transition: "opacity 0.22s ease",
              }}>
                {bpm && (
                  <span style={{
                    background: "rgba(255,255,255,0.18)",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                    border: "1px solid rgba(255,255,255,0.25)",
                    borderRadius: "9999px",
                    padding: "2px 7px",
                    fontFamily: "'Figtree', sans-serif",
                    fontSize: "10px",
                    fontWeight: 600,
                    color: "#FFFFFF",
                    letterSpacing: "0.02em",
                  }}>{bpm} BPM</span>
                )}
                {musicalKey && (
                  <span style={{
                    background: "rgba(255,255,255,0.18)",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                    border: "1px solid rgba(255,255,255,0.25)",
                    borderRadius: "9999px",
                    padding: "2px 7px",
                    fontFamily: "'Figtree', sans-serif",
                    fontSize: "10px",
                    fontWeight: 500,
                    color: "#FFFFFF",
                  }}>{musicalKey}</span>
                )}
                {genre && (
                  <span style={{
                    background: "rgba(255,255,255,0.18)",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                    border: "1px solid rgba(255,255,255,0.25)",
                    borderRadius: "9999px",
                    padding: "2px 7px",
                    fontFamily: "'Figtree', sans-serif",
                    fontSize: "10px",
                    fontWeight: 500,
                    color: "#FFFFFF",
                  }}>{genre}</span>
                )}
              </div>
            )}

            {/* Exclusive sold overlay */}
            {isExclusiveSold && (
              <div style={{
                position: "absolute",
                inset: 0,
                background: "rgba(0,0,0,0.5)",
                backdropFilter: "blur(4px)",
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
                  letterSpacing: "0.06em",
                }}>SOLD</span>
              </div>
            )}
          </div>
        </Link>

        {/* Info */}
        <div style={{ padding: "12px 14px 14px" }}>
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
                    color: "#999999",
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
                  width: "34px",
                  height: "34px",
                  borderRadius: "50%",
                  background: isPlaying
                    ? "linear-gradient(135deg, #555555 0%, #222222 100%)"
                    : "linear-gradient(135deg, #1a1a1a 0%, #0A0A0A 100%)",
                  border: "none",
                  boxShadow: isPlaying
                    ? "0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)"
                    : "0 2px 10px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  flexShrink: 0,
                  transition: "transform 0.15s ease, box-shadow 0.15s ease",
                  transform: isHovered ? "scale(1.06)" : "scale(1)",
                }}
              >
                {isPlaying
                  ? <Pause size={13} fill="#FFFFFF" color="#FFFFFF" />
                  : <Play size={13} fill="#FFFFFF" color="#FFFFFF" />
                }
              </button>
            )}
          </div>

          {lowestPrice !== null && lowestPrice !== undefined && (
            <div style={{
              marginTop: "10px",
              fontFamily: "'Figtree', sans-serif",
              fontWeight: 700,
              fontSize: "14px",
              color: "#0A0A0A",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }} data-testid={`text-price-${id}`}>
              <span style={{ fontSize: "11px", fontWeight: 500, color: "#AAAAAA" }}>from</span>
              {formatCurrency(Number(lowestPrice))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
