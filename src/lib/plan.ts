/**
 * Single source of truth for "does this user get Pro-tier access". Founders
 * get full access via the `is_founder` DB flag rather than a fake Lemon
 * Squeezy subscription, so the webhook never has a reason to touch them.
 */
export interface PlanInfo {
  plan: string;
  is_founder?: boolean | null;
}

export function hasFullAccess(info: PlanInfo): boolean {
  return info.plan === "pro" || !!info.is_founder;
}

export function displayPlan(info: PlanInfo): "Founder" | "Pro" | "Free" {
  if (info.is_founder) return "Founder";
  if (info.plan === "pro") return "Pro";
  return "Free";
}
