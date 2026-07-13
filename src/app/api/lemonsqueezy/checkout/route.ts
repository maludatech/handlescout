import { createClient } from "@/lib/supabase/server";
import { createCheckoutUrl } from "@/lib/lemonsqueezy";
import { isTrustedOrigin } from "@/lib/origin-check";
import { hasFullAccess } from "@/lib/plan";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    if (!isTrustedOrigin(request)) {
      return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("plan, is_founder")
      .eq("id", user.id)
      .single();

    if (profile && hasFullAccess(profile)) {
      return NextResponse.json(
        { error: "You already have full access" },
        { status: 400 },
      );
    }

    const url = await createCheckoutUrl(user.id, user.email!);
    return NextResponse.json({ url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
