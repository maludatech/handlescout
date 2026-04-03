"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PlatformResult {
  platform: string;
  available: boolean;
  url: string;
  error?: boolean;
}

interface UsernameResult {
  username: string;
  results: PlatformResult[];
  score: number;
}

interface SearchFormProps {
  plan: string;
  searchesLeft: number | null;
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

export default function SearchForm({ plan, searchesLeft }: SearchFormProps) {
  const [keywords, setKeywords] = useState("");
  const [vibe, setVibe] = useState("creative");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<UsernameResult[]>([]);
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

  const handleSearch = async () => {
    if (!keywords.trim()) return;
    if (plan === "free" && searchesLeft === 0) {
      setError("Daily limit reached. Upgrade to Pro for unlimited searches.");
      return;
    }

    setLoading(true);
    setError(null);
    setResults([]);
    setSelectedUsername(null);

    // Cycle through loading messages
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
        setError(data.error ?? "Something went wrong");
        return;
      }

      setResults(data.usernames);
      if (data.usernames.length > 0) {
        setSelectedUsername(data.usernames[0].username);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      clearInterval(msgInterval);
      setLoading(false);
      setLoadingMessage("");
    }
  };

  const selectedResult = results.find((r) => r.username === selectedUsername);

  return (
    <div className="space-y-6">
      {/* Search input */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Keywords or name ideas
            </label>
            <Input
              placeholder="e.g. fitness, minimal, zen, nature..."
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="text-base"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Vibe</label>
            <Tabs value={vibe} onValueChange={setVibe}>
              <TabsList className="flex-wrap h-auto gap-1">
                {VIBES.map((v) => (
                  <TabsTrigger key={v} value={v} className="capitalize">
                    {v}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {error && (
            <div className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-md">
              {error}
              {error.includes("Upgrade") && (
                <a href="/pricing" className="ml-2 underline font-medium">
                  Upgrade to Pro →
                </a>
              )}
            </div>
          )}

          <Button
            className="w-full"
            size="lg"
            onClick={handleSearch}
            disabled={loading || !keywords.trim()}
          >
            {loading ? loadingMessage : "Generate & Check Usernames"}
          </Button>

          {plan === "free" && searchesLeft !== null && (
            <p className="text-center text-xs text-slate-400">
              {searchesLeft} of 3 free searches remaining today
            </p>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {results.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Username list */}
          <div className="lg:col-span-1 space-y-2">
            <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wide px-1">
              Generated usernames
            </h2>
            {results.map((r) => (
              <button
                key={r.username}
                onClick={() => setSelectedUsername(r.username)}
                className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${
                  selectedUsername === r.username
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">@{r.username}</span>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      r.score >= 70
                        ? "bg-green-100 text-green-700"
                        : r.score >= 40
                          ? "bg-amber-100 text-amber-700"
                          : "bg-red-100 text-red-700"
                    } ${selectedUsername === r.username ? "bg-opacity-20" : ""}`}
                  >
                    {r.score}%
                  </span>
                </div>
                <Progress
                  value={r.score}
                  className={`h-1 mt-2 ${
                    selectedUsername === r.username ? "opacity-50" : ""
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Platform breakdown */}
          {selectedResult && (
            <div className="lg:col-span-2">
              <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wide px-1 mb-2">
                Platform availability for @{selectedResult.username}
              </h2>
              <Card>
                <CardContent className="pt-4 divide-y divide-slate-100">
                  {selectedResult.results.map((r) => (
                    <div
                      key={r.platform}
                      className="flex items-center justify-between py-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">
                          {PLATFORM_ICONS[r.platform] ?? "🌐"}
                        </span>
                        <span className="text-sm font-medium text-slate-700">
                          {r.platform}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        {r.error ? (
                          <Badge variant="secondary">Unknown</Badge>
                        ) : r.available ? (
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                            Available
                          </Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                            Taken
                          </Badge>
                        )}

                        {r.available && !r.error && (
                          <Link
                            href={r.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-slate-400 hover:text-slate-600 underline"
                          >
                            Visit →
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
