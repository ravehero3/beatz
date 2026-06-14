import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { useCreateBeat, getListBeatsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";
import StudioLayout from "./StudioLayout";
import { Upload, X, Music } from "lucide-react";

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

function FileDropZone({
  label, accept, hint, preview, onFile, onClear, uploading
}: {
  label: string; accept: string; hint: string;
  preview: React.ReactNode; onFile: (f: File) => void;
  onClear: () => void; uploading: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault(); setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) onFile(file);
  }

  return (
    <div>
      <Label text={label} />
      <div
        onClick={() => ref.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${dragging ? "#0A0A0A" : "#E5E5E5"}`,
          borderRadius: "12px",
          padding: "20px",
          cursor: "pointer",
          background: dragging ? "#F9F9F9" : "#FAFAFA",
          transition: "all 0.15s ease",
          display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
          textAlign: "center",
        }}
      >
        {preview || (
          <>
            <div style={{ width: "40px", height: "40px", background: "#F0F0F0", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Upload size={18} color="#888" />
            </div>
            <div style={{ fontFamily: F, fontSize: "13px", color: "#888888" }}>{hint}</div>
            <div style={{ fontFamily: F, fontSize: "11px", color: "#AAAAAA" }}>Click or drag & drop</div>
          </>
        )}
        {uploading && <div style={{ fontFamily: F, fontSize: "12px", color: "#888" }}>Uploading…</div>}
      </div>
      <input ref={ref} type="file" accept={accept} style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); }} />
      {preview && (
        <button type="button" onClick={(e) => { e.stopPropagation(); onClear(); }} style={{ marginTop: "6px", background: "none", border: "none", fontFamily: F, fontSize: "12px", color: "#888", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}>
          <X size={12} /> Remove
        </button>
      )}
    </div>
  );
}

export default function UploadBeatPage() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { token } = useAuthStore();
  const createBeat = useCreateBeat();

  const [form, setForm] = useState({ title: "", description: "", bpm: "", key: "", genre: "", mood: "", tags: "", priceBasic: "490", pricePremium: "1490", priceExclusive: "4900" });
  const [coverUrl, setCoverUrl] = useState("");
  const [coverPreview, setCoverPreview] = useState("");
  const [previewAudioUrl, setPreviewAudioUrl] = useState("");
  const [previewAudioName, setPreviewAudioName] = useState("");
  const [fullAudioUrl, setFullAudioUrl] = useState("");
  const [fullAudioName, setFullAudioName] = useState("");
  const [wavAudioUrl, setWavAudioUrl] = useState("");
  const [wavAudioName, setWavAudioName] = useState("");
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingPreview, setUploadingPreview] = useState(false);
  const [uploadingFull, setUploadingFull] = useState(false);
  const [uploadingWav, setUploadingWav] = useState(false);

  function set(field: string, value: string) { setForm((f) => ({ ...f, [field]: value })); }

  async function uploadFile(file: File): Promise<string> {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: fd });
    if (!res.ok) throw new Error("Upload failed");
    const data = await res.json();
    return data.url as string;
  }

  async function handleCoverFile(file: File) {
    setCoverPreview(URL.createObjectURL(file));
    setUploadingCover(true);
    try { setCoverUrl(await uploadFile(file)); } catch { setCoverPreview(""); }
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
    createBeat.mutate({
      data: {
        title: form.title,
        description: form.description || undefined,
        bpm: form.bpm ? Number(form.bpm) : undefined,
        key: form.key || undefined,
        genre: form.genre || undefined,
        mood: form.mood || undefined,
        tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
        coverUrl: coverUrl || undefined,
        audioPreviewUrl: previewAudioUrl || undefined,
        audioFullUrl: fullAudioUrl || undefined,
        priceBasic: form.priceBasic ? Number(form.priceBasic) : undefined,
        pricePremium: form.pricePremium ? Number(form.pricePremium) : undefined,
        priceExclusive: form.priceExclusive ? Number(form.priceExclusive) : undefined,
      },
    }, {
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListBeatsQueryKey() }); setLocation("/studio/beats"); },
    });
  }

  const card = { background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "16px", padding: "24px", display: "flex" as const, flexDirection: "column" as const, gap: "16px" };

  return (
    <StudioLayout>
      <div style={{ padding: "32px", maxWidth: "700px" }}>
        <h1 style={{ fontFamily: F, fontWeight: 700, fontSize: "22px", color: "#0A0A0A", letterSpacing: "-0.02em", marginBottom: "28px" }}>Upload Beat</h1>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Files */}
          <div style={card}>
            <div style={{ fontFamily: F, fontWeight: 600, fontSize: "15px", color: "#0A0A0A" }}>Files</div>
            {/* Cover artwork */}
            <FileDropZone
              label="Cover Artwork"
              accept="image/*"
              hint="JPG, PNG, WebP"
              uploading={uploadingCover}
              onClear={() => { setCoverUrl(""); setCoverPreview(""); }}
              onFile={handleCoverFile}
              preview={coverPreview ? (
                <div style={{ position: "relative", width: "100%" }}>
                  <img src={coverPreview} alt="cover" style={{ width: "100%", aspectRatio: "1", objectFit: "cover", borderRadius: "8px" }} />
                  {uploadingCover && (
                    <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.7)", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "8px", fontFamily: F, fontSize: "12px" }}>Uploading…</div>
                  )}
                </div>
              ) : null}
            />

            {/* Audio files */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
              <FileDropZone
                label="Preview Audio"
                accept=".mp3,.wav,.aiff"
                hint="Tagged MP3 for public listening"
                uploading={uploadingPreview}
                onClear={() => { setPreviewAudioUrl(""); setPreviewAudioName(""); }}
                onFile={(f) => handleAudioFile(f, "preview")}
                preview={previewAudioName ? (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                    <Music size={16} color="#0A0A0A" />
                    <div style={{ fontFamily: F, fontSize: "11px", color: "#444", textAlign: "center", wordBreak: "break-all" }}>{previewAudioName}</div>
                    {previewAudioUrl && <audio controls src={previewAudioUrl} style={{ width: "100%", height: "26px" }} />}
                  </div>
                ) : null}
              />
              <FileDropZone
                label="Full MP3"
                accept=".mp3"
                hint="Clean MP3 for buyers (Basic+)"
                uploading={uploadingFull}
                onClear={() => { setFullAudioUrl(""); setFullAudioName(""); }}
                onFile={(f) => handleAudioFile(f, "full")}
                preview={fullAudioName ? (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                    <Music size={16} color="#6D28D9" />
                    <div style={{ fontFamily: F, fontSize: "11px", color: "#444", textAlign: "center", wordBreak: "break-all" }}>{fullAudioName}</div>
                    {fullAudioUrl && <audio controls src={fullAudioUrl} style={{ width: "100%", height: "26px" }} />}
                  </div>
                ) : null}
              />
              <FileDropZone
                label="WAV File"
                accept=".wav"
                hint="High quality (Premium/Exclusive)"
                uploading={uploadingWav}
                onClear={() => { setWavAudioUrl(""); setWavAudioName(""); }}
                onFile={(f) => handleAudioFile(f, "wav")}
                preview={wavAudioName ? (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                    <Music size={16} color="#92400E" />
                    <div style={{ fontFamily: F, fontSize: "11px", color: "#444", textAlign: "center", wordBreak: "break-all" }}>{wavAudioName}</div>
                    {wavAudioUrl && <audio controls src={wavAudioUrl} style={{ width: "100%", height: "26px" }} />}
                  </div>
                ) : null}
              />
            </div>
          </div>

          {/* Beat Info */}
          <div style={card}>
            <div style={{ fontFamily: F, fontWeight: 600, fontSize: "15px", color: "#0A0A0A" }}>Beat Info</div>
            <div>
              <Label text="Title *" />
              <TextInput value={form.title} onChange={(v) => set("title", v)} placeholder="Beat title" required />
            </div>
            <div>
              <Label text="Description" />
              <textarea value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Describe your beat…"
                style={{ width: "100%", height: "80px", padding: "10px 12px", borderRadius: "10px", border: "1px solid #E5E5E5", fontFamily: F, fontSize: "14px", outline: "none", boxSizing: "border-box", resize: "vertical" }}
                onFocus={(e) => (e.target.style.borderColor = "#0A0A0A")} onBlur={(e) => (e.target.style.borderColor = "#E5E5E5")}
              />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div><Label text="BPM" /><TextInput value={form.bpm} onChange={(v) => set("bpm", v)} placeholder="140" type="number" /></div>
              <div>
                <Label text="Key" />
                <SelectInput value={form.key} onChange={(v) => set("key", v)}>
                  <option value="">Select key…</option>
                  {KEYS.map((k) => <option key={k} value={k}>{k}</option>)}
                </SelectInput>
              </div>
              <div>
                <Label text="Genre" />
                <SelectInput value={form.genre} onChange={(v) => set("genre", v)}>
                  <option value="">Select genre…</option>
                  {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
                </SelectInput>
              </div>
              <div>
                <Label text="Mood" />
                <SelectInput value={form.mood} onChange={(v) => set("mood", v)}>
                  <option value="">Select mood…</option>
                  {MOODS.map((m) => <option key={m} value={m}>{m}</option>)}
                </SelectInput>
              </div>
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

          <div style={{ display: "flex", gap: "10px" }}>
            <button type="submit" disabled={createBeat.isPending || uploadingCover || uploadingPreview || uploadingFull || uploadingWav} data-testid="btn-submit-upload" style={{
              height: "44px", padding: "0 28px", borderRadius: "9999px", background: "#0A0A0A", color: "#FFFFFF", border: "none",
              fontFamily: F, fontSize: "14px", fontWeight: 500,
              cursor: (createBeat.isPending || uploadingCover || uploadingPreview || uploadingFull || uploadingWav) ? "not-allowed" : "pointer",
              opacity: (createBeat.isPending || uploadingCover || uploadingPreview || uploadingFull || uploadingWav) ? 0.6 : 1,
            }}>
              {createBeat.isPending ? "Uploading…" : (uploadingCover || uploadingPreview || uploadingFull || uploadingWav) ? "Processing files…" : "Upload Beat"}
            </button>
            <button type="button" onClick={() => setLocation("/studio/beats")} style={{
              height: "44px", padding: "0 20px", borderRadius: "9999px", background: "#FFFFFF", color: "#0A0A0A",
              border: "1px solid #E5E5E5", fontFamily: F, fontSize: "14px", fontWeight: 500, cursor: "pointer",
            }}>Cancel</button>
          </div>
        </form>
      </div>
    </StudioLayout>
  );
}
