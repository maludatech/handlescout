import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata = { title: "Admin" };

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_founder")
    .eq("id", user.id)
    .single();

  if (!profile?.is_founder) redirect("/dashboard");

  const admin = createAdminClient();
  // eslint-disable-next-line react-hooks/purity -- intentional: a fresh "now" per request is the point, this page is never statically cached
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const [
    { count: totalUsers },
    { data: planRows },
    { count: totalSaved },
    { count: totalSearches },
    { count: newSignups },
  ] = await Promise.all([
    admin.from("profiles").select("*", { count: "exact", head: true }),
    admin.from("profiles").select("plan, is_founder"),
    admin.from("saved_usernames").select("*", { count: "exact", head: true }),
    admin.from("searches").select("*", { count: "exact", head: true }),
    admin
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .gte("created_at", sevenDaysAgo),
  ]);

  const founders = planRows?.filter((p) => p.is_founder).length ?? 0;
  const pro = planRows?.filter((p) => !p.is_founder && p.plan === "pro").length ?? 0;
  const free = (planRows?.length ?? 0) - founders - pro;

  const stats = [
    { label: "Total users", value: totalUsers ?? 0 },
    { label: "Free", value: free },
    { label: "Pro", value: pro },
    { label: "Founders", value: founders },
    { label: "Signups (7d)", value: newSignups ?? 0 },
    { label: "Saved handles", value: totalSaved ?? 0 },
    { label: "AI searches run", value: totalSearches ?? 0 },
  ];

  return (
    <main>
      <div className="shell-narrow">
        <header className="app-head">
          <Link href="/dashboard" className="hint t-small" style={{ display: "inline-block", marginBottom: "12px" }}>
            ← Dashboard
          </Link>
          <h1>Admin</h1>
          <p className="t-sec">Founder-only account and usage stats.</p>
        </header>

        <div className="app-content">
          <div className="card">
            <div className="stat-grid">
              {stats.map((s) => (
                <div className="stat-card" key={s.label}>
                  <div className="num">{s.value.toLocaleString()}</div>
                  <div className="label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
