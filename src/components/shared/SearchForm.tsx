"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

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

function PlatformBreakdown({ result }: { result: UsernameResult }) {
  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wide">
          Availability for @{result.username}
        </h2>
        <span
          className={`text-sm font-semibold px-3 py-1 rounded-full ${
            result.score >= 70
              ? "bg-green-100 text-green-700"
              : result.score >= 40
                ? "bg-amber-100 text-amber-700"
                : "bg-red-100 text-red-700"
          }`}
        >
          {result.score}% available
        </span>
      </div>
      <Progress value={result.score} className="h-2 mb-4" />
      <Card>
        <CardContent className="pt-4 divide-y divide-slate-100">
          {result.results.map((r) => (
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
  );
}

export default function SearchForm({
  plan,
  searchesLeft,
  onSearchUsed,
}: SearchFormProps) {
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

  // Direct check handler
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

  // AI generate handler
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
      if (data.usernames.length > 0) {
        setSelectedUsername(data.usernames[0].username);
      }

      onSearchUsed();
    } catch {
      setGenerateError("Network error. Please try again.");
    } finally {
      clearInterval(msgInterval);
      setGenerateLoading(false);
      setLoadingMessage("");
    }
  };

  const selectedResult = generateResults.find(
    (r) => r.username === selectedUsername,
  );

  return (
    <Tabs defaultValue="check">
      <TabsList className="w-full mb-6">
        <TabsTrigger value="check" className="flex-1">
          Check a username
        </TabsTrigger>
        <TabsTrigger value="generate" className="flex-1">
          Generate with AI
          {plan === "free" && searchesLeft !== null && (
            <span className="ml-2 text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">
              {searchesLeft} left
            </span>
          )}
        </TabsTrigger>
      </TabsList>

      {/* Tab 1: Direct check */}
      <TabsContent value="check">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Enter a username to check
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                    @
                  </span>
                  <Input
                    placeholder="yourhandle"
                    value={directUsername}
                    onChange={(e) => {
                      setDirectUsername(e.target.value);
                      setDirectError(null);
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleDirectCheck()}
                    className="pl-8 text-base"
                  />
                </div>
                <Button
                  onClick={handleDirectCheck}
                  disabled={directLoading || !directUsername.trim()}
                >
                  {directLoading ? "Checking..." : "Check"}
                </Button>
              </div>
              <p className="text-xs text-slate-400">
                Letters only — no numbers, underscores or symbols
              </p>
            </div>

            {directError && (
              <div className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-md">
                {directError}
              </div>
            )}
          </CardContent>
        </Card>

        {directLoading && (
          <div className="mt-6 text-center py-12 text-slate-400 text-sm animate-pulse">
            Checking across 15 platforms...
          </div>
        )}

        {directResult && !directLoading && (
          <PlatformBreakdown result={directResult} />
        )}
      </TabsContent>

      {/* Tab 2: AI Generate */}
      <TabsContent value="generate">
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
                onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
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

            {generateError && (
              <div className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-md">
                {generateError}
                {generateError.includes("Upgrade") && (
                  <Link href="/pricing" className="ml-2 underline font-medium">
                    Upgrade to Pro →
                  </Link>
                )}
              </div>
            )}

            <Button
              className="w-full"
              size="lg"
              onClick={handleGenerate}
              disabled={
                generateLoading ||
                !keywords.trim() ||
                (plan === "free" && searchesLeft === 0)
              }
            >
              {generateLoading ? loadingMessage : "Generate & Check Usernames"}
            </Button>

            {plan === "free" && searchesLeft !== null && (
              <p className="text-center text-xs text-slate-400">
                {searchesLeft} of 3 free AI generations remaining today
              </p>
            )}
          </CardContent>
        </Card>

        {generateLoading && (
          <div className="mt-6 text-center py-12 text-slate-400 text-sm animate-pulse">
            {loadingMessage}
          </div>
        )}

        {generateResults.length > 0 && !generateLoading && (
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Username list */}
            <div className="lg:col-span-1 space-y-2">
              <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wide px-1">
                Generated usernames
              </h2>
              {generateResults.map((r) => (
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
                      } ${selectedUsername === r.username ? "opacity-70" : ""}`}
                    >
                      {r.score}%
                    </span>
                  </div>
                  <Progress
                    value={r.score}
                    className={`h-1 mt-2 ${
                      selectedUsername === r.username ? "opacity-40" : ""
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Platform breakdown */}
            {selectedResult && (
              <div className="lg:col-span-2">
                <PlatformBreakdown result={selectedResult} />
              </div>
            )}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
