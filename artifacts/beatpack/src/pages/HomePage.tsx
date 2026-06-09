import { Link } from "wouter";
import { ArrowRight, Upload, DollarSign, Zap } from "lucide-react";
import { useGetFeaturedBeats, useGetFeaturedArtists } from "@workspace/api-client-react";
import BeatCard from "@/components/BeatCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomePage() {
  const { data: featuredBeats, isLoading: beatsLoading } = useGetFeaturedBeats();
  const { data: featuredArtists, isLoading: artistsLoading } = useGetFeaturedArtists();

  return (
    <div style={{ paddingTop: "44px" }}>
      {/* Hero */}
      <section style={{
        maxWidth: "1280px",
        margin: "0 auto",
        padding: "96px 24px 80px",
        textAlign: "center",
      }}>
        <h1 style={{
          fontFamily: "'Figtree', sans-serif",
          fontWeight: 800,
          fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
          color: "#0A0A0A",
          letterSpacing: "-0.03em",
          lineHeight: 1.1,
          marginBottom: "20px",
        }}>
          Your beats. Your store.
        </h1>
        <p style={{
          fontFamily: "'Figtree', sans-serif",
          fontSize: "18px",
          color: "#888888",
          marginBottom: "40px",
          maxWidth: "480px",
          margin: "0 auto 40px",
          lineHeight: 1.6,
        }}>
          The Czech beat marketplace for independent producers. Sell your beats directly to buyers — keep everything you earn.
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/beats">
            <button
              data-testid="btn-browse-beats"
              style={{
                height: "44px",
                padding: "0 28px",
                borderRadius: "9999px",
                background: "#0A0A0A",
                color: "#FFFFFF",
                border: "none",
                fontFamily: "'Figtree', sans-serif",
                fontWeight: 500,
                fontSize: "14px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "all 0.15s ease",
              }}
            >
              Browse Beats <ArrowRight size={16} />
            </button>
          </Link>
          <Link href="/pricing">
            <button
              data-testid="btn-start-selling"
              style={{
                height: "44px",
                padding: "0 28px",
                borderRadius: "9999px",
                background: "#FFFFFF",
                color: "#0A0A0A",
                border: "1px solid #E5E5E5",
                fontFamily: "'Figtree', sans-serif",
                fontWeight: 500,
                fontSize: "14px",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              Start Selling
            </button>
          </Link>
        </div>
      </section>

      {/* Featured Beats */}
      <section style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px 80px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
          <h2 style={{
            fontFamily: "'Figtree', sans-serif",
            fontWeight: 700,
            fontSize: "24px",
            color: "#0A0A0A",
            letterSpacing: "-0.02em",
          }}>Featured Beats</h2>
          <Link href="/beats" style={{
            fontFamily: "'Figtree', sans-serif",
            fontSize: "14px",
            fontWeight: 500,
            color: "#888888",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}>
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: "24px",
        }}>
          {beatsLoading
            ? Array(6).fill(0).map((_, i) => (
              <div key={i} style={{ borderRadius: "16px", overflow: "hidden", border: "1px solid #E5E5E5" }}>
                <Skeleton style={{ aspectRatio: "1" }} />
                <div style={{ padding: "12px 16px 16px" }}>
                  <Skeleton style={{ height: "16px", marginBottom: "8px" }} />
                  <Skeleton style={{ height: "12px", width: "60%" }} />
                </div>
              </div>
            ))
            : (featuredBeats ?? []).map((beat) => (
              <BeatCard
                key={beat.id}
                id={beat.id}
                title={beat.title}
                artistName={beat.artistName}
                artistSlug={beat.artistSlug}
                bpm={beat.bpm}
                musicalKey={beat.key}
                genre={beat.genre}
                coverUrl={beat.coverUrl}
                priceBasic={beat.priceBasic !== undefined ? Number(beat.priceBasic) : null}
                isExclusiveSold={beat.isExclusiveSold}
              />
            ))
          }
        </div>
      </section>

      {/* Featured Artists */}
      <section style={{
        background: "#F9F9F9",
        borderTop: "1px solid #F2F2F2",
        borderBottom: "1px solid #F2F2F2",
      }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "64px 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
            <h2 style={{
              fontFamily: "'Figtree', sans-serif",
              fontWeight: 700,
              fontSize: "24px",
              color: "#0A0A0A",
              letterSpacing: "-0.02em",
            }}>Featured Artists</h2>
            <Link href="/artists" style={{
              fontFamily: "'Figtree', sans-serif",
              fontSize: "14px",
              fontWeight: 500,
              color: "#888888",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}>
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div style={{
            display: "flex",
            gap: "24px",
            overflowX: "auto",
            paddingBottom: "8px",
            scrollbarWidth: "none",
          }}>
            {artistsLoading
              ? Array(6).fill(0).map((_, i) => (
                <div key={i} style={{ flexShrink: 0, textAlign: "center", width: "120px" }}>
                  <Skeleton style={{ width: "80px", height: "80px", borderRadius: "50%", margin: "0 auto 8px" }} />
                  <Skeleton style={{ height: "14px", width: "80px", margin: "0 auto 4px" }} />
                  <Skeleton style={{ height: "12px", width: "60px", margin: "0 auto" }} />
                </div>
              ))
              : (featuredArtists ?? []).map((artist) => (
                <Link key={artist.id} href={`/artists/${artist.slug ?? artist.id}`}>
                  <div style={{
                    flexShrink: 0,
                    textAlign: "center",
                    width: "120px",
                    cursor: "pointer",
                  }} data-testid={`card-artist-${artist.id}`}>
                    <div style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "50%",
                      background: artist.profilePictureUrl ? undefined : "#E5E5E5",
                      margin: "0 auto 10px",
                      overflow: "hidden",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
                      {artist.profilePictureUrl
                        ? <img src={artist.profilePictureUrl} alt={artist.displayName ?? ""} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        : <span style={{ fontSize: "28px", color: "#888888" }}>♪</span>
                      }
                    </div>
                    <div style={{
                      fontFamily: "'Figtree', sans-serif",
                      fontWeight: 600,
                      fontSize: "13px",
                      color: "#0A0A0A",
                    }}>{artist.displayName ?? "Artist"}</div>
                    {artist.beatCount != null && (
                      <div style={{
                        fontFamily: "'Figtree', sans-serif",
                        fontSize: "12px",
                        color: "#888888",
                        marginTop: "2px",
                      }}>{artist.beatCount} beats</div>
                    )}
                  </div>
                </Link>
              ))
            }
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ maxWidth: "1280px", margin: "0 auto", padding: "80px 24px" }}>
        <h2 style={{
          fontFamily: "'Figtree', sans-serif",
          fontWeight: 700,
          fontSize: "28px",
          color: "#0A0A0A",
          letterSpacing: "-0.02em",
          textAlign: "center",
          marginBottom: "48px",
        }}>How it works</h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "32px",
        }}>
          {[
            { icon: <Upload size={24} />, title: "Upload beats", desc: "Upload your MP3/WAV files and set your own prices for each license tier." },
            { icon: <Zap size={24} />, title: "Set prices", desc: "Choose Basic, Premium, or Exclusive licenses. You control every price." },
            { icon: <DollarSign size={24} />, title: "Get paid directly", desc: "Buyers pay directly to your bank via QR platba. Money goes straight to you." },
          ].map((step, i) => (
            <div key={i} style={{
              background: "#FFFFFF",
              border: "1px solid #E5E5E5",
              borderRadius: "16px",
              padding: "32px",
              textAlign: "center",
            }}>
              <div style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                background: "#0A0A0A",
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}>{step.icon}</div>
              <div style={{
                fontFamily: "'Figtree', sans-serif",
                fontWeight: 700,
                fontSize: "18px",
                color: "#0A0A0A",
                marginBottom: "8px",
              }}>{step.title}</div>
              <div style={{
                fontFamily: "'Figtree', sans-serif",
                fontSize: "14px",
                color: "#888888",
                lineHeight: 1.6,
              }}>{step.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{
        background: "#0A0A0A",
        padding: "80px 24px",
        textAlign: "center",
      }}>
        <h2 style={{
          fontFamily: "'Figtree', sans-serif",
          fontWeight: 700,
          fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
          color: "#FFFFFF",
          letterSpacing: "-0.03em",
          marginBottom: "16px",
        }}>Start your beat store today</h2>
        <p style={{
          fontFamily: "'Figtree', sans-serif",
          fontSize: "16px",
          color: "rgba(255,255,255,0.6)",
          marginBottom: "32px",
        }}>Free forever. Upgrade when you're ready.</p>
        <Link href="/pricing">
          <button
            data-testid="btn-cta-pricing"
            style={{
              height: "44px",
              padding: "0 28px",
              borderRadius: "9999px",
              background: "#FFFFFF",
              color: "#0A0A0A",
              border: "none",
              fontFamily: "'Figtree', sans-serif",
              fontWeight: 500,
              fontSize: "14px",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              transition: "all 0.15s ease",
            }}
          >
            View pricing <ArrowRight size={16} />
          </button>
        </Link>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid #F2F2F2",
        padding: "32px 24px",
        textAlign: "center",
      }}>
        <p style={{
          fontFamily: "'Figtree', sans-serif",
          fontSize: "13px",
          color: "#888888",
        }}>
          © 2024 Beatpack. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
