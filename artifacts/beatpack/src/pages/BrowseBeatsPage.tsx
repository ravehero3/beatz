import { useState } from "react";
import { Search, SlidersHorizontal, Music, ArrowRight } from "lucide-react";
import { useListBeats, useListGenres, useGetFeaturedBeats } from "@workspace/api-client-react";
import BeatCard from "@/components/BeatCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useT } from "@/lib/i18n";
import { useAudioStore } from "@/store/audioStore";

function FeaturedBeatsSection() {
  const { data: featured, isLoading } = useGetFeaturedBeats();
  const { setTrack } = useAudioStore();
  if (!isLoading && (!featured || featured.length === 0)) return null;
  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "32px 24px 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2 style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 700, fontSize: "18px", color: "#0A0A0A", letterSpacing: "-0.02em" }}>
          Featured Beats
        </h2>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "20px", marginBottom: "40px" }}>
        {isLoading
          ? Array(4).fill(0).map((_, i) => (
            <div key={i} style={{ borderRadius: "16px", overflow: "hidden", border: "1px solid #E5E5E5" }}>
              <Skeleton style={{ aspectRatio: "1" }} />
              <div style={{ padding: "12px 16px 16px" }}><Skeleton style={{ height: "14px", marginBottom: "8px" }} /><Skeleton style={{ height: "12px", width: "60%" }} /></div>
            </div>
          ))
          : (featured ?? []).map((beat) => (
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
      <div style={{ borderBottom: "1px solid #F0F0F0", marginBottom: "32px" }} />
    </div>
  );
}

export default function BrowseBeatsPage() {
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("all");
  const [bpmMin, setBpmMin] = useState("");
  const [bpmMax, setBpmMax] = useState("");
  const t = useT();
  const { currentBeat, setTrack, close } = useAudioStore();

  const { data: beats, isLoading } = useListBeats({
    search: search || undefined,
    genre: genre && genre !== "all" ? genre : undefined,
    bpmMin: bpmMin ? Number(bpmMin) : undefined,
    bpmMax: bpmMax ? Number(bpmMax) : undefined,
    limit: 48,
  });

  const { data: genres } = useListGenres();

  const filterKey = `${search}-${genre}-${bpmMin}-${bpmMax}`;

  return (
    <div style={{ paddingTop: "44px", minHeight: "100vh" }}>
      {/* Page header */}
      <div style={{
        borderBottom: "1px solid rgba(0,0,0,0.06)",
        padding: "32px 24px 24px",
        background: "rgba(255,255,255,0.7)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <h1 style={{
            fontFamily: "'Figtree', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(1.75rem, 4vw, 2.25rem)",
            color: "#0A0A0A",
            letterSpacing: "-0.03em",
            marginBottom: "20px",
            background: "linear-gradient(135deg, #0A0A0A 0%, #3D3D3D 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>{t("browse.title")}</h1>
          {/* Search + filters */}
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ position: "relative", flex: "1 1 300px", maxWidth: "440px" }}>
              <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#888888" }} />
              <input
                type="search"
                placeholder={t("browse.searchPlaceholder")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                data-testid="input-search"
                style={{
                  width: "100%",
                  height: "40px",
                  paddingLeft: "36px",
                  paddingRight: "12px",
                  borderRadius: "10px",
                  border: "1px solid #E5E5E5",
                  background: "rgba(255,255,255,0.9)",
                  fontFamily: "'Figtree', sans-serif",
                  fontSize: "14px",
                  outline: "none",
                  transition: "border-color 0.15s ease, box-shadow 0.15s ease",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => { e.target.style.borderColor = "#0A0A0A"; e.target.style.boxShadow = "0 0 0 3px rgba(0,0,0,0.06)"; }}
                onBlur={(e) => { e.target.style.borderColor = "#E5E5E5"; e.target.style.boxShadow = "none"; }}
              />
            </div>

            <Select value={genre} onValueChange={setGenre}>
              <SelectTrigger style={{ width: "150px", height: "40px", borderRadius: "10px" }} data-testid="select-genre">
                <SelectValue placeholder={t("browse.allGenres")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("browse.allGenres")}</SelectItem>
                {(genres ?? []).map((g) => (
                  <SelectItem key={g.genre} value={g.genre}>{g.genre} ({g.count})</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <SlidersHorizontal size={14} color="#888888" />
              <input
                type="number"
                placeholder={t("browse.bpmMin")}
                value={bpmMin}
                onChange={(e) => setBpmMin(e.target.value)}
                data-testid="input-bpm-min"
                style={{
                  width: "90px",
                  height: "40px",
                  padding: "0 10px",
                  borderRadius: "10px",
                  border: "1px solid #E5E5E5",
                  fontFamily: "'Figtree', sans-serif",
                  fontSize: "14px",
                  outline: "none",
                  background: "rgba(255,255,255,0.9)",
                }}
              />
              <span style={{ color: "#888888", fontSize: "12px" }}>–</span>
              <input
                type="number"
                placeholder={t("browse.bpmMax")}
                value={bpmMax}
                onChange={(e) => setBpmMax(e.target.value)}
                data-testid="input-bpm-max"
                style={{
                  width: "90px",
                  height: "40px",
                  padding: "0 10px",
                  borderRadius: "10px",
                  border: "1px solid #E5E5E5",
                  fontFamily: "'Figtree', sans-serif",
                  fontSize: "14px",
                  outline: "none",
                  background: "rgba(255,255,255,0.9)",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Featured Beats — shown only when no filters active */}
      {!search && genre === "all" && !bpmMin && !bpmMax && <FeaturedBeatsSection />}

      {/* Beat grid */}
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "32px 24px", paddingBottom: currentBeat ? "120px" : "48px" }}>
        {isLoading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "24px" }}>
            {Array(12).fill(0).map((_, i) => (
              <div key={i} style={{ borderRadius: "16px", overflow: "hidden", border: "1px solid #E5E5E5" }}>
                <Skeleton style={{ aspectRatio: "1" }} />
                <div style={{ padding: "12px 16px 16px" }}>
                  <Skeleton style={{ height: "16px", marginBottom: "6px" }} />
                  <Skeleton style={{ height: "12px", width: "60%" }} />
                </div>
              </div>
            ))}
          </div>
        ) : (beats ?? []).length === 0 ? (
          <div style={{ textAlign: "center", padding: "96px 24px" }}>
            <div style={{
              width: "72px",
              height: "72px",
              borderRadius: "20px",
              background: "rgba(0,0,0,0.05)",
              backdropFilter: "blur(12px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
              border: "1px solid rgba(0,0,0,0.06)",
            }}>
              <Music size={28} color="#AAAAAA" />
            </div>
            <div style={{ fontFamily: "'Figtree', sans-serif", fontSize: "18px", fontWeight: 700, color: "#0A0A0A", marginBottom: "8px", letterSpacing: "-0.02em" }}>
              {t("browse.noBeats")}
            </div>
            <div style={{ fontFamily: "'Figtree', sans-serif", fontSize: "14px", color: "#888888", maxWidth: "320px", margin: "0 auto", lineHeight: 1.6 }}>
              {t("browse.noBeatsHint")}
            </div>
          </div>
        ) : (
          <>
            <div style={{
              fontFamily: "'Figtree', sans-serif",
              fontSize: "13px",
              color: "#AAAAAA",
              marginBottom: "20px",
              fontWeight: 500,
            }}>
              {beats?.length ?? 0} {t("browse.beatsFound")}
            </div>
            <div
              key={filterKey}
              style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "28px" }}
            >
              {(beats ?? []).map((beat, index) => (
                <div
                  key={beat.id}
                  className="beat-card-enter"
                  style={{ animationDelay: `${Math.min(index * 0.045, 0.5)}s` }}
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
                    isPlaying={currentBeat?.id === beat.id}
                    onPlay={() => {
                      const audioUrl = beat.audioFullUrl ?? beat.audioPreviewUrl;
                      if (!audioUrl) return;
                      if (currentBeat?.id === beat.id) {
                        close();
                      } else {
                        setTrack({
                          id: beat.id,
                          title: beat.title,
                          artistName: beat.artistName ?? null,
                          coverUrl: beat.coverUrl ?? null,
                          audioUrl,
                        });
                      }
                    }}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
