import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="dot-grid min-h-screen">
      {/* Navbar Skeleton */}
      <nav
        style={{
          borderBottom: "1px solid var(--border)",
          backdropFilter: "blur(12px)",
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "#0a0a0f99",
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

          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-24 rounded-lg" />
            <Skeleton className="h-9 w-36 rounded-lg" />
          </div>
        </div>
      </nav>

      {/* Hero Section Skeleton */}
      <section
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "100px 24px 80px",
          textAlign: "center",
        }}
      >
        {/* Pill Badge */}
        <div className="flex justify-center mb-10">
          <Skeleton className="h-8 w-80 rounded-full" />
        </div>

        {/* Hero Title */}
        <div className="mb-8">
          <Skeleton className="h-20 w-195 mx-auto rounded-2xl" />
        </div>

        {/* Subtitle */}
        <Skeleton className="h-6 w-130 mx-auto mb-12" />

        {/* CTA Buttons */}
        <div className="flex gap-4 justify-center mb-4">
          <Skeleton className="h-14 w-52 rounded-2xl" />
          <Skeleton className="h-14 w-40 rounded-2xl" />
        </div>

        <Skeleton className="h-4 w-64 mx-auto" />
      </section>

      {/* Platforms Section Skeleton */}
      <section
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "0 24px 100px",
        }}
      >
        <div className="flex justify-center mb-6">
          <Skeleton className="h-5 w-64" />
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            justifyContent: "center",
          }}
        >
          {Array.from({ length: 15 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-28 rounded-full" />
          ))}
        </div>
      </section>

      {/* Features Section Skeleton */}
      <section
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "0 24px 100px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="glass p-8 rounded-3xl">
              <Skeleton className="h-10 w-10 rounded-xl mb-6" />
              <Skeleton className="h-7 w-3/4 mb-4" />
              <Skeleton className="h-4 w-full mb-3" />
              <Skeleton className="h-4 w-11/12" />
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section Skeleton */}
      <section
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "0 24px 100px",
          textAlign: "center",
        }}
      >
        <Skeleton className="h-12 w-80 mx-auto mb-4" />
        <Skeleton className="h-6 w-96 mx-auto mb-12" />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
            maxWidth: "680px",
            margin: "0 auto",
          }}
        >
          {/* Free Card */}
          <div className="glass p-10 rounded-3xl">
            <Skeleton className="h-5 w-16 mb-3" />
            <Skeleton className="h-12 w-20 mb-8" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-3 mb-4">
                <Skeleton className="h-5 w-5 rounded" />
                <Skeleton className="h-5 flex-1" />
              </div>
            ))}
            <Skeleton className="h-11 w-full mt-8 rounded-xl" />
          </div>

          {/* Pro Card */}
          <div
            className="glass p-10 rounded-3xl"
            style={{
              background: "linear-gradient(135deg, #1a1a2e, #16162a)",
              border: "1px solid #6366f140",
            }}
          >
            <Skeleton
              className="h-5 w-12 mb-3"
              style={{ background: "#818cf8" }}
            />
            <Skeleton className="h-12 w-24 mb-2" />
            <Skeleton className="h-4 w-32 mb-8" />
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-3 mb-4">
                <Skeleton className="h-5 w-5 rounded" />
                <Skeleton className="h-5 flex-1" />
              </div>
            ))}
            <Skeleton className="h-11 w-full mt-8 rounded-xl" />
          </div>
        </div>
      </section>

      {/* Final CTA Skeleton */}
      <section
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "0 24px 120px",
        }}
      >
        <div className="glass p-20 rounded-3xl text-center mx-auto max-w-2xl">
          <Skeleton className="h-12 w-96 mx-auto mb-6" />
          <Skeleton className="h-6 w-105 mx-auto mb-10" />
          <Skeleton className="h-14 w-60 mx-auto rounded-2xl" />
        </div>
      </section>

      {/* Footer Skeleton */}
      <footer
        style={{
          borderTop: "1px solid var(--border)",
          padding: "40px 24px",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <Skeleton className="h-7 w-40" />

          <div className="flex gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-16" />
            ))}
          </div>

          <Skeleton className="h-4 w-72" />
        </div>
      </footer>
    </div>
  );
}
