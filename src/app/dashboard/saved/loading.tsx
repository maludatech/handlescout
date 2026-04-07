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
          <div className="flex items-center gap-1.5">
            <Skeleton className="h-7 w-40" />
          </div>

          <div className="flex items-center gap-6">
            <Skeleton className="h-5 w-24" />
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
          <Skeleton className="h-9 w-72 mb-3" />
          <Skeleton className="h-5 w-[420px]" />
        </div>

        {/* Skeletons Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "16px",
          }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="glass p-5"
              style={{ borderRadius: "var(--radius-lg)" }}
            >
              {/* Username + Date Row */}
              <div className="flex justify-between items-start mb-4">
                <Skeleton className="h-6 w-36" />
                <Skeleton className="h-4 w-16" />
              </div>

              {/* Platforms */}
              <div className="flex flex-wrap gap-2 mb-6">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <Skeleton key={idx} className="h-[22px] w-16 rounded-full" />
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Skeleton className="h-9 flex-1 rounded-md" />
                <Skeleton className="h-9 w-20 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
