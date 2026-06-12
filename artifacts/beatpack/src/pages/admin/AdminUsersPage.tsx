import { useState } from "react";
import { useAdminListUsers } from "@workspace/api-client-react";
import AdminLayout from "./AdminLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/store/authStore";
import { Download } from "lucide-react";

const ROLES = ["buyer", "artist", "admin"] as const;

export default function AdminUsersPage() {
  const { data: users, isLoading, refetch } = useAdminListUsers();
  const token = useAuthStore((s) => s.token);
  const [downloading, setDownloading] = useState(false);
  const [changingRole, setChangingRole] = useState<string | null>(null);

  const roleColor = (r: string) => {
    if (r === "admin") return { bg: "#EEF2FF", color: "#6366F1" };
    if (r === "artist") return { bg: "#F0FDF4", color: "#22C55E" };
    return { bg: "#F2F2F2", color: "#888888" };
  };

  async function handleExportEmails() {
    setDownloading(true);
    try {
      const res = await fetch("/api/admin/emails/export", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "beatpack-emails.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      alert("Export failed. Please try again.");
    } finally {
      setDownloading(false);
    }
  }

  async function handleRoleChange(userId: string, newRole: string) {
    setChangingRole(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) throw new Error("Role change failed");
      await refetch();
    } catch {
      alert("Failed to change role. Please try again.");
    } finally {
      setChangingRole(null);
    }
  }

  return (
    <AdminLayout>
      <div style={{ padding: "32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
          <div>
            <h1 style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 700, fontSize: "22px", color: "#0A0A0A", letterSpacing: "-0.02em", marginBottom: "2px" }}>Users</h1>
            <div style={{ fontFamily: "'Figtree', sans-serif", fontSize: "13px", color: "#AAAAAA" }}>{(users ?? []).length} total</div>
          </div>
          <button
            onClick={handleExportEmails}
            disabled={downloading}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              height: "38px",
              padding: "0 16px",
              borderRadius: "10px",
              background: downloading ? "#F2F2F2" : "#0A0A0A",
              color: downloading ? "#888888" : "#FFFFFF",
              border: "none",
              fontFamily: "'Figtree', sans-serif",
              fontWeight: 600,
              fontSize: "13px",
              cursor: downloading ? "not-allowed" : "pointer",
              transition: "opacity 0.15s ease",
            }}
          >
            <Download size={14} />
            {downloading ? "Exporting…" : "Export Emails CSV"}
          </button>
        </div>

        <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "16px", overflow: "hidden" }}>
          {isLoading ? (
            <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
              {Array(5).fill(0).map((_, i) => <Skeleton key={i} style={{ height: "44px" }} />)}
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #F2F2F2", background: "#F9F9F9" }}>
                  {["User", "Email", "Role", "Joined", "Actions"].map((h) => (
                    <th key={h} style={{ fontFamily: "'Figtree', sans-serif", fontSize: "11px", fontWeight: 500, color: "#888888", textAlign: "left", padding: "10px 16px", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(users ?? []).map((user) => {
                  const rc = roleColor(user.role);
                  const isChanging = changingRole === user.id;
                  return (
                    <tr key={user.id} data-testid={`row-user-${user.id}`} style={{ borderBottom: "1px solid #F2F2F2" }}>
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#F2F2F2", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Figtree', sans-serif", fontWeight: 700, fontSize: "13px", color: "#444444", flexShrink: 0 }}>
                            {user.firstName?.[0] ?? user.email?.[0]?.toUpperCase() ?? "?"}
                          </div>
                          <span style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 600, fontSize: "13px", color: "#0A0A0A" }}>
                            {user.firstName ? `${user.firstName} ${user.lastName ?? ""}`.trim() : "—"}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: "12px 16px", fontFamily: "'Figtree', sans-serif", fontSize: "13px", color: "#888888" }}>{user.email ?? "—"}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ padding: "3px 8px", borderRadius: "9999px", fontFamily: "'Figtree', sans-serif", fontSize: "11px", fontWeight: 600, background: rc.bg, color: rc.color }}>{user.role}</span>
                      </td>
                      <td style={{ padding: "12px 16px", fontFamily: "'Figtree', sans-serif", fontSize: "12px", color: "#888888" }}>{new Date(user.createdAt).toLocaleDateString("cs-CZ")}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <select
                          value={user.role}
                          disabled={isChanging}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          style={{
                            height: "30px",
                            padding: "0 8px",
                            borderRadius: "8px",
                            border: "1px solid #E5E5E5",
                            fontFamily: "'Figtree', sans-serif",
                            fontSize: "12px",
                            color: "#0A0A0A",
                            background: isChanging ? "#F9F9F9" : "#FFFFFF",
                            cursor: isChanging ? "not-allowed" : "pointer",
                            outline: "none",
                          }}
                        >
                          {ROLES.map((r) => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
