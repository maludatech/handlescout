import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="dot-grid" style={{ minHeight: "100vh" }}>
      {/* Navbar Skeleton */}
      <nav
        style={{
          borderBottom: "1px solid var(--border)",
          backdropFilter: "blur(12px)",
          background: "#0a0a0f99",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            padding: "0 24px",
            height: "64px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Skeleton className="h-7 w-40" />

          <div className="flex items-center gap-6">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-5 w-20" />
          </div>
        </div>
      </nav>

      <main
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "48px 24px",
        }}
      >
        {/* Header */}
        <div className="mb-10">
          <Skeleton className="h-9 w-40 mb-3" />
          <Skeleton className="h-5 w-72" />
        </div>

        {/* Cards Grid */}
        <div style={{ display: "grid", gap: "24px" }}>
          {/* Account Info Card */}
          <div className="glass p-8 rounded-3xl">
            <Skeleton className="h-7 w-40 mb-8" />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "16px",
                marginBottom: "28px",
              }}
            >
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    background: "#ffffff06",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-sm)",
                    padding: "18px",
                  }}
                >
                  <Skeleton className="h-4 w-16 mb-3" />
                  <Skeleton className="h-6 w-28" />
                </div>
              ))}
            </div>

            {/* Upgrade Banner Skeleton */}
            <div
              style={{
                background: "#6366f110",
                border: "1px solid #6366f120",
                borderRadius: "var(--radius-sm)",
                padding: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "16px",
              }}
            >
              <div className="flex-1">
                <Skeleton className="h-5 w-40 mb-2" />
                <Skeleton className="h-4 w-64" />
              </div>
              <Skeleton className="h-10 w-40 rounded-xl" />
            </div>
          </div>

          {/* Edit Profile Card */}
          <div className="glass p-8 rounded-3xl">
            <Skeleton className="h-7 w-36 mb-8" />

            <div className="mb-8">
              <Skeleton className="h-4 w-24 mb-3" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>

            <Skeleton className="h-11 w-40 rounded-xl" />
          </div>

          {/* Change Password Card */}
          <div className="glass p-8 rounded-3xl">
            <Skeleton className="h-7 w-44 mb-8" />

            <div className="space-y-8">
              <div>
                <Skeleton className="h-4 w-32 mb-3" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>

              <div>
                <Skeleton className="h-4 w-40 mb-3" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
            </div>

            <Skeleton className="h-11 w-52 rounded-xl mt-8" />
          </div>

          {/* Danger Zone / Sign Out Card */}
          <div className="glass p-8 rounded-3xl">
            <Skeleton
              className="h-7 w-28 mb-3"
              style={{ background: "#f87171" }}
            />
            <Skeleton className="h-4 w-80 mb-8" />
            <Skeleton className="h-11 w-40 rounded-xl" />
          </div>
        </div>
      </main>
    </div>
  );
}
