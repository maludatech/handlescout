import {
  lemonSqueezySetup,
  createCheckout,
} from "@lemonsqueezy/lemonsqueezy.js";

lemonSqueezySetup({
  apiKey: process.env.LEMONSQUEEZY_API_KEY!,
  onError: (error) => console.error("Lemon Squeezy error:", error),
});

export async function createCheckoutUrl(
  userId: string,
  email: string,
): Promise<string> {
  const storeId = process.env.NEXT_PUBLIC_LEMONSQUEEZY_STORE_ID!;
  const variantId = process.env.LEMONSQUEEZY_VARIANT_ID!;

  const { data, error } = await createCheckout(storeId, variantId, {
    checkoutOptions: {
      embed: false,
      media: false,
    },
    checkoutData: {
      email,
      custom: {
        user_id: userId,
      },
    },
    productOptions: {
      redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgraded=true`,
      receiptButtonText: "Go to Dashboard",
      receiptThankYouNote: "Thanks for upgrading to Pro!",
    },
  });

  if (error) throw new Error(error.message);

  return data?.data?.attributes?.url ?? "";
}
