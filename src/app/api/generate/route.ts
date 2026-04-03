import { createClient } from "@/lib/supabase/server";
import { generateUsernames } from "@/lib/groq";
import { checkMultipleUsernames, getAvailabilityScore } from "@/lib/checker";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check rate limit for free users
    const { data: profile } = await supabase
      .from("profiles")
      .select("plan, searches_today, last_search_date")
      .eq("id", user.id)
      .single();

    if (profile?.plan === "free") {
      const today = new Date().toISOString().split("T")[0];
      const lastSearchDate = profile.last_search_date;

      if (lastSearchDate === today && (profile.searches_today ?? 0) >= 3) {
        return NextResponse.json(
          {
            error:
              "Daily limit reached. Upgrade to Pro for unlimited searches.",
          },
          { status: 429 },
        );
      }
    }

    const { keywords, vibe } = await request.json();

    if (!keywords?.trim()) {
      return NextResponse.json(
        { error: "Keywords are required" },
        { status: 400 },
      );
    }

    // Generate usernames via Groq
    const usernames = await generateUsernames(keywords, vibe ?? "creative");

    if (usernames.length === 0) {
      return NextResponse.json(
        { error: "Failed to generate usernames" },
        { status: 500 },
      );
    }

    // Check availability across all platforms
    const results = await checkMultipleUsernames(usernames);

    // Build response with scores
    const scored = usernames
      .map((username) => ({
        username,
        results: results[username] ?? [],
        score: getAvailabilityScore(results[username] ?? []),
      }))
      .sort((a, b) => b.score - a.score);

    // Update search count
    const today = new Date().toISOString().split("T")[0];
    const isNewDay = profile?.last_search_date !== today;

    await supabase
      .from("profiles")
      .update({
        searches_today: isNewDay ? 1 : (profile?.searches_today ?? 0) + 1,
        last_search_date: today,
      })
      .eq("id", user.id);

    // Save to search history
    await supabase.from("searches").insert({
      user_id: user.id,
      keywords,
      generated_usernames: usernames,
    });

    return NextResponse.json({ usernames: scored });
  } catch (error) {
    console.error("Generate error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
