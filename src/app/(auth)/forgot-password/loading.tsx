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
          <Skeleton className="h-8 w-60 mb-3" />
          <Skeleton className="h-5 w-80" />
        </div>

        {/* Error placeholder */}
        <Skeleton
          className="h-11 w-full mb-6 rounded-xl"
          style={{ background: "#ef444415" }}
        />

        {/* Email Field */}
        <div style={{ marginBottom: "24px" }}>
          <Skeleton className="h-4 w-20 mb-3" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>

        {/* Submit Button */}
        <Skeleton className="h-12 w-full rounded-2xl" />

        {/* Back to sign in link */}
        <div className="flex justify-center mt-8">
          <Skeleton className="h-4 w-52" />
        </div>
      </div>
    </div>
  );
}
