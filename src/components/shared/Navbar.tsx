"use client";

import Link from "next/link";

import { ThemeToggle } from "@/components/shared/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavbarProps {
  plan: string;
  searchesLeft: number | null;
  fullName: string;
  onUpgrade: () => void;
  onSignOut: () => void;
  upgrading: boolean;
}

export default function Navbar({
  plan,
  searchesLeft,
  fullName,
  onUpgrade,
  onSignOut,
  upgrading,
}: NavbarProps) {
  const initials = fullName?.charAt(0)?.toUpperCase() ?? "U";
  const quotaText = plan === "pro" ? "— AI" : `${searchesLeft ?? 0}/3 AI`;

  return (
    <nav className="nav">
      <div className="nav-inner" style={{ maxWidth: "960px" }}>
        <Link href="/dashboard" className="nav-logo">
          <span className="mark">@</span>HandleScout
        </Link>

        <span className={plan === "pro" ? "badge badge-accent" : "badge badge-neutral"}>
          {plan === "pro" ? "Pro" : "Free"}
        </span>

        <div className="nav-spacer" />

        <span className="nav-quota t-mono" title="AI generations left today">
          {quotaText}
        </span>

        {plan !== "pro" && (
          <button
            type="button"
            className="btn btn-primary btn-sm"
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
            <div className="menu-quota">{quotaText} generations</div>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/profile">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/history">History</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/saved">Saved</Link>
            </DropdownMenuItem>
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
