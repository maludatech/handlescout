import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div
        className="glass"
        style={{
          width: "100%",
          maxWidth: "420px",
          padding: "40px",
          borderRadius: "var(--radius)",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <Skeleton className="h-8 w-52 mb-3" />
          <Skeleton className="h-5 w-64" />
        </div>

        {/* Error placeholder */}
        <Skeleton
          className="h-11 w-full mb-6 rounded-xl"
          style={{ background: "#ef444415" }}
        />

        {/* Form Fields */}
        <div className="space-y-6">
          {/* Email Field */}
          <div>
            <Skeleton className="h-4 w-20 mb-3" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>

          {/* Password Field */}
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-28" />
            </div>
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        </div>

        {/* Sign In Button */}
        <Skeleton className="h-12 w-full mt-10 rounded-2xl" />

        {/* Sign up link */}
        <div className="flex justify-center mt-8">
          <Skeleton className="h-4 w-72" />
        </div>
      </div>
    </div>
  );
}
