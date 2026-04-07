"use client";

import { useState } from "react";
import { toast } from "sonner";

interface PlatformResult {
  platform: string;
  available: boolean;
  url: string;
  error?: boolean;
  tooLong?: boolean;
  maxLength?: number;
}

interface UsernameResult {
  username: string;
  results: PlatformResult[];
  score: number;
}

interface SearchFormProps {
  plan: string;
  searchesLeft: number | null;
  onSearchUsed: () => void;
}

const PLATFORM_ICONS: Record<string, string> = {
  Instagram: "📸",
  "X (Twitter)": "🐦",
  TikTok: "🎵",
  GitHub: "💻",
  Reddit: "🤖",
  Pinterest: "📌",
  Twitch: "🎮",
  YouTube: "▶️",
  LinkedIn: "💼",
  Snapchat: "👻",
  Medium: "✍️",
  Tumblr: "📝",
  SoundCloud: "🎧",
  Telegram: "✈️",
  DevTo: "🧑‍💻",
};

const VIBES = ["creative", "professional", "playful", "minimal", "bold"];

function ScoreBar({ score }: { score: number }) {
  return (
    <div
      style={{
        height: "4px",
        background: "#ffffff10",
        borderRadius: "2px",
        overflow: "hidden",
        marginTop: "8px",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${score}%`,
          background:
            score >= 70
              ? "var(--success)"
              : score >= 40
                ? "var(--warning)"
                : "var(--danger)",
          borderRadius: "2px",
          transition: "width 0.5s ease",
        }}
      />
    </div>
  );
}

function PlatformBreakdown({
  result,
  plan,
  onSave,
}: {
  result: UsernameResult;
  plan: string;
  onSave: (username: string, availableOn: string[]) => void;
}) {
  return (
    <div style={{ marginTop: "24px" }} className="animate-fade-up">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "16px",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        <h2
          style={{
            fontFamily: "Syne, sans-serif",
            fontSize: "16px",
            fontWeight: 600,
            color: "var(--text-secondary)",
          }}
        >
          Availability for @{result.username}
        </h2>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            style={{
              fontSize: "14px",
              fontWeight: 600,
              padding: "4px 12px",
              borderRadius: "100px",
              background:
                result.score >= 70
                  ? "#10b98120"
                  : result.score >= 40
                    ? "#f59e0b20"
                    : "#ef444420",
              color:
                result.score >= 70
                  ? "#34d399"
                  : result.score >= 40
                    ? "#fbbf24"
                    : "#f87171",
              border: `1px solid ${
                result.score >= 70
                  ? "#10b98130"
                  : result.score >= 40
                    ? "#f59e0b30"
                    : "#ef444430"
              }`,
            }}
          >
            {result.score}% available
          </span>
          {plan === "pro" && (
            <button
              onClick={() => {
                const availableOn = result.results
                  .filter((r) => r.available && !r.error && !r.tooLong)
                  .map((r) => r.platform);
                onSave(result.username, availableOn);
              }}
              style={{
                padding: "4px 14px",
                borderRadius: "100px",
                border: "1px solid #6366f130",
                background: "#6366f115",
                color: "#818cf8",
                fontSize: "13px",
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: "DM Sans, sans-serif",
                transition: "all 0.2s",
              }}
            >
              🔖 Save
            </button>
          )}
        </div>
      </div>

      <ScoreBar score={result.score} />

      <div className="glass" style={{ marginTop: "16px", overflow: "hidden" }}>
        {result.results.map((r, i) => (
          <div
            key={r.platform}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 20px",
              borderBottom:
                i < result.results.length - 1
                  ? "1px solid var(--border)"
                  : "none",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "18px" }}>
                {PLATFORM_ICONS[r.platform] ?? "🌐"}
              </span>
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "var(--text-primary)",
                }}
              >
                {r.platform}
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              {r.tooLong ? (
                <span className="badge badge-unknown">
                  Too long (max {r.maxLength})
                </span>
              ) : r.error ? (
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "13px",
                    color: "var(--accent)",
                    textDecoration: "none",
                    background: "#6366f110",
                    border: "1px solid #6366f120",
                    borderRadius: "100px",
                    padding: "4px 12px",
                    fontWeight: 500,
                    transition: "all 0.2s",
                  }}
                >
                  Check manually →
                </a>
              ) : r.available ? (
                <>
                  <span className="badge badge-available">Available</span>
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: "12px",
                      color: "var(--accent)",
                      textDecoration: "none",
                    }}
                  >
                    Visit →
                  </a>
                </>
              ) : (
                <span className="badge badge-taken">Taken</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SearchForm({
  plan,
  searchesLeft,
  onSearchUsed,
}: SearchFormProps) {
  const [activeTab, setActiveTab] = useState<"check" | "generate">("check");

  // Direct check state
  const [directUsername, setDirectUsername] = useState("");
  const [directLoading, setDirectLoading] = useState(false);
  const [directError, setDirectError] = useState<string | null>(null);
  const [directResult, setDirectResult] = useState<UsernameResult | null>(null);

  // AI generate state
  const [keywords, setKeywords] = useState("");
  const [vibe, setVibe] = useState("creative");
  const [generateLoading, setGenerateLoading] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [generateResults, setGenerateResults] = useState<UsernameResult[]>([]);
  const [selectedUsername, setSelectedUsername] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState("");

  const loadingMessages = [
    "Sparking the AI...",
    "Generating unique usernames...",
    "Checking Instagram...",
    "Checking TikTok & Twitter...",
    "Checking GitHub & Reddit...",
    "Scanning remaining platforms...",
    "Almost done...",
  ];

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
    if (plan === "free" && searchesLeft === 0) {
      setGenerateError(
        "Daily limit reached. Upgrade to Pro for unlimited generations.",
      );
      return;
    }
    setGenerateLoading(true);
    setGenerateError(null);
    setGenerateResults([]);
    setSelectedUsername(null);

    let msgIndex = 0;
    setLoadingMessage(loadingMessages[0]);
    const msgInterval = setInterval(() => {
      msgIndex = (msgIndex + 1) % loadingMessages.length;
      setLoadingMessage(loadingMessages[msgIndex]);
    }, 2000);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keywords, vibe }),
      });
      const data = await res.json();
      if (!res.ok) {
        setGenerateError(data.error ?? "Something went wrong");
        return;
      }
      setGenerateResults(data.usernames);
      if (data.usernames.length > 0)
        setSelectedUsername(data.usernames[0].username);
      onSearchUsed();
    } catch {
      setGenerateError("Network error. Please try again.");
    } finally {
      clearInterval(msgInterval);
      setGenerateLoading(false);
      setLoadingMessage("");
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

  const selectedResult = generateResults.find(
    (r) => r.username === selectedUsername,
  );

  return (
    <div>
      {/* Tabs */}
      <div
        style={{
          display: "flex",
          background: "#ffffff06",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          padding: "4px",
          marginBottom: "24px",
        }}
      >
        {(["check", "generate"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              if (tab === "generate") {
                setDirectResult(null);
                setDirectError(null);
                setDirectUsername("");
              } else {
                setGenerateResults([]);
                setSelectedUsername(null);
                setGenerateError(null);
              }
            }}
            style={{
              flex: 1,
              padding: "10px 16px",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: 500,
              fontFamily: "DM Sans, sans-serif",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              background: activeTab === tab ? "var(--bg-card)" : "transparent",
              color:
                activeTab === tab ? "var(--text-primary)" : "var(--text-muted)",
              boxShadow: activeTab === tab ? "0 1px 4px #00000040" : "none",
            }}
          >
            {tab === "check" ? "🔍 Check a username" : "✦ Generate with AI"}
            {tab === "generate" && plan === "free" && searchesLeft !== null && (
              <span
                style={{
                  fontSize: "11px",
                  background: "#6366f120",
                  color: "#818cf8",
                  border: "1px solid #6366f130",
                  borderRadius: "100px",
                  padding: "2px 8px",
                }}
              >
                {searchesLeft} left
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Check tab */}
      {activeTab === "check" && (
        <div className="glass" style={{ padding: "28px" }}>
          <label
            style={{
              display: "block",
              fontSize: "14px",
              fontWeight: 500,
              color: "var(--text-secondary)",
              marginBottom: "10px",
            }}
          >
            Enter a username to check
          </label>
          <div style={{ display: "flex", gap: "10px" }}>
            <div style={{ position: "relative", flex: 1 }}>
              <span
                style={{
                  position: "absolute",
                  left: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-muted)",
                  fontWeight: 500,
                  fontSize: "16px",
                }}
              >
                @
              </span>
              <input
                className="input"
                placeholder="yourhandle"
                value={directUsername}
                onChange={(e) => {
                  setDirectUsername(e.target.value);
                  setDirectError(null);
                }}
                onKeyDown={(e) => e.key === "Enter" && handleDirectCheck()}
                style={{ paddingLeft: "32px" }}
              />
            </div>
            <button
              className="btn-primary"
              onClick={handleDirectCheck}
              disabled={directLoading || !directUsername.trim()}
              style={{ padding: "12px 24px", whiteSpace: "nowrap" }}
            >
              {directLoading ? "..." : "Check"}
            </button>
          </div>
          <p
            style={{
              fontSize: "12px",
              color: "var(--text-muted)",
              marginTop: "8px",
            }}
          >
            Letters only — no numbers, underscores or symbols
          </p>

          {directError && (
            <div
              style={{
                background: "#ef444415",
                border: "1px solid #ef444430",
                borderRadius: "var(--radius-sm)",
                padding: "12px 16px",
                fontSize: "14px",
                color: "#f87171",
                marginTop: "16px",
              }}
            >
              {directError}
            </div>
          )}
        </div>
      )}

      {/* Generate tab */}
      {activeTab === "generate" && (
        <div className="glass" style={{ padding: "28px" }}>
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: 500,
                color: "var(--text-secondary)",
                marginBottom: "10px",
              }}
            >
              Keywords or name ideas
            </label>
            <input
              className="input"
              placeholder="e.g. fitness, minimal, zen, nature..."
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: 500,
                color: "var(--text-secondary)",
                marginBottom: "10px",
              }}
            >
              Vibe
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {VIBES.map((v) => (
                <button
                  key={v}
                  onClick={() => setVibe(v)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "100px",
                    border: "1px solid",
                    borderColor: vibe === v ? "var(--accent)" : "var(--border)",
                    background: vibe === v ? "#6366f120" : "transparent",
                    color: vibe === v ? "#818cf8" : "var(--text-muted)",
                    fontSize: "13px",
                    fontWeight: 500,
                    fontFamily: "DM Sans, sans-serif",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    textTransform: "capitalize",
                  }}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {generateError && (
            <div
              style={{
                background: "#ef444415",
                border: "1px solid #ef444430",
                borderRadius: "var(--radius-sm)",
                padding: "12px 16px",
                fontSize: "14px",
                color: "#f87171",
                marginBottom: "16px",
              }}
            >
              {generateError}
              {generateError.includes("Upgrade") && (
                <a
                  href="/dashboard"
                  style={{
                    marginLeft: "8px",
                    color: "var(--accent)",
                    textDecoration: "underline",
                  }}
                >
                  Upgrade to Pro →
                </a>
              )}
            </div>
          )}

          <button
            className="btn-primary"
            onClick={handleGenerate}
            disabled={
              generateLoading ||
              !keywords.trim() ||
              (plan === "free" && searchesLeft === 0)
            }
            style={{ width: "100%", padding: "14px" }}
          >
            {generateLoading ? loadingMessage : "✦ Generate & Check Usernames"}
          </button>

          {plan === "free" && searchesLeft !== null && (
            <p
              style={{
                textAlign: "center",
                fontSize: "12px",
                color: "var(--text-muted)",
                marginTop: "12px",
              }}
            >
              {searchesLeft} of 3 free AI generations remaining today
            </p>
          )}
        </div>
      )}

      {/* Loading state */}
      {(directLoading || generateLoading) && (
        <div
          style={{
            textAlign: "center",
            padding: "48px",
            color: "var(--text-muted)",
            fontSize: "14px",
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              border: "2px solid var(--border)",
              borderTop: "2px solid var(--accent)",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto 16px",
            }}
          />
          {generateLoading ? loadingMessage : "Checking across 15 platforms..."}
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* Direct check result */}
      {activeTab === "check" && directResult && !directLoading && (
        <PlatformBreakdown
          result={directResult}
          plan={plan}
          onSave={handleSave}
        />
      )}

      {/* Generate results */}
      {activeTab === "generate" &&
        generateResults.length > 0 &&
        !generateLoading && (
          <div style={{ marginTop: "24px" }} className="animate-fade-up">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "20px",
              }}
            >
              {/* Username list */}
              <div>
                <p
                  style={{
                    fontSize: "12px",
                    color: "var(--text-muted)",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    fontWeight: 500,
                    marginBottom: "12px",
                  }}
                >
                  Generated usernames
                </p>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  {generateResults.map((r) => (
                    <button
                      key={r.username}
                      onClick={() => setSelectedUsername(r.username)}
                      style={{
                        textAlign: "left",
                        padding: "14px 16px",
                        borderRadius: "var(--radius-sm)",
                        border: "1px solid",
                        borderColor:
                          selectedUsername === r.username
                            ? "var(--accent)"
                            : "var(--border)",
                        background:
                          selectedUsername === r.username
                            ? "#6366f115"
                            : "var(--bg-card)",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        fontFamily: "DM Sans, sans-serif",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: "6px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "14px",
                            fontWeight: 600,
                            color:
                              selectedUsername === r.username
                                ? "#818cf8"
                                : "var(--text-primary)",
                          }}
                        >
                          @{r.username}
                        </span>
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: 600,
                            padding: "2px 8px",
                            borderRadius: "100px",
                            background:
                              r.score >= 70
                                ? "#10b98120"
                                : r.score >= 40
                                  ? "#f59e0b20"
                                  : "#ef444420",
                            color:
                              r.score >= 70
                                ? "#34d399"
                                : r.score >= 40
                                  ? "#fbbf24"
                                  : "#f87171",
                          }}
                        >
                          {r.score}%
                        </span>
                      </div>
                      <ScoreBar score={r.score} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Platform breakdown */}
              {selectedResult && (
                <div>
                  <PlatformBreakdown
                    result={selectedResult}
                    plan={plan}
                    onSave={handleSave}
                  />
                </div>
              )}
            </div>
          </div>
        )}
    </div>
  );
}
