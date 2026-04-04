import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import crypto from "crypto";

function verifySignature(payload: string, signature: string): boolean {
  const hmac = crypto.createHmac(
    "sha256",
    process.env.LEMONSQUEEZY_SIGNING_SECRET!,
  );
  const digest = hmac.update(payload).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
}

export async function POST(request: Request) {
  try {
    const payload = await request.text();
    const signature = request.headers.get("x-signature") ?? "";

    if (!verifySignature(payload, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(payload);
    const eventName = event.meta?.event_name;
    const userId = event.meta?.custom_data?.user_id;
    const supabase = await createClient();

    switch (eventName) {
      case "order_created":
      case "subscription_created":
      case "subscription_payment_success": {
        if (userId) {
          await supabase
            .from("profiles")
            .update({
              plan: "pro",
              stripe_subscription_id: event.data?.id?.toString(),
            })
            .eq("id", userId);
        }
        break;
      }

      case "subscription_cancelled":
      case "subscription_expired":
      case "subscription_payment_failed": {
        if (userId) {
          await supabase
            .from("profiles")
            .update({
              plan: "free",
              stripe_subscription_id: null,
            })
            .eq("id", userId);
        } else {
          // Fallback: find by email
          const email = event.data?.attributes?.user_email;
          if (email) {
            const { data: profile } = await supabase
              .from("profiles")
              .select("id")
              .eq("email", email)
              .single();

            if (profile) {
              await supabase
                .from("profiles")
                .update({ plan: "free", stripe_subscription_id: null })
                .eq("id", profile.id);
            }
          }
        }
        break;
      }

      case "subscription_updated":
      case "subscription_resumed":
      case "subscription_unpaused": {
        if (userId) {
          await supabase
            .from("profiles")
            .update({ plan: "pro" })
            .eq("id", userId);
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
