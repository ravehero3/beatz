import { useState } from "react";
import { useLocation } from "wouter";
import { useCreateBeat, getListBeatsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import StudioLayout from "./StudioLayout";

const GENRES = ["Hip-Hop", "Trap", "Drill", "R&B", "Pop", "Afrobeats", "Lo-Fi", "House", "Techno", "Other"];
const MOODS = ["Dark", "Chill", "Hype", "Emotional", "Aggressive", "Romantic", "Uplifting", "Mysterious"];
const KEYS = ["C major", "C minor", "C# major", "C# minor", "D major", "D minor", "D# major", "D# minor", "E major", "E minor", "F major", "F minor", "F# major", "F# minor", "G major", "G minor", "G# major", "G# minor", "A major", "A minor", "A# major", "A# minor", "B major", "B minor"];

export default function UploadBeatPage() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const createBeat = useCreateBeat();

  const [form, setForm] = useState({
    title: "", description: "", bpm: "", key: "", genre: "", mood: "",
    tags: "", priceBasic: "490", pricePremium: "1490", priceExclusive: "4900",
    coverUrl: "", audioPreviewUrl: "",
  });

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    createBeat.mutate({
      data: {
        title: form.title,
        description: form.description || undefined,
        bpm: form.bpm ? Number(form.bpm) : undefined,
        key: form.key || undefined,
        genre: form.genre || undefined,
        mood: form.mood || undefined,
        tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
        coverUrl: form.coverUrl || undefined,
        audioPreviewUrl: form.audioPreviewUrl || undefined,
        priceBasic: form.priceBasic ? Number(form.priceBasic) : undefined,
        pricePremium: form.pricePremium ? Number(form.pricePremium) : undefined,
        priceExclusive: form.priceExclusive ? Number(form.priceExclusive) : undefined,
      },
    }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListBeatsQueryKey() });
        setLocation("/studio/beats");
      },
    });
  }

  const inp = (field: string) => ({
    value: form[field as keyof typeof form],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => set(field, e.target.value),
    style: { width: "100%", height: "40px", padding: "0 12px", borderRadius: "10px", border: "1px solid #E5E5E5", fontFamily: "'Figtree', sans-serif", fontSize: "14px", outline: "none", boxSizing: "border-box" as const },
    onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => (e.target.style.borderColor = "#0A0A0A"),
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => (e.target.style.borderColor = "#E5E5E5"),
  });

  const label = (text: string) => (
    <label style={{ display: "block", fontFamily: "'Figtree', sans-serif", fontSize: "13px", fontWeight: 500, color: "#444444", marginBottom: "5px" }}>{text}</label>
  );

  return (
    <StudioLayout>
      <div style={{ padding: "32px", maxWidth: "700px" }}>
        <h1 style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 700, fontSize: "22px", color: "#0A0A0A", letterSpacing: "-0.02em", marginBottom: "28px" }}>Upload Beat</h1>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "16px", padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 600, fontSize: "15px", color: "#0A0A0A", marginBottom: "4px" }}>Beat Info</div>
            <div>
              {label("Title *")}
              <input type="text" required placeholder="Beat title" {...inp("title")} data-testid="input-beat-title" />
            </div>
            <div>
              {label("Description")}
              <textarea placeholder="Describe your beat..." {...inp("description")} style={{ ...inp("description").style, height: "80px", padding: "10px 12px", resize: "vertical" }} data-testid="input-beat-description" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                {label("BPM")}
                <input type="number" placeholder="140" {...inp("bpm")} data-testid="input-beat-bpm" />
              </div>
              <div>
                {label("Key")}
                <select {...inp("key")} style={{ ...inp("key").style, cursor: "pointer" }} data-testid="select-beat-key">
                  <option value="">Select key...</option>
                  {KEYS.map((k) => <option key={k} value={k}>{k}</option>)}
                </select>
              </div>
              <div>
                {label("Genre")}
                <select {...inp("genre")} style={{ ...inp("genre").style, cursor: "pointer" }} data-testid="select-beat-genre">
                  <option value="">Select genre...</option>
                  {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div>
                {label("Mood")}
                <select {...inp("mood")} style={{ ...inp("mood").style, cursor: "pointer" }} data-testid="select-beat-mood">
                  <option value="">Select mood...</option>
                  {MOODS.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            </div>
            <div>
              {label("Tags (comma-separated)")}
              <input type="text" placeholder="dark, trap, melodic" {...inp("tags")} data-testid="input-beat-tags" />
            </div>
          </div>

          <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "16px", padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 600, fontSize: "15px", color: "#0A0A0A", marginBottom: "4px" }}>Files</div>
            <div>
              {label("Cover Image URL")}
              <input type="url" placeholder="https://..." {...inp("coverUrl")} data-testid="input-cover-url" />
            </div>
            <div>
              {label("Audio Preview URL (30s MP3)")}
              <input type="url" placeholder="https://..." {...inp("audioPreviewUrl")} data-testid="input-audio-url" />
            </div>
          </div>

          <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "16px", padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 600, fontSize: "15px", color: "#0A0A0A", marginBottom: "4px" }}>Pricing (Kč)</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
              <div>
                {label("Basic")}
                <input type="number" placeholder="490" {...inp("priceBasic")} data-testid="input-price-basic" />
              </div>
              <div>
                {label("Premium")}
                <input type="number" placeholder="1490" {...inp("pricePremium")} data-testid="input-price-premium" />
              </div>
              <div>
                {label("Exclusive")}
                <input type="number" placeholder="4900" {...inp("priceExclusive")} data-testid="input-price-exclusive" />
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button type="submit" disabled={createBeat.isPending} data-testid="btn-submit-upload" style={{ height: "44px", padding: "0 28px", borderRadius: "9999px", background: "#0A0A0A", color: "#FFFFFF", border: "none", fontFamily: "'Figtree', sans-serif", fontSize: "14px", fontWeight: 500, cursor: createBeat.isPending ? "not-allowed" : "pointer", opacity: createBeat.isPending ? 0.6 : 1 }}>
              {createBeat.isPending ? "Uploading..." : "Upload Beat"}
            </button>
            <button type="button" onClick={() => setLocation("/studio/beats")} style={{ height: "44px", padding: "0 20px", borderRadius: "9999px", background: "#FFFFFF", color: "#0A0A0A", border: "1px solid #E5E5E5", fontFamily: "'Figtree', sans-serif", fontSize: "14px", fontWeight: 500, cursor: "pointer" }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </StudioLayout>
  );
}
