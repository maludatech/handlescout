import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SearchForm from "@/components/shared/SearchForm";
import { Badge } from "@/components/ui/badge";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const searchesLeft =
    profile?.plan === "free"
      ? Math.max(0, 3 - (profile?.searches_today ?? 0))
      : null;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <span className="font-semibold text-slate-900 text-lg">
            HandleScout
          </span>
          <div className="flex items-center gap-4">
            {profile?.plan === "free" && (
              <span className="text-sm text-slate-500">
                {searchesLeft} search{searchesLeft === 1 ? "" : "es"} left today
              </span>
            )}
            <Badge variant={profile?.plan === "free" ? "secondary" : "default"}>
              {profile?.plan ?? "free"}
            </Badge>
            <form action="/auth/signout" method="post">
              <button className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-semibold text-slate-900 mb-3">
            Find your perfect username
          </h1>
          <p className="text-slate-500 text-lg">
            AI generates unique handles and checks availability across 15
            platforms instantly
          </p>
        </div>

        <SearchForm
          plan={profile?.plan ?? "free"}
          searchesLeft={searchesLeft}
        />
      </main>
    </div>
  );
}
