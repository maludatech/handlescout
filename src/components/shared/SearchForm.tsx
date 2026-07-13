"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlatformBreakdown, type UsernameResult } from "@/components/shared/PlatformBreakdown";
import { ResultsSkeleton } from "@/components/shared/ResultsSkeleton";
import { hasFullAccess, type PlanInfo } from "@/lib/plan";

interface SearchFormProps extends PlanInfo {
  searchesLeft: number | null;
  onSearchUsed: () => void;
}

function scoreTone(score: number): "success" | "warning" | "danger" {
  if (score >= 70) return "success";
  if (score >= 40) return "warning";
  return "danger";
}

export default function SearchForm({ plan, is_founder, searchesLeft, onSearchUsed }: SearchFormProps) {
  const fullAccess = hasFullAccess({ plan, is_founder });
  const [directUsername, setDirectUsername] = useState("");
  const [directLoading, setDirectLoading] = useState(false);
  const [directError, setDirectError] = useState<string | null>(null);
  const [directResult, setDirectResult] = useState<UsernameResult | null>(null);

  const [keywords, setKeywords] = useState("");
  const [generateLoading, setGenerateLoading] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [generateResults, setGenerateResults] = useState<UsernameResult[]>([]);
  const [selectedUsername, setSelectedUsername] = useState<string | null>(null);

  const handleDirectCheck = async () => {
    if (!directUsername.trim()) return;
    if (!/^[a-zA-Z]+$/.test(directUsername.trim())) {
      setDirectError("Letters only — no numbers, underscores or symbols.");
      return;
    }
    setDirectLoading(true);
    setDirectError(null);
    setDirectResult(null);

    try {
      const res = await fetch("/api/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: directUsername.trim().toLowerCase() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setDirectError(data.error ?? "Something went wrong");
        return;
      }
      setDirectResult(data);
    } catch {
      setDirectError("Network error. Please try again.");
    } finally {
      setDirectLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!keywords.trim()) return;
    if (!fullAccess && searchesLeft === 0) {
      setGenerateError("Daily limit reached. Upgrade to Pro for unlimited generations.");
      return;
    }
    setGenerateLoading(true);
    setGenerateError(null);
    setGenerateResults([]);
    setSelectedUsername(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keywords, vibe: "creative" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setGenerateError(data.error ?? "Something went wrong");
        return;
      }
      setGenerateResults(data.usernames);
      if (data.usernames.length > 0) setSelectedUsername(data.usernames[0].username);
      onSearchUsed();
    } catch {
      setGenerateError("Network error. Please try again.");
    } finally {
      setGenerateLoading(false);
    }
  };

  const handleSave = async (username: string, availableOn: string[]) => {
    try {
      const res = await fetch("/api/saved-usernames", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, available_on: availableOn }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Failed to save");
        return;
      }
      toast.success(`@${username} saved!`);
    } catch {
      toast.error("Something went wrong");
    }
  };

  const selectedResult = generateResults.find((r) => r.username === selectedUsername);

  return (
    <Tabs defaultValue="check">
      <TabsList aria-label="Search mode">
        <TabsTrigger value="check">Check a username</TabsTrigger>
        <TabsTrigger value="ai">Generate with AI</TabsTrigger>
      </TabsList>

      <TabsContent value="check">
        <div className="check-row">
          <input
            className="input input-mono"
            type="text"
            placeholder="@yourhandle"
            aria-label="Username to check"
            value={directUsername}
            onChange={(e) => {
              setDirectUsername(e.target.value);
              setDirectError(null);
            }}
            onKeyDown={(e) => e.key === "Enter" && handleDirectCheck()}
          />
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleDirectCheck}
            disabled={directLoading || !directUsername.trim()}
          >
            Check 15 platforms
          </button>
        </div>
        <p className="hint t-small t-muted">
          Letters only — no numbers, underscores or symbols.
        </p>

        {directError && (
          <p className="hint t-small" style={{ color: "var(--danger-text)", marginTop: "16px" }}>
            {directError}
          </p>
        )}

        <div style={{ marginTop: "32px" }}>
          {directLoading && <ResultsSkeleton />}
          {directResult && !directLoading && (
            <PlatformBreakdown result={directResult} canSave={fullAccess} onSave={handleSave} />
          )}
        </div>
      </TabsContent>

      <TabsContent value="ai">
        <div className="check-row">
          <input
            className="input"
            type="text"
            placeholder="Keywords — e.g. victor, fullstack, lagos"
            aria-label="Keywords for AI generation"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
          />
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleGenerate}
            disabled={generateLoading || !keywords.trim() || (!fullAccess && searchesLeft === 0)}
          >
            {generateLoading ? "Generating…" : "Generate handles"}
          </button>
        </div>
        <p className="hint t-small t-muted">
          AI proposes handles from your keywords and checks each across all 15 platforms.
          {!fullAccess && searchesLeft !== null && (
            <>
              {" "}
              <span className="t-mono">{searchesLeft}/3</span> generations left today.
            </>
          )}
        </p>

        {generateError && (
          <p className="hint t-small" style={{ color: "var(--danger-text)", marginTop: "16px" }}>
            {generateError}
            {generateError.includes("Upgrade") && (
              <>
                {" "}
                <a href="/dashboard" style={{ color: "var(--accent)" }}>
                  Upgrade to Pro →
                </a>
              </>
            )}
          </p>
        )}

        <div style={{ marginTop: "32px" }}>
          {generateLoading && <ResultsSkeleton />}

          {generateResults.length > 0 && !generateLoading && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(220px, 320px) 1fr",
                gap: "24px",
                alignItems: "start",
              }}
            >
              <div className="candidate-list">
                {generateResults.map((r) => {
                  const available = r.results.filter((p) => p.available && !p.error && !p.tooLong).length;
                  const isSelected = selectedUsername === r.username;
                  return (
                    <button
                      key={r.username}
                      type="button"
                      aria-pressed={isSelected}
                      className="candidate"
                      onClick={() => setSelectedUsername(r.username)}
                    >
                      <span>
                        <span className="t-mono" style={{ fontWeight: 600, display: "block" }}>
                          {r.username}
                        </span>
                        <span className="candidate-sub">{available}/15 available</span>
                      </span>
                      <span className={`badge badge-${scoreTone(r.score)}`}>{r.score}</span>
                    </button>
                  );
                })}
              </div>

              {selectedResult && (
                <PlatformBreakdown result={selectedResult} canSave={fullAccess} onSave={handleSave} />
              )}
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}
