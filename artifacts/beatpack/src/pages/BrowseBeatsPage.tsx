import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { useListBeats, useListGenres } from "@workspace/api-client-react";
import BeatCard from "@/components/BeatCard";
import BottomPlayer from "@/components/BottomPlayer";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useT } from "@/lib/i18n";

interface ActiveBeat {
  id: string;
  title: string;
  artistName?: string | null;
  coverUrl?: string | null;
  audioUrl: string;
}

export default function BrowseBeatsPage() {
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("all");
  const [bpmMin, setBpmMin] = useState("");
  const [bpmMax, setBpmMax] = useState("");
  const [activeBeat, setActiveBeat] = useState<ActiveBeat | null>(null);
  const t = useT();

  const { data: beats, isLoading } = useListBeats({
    search: search || undefined,
    genre: genre && genre !== "all" ? genre : undefined,
    bpmMin: bpmMin ? Number(bpmMin) : undefined,
    bpmMax: bpmMax ? Number(bpmMax) : undefined,
    limit: 48,
  });

  const { data: genres } = useListGenres();

  return (
    <div style={{ paddingTop: "44px", minHeight: "100vh" }}>
      {/* Page header */}
      <div style={{
        borderBottom: "1px solid #F2F2F2",
        padding: "32px 24px 24px",
        background: "#FFFFFF",
      }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <h1 style={{
            fontFamily: "'Figtree', sans-serif",
            fontWeight: 700,
            fontSize: "28px",
            color: "#0A0A0A",
            letterSpacing: "-0.02em",
            marginBottom: "20px",
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
                  fontFamily: "'Figtree', sans-serif",
                  fontSize: "14px",
                  outline: "none",
                  transition: "border-color 0.15s ease",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#0A0A0A")}
                onBlur={(e) => (e.target.style.borderColor = "#E5E5E5")}
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
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Beat grid */}
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "32px 24px", paddingBottom: activeBeat ? "104px" : "32px" }}>
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
          <div style={{ textAlign: "center", padding: "80px 24px", color: "#888888" }}>
            <div style={{ fontSize: "40px", marginBottom: "16px" }}>♪</div>
            <div style={{ fontFamily: "'Figtree', sans-serif", fontSize: "16px", fontWeight: 600, color: "#0A0A0A", marginBottom: "8px" }}>
              {t("browse.noBeats")}
            </div>
            <div style={{ fontFamily: "'Figtree', sans-serif", fontSize: "14px" }}>
              {t("browse.noBeatsHint")}
            </div>
          </div>
        ) : (
          <>
            <div style={{
              fontFamily: "'Figtree', sans-serif",
              fontSize: "13px",
              color: "#888888",
              marginBottom: "20px",
            }}>
              {beats?.length ?? 0} {t("browse.beatsFound")}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "24px" }}>
              {(beats ?? []).map((beat) => (
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
                  isPlaying={activeBeat?.id === beat.id}
                  onPlay={() => {
                    const audioUrl = beat.audioFullUrl ?? beat.audioPreviewUrl;
                    if (!audioUrl) return;
                    if (activeBeat?.id === beat.id) {
                      setActiveBeat(null);
                    } else {
                      setActiveBeat({
                        id: beat.id,
                        title: beat.title,
                        artistName: beat.artistName ?? null,
                        coverUrl: beat.coverUrl ?? null,
                        audioUrl,
                      });
                    }
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {activeBeat && (
        <BottomPlayer
          beat={activeBeat}
          onClose={() => setActiveBeat(null)}
        />
      )}
    </div>
  );
}
