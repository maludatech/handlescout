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
          {/* Logo */}
          <Skeleton className="h-7 w-40" />

          {/* Right side - User info + buttons */}
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-28 rounded-full" />
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-9 rounded-full" />
          </div>
        </div>
      </nav>

      <main
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "64px 24px",
        }}
      >
        {/* Hero Section Skeleton */}
        <div className="text-center mb-12">
          {/* Main Title */}
          <div className="mx-auto mb-6">
            <Skeleton className="h-14 w-155 mx-auto rounded-xl" />
          </div>

          {/* Subtitle */}
          <Skeleton className="h-6 w-120 mx-auto" />
        </div>

        {/* Search Form Skeleton */}
        <div className="glass p-8 rounded-2xl max-w-2xl mx-auto">
          <div className="space-y-8">
            {/* Search Input Area */}
            <div>
              <Skeleton className="h-5 w-32 mb-3" />
              <div className="relative">
                <Skeleton className="h-14 w-full rounded-2xl" />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Skeleton className="h-9 w-28 rounded-xl" />
                </div>
              </div>
            </div>

            {/* AI Generate Section */}
            <div className="pt-6 border-t border-border">
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-5 w-20" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-11 w-full rounded-xl" />
                ))}
              </div>
            </div>

            {/* Usage / Plan Info */}
            <div className="pt-4 flex justify-center">
              <Skeleton className="h-5 w-80" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
