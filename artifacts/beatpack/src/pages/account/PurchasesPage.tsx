import { useListMyOrders } from "@workspace/api-client-react";
import { Download, FileText, Music } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import { Skeleton } from "@/components/ui/skeleton";

function getLicenseBadgeStyle(licenseType: string): React.CSSProperties {
  if (licenseType === "exclusive") return { background: "#FEF3C7", color: "#92400E" };
  if (licenseType === "premium") return { background: "#EDE9FE", color: "#6D28D9" };
  return { background: "#F2F2F2", color: "#444444" };
}

function getDownloadUrls(licenseType: string, beat: { audioPreviewUrl?: string | null; audioFullUrl?: string | null; audioWavUrl?: string | null } | null | undefined): { mp3: string | null; wav: string | null } {
  if (!beat) return { mp3: null, wav: null };
  const mp3 = beat.audioFullUrl ?? beat.audioPreviewUrl ?? null;
  const wav = (licenseType === "premium" || licenseType === "exclusive") ? (beat.audioWavUrl ?? null) : null;
  return { mp3, wav };
}

export default function PurchasesPage() {
  const { data: orders, isLoading } = useListMyOrders();
  const paidOrders = (orders ?? []).filter((o) => o.paymentStatus === "paid");

  return (
    <div style={{ paddingTop: "44px", minHeight: "100vh", background: "#F9F9F9" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 700, fontSize: "24px", color: "#0A0A0A", letterSpacing: "-0.02em", marginBottom: "4px" }}>My Purchases</h1>
          <p style={{ fontFamily: "'Figtree', sans-serif", fontSize: "14px", color: "#888888" }}>
            {paidOrders.length > 0 ? `${paidOrders.length} beat${paidOrders.length === 1 ? "" : "s"} purchased` : "Your purchased beats will appear here"}
          </p>
        </div>

        {isLoading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {Array(4).fill(0).map((_, i) => (
              <div key={i} style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "16px", padding: "20px" }}>
                <Skeleton style={{ height: "16px", width: "200px", marginBottom: "8px" }} />
                <Skeleton style={{ height: "12px", width: "120px" }} />
              </div>
            ))}
          </div>
        ) : paidOrders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 24px", background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "16px" }}>
            <div style={{ width: "64px", height: "64px", borderRadius: "16px", background: "#F2F2F2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: "#AAAAAA" }}>
              <Music size={28} />
            </div>
            <div style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 600, fontSize: "16px", color: "#0A0A0A", marginBottom: "8px" }}>No purchases yet</div>
            <div style={{ fontFamily: "'Figtree', sans-serif", fontSize: "14px", color: "#888888" }}>Browse beats and find something you love.</div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {paidOrders.map((order) => {
              const { mp3, wav } = getDownloadUrls(order.licenseType, order.beat as any);
              const licenseLabel = order.licenseType.charAt(0).toUpperCase() + order.licenseType.slice(1);

              return (
                <div
                  key={order.id}
                  data-testid={`row-purchase-${order.id}`}
                  style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "16px", padding: "20px" }}
                >
                  <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                    {/* Cover art */}
                    <div style={{ width: "64px", height: "64px", borderRadius: "10px", background: "#F2F2F2", overflow: "hidden", flexShrink: 0 }}>
                      {order.beat?.coverUrl
                        ? <img src={order.beat.coverUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#AAAAAA" }}><Music size={22} /></div>
                      }
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 700, fontSize: "15px", color: "#0A0A0A", marginBottom: "6px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {order.beat?.title ?? "Beat"}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                        <span style={{ ...getLicenseBadgeStyle(order.licenseType), borderRadius: "9999px", padding: "2px 10px", fontFamily: "'Figtree', sans-serif", fontSize: "11px", fontWeight: 600 }}>
                          {licenseLabel}
                        </span>
                        <span style={{ fontFamily: "'Figtree', sans-serif", fontSize: "13px", color: "#0A0A0A", fontWeight: 700 }}>
                          {formatCurrency(Number(order.amountCzk))}
                        </span>
                        <span style={{ fontFamily: "'Figtree', sans-serif", fontSize: "12px", color: "#AAAAAA" }}>
                          {new Date(order.createdAt).toLocaleDateString("cs-CZ", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Download actions */}
                  <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid #F2F2F2", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {mp3 ? (
                      <a
                        href={mp3}
                        download
                        data-testid={`btn-download-${order.id}`}
                        style={{ display: "inline-flex", alignItems: "center", gap: "6px", height: "36px", padding: "0 16px", borderRadius: "9999px", background: "#0A0A0A", color: "#FFFFFF", border: "none", fontFamily: "'Figtree', sans-serif", fontSize: "13px", fontWeight: 500, cursor: "pointer", textDecoration: "none" }}
                      >
                        <Download size={13} /> Download MP3
                      </a>
                    ) : null}
                    {wav ? (
                      <a
                        href={wav}
                        download
                        data-testid={`btn-download-wav-${order.id}`}
                        style={{ display: "inline-flex", alignItems: "center", gap: "6px", height: "36px", padding: "0 16px", borderRadius: "9999px", background: "#FFFFFF", color: "#0A0A0A", border: "1px solid #E5E5E5", fontFamily: "'Figtree', sans-serif", fontSize: "13px", fontWeight: 500, cursor: "pointer", textDecoration: "none" }}
                      >
                        <Download size={13} /> Download WAV
                      </a>
                    ) : null}
                    {order.licensePdfUrl && (
                      <a
                        href={order.licensePdfUrl}
                        target="_blank"
                        rel="noreferrer"
                        data-testid={`btn-license-${order.id}`}
                        style={{ display: "inline-flex", alignItems: "center", gap: "6px", height: "36px", padding: "0 16px", borderRadius: "9999px", background: "#FFFFFF", color: "#0A0A0A", border: "1px solid #E5E5E5", fontFamily: "'Figtree', sans-serif", fontSize: "13px", fontWeight: 500, cursor: "pointer", textDecoration: "none" }}
                      >
                        <FileText size={13} /> License
                      </a>
                    )}
                    {!mp3 && !wav && !order.licensePdfUrl && (
                      <span style={{ fontFamily: "'Figtree', sans-serif", fontSize: "13px", color: "#AAAAAA" }}>Files not yet available</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
