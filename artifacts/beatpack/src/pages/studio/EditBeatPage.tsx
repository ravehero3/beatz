import { useState, useRef, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { useGetBeat, useUpdateBeat, getGetBeatQueryKey, getListBeatsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";
import StudioLayout from "./StudioLayout";
import { Upload, X, Music, Image, CheckCircle2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const GENRES = ["Hip-Hop", "Trap", "Drill", "R&B", "Pop", "Afrobeats", "Lo-Fi", "House", "Techno", "Other"];
const MOODS = ["Dark", "Chill", "Hype", "Emotional", "Aggressive", "Romantic", "Uplifting", "Mysterious"];
const KEYS = ["C major","C minor","C# major","C# minor","D major","D minor","D# major","D# minor","E major","E minor","F major","F minor","F# major","F# minor","G major","G minor","G# major","G# minor","A major","A minor","A# major","A# minor","B major","B minor"];
const F = "'Figtree', sans-serif";

function Label({ text }: { text: string }) {
  return <label style={{ display: "block", fontFamily: F, fontSize: "13px", fontWeight: 500, color: "#444444", marginBottom: "5px" }}>{text}</label>;
}

function TextInput({ value, onChange, placeholder, type = "text", required }: { value: string; onChange: (v: string) => void; placeholder?: string; type?: string; required?: boolean }) {
  return (
    <input type={type} required={required} value={value} placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      style={{ width: "100%", height: "40px", padding: "0 12px", borderRadius: "10px", border: "1px solid #E5E5E5", fontFamily: F, fontSize: "14px", outline: "none", boxSizing: "border-box" }}
      onFocus={(e) => (e.target.style.borderColor = "#0A0A0A")}
      onBlur={(e) => (e.target.style.borderColor = "#E5E5E5")}
    />
  );
}

function SelectInput({ value, onChange, children }: { value: string; onChange: (v: string) => void; children: React.ReactNode }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}
      style={{ width: "100%", height: "40px", padding: "0 12px", borderRadius: "10px", border: "1px solid #E5E5E5", fontFamily: F, fontSize: "14px", outline: "none", boxSizing: "border-box", cursor: "pointer", background: "#FFFFFF" }}
      onFocus={(e) => (e.target.style.borderColor = "#0A0A0A")}
      onBlur={(e) => (e.target.style.borderColor = "#E5E5E5")}
    >
      {children}
    </select>
  );
}

function AudioDropZone({ label, hint, fileName, audioUrl, uploading, onFile, onClear }: {
  label: string; hint: string; fileName: string; audioUrl: string; uploading: boolean;
  onFile: (f: File) => void; onClear: () => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  return (
    <div>
      <Label text={label} />
      <div
        onClick={() => ref.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) onFile(f); }}
        style={{ border: `2px dashed ${dragging ? "#0A0A0A" : "#E5E5E5"}`, borderRadius: "12px", padding: "16px", cursor: "pointer", background: dragging ? "#F9F9F9" : "#FAFAFA", transition: "all 0.15s ease", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", textAlign: "center" }}
      >
        {fileName ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
            <Music size={20} color="#0A0A0A" />
            <span style={{ fontFamily: F, fontSize: "12px", color: "#444", wordBreak: "break-all" }}>{fileName}</span>
            {audioUrl && <audio controls src={audioUrl} style={{ width: "100%", height: "28px" }} onClick={(e) => e.stopPropagation()} />}
          </div>
        ) : (
          <>
            <Upload size={18} color="#888" />
            <span style={{ fontFamily: F, fontSize: "12px", color: "#888888" }}>{hint}</span>
            <span style={{ fontFamily: F, fontSize: "11px", color: "#AAAAAA" }}>Click or drag & drop</span>
          </>
        )}
        {uploading && <span style={{ fontFamily: F, fontSize: "11px", color: "#888" }}>Uploading…</span>}
      </div>
      <input ref={ref} type="file" accept=".mp3,.wav,.aiff" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); }} />
      {fileName && (
        <button type="button" onClick={(e) => { e.stopPropagation(); onClear(); }} style={{ marginTop: "4px", background: "none", border: "none", fontFamily: F, fontSize: "11px", color: "#888", cursor: "pointer", display: "flex", alignItems: "center", gap: "3px" }}>
          <X size={10} /> Remove
        </button>
      )}
    </div>
  );
}

export default function EditBeatPage() {
  const params = useParams<{ id: string }>();
  const beatId = params.id;
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { token } = useAuthStore();
  const updateBeat = useUpdateBeat();

  const { data: beat, isLoading } = useGetBeat(beatId, {
    query: { enabled: !!beatId, queryKey: getGetBeatQueryKey(beatId) },
  });

  const [form, setForm] = useState({ title: "", description: "", bpm: "", key: "", genre: "", mood: "", tags: "", priceBasic: "", pricePremium: "", priceExclusive: "" });
  const [coverUrl, setCoverUrl] = useState("");
  const [coverPreview, setCoverPreview] = useState("");
  const [uploadingCover, setUploadingCover] = useState(false);
  const [previewAudioUrl, setPreviewAudioUrl] = useState("");
  const [previewAudioName, setPreviewAudioName] = useState("");
  const [uploadingPreview, setUploadingPreview] = useState(false);
  const [fullAudioUrl, setFullAudioUrl] = useState("");
  const [fullAudioName, setFullAudioName] = useState("");
  const [uploadingFull, setUploadingFull] = useState(false);
  const [wavAudioUrl, setWavAudioUrl] = useState("");
  const [wavAudioName, setWavAudioName] = useState("");
  const [uploadingWav, setUploadingWav] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (beat) {
      setForm({
        title: beat.title ?? "",
        description: (beat as any).description ?? "",
        bpm: beat.bpm ? String(beat.bpm) : "",
        key: beat.key ?? "",
        genre: beat.genre ?? "",
        mood: beat.mood ?? "",
        tags: (beat.tags ?? []).join(", "),
        priceBasic: beat.priceBasic ? String(beat.priceBasic) : "",
        pricePremium: beat.pricePremium ? String(beat.pricePremium) : "",
        priceExclusive: beat.priceExclusive ? String(beat.priceExclusive) : "",
      });
      setCoverUrl(beat.coverUrl ?? "");
      setCoverPreview(beat.coverUrl ?? "");
      setPreviewAudioUrl(beat.audioPreviewUrl ?? "");
      setPreviewAudioName(beat.audioPreviewUrl ? "Current preview audio" : "");
      setFullAudioUrl((beat as any).audioFullUrl ?? "");
      setFullAudioName((beat as any).audioFullUrl ? "Current full audio" : "");
      setWavAudioUrl((beat as any).audioWavUrl ?? "");
      setWavAudioName((beat as any).audioWavUrl ? "Current WAV audio" : "");
    }
  }, [beat]);

  function set(field: string, value: string) { setForm((f) => ({ ...f, [field]: value })); }

  async function uploadFile(file: File): Promise<string> {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: fd });
    if (!res.ok) throw new Error("Upload failed");
    return (await res.json()).url as string;
  }

  async function handleCoverFile(file: File) {
    setCoverPreview(URL.createObjectURL(file));
    setUploadingCover(true);
    try { setCoverUrl(await uploadFile(file)); } catch { setCoverPreview(coverUrl); }
    finally { setUploadingCover(false); }
  }

  async function handleAudioFile(file: File, type: "preview" | "full" | "wav") {
    const setUploading = type === "preview" ? setUploadingPreview : type === "full" ? setUploadingFull : setUploadingWav;
    const setName = type === "preview" ? setPreviewAudioName : type === "full" ? setFullAudioName : setWavAudioName;
    const setUrl = type === "preview" ? setPreviewAudioUrl : type === "full" ? setFullAudioUrl : setWavAudioUrl;
    setName(file.name);
    setUploading(true);
    try { setUrl(await uploadFile(file)); } catch { setName(""); }
    finally { setUploading(false); }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaved(false);
    updateBeat.mutate({
      id: beatId,
      data: {
        title: form.title || null,
        description: form.description || null,
        bpm: form.bpm ? Number(form.bpm) : null,
        key: form.key || null,
        genre: form.genre || null,
        mood: form.mood || null,
        tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
        coverUrl: coverUrl || null,
        priceBasic: form.priceBasic ? Number(form.priceBasic) : null,
        pricePremium: form.pricePremium ? Number(form.pricePremium) : null,
        priceExclusive: form.priceExclusive ? Number(form.priceExclusive) : null,
      } as any,
    }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListBeatsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetBeatQueryKey(beatId) });
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      },
    });
  }

  const card = { background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "16px", padding: "24px", display: "flex" as const, flexDirection: "column" as const, gap: "16px" };
  const anyUploading = uploadingCover || uploadingPreview || uploadingFull || uploadingWav;

  if (isLoading) {
    return (
      <StudioLayout>
        <div style={{ padding: "32px", maxWidth: "700px" }}>
          <Skeleton style={{ height: "32px", width: "200px", marginBottom: "28px" }} />
          <Skeleton style={{ height: "200px", borderRadius: "16px" }} />
        </div>
      </StudioLayout>
    );
  }

  return (
    <StudioLayout>
      <div style={{ padding: "32px", maxWidth: "700px" }}>
        <h1 style={{ fontFamily: F, fontWeight: 700, fontSize: "22px", color: "#0A0A0A", letterSpacing: "-0.02em", marginBottom: "28px" }}>Edit Beat</h1>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Files */}
          <div style={card}>
            <div style={{ fontFamily: F, fontWeight: 600, fontSize: "15px", color: "#0A0A0A" }}>Files</div>

            {/* Cover */}
            <div>
              <Label text="Cover Artwork" />
              <div
                onClick={() => document.getElementById("cover-input")?.click()}
                style={{ border: "2px dashed #E5E5E5", borderRadius: "12px", padding: "16px", cursor: "pointer", background: "#FAFAFA", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}
              >
                {coverPreview ? (
                  <img src={coverPreview} alt="cover" style={{ width: "120px", height: "120px", objectFit: "cover", borderRadius: "10px" }} />
                ) : (
                  <>
                    <Image size={20} color="#888" />
                    <span style={{ fontFamily: F, fontSize: "12px", color: "#888" }}>JPG, PNG, WebP</span>
                  </>
                )}
                {uploadingCover && <span style={{ fontFamily: F, fontSize: "11px", color: "#888" }}>Uploading…</span>}
              </div>
              <input id="cover-input" type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleCoverFile(f); }} />
              {coverPreview && (
                <button type="button" onClick={() => { setCoverUrl(""); setCoverPreview(""); }} style={{ marginTop: "4px", background: "none", border: "none", fontFamily: F, fontSize: "11px", color: "#888", cursor: "pointer", display: "flex", alignItems: "center", gap: "3px" }}>
                  <X size={10} /> Remove
                </button>
              )}
            </div>

            {/* Audio files */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
              <AudioDropZone label="Preview Audio" hint="Tagged MP3 for public listening" fileName={previewAudioName} audioUrl={previewAudioUrl} uploading={uploadingPreview} onFile={(f) => handleAudioFile(f, "preview")} onClear={() => { setPreviewAudioUrl(""); setPreviewAudioName(""); }} />
              <AudioDropZone label="Full MP3" hint="Clean MP3 for buyers" fileName={fullAudioName} audioUrl={fullAudioUrl} uploading={uploadingFull} onFile={(f) => handleAudioFile(f, "full")} onClear={() => { setFullAudioUrl(""); setFullAudioName(""); }} />
              <AudioDropZone label="WAV File" hint="High quality for Premium/Exclusive" fileName={wavAudioName} audioUrl={wavAudioUrl} uploading={uploadingWav} onFile={(f) => handleAudioFile(f, "wav")} onClear={() => { setWavAudioUrl(""); setWavAudioName(""); }} />
            </div>
          </div>

          {/* Beat Info */}
          <div style={card}>
            <div style={{ fontFamily: F, fontWeight: 600, fontSize: "15px", color: "#0A0A0A" }}>Beat Info</div>
            <div><Label text="Title *" /><TextInput value={form.title} onChange={(v) => set("title", v)} placeholder="Beat title" required /></div>
            <div>
              <Label text="Description" />
              <textarea value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Describe your beat…"
                style={{ width: "100%", height: "80px", padding: "10px 12px", borderRadius: "10px", border: "1px solid #E5E5E5", fontFamily: F, fontSize: "14px", outline: "none", boxSizing: "border-box", resize: "vertical" }}
                onFocus={(e) => (e.target.style.borderColor = "#0A0A0A")} onBlur={(e) => (e.target.style.borderColor = "#E5E5E5")}
              />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div><Label text="BPM" /><TextInput value={form.bpm} onChange={(v) => set("bpm", v)} placeholder="140" type="number" /></div>
              <div><Label text="Key" /><SelectInput value={form.key} onChange={(v) => set("key", v)}><option value="">Select key…</option>{KEYS.map((k) => <option key={k} value={k}>{k}</option>)}</SelectInput></div>
              <div><Label text="Genre" /><SelectInput value={form.genre} onChange={(v) => set("genre", v)}><option value="">Select genre…</option>{GENRES.map((g) => <option key={g} value={g}>{g}</option>)}</SelectInput></div>
              <div><Label text="Mood" /><SelectInput value={form.mood} onChange={(v) => set("mood", v)}><option value="">Select mood…</option>{MOODS.map((m) => <option key={m} value={m}>{m}</option>)}</SelectInput></div>
            </div>
            <div><Label text="Tags (comma-separated)" /><TextInput value={form.tags} onChange={(v) => set("tags", v)} placeholder="dark, trap, melodic" /></div>
          </div>

          {/* Pricing */}
          <div style={card}>
            <div style={{ fontFamily: F, fontWeight: 600, fontSize: "15px", color: "#0A0A0A" }}>Pricing (Kč)</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
              <div><Label text="Basic" /><TextInput value={form.priceBasic} onChange={(v) => set("priceBasic", v)} placeholder="490" type="number" /></div>
              <div><Label text="Premium" /><TextInput value={form.pricePremium} onChange={(v) => set("pricePremium", v)} placeholder="1490" type="number" /></div>
              <div><Label text="Exclusive" /><TextInput value={form.priceExclusive} onChange={(v) => set("priceExclusive", v)} placeholder="4900" type="number" /></div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <button
              type="submit"
              disabled={updateBeat.isPending || anyUploading}
              style={{ height: "44px", padding: "0 28px", borderRadius: "9999px", background: "#0A0A0A", color: "#FFFFFF", border: "none", fontFamily: F, fontSize: "14px", fontWeight: 500, cursor: (updateBeat.isPending || anyUploading) ? "not-allowed" : "pointer", opacity: (updateBeat.isPending || anyUploading) ? 0.6 : 1 }}
            >
              {updateBeat.isPending ? "Saving…" : anyUploading ? "Uploading files…" : "Save changes"}
            </button>
            <button type="button" onClick={() => setLocation("/studio/beats")} style={{ height: "44px", padding: "0 20px", borderRadius: "9999px", background: "#FFFFFF", color: "#0A0A0A", border: "1px solid #E5E5E5", fontFamily: F, fontSize: "14px", fontWeight: 500, cursor: "pointer" }}>
              Cancel
            </button>
            {saved && (
              <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 14px", background: "#F0FDF4", border: "1px solid #86EFAC", borderRadius: "9999px" }}>
                <CheckCircle2 size={13} color="#22C55E" />
                <span style={{ fontFamily: F, fontSize: "12px", fontWeight: 500, color: "#22C55E" }}>Saved!</span>
              </div>
            )}
          </div>
        </form>
      </div>
    </StudioLayout>
  );
}
