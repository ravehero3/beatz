import { useState } from "react";
import { useListMyOrders } from "@workspace/api-client-react";
import { useLocation, Link } from "wouter";
import { Download, Clock, CheckCircle2, AlertCircle, Copy, Music, RotateCcw } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import { Skeleton } from "@/components/ui/skeleton";

const F = "'Figtree', sans-serif";

function statusStyle(s: string): { bg: string; color: string; border: string } {
  if (s === "paid") return { bg: "#F0FDF4", color: "#22C55E", border: "#86EFAC" };
  if (s === "failed") return { bg: "#FEF2F2", color: "#EF4444", border: "#FECACA" };
  return { bg: "#FFFBEB", color: "#F59E0B", border: "#FCD34D" };
}

function StatusBadge({ status }: { status: string }) {
  const s = statusStyle(status);
  const Icon = status === "paid" ? CheckCircle2 : status === "failed" ? AlertCircle : Clock;
  const label = status === "paid" ? "Paid" : status === "failed" ? "Failed" : "Pending";
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "3px 10px", background: s.bg, border: `1px solid ${s.border}`, borderRadius: "9999px" }}>
      <Icon size={11} color={s.color} />
      <span style={{ fontFamily: F, fontSize: "11px", fontWeight: 600, color: s.color }}>{label}</span>
    </div>
  );
}

function LicenseBadge({ licenseType }: { licenseType: string }) {
  const styles: Record<string, React.CSSProperties> = {
    exclusive: { background: "#FEF3C7", color: "#92400E" },
    premium: { background: "#EDE9FE", color: "#6D28D9" },
    basic: { background: "#F2F2F2", color: "#444444" },
  };
  return (
    <span style={{ ...(styles[licenseType] ?? styles.basic), borderRadius: "9999px", padding: "2px 10px", fontFamily: F, fontSize: "11px", fontWeight: 600 }}>
      {licenseType.charAt(0).toUpperCase() + licenseType.slice(1)}
    </span>
  );
}

function PendingOrderCard({ order }: { order: any }) {
  const [copied, setCopied] = useState(false);
  const [, setLocation] = useLocation();

  function copySymbol() {
    if (order.variableSymbol) {
      navigator.clipboard.writeText(order.variableSymbol);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  }

  return (
    <div style={{ background: "#FFFBEB", border: "1px solid #FCD34D", borderRadius: "16px", padding: "20px" }}>
      <div style={{ display: "flex", gap: "14px", alignItems: "flex-start", marginBottom: "16px" }}>
        <div style={{ width: "56px", height: "56px", borderRadius: "10px", background: "#F2F2F2", overflow: "hidden", flexShrink: 0 }}>
          {order.beat?.coverUrl
            ? <img src={order.beat.coverUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#AAAAAA" }}><Music size={18} /></div>}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: F, fontWeight: 700, fontSize: "15px", color: "#0A0A0A", marginBottom: "4px" }}>{order.beat?.title ?? "Beat"}</div>
          <div style={{ display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap" }}>
            <LicenseBadge licenseType={order.licenseType} />
            <span style={{ fontFamily: F, fontSize: "13px", fontWeight: 700, color: "#0A0A0A" }}>{formatCurrency(Number(order.amountCzk))}</span>
          </div>
        </div>
        <StatusBadge status={order.paymentStatus} />
      </div>

      <div style={{ background: "rgba(255,255,255,0.7)", borderRadius: "12px", padding: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
        <p style={{ fontFamily: F, fontSize: "13px", color: "#666", margin: 0, lineHeight: 1.5 }}>
          Open your banking app and scan the QR code or use the variable symbol below to complete the bank transfer.
        </p>
        {order.variableSymbol && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <span style={{ fontFamily: F, fontSize: "13px", color: "#888" }}>Variable symbol:</span>
            <span style={{ fontFamily: "'Courier New', monospace", fontWeight: 700, fontSize: "15px", color: "#0A0A0A", background: "#F2F2F2", padding: "3px 10px", borderRadius: "6px" }}>{order.variableSymbol}</span>
            <button
              onClick={copySymbol}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#888", display: "flex", alignItems: "center", gap: "4px", fontFamily: F, fontSize: "12px", padding: 0 }}
            >
              <Copy size={13} /> {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontFamily: F, fontSize: "13px", color: "#888" }}>Amount:</span>
          <span style={{ fontFamily: F, fontWeight: 700, fontSize: "15px", color: "#0A0A0A" }}>{formatCurrency(Number(order.amountCzk))}</span>
        </div>
        <p style={{ fontFamily: F, fontSize: "11px", color: "#AAAAAA", margin: 0 }}>
          Placed {new Date(order.createdAt).toLocaleDateString("cs-CZ", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>
    </div>
  );
}

function PaidOrderCard({ order }: { order: any }) {
  const hasFullAudio = order.beat?.audioFullUrl;
  const hasWav = (order.licenseType === "premium" || order.licenseType === "exclusive") && order.beat?.audioWavUrl;

  return (
    <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "16px", padding: "20px" }}>
      <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
        <div style={{ width: "56px", height: "56px", borderRadius: "10px", background: "#F2F2F2", overflow: "hidden", flexShrink: 0 }}>
          {order.beat?.coverUrl
            ? <img src={order.beat.coverUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#AAAAAA" }}><Music size={18} /></div>}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: F, fontWeight: 700, fontSize: "15px", color: "#0A0A0A", marginBottom: "4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{order.beat?.title ?? "Beat"}</div>
          <div style={{ display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap", marginBottom: "4px" }}>
            <LicenseBadge licenseType={order.licenseType} />
            <span style={{ fontFamily: F, fontSize: "13px", fontWeight: 700, color: "#0A0A0A" }}>{formatCurrency(Number(order.amountCzk))}</span>
          </div>
          <span style={{ fontFamily: F, fontSize: "12px", color: "#AAAAAA" }}>
            {new Date(order.createdAt).toLocaleDateString("cs-CZ", { day: "numeric", month: "short", year: "numeric" })}
          </span>
        </div>
        <StatusBadge status="paid" />
      </div>

      <div style={{ marginTop: "14px", paddingTop: "14px", borderTop: "1px solid #F2F2F2", display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {hasFullAudio && (
          <a href={order.beat.audioFullUrl} download style={{ display: "inline-flex", alignItems: "center", gap: "6px", height: "34px", padding: "0 14px", borderRadius: "9999px", background: "#0A0A0A", color: "#FFFFFF", textDecoration: "none", fontFamily: F, fontSize: "12px", fontWeight: 500 }}>
            <Download size={12} /> MP3
          </a>
        )}
        {hasWav && (
          <a href={order.beat.audioWavUrl} download style={{ display: "inline-flex", alignItems: "center", gap: "6px", height: "34px", padding: "0 14px", borderRadius: "9999px", background: "#FFFFFF", color: "#0A0A0A", border: "1px solid #E5E5E5", textDecoration: "none", fontFamily: F, fontSize: "12px", fontWeight: 500 }}>
            <Download size={12} /> WAV
          </a>
        )}
        {!hasFullAudio && !hasWav && (
          <Link href="/account/purchases">
            <span style={{ fontFamily: F, fontSize: "12px", color: "#888", cursor: "pointer", textDecoration: "underline" }}>View downloads</span>
          </Link>
        )}
      </div>
    </div>
  );
}

function FailedOrderCard({ order }: { order: any }) {
  return (
    <div style={{ background: "#FFFFFF", border: "1px solid #FECACA", borderRadius: "16px", padding: "20px", opacity: 0.7 }}>
      <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
        <div style={{ width: "48px", height: "48px", borderRadius: "10px", background: "#F2F2F2", overflow: "hidden", flexShrink: 0 }}>
          {order.beat?.coverUrl && <img src={order.beat.coverUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: F, fontWeight: 600, fontSize: "14px", color: "#0A0A0A" }}>{order.beat?.title ?? "Beat"}</div>
          <div style={{ fontFamily: F, fontSize: "12px", color: "#888" }}>{order.licenseType} · {formatCurrency(Number(order.amountCzk))}</div>
        </div>
        <StatusBadge status="failed" />
      </div>
      <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px solid #F2F2F2" }}>
        <Link href={`/beats/${order.beatId}`}>
          <button style={{ display: "inline-flex", alignItems: "center", gap: "6px", height: "32px", padding: "0 14px", borderRadius: "9999px", background: "#FFFFFF", color: "#0A0A0A", border: "1px solid #E5E5E5", fontFamily: F, fontSize: "12px", fontWeight: 500, cursor: "pointer" }}>
            <RotateCcw size={12} /> Try again
          </button>
        </Link>
      </div>
    </div>
  );
}

const FILTERS = ["All", "Pending", "Paid", "Failed"] as const;
type Filter = typeof FILTERS[number];

export default function OrdersPage() {
  const { data: orders, isLoading } = useListMyOrders();
  const [filter, setFilter] = useState<Filter>("All");

  const filtered = (orders ?? []).filter((o) => {
    if (filter === "All") return true;
    return o.paymentStatus === filter.toLowerCase();
  });

  const counts = {
    All: (orders ?? []).length,
    Pending: (orders ?? []).filter((o) => o.paymentStatus === "pending").length,
    Paid: (orders ?? []).filter((o) => o.paymentStatus === "paid").length,
    Failed: (orders ?? []).filter((o) => o.paymentStatus === "failed").length,
  };

  return (
    <div style={{ paddingTop: "44px", minHeight: "100vh", background: "#F9F9F9" }}>
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ fontFamily: F, fontWeight: 700, fontSize: "24px", color: "#0A0A0A", letterSpacing: "-0.02em", marginBottom: "4px" }}>My Orders</h1>
          <p style={{ fontFamily: F, fontSize: "14px", color: "#888888" }}>Track your purchases and pending payments.</p>
        </div>

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: "6px", marginBottom: "24px", overflowX: "auto", paddingBottom: "2px" }}>
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                height: "32px", padding: "0 14px", borderRadius: "9999px", border: "none", cursor: "pointer",
                fontFamily: F, fontSize: "13px", fontWeight: 500, whiteSpace: "nowrap",
                background: filter === f ? "#0A0A0A" : "#FFFFFF",
                color: filter === f ? "#FFFFFF" : "#444444",
                boxShadow: filter === f ? "none" : "0 1px 3px rgba(0,0,0,0.08)",
              }}
            >
              {f} {counts[f] > 0 && <span style={{ opacity: 0.6 }}>({counts[f]})</span>}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {Array(4).fill(0).map((_, i) => (
              <div key={i} style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "16px", padding: "20px" }}>
                <Skeleton style={{ height: "56px", borderRadius: "10px", marginBottom: "12px" }} />
                <Skeleton style={{ height: "12px", width: "60%" }} />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "72px 24px", background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "16px" }}>
            <div style={{ width: "56px", height: "56px", borderRadius: "14px", background: "#F2F2F2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: "#AAAAAA" }}>
              <Music size={24} />
            </div>
            <div style={{ fontFamily: F, fontWeight: 600, fontSize: "16px", color: "#0A0A0A", marginBottom: "6px" }}>
              {filter === "All" ? "No orders yet" : `No ${filter.toLowerCase()} orders`}
            </div>
            <div style={{ fontFamily: F, fontSize: "14px", color: "#888888" }}>
              {filter === "All" ? "Browse beats and make your first purchase." : `You have no ${filter.toLowerCase()} orders right now.`}
            </div>
            {filter === "All" && (
              <Link href="/beats">
                <button style={{ marginTop: "20px", height: "40px", padding: "0 20px", borderRadius: "9999px", background: "#0A0A0A", color: "#FFFFFF", border: "none", fontFamily: F, fontSize: "13px", fontWeight: 500, cursor: "pointer" }}>
                  Browse Beats
                </button>
              </Link>
            )}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {filtered.map((order) => {
              if (order.paymentStatus === "pending") return <PendingOrderCard key={order.id} order={order} />;
              if (order.paymentStatus === "paid") return <PaidOrderCard key={order.id} order={order} />;
              return <FailedOrderCard key={order.id} order={order} />;
            })}
          </div>
        )}
      </div>
    </div>
  );
}
