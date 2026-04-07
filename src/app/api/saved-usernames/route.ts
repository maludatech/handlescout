import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase
      .from("saved_usernames")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ saved: data });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: profile } = await supabase
      .from("profiles")
      .select("plan")
      .eq("id", user.id)
      .single();

    if (profile?.plan !== "pro") {
      return NextResponse.json(
        { error: "Pro feature. Upgrade to save usernames." },
        { status: 403 },
      );
    }

    const { username, available_on } = await request.json();

    const { data, error } = await supabase
      .from("saved_usernames")
      .insert({ user_id: user.id, username, available_on })
      .select()
      .single();

    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ saved: data });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await request.json();

    const { error } = await supabase
      .from("saved_usernames")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
