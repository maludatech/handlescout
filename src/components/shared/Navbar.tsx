"use client";

import Link from "next/link";

import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { hasFullAccess, displayPlan, type PlanInfo } from "@/lib/plan";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavbarProps extends PlanInfo {
  searchesLeft: number | null;
  fullName: string;
  onUpgrade: () => void;
  onSignOut: () => void;
  upgrading: boolean;
}

export default function Navbar({
  plan,
  is_founder,
  searchesLeft,
  fullName,
  onUpgrade,
  onSignOut,
  upgrading,
}: NavbarProps) {
  const initials = fullName?.charAt(0)?.toUpperCase() ?? "U";
  const fullAccess = hasFullAccess({ plan, is_founder });
  const label = displayPlan({ plan, is_founder });
  const quotaText = fullAccess ? "∞ AI" : `${searchesLeft ?? 0}/3 AI`;
  const quotaColor = fullAccess
    ? "var(--accent)"
    : searchesLeft === 0
      ? "var(--danger-text)"
      : searchesLeft === 1
        ? "var(--warning-text)"
        : "var(--text-secondary)";

  return (
    <nav className="nav">
      <div className="nav-inner" style={{ maxWidth: "960px" }}>
        <Link href="/dashboard" className="nav-logo">
          <span className="mark">@</span>HandleScout
        </Link>

        <span className={`badge ${label === "Free" ? "badge-neutral" : "badge-accent"} nav-badge`}>
          {label}
        </span>

        <div className="nav-spacer" />

        <span
          className="nav-quota t-mono"
          title={fullAccess ? "Unlimited AI generations" : "AI generations left today"}
          style={{ color: quotaColor }}
        >
          {quotaText}
        </span>

        {!fullAccess && (
          <button
            type="button"
            className="btn btn-primary btn-sm nav-upgrade"
            onClick={onUpgrade}
            disabled={upgrading}
          >
            {upgrading ? "Redirecting…" : "Upgrade"}
          </button>
        )}

        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button type="button" className="avatar" aria-label="Account menu">
              {initials}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <div className="menu-quota">
              <span className={`badge ${label === "Free" ? "badge-neutral" : "badge-accent"}`}>
                {label}
              </span>
              <span style={{ marginLeft: "8px", color: quotaColor }}>{quotaText} generations</span>
            </div>
            {!fullAccess && (
              <DropdownMenuItem onSelect={onUpgrade}>
                {upgrading ? "Redirecting…" : "Upgrade to Pro"}
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/profile">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/history">History</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/saved">Saved</Link>
            </DropdownMenuItem>
            {is_founder && (
              <DropdownMenuItem asChild>
                <Link href="/dashboard/admin">Admin</Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="menu-item-danger" onSelect={onSignOut}>
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
