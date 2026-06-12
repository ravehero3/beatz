import { Link } from "wouter";
import { ArrowRight, Upload, DollarSign, Zap } from "lucide-react";
import { useGetFeaturedBeats, useGetFeaturedArtists } from "@workspace/api-client-react";
import BeatCard from "@/components/BeatCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useT } from "@/lib/i18n";

export default function HomePage() {
  const { data: featuredBeats, isLoading: beatsLoading } = useGetFeaturedBeats();
  const { data: featuredArtists, isLoading: artistsLoading } = useGetFeaturedArtists();
  const t = useT();

  return (
    <div style={{ paddingTop: "44px" }}>
      {/* Hero */}
      <section style={{
        maxWidth: "1280px",
        margin: "0 auto",
        padding: "104px 24px 88px",
        textAlign: "center",
      }}>
        <h1 style={{
          fontFamily: "'Figtree', sans-serif",
          fontWeight: 800,
          fontSize: "clamp(3rem, 7.5vw, 6rem)",
          color: "#0A0A0A",
          letterSpacing: "-0.04em",
          lineHeight: 1.05,
          marginBottom: "24px",
          background: "linear-gradient(160deg, #0A0A0A 0%, #3A3A3A 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}>
          {t("home.hero.title")}
        </h1>
        <p style={{
          fontFamily: "'Figtree', sans-serif",
          fontSize: "18px",
          color: "#888888",
          maxWidth: "440px",
          margin: "0 auto 44px",
          lineHeight: 1.65,
        }}>
          {t("home.hero.sub")}
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/beats">
            <button
              data-testid="btn-browse-beats"
              style={{
                height: "48px",
                padding: "0 32px",
                borderRadius: "9999px",
                background: "linear-gradient(135deg, #1a1a1a 0%, #0A0A0A 100%)",
                color: "#FFFFFF",
                border: "none",
                fontFamily: "'Figtree', sans-serif",
                fontWeight: 600,
                fontSize: "14px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                boxShadow: "0 4px 16px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.12)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.12)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 16px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.12)";
              }}
            >
              {t("home.hero.browse")} <ArrowRight size={16} />
            </button>
          </Link>
          <Link href="/pricing">
            <button
              data-testid="btn-start-selling"
              style={{
                height: "48px",
                padding: "0 32px",
                borderRadius: "9999px",
                background: "rgba(255,255,255,0.85)",
                backdropFilter: "blur(12px)",
                color: "#0A0A0A",
                border: "1px solid rgba(0,0,0,0.10)",
                fontFamily: "'Figtree', sans-serif",
                fontWeight: 500,
                fontSize: "14px",
                cursor: "pointer",
                transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 20px rgba(0,0,0,0.10)";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(0,0,0,0.18)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(0,0,0,0.10)";
              }}
            >
              {t("home.hero.sell")}
            </button>
          </Link>
        </div>
      </section>

      {/* Featured Beats */}
      <section style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px 88px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
          <h2 style={{
            fontFamily: "'Figtree', sans-serif",
            fontWeight: 700,
            fontSize: "22px",
            color: "#0A0A0A",
            letterSpacing: "-0.025em",
          }}>{t("home.featured.beats")}</h2>
          <Link href="/beats" style={{
            fontFamily: "'Figtree', sans-serif",
            fontSize: "14px",
            fontWeight: 500,
            color: "#888888",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            transition: "color 0.15s ease",
          }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#0A0A0A"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#888888"; }}
          >
            {t("home.featured.viewAllBeats")} <ArrowRight size={14} />
          </Link>
        </div>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: "28px",
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
            : (featuredBeats ?? []).map((beat, index) => (
              <div
                key={beat.id}
                className="beat-card-enter"
                style={{ animationDelay: `${Math.min(index * 0.055, 0.45)}s` }}
              >
                <BeatCard
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
              </div>
            ))
          }
        </div>
      </section>

      {/* Featured Artists */}
      <section style={{
        background: "rgba(248,248,248,0.7)",
        backdropFilter: "blur(8px)",
        borderTop: "1px solid rgba(0,0,0,0.05)",
        borderBottom: "1px solid rgba(0,0,0,0.05)",
      }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "64px 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
            <h2 style={{
              fontFamily: "'Figtree', sans-serif",
              fontWeight: 700,
              fontSize: "22px",
              color: "#0A0A0A",
              letterSpacing: "-0.025em",
            }}>{t("home.featured.artists")}</h2>
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
              {t("home.featured.viewAllArtists")} <ArrowRight size={14} />
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
                    transition: "transform 0.2s ease",
                  }}
                    data-testid={`card-artist-${artist.id}`}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; }}
                  >
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
                      boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
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
                        color: "#AAAAAA",
                        marginTop: "2px",
                      }}>{artist.beatCount} {t("home.artist.beats")}</div>
                    )}
                  </div>
                </Link>
              ))
            }
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ maxWidth: "1280px", margin: "0 auto", padding: "88px 24px" }}>
        <h2 style={{
          fontFamily: "'Figtree', sans-serif",
          fontWeight: 700,
          fontSize: "clamp(1.5rem, 3vw, 2rem)",
          color: "#0A0A0A",
          letterSpacing: "-0.03em",
          textAlign: "center",
          marginBottom: "52px",
        }}>{t("home.how.title")}</h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "24px",
        }}>
          {[
            { icon: <Upload size={22} />, title: t("home.how.upload.title"), desc: t("home.how.upload.desc") },
            { icon: <Zap size={22} />, title: t("home.how.price.title"), desc: t("home.how.price.desc") },
            { icon: <DollarSign size={22} />, title: t("home.how.pay.title"), desc: t("home.how.pay.desc") },
          ].map((step, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,0.8)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(0,0,0,0.07)",
              borderRadius: "20px",
              padding: "36px 28px",
              textAlign: "center",
              boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
              transition: "transform 0.22s ease, box-shadow 0.22s ease",
            }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 32px rgba(0,0,0,0.08)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 12px rgba(0,0,0,0.04)";
              }}
            >
              <div style={{
                width: "48px",
                height: "48px",
                borderRadius: "14px",
                background: "linear-gradient(135deg, #1a1a1a 0%, #0A0A0A 100%)",
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)",
              }}>{step.icon}</div>
              <div style={{
                fontFamily: "'Figtree', sans-serif",
                fontWeight: 700,
                fontSize: "17px",
                color: "#0A0A0A",
                marginBottom: "10px",
                letterSpacing: "-0.01em",
              }}>{step.title}</div>
              <div style={{
                fontFamily: "'Figtree', sans-serif",
                fontSize: "14px",
                color: "#888888",
                lineHeight: 1.65,
              }}>{step.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{
        background: "linear-gradient(135deg, #0F0F0F 0%, #1A1A1A 100%)",
        padding: "88px 24px",
        textAlign: "center",
      }}>
        <h2 style={{
          fontFamily: "'Figtree', sans-serif",
          fontWeight: 800,
          fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
          color: "#FFFFFF",
          letterSpacing: "-0.035em",
          marginBottom: "16px",
          lineHeight: 1.1,
        }}>{t("home.cta.title")}</h2>
        <p style={{
          fontFamily: "'Figtree', sans-serif",
          fontSize: "16px",
          color: "rgba(255,255,255,0.5)",
          marginBottom: "36px",
        }}>{t("home.cta.sub")}</p>
        <Link href="/pricing">
          <button
            data-testid="btn-cta-pricing"
            style={{
              height: "48px",
              padding: "0 32px",
              borderRadius: "9999px",
              background: "rgba(255,255,255,0.95)",
              color: "#0A0A0A",
              border: "none",
              fontFamily: "'Figtree', sans-serif",
              fontWeight: 600,
              fontSize: "14px",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              boxShadow: "0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.9)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.9)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.9)";
            }}
          >
            {t("home.cta.button")} <ArrowRight size={16} />
          </button>
        </Link>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid rgba(0,0,0,0.06)",
        padding: "32px 24px",
        textAlign: "center",
        background: "rgba(255,255,255,0.5)",
      }}>
        <p style={{
          fontFamily: "'Figtree', sans-serif",
          fontSize: "13px",
          color: "#AAAAAA",
        }}>
          {t("home.footer")}
        </p>
      </footer>
    </div>
  );
}
