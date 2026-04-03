import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function generateUsernames(
  keywords: string,
  vibe: string,
  count: number = 15,
): Promise<string[]> {
  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "system",
        content: `You are a creative username generator. Generate unique, memorable usernames based on the user's input.
Rules:
- Letters only, no numbers, no underscores, no dots, no special characters
- Between 4 and 18 characters long
- Creative, memorable, and brandable
- Not offensive or inappropriate
- Mix of styles: some short and punchy, some descriptive, some abstract
- Return ONLY a JSON array of strings, nothing else. Example: ["username1","username2"]`,
      },
      {
        role: "user",
        content: `Generate ${count} unique usernames for someone with these keywords: "${keywords}". Vibe/tone: "${vibe}". Return only the JSON array.`,
      },
    ],
    temperature: 0.9,
    max_tokens: 500,
  });

  const content = completion.choices[0]?.message?.content ?? "[]";

  try {
    const cleaned = content.replace(/```json|```/g, "").trim();
    const usernames: string[] = JSON.parse(cleaned);
    // Sanitize — enforce letters only just in case
    return usernames
      .filter((u) => /^[a-zA-Z]+$/.test(u) && u.length >= 4 && u.length <= 18)
      .slice(0, count);
  } catch {
    return [];
  }
}
