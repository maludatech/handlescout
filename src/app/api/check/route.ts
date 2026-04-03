import { createClient } from "@/lib/supabase/server";
import { checkUsername, getAvailabilityScore } from "@/lib/checker";
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

    const { username } = await request.json();

    if (!username?.trim()) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 },
      );
    }

    if (!/^[a-zA-Z]+$/.test(username)) {
      return NextResponse.json(
        { error: "Username must contain letters only" },
        { status: 400 },
      );
    }

    const results = await checkUsername(username);
    const score = getAvailabilityScore(results);

    return NextResponse.json({ username, results, score });
  } catch (error) {
    console.error("Check error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
