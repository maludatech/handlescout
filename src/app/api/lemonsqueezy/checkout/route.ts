import { createClient } from "@/lib/supabase/server";
import { createCheckoutUrl } from "@/lib/lemonsqueezy";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("plan")
      .eq("id", user.id)
      .single();

    if (profile?.plan === "pro") {
      return NextResponse.json(
        { error: "Already on Pro plan" },
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
