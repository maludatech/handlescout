import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div
      style={{
        maxWidth: "820px",
        margin: "0 auto",
        padding: "80px 24px 120px",
        minHeight: "100vh",
      }}
    >
      {/* Header Skeleton */}
      <div style={{ marginBottom: "48px", textAlign: "center" }}>
        <Skeleton className="h-12 w-130 mx-auto mb-4" />
        <Skeleton className="h-6 w-115 mx-auto" />
      </div>

      {/* FAQ Items Skeletons */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="glass"
            style={{
              borderRadius: "var(--radius)",
              overflow: "hidden",
            }}
          >
            {/* Question Row */}
            <div
              style={{
                padding: "20px 24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Skeleton className="h-6 w-[82%] rounded" />
              <Skeleton className="h-7 w-7 rounded" />
            </div>

            {/* Optional expanded answer simulation (for some items) */}
            {i % 3 === 0 && (
              <div
                style={{
                  padding: "0 24px 24px",
                  borderTop: "1px solid var(--border)",
                }}
              >
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-[90%]" />
                  <Skeleton className="h-4 w-[75%]" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* CTA Section Skeleton */}
      <div
        className="glass"
        style={{
          marginTop: "64px",
          padding: "48px 40px",
          textAlign: "center",
          borderRadius: "var(--radius)",
        }}
      >
        <Skeleton className="h-9 w-80 mx-auto mb-4" />
        <Skeleton className="h-5 w-96 mx-auto mb-8" />
        <Skeleton className="h-12 w-56 mx-auto rounded-2xl" />
      </div>
    </div>
  );
}
