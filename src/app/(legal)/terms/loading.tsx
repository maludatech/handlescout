import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "80px 24px 120px",
        minHeight: "100vh",
      }}
    >
      {/* Header Skeleton */}
      <div style={{ marginBottom: "48px" }}>
        <Skeleton className="h-12 w-80 mb-4" />
        <Skeleton className="h-5 w-52" />
      </div>

      {/* Content Sections Skeleton */}
      <div style={{ display: "flex", flexDirection: "column", gap: "42px" }}>
        {Array.from({ length: 11 }).map((_, i) => (
          <div key={i}>
            {/* Section Title */}
            <Skeleton className="h-7 w-70 mb-4" />

            {/* Paragraph Lines */}
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[92%]" />
              <Skeleton className="h-4 w-[85%]" />
              {i % 3 === 0 && (
                <>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-[78%]" />
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Note Skeleton */}
      <div
        style={{ marginTop: "80px", display: "flex", justifyContent: "center" }}
      >
        <Skeleton className="h-4 w-96" />
      </div>
    </div>
  );
}
