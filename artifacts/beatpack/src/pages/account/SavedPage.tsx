import { useListSavedBeats } from "@workspace/api-client-react";
import BeatCard from "@/components/BeatCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function SavedPage() {
  const { data: beats, isLoading } = useListSavedBeats();

  return (
    <div style={{ paddingTop: "44px", minHeight: "100vh", background: "#F9F9F9" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 24px" }}>
        <h1 style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 700, fontSize: "24px", color: "#0A0A0A", letterSpacing: "-0.02em", marginBottom: "32px" }}>Saved Beats</h1>
        {isLoading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "24px" }}>
            {Array(6).fill(0).map((_, i) => (
              <div key={i} style={{ borderRadius: "16px", overflow: "hidden", border: "1px solid #E5E5E5" }}>
                <Skeleton style={{ aspectRatio: "1" }} />
                <div style={{ padding: "12px 16px 16px" }}><Skeleton style={{ height: "16px", marginBottom: "6px" }} /></div>
              </div>
            ))}
          </div>
        ) : (beats ?? []).length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 24px", background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "16px" }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>♡</div>
            <div style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 600, fontSize: "16px", color: "#0A0A0A", marginBottom: "8px" }}>No saved beats yet</div>
            <div style={{ fontFamily: "'Figtree', sans-serif", fontSize: "14px", color: "#888888" }}>Save beats you like and find them here.</div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "24px" }}>
            {(beats ?? []).map((beat) => (
              <BeatCard
                key={beat.id}
                id={beat.id}
                title={beat.title}
                artistName={beat.artistName}
                artistSlug={beat.artistSlug}
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
