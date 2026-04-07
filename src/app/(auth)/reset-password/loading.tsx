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

        {/* Error placeholder (sometimes shown) */}
        <Skeleton
          className="h-11 w-full mb-6 rounded-xl"
          style={{ background: "#ef444415" }}
        />

        {/* Form Fields */}
        <div className="space-y-6">
          {/* New Password */}
          <div>
            <Skeleton className="h-4 w-32 mb-3" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>

          {/* Confirm Password */}
          <div>
            <Skeleton className="h-4 w-40 mb-3" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        </div>

        {/* Submit Button */}
        <Skeleton className="h-12 w-full mt-10 rounded-2xl" />
      </div>
    </div>
  );
}
