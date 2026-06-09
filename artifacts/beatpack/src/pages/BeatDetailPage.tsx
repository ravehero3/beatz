import { useState } from "react";
import { useParams, Link, useLocation } from "wouter";
import { ArrowLeft, Play, Heart, ShoppingCart, Instagram, Youtube, Music } from "lucide-react";
import { useGetBeat, getGetBeatQueryKey, useIncrementBeatPlays, useListSavedBeats, useSaveBeat, useUnsaveBeat, getListSavedBeatsQueryKey } from "@workspace/api-client-react";
import { useAuthStore } from "@/store/authStore";
import { useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/format";

const licenses = [
  {
    type: "basic",
    name: "Basic License",
    priceKey: "priceBasic" as const,
    features: ["MP3 file", "Non-exclusive", "Up to 500k streams", "Commercial use"],
  },
  {
    type: "premium",
    name: "Premium License",
    priceKey: "pricePremium" as const,
    features: ["WAV + stems", "Non-exclusive", "Unlimited commercial use", "Radio & sync ready"],
  },
  {
    type: "exclusive",
    name: "Exclusive License",
    priceKey: "priceExclusive" as const,
    features: ["WAV + stems", "Exclusive rights", "Beat removed from sale", "Full ownership transfer"],
  },
];

export default function BeatDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id ?? "";
  const [selectedLicense, setSelectedLicense] = useState<string>("basic");
  const [, setLocation] = useLocation();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: beat, isLoading } = useGetBeat(id, {
    query: { enabled: !!id, queryKey: getGetBeatQueryKey(id) },
  });
  const incrementPlays = useIncrementBeatPlays();
  const { data: savedBeats } = useListSavedBeats();
  const saveBeat = useSaveBeat();
  const unsaveBeat = useUnsaveBeat();

  const isSaved = (savedBeats ?? []).some((b) => b.id === id);

  function handlePlay() {
    incrementPlays.mutate({ id });
  }

  function handleSave() {
    if (!user) { setLocation("/login"); return; }
    if (isSaved) {
      unsaveBeat.mutate({ beatId: id }, {
        onSuccess: () => queryClient.invalidateQueries({ queryKey: getListSavedBeatsQueryKey() }),
      });
    } else {
      saveBeat.mutate({ beatId: id }, {
        onSuccess: () => queryClient.invalidateQueries({ queryKey: getListSavedBeatsQueryKey() }),
      });
    }
  }

  function handleBuy() {
    if (!user) { setLocation("/register"); return; }
    setLocation(`/checkout?beatId=${id}&license=${selectedLicense}`);
  }

  if (isLoading) {
    return (
      <div style={{ paddingTop: "44px", maxWidth: "1280px", margin: "0 auto", padding: "80px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px" }}>
          <Skeleton style={{ aspectRatio: "1", borderRadius: "16px" }} />
          <div>
            <Skeleton style={{ height: "32px", width: "300px", marginBottom: "16px" }} />
            <Skeleton style={{ height: "16px", width: "200px", marginBottom: "32px" }} />
            <Skeleton style={{ height: "200px", borderRadius: "16px" }} />
          </div>
        </div>
      </div>
    );
  }

  if (!beat) {
    return (
      <div style={{ paddingTop: "44px", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 700, fontSize: "20px", marginBottom: "8px" }}>Beat not found</div>
          <Link href="/beats" style={{ color: "#888888", fontSize: "14px", display: "flex", alignItems: "center", gap: "4px", justifyContent: "center" }}>
            <ArrowLeft size={14} /> Back to beats
          </Link>
        </div>
      </div>
    );
  }

  const selectedLicenseData = licenses.find((l) => l.type === selectedLicense);
  const selectedPrice = beat[selectedLicenseData?.priceKey ?? "priceBasic" as keyof typeof beat] as string | null | undefined;

  return (
    <div style={{ paddingTop: "44px", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Breadcrumb */}
        <Link href="/beats" style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#888888", fontFamily: "'Figtree', sans-serif", fontSize: "13px", textDecoration: "none", marginBottom: "24px" }}>
          <ArrowLeft size={14} /> Back to beats
        </Link>

        <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: "48px", alignItems: "start" }}>
          {/* Left column */}
          <div>
            {/* Cover */}
            <div style={{
              aspectRatio: "1",
              background: beat.coverUrl ? undefined : "#F2F2F2",
              borderRadius: "16px",
              overflow: "hidden",
              marginBottom: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}>
              {beat.coverUrl
                ? <img src={beat.coverUrl} alt={beat.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <span style={{ fontSize: "64px", color: "#AAAAAA" }}>♪</span>
              }
              <button
                onClick={handlePlay}
                data-testid="btn-play-beat"
                style={{
                  position: "absolute",
                  bottom: "16px",
                  right: "16px",
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  background: "#0A0A0A",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.20)",
                }}
              >
                <Play size={20} fill="#FFFFFF" color="#FFFFFF" />
              </button>
            </div>

            {/* Beat info */}
            <h1 style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 700, fontSize: "28px", color: "#0A0A0A", letterSpacing: "-0.02em", marginBottom: "16px" }}>
              {beat.title}
            </h1>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
              {beat.bpm && <span style={{ background: "#F2F2F2", borderRadius: "9999px", padding: "4px 12px", fontFamily: "'Figtree', sans-serif", fontSize: "13px", fontWeight: 500, color: "#444444" }}>{beat.bpm} BPM</span>}
              {beat.key && <span style={{ background: "#F2F2F2", borderRadius: "9999px", padding: "4px 12px", fontFamily: "'Figtree', sans-serif", fontSize: "13px", fontWeight: 500, color: "#444444" }}>{beat.key}</span>}
              {beat.genre && <span style={{ background: "#F2F2F2", borderRadius: "9999px", padding: "4px 12px", fontFamily: "'Figtree', sans-serif", fontSize: "13px", fontWeight: 500, color: "#444444" }}>{beat.genre}</span>}
              {beat.mood && <span style={{ background: "#F2F2F2", borderRadius: "9999px", padding: "4px 12px", fontFamily: "'Figtree', sans-serif", fontSize: "13px", fontWeight: 500, color: "#444444" }}>{beat.mood}</span>}
            </div>
            {(beat as any).tags && (beat as any).tags.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "16px" }}>
                {(beat as any).tags.map((tag: string) => (
                  <span key={tag} style={{ background: "#0A0A0A", color: "#FFFFFF", borderRadius: "9999px", padding: "3px 10px", fontFamily: "'Figtree', sans-serif", fontSize: "12px" }}>#{tag}</span>
                ))}
              </div>
            )}
            <div style={{ fontFamily: "'Figtree', sans-serif", fontSize: "13px", color: "#888888" }}>
              {beat.plays?.toLocaleString("cs-CZ")} plays
            </div>
          </div>

          {/* Right column */}
          <div style={{ position: "sticky", top: "68px" }}>
            {/* Artist card */}
            {(beat as any).artist && (
              <div style={{ background: "#F9F9F9", border: "1px solid #E5E5E5", borderRadius: "16px", padding: "20px", marginBottom: "24px", display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#E5E5E5", overflow: "hidden", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {(beat as any).artist.profilePictureUrl
                    ? <img src={(beat as any).artist.profilePictureUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : <span style={{ fontSize: "20px" }}>♪</span>
                  }
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 600, fontSize: "14px", color: "#0A0A0A" }}>{(beat as any).artist.displayName ?? "Artist"}</div>
                  <Link href={`/artists/${(beat as any).artist.slug ?? (beat as any).artist.id}`} style={{ fontFamily: "'Figtree', sans-serif", fontSize: "12px", color: "#888888", textDecoration: "none" }}>
                    View store →
                  </Link>
                </div>
              </div>
            )}

            {/* License selector */}
            <div style={{ marginBottom: "16px" }}>
              <div style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 600, fontSize: "15px", color: "#0A0A0A", marginBottom: "12px" }}>Select license</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {licenses.map((lic) => {
                  const price = beat[lic.priceKey as keyof typeof beat] as string | null | undefined;
                  if (!price) return null;
                  const isSelected = selectedLicense === lic.type;
                  const isExclusiveSoldOut = lic.type === "exclusive" && beat.isExclusiveSold;
                  return (
                    <button
                      key={lic.type}
                      onClick={() => !isExclusiveSoldOut && setSelectedLicense(lic.type)}
                      disabled={isExclusiveSoldOut}
                      data-testid={`btn-license-${lic.type}`}
                      style={{
                        background: isSelected ? "#0A0A0A" : "#FFFFFF",
                        border: isSelected ? "2px solid #0A0A0A" : "1px solid #E5E5E5",
                        borderRadius: "10px",
                        padding: "14px 16px",
                        cursor: isExclusiveSoldOut ? "not-allowed" : "pointer",
                        textAlign: "left",
                        transition: "all 0.15s ease",
                        opacity: isExclusiveSoldOut ? 0.5 : 1,
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                        <span style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 600, fontSize: "13px", color: isSelected ? "#FFFFFF" : "#0A0A0A" }}>
                          {lic.name} {isExclusiveSoldOut && "(Sold)"}
                        </span>
                        <span style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 700, fontSize: "15px", color: isSelected ? "#FFFFFF" : "#0A0A0A" }}>
                          {formatCurrency(Number(price))}
                        </span>
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                        {lic.features.map((f) => (
                          <span key={f} style={{ fontFamily: "'Figtree', sans-serif", fontSize: "11px", color: isSelected ? "rgba(255,255,255,0.7)" : "#888888" }}>
                            {f} ·{" "}
                          </span>
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <button
                onClick={handleBuy}
                data-testid="btn-buy-now"
                style={{
                  height: "48px",
                  borderRadius: "9999px",
                  background: "#0A0A0A",
                  color: "#FFFFFF",
                  border: "none",
                  fontFamily: "'Figtree', sans-serif",
                  fontWeight: 600,
                  fontSize: "15px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  transition: "opacity 0.15s ease",
                }}
              >
                <ShoppingCart size={18} /> Buy Now
                {selectedPrice && <span style={{ opacity: 0.7 }}>— {formatCurrency(Number(selectedPrice))}</span>}
              </button>
              <button
                onClick={handleSave}
                data-testid="btn-save-beat"
                style={{
                  height: "44px",
                  borderRadius: "9999px",
                  background: isSaved ? "#F2F2F2" : "#FFFFFF",
                  color: "#0A0A0A",
                  border: "1px solid #E5E5E5",
                  fontFamily: "'Figtree', sans-serif",
                  fontWeight: 500,
                  fontSize: "14px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  transition: "all 0.15s ease",
                }}
              >
                <Heart size={16} fill={isSaved ? "#0A0A0A" : "none"} /> {isSaved ? "Saved" : "Save to wishlist"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
