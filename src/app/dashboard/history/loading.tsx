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
            maxWidth: "1100px",
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
          <Skeleton className="h-9 w-56 mb-3" />
          <Skeleton className="h-5 w-80" />
        </div>

        {/* Loading History Table */}
        <div className="glass rounded-3xl overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              style={{
                padding: "22px 24px",
                borderBottom: i < 5 ? "1px solid var(--border)" : "none",
                display: "flex",
                flexDirection: "column",
                gap: "14px",
              }}
            >
              {/* Keywords / Search Term */}
              <Skeleton className="h-5 w-[45%]" />

              {/* Generated Usernames */}
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Skeleton key={idx} className="h-7 w-24 rounded-full" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
