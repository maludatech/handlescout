import axios from "axios";

export interface PlatformResult {
  platform: string;
  available: boolean;
  url: string;
  error?: boolean;
  tooLong?: boolean;
  maxLength?: number;
}

export interface Platform {
  name: string;
  maxLength: number;
  unreliable?: boolean;
  url: (username: string) => string;
  checkAvailability: (username: string) => Promise<boolean>;
}

// Twitch token cache
let twitchToken: string | null = null;
let twitchTokenExpiry: number = 0;

async function getTwitchToken(): Promise<string | null> {
  if (twitchToken && Date.now() < twitchTokenExpiry) {
    return twitchToken;
  }
  try {
    const res = await axios.post(`https://id.twitch.tv/oauth2/token`, null, {
      params: {
        client_id: process.env.TWITCH_CLIENT_ID,
        client_secret: process.env.TWITCH_CLIENT_SECRET,
        grant_type: "client_credentials",
      },
      validateStatus: () => true,
    });
    twitchToken = res.data?.access_token ?? null;
    twitchTokenExpiry =
      Date.now() + ((res.data?.expires_in ?? 3600) - 60) * 1000;
    return twitchToken;
  } catch {
    return null;
  }
}

const platforms: Platform[] = [
  {
    name: "Instagram",
    maxLength: 30,
    unreliable: true,
    url: (u) => `https://instagram.com/${u}`,
    checkAvailability: async (_u) => {
      throw new Error("unreliable");
    },
  },
  {
    name: "X (Twitter)",
    maxLength: 15,
    unreliable: true,
    url: (u) => `https://x.com/${u}`,
    checkAvailability: async (_u) => {
      throw new Error("unreliable");
    },
  },
  {
    name: "TikTok",
    maxLength: 24,
    unreliable: true,
    url: (u) => `https://tiktok.com/@${u}`,
    checkAvailability: async (_u) => {
      throw new Error("unreliable");
    },
  },
  {
    name: "GitHub",
    maxLength: 39,
    url: (u) => `https://github.com/${u}`,
    checkAvailability: async (u) => {
      try {
        const res = await axios.get(`https://api.github.com/users/${u}`, {
          timeout: 5000,
          headers: {
            Accept: "application/vnd.github.v3+json",
            "User-Agent": "HandleScout",
            Authorization: `token ${process.env.GITHUB_TOKEN}`,
          },
          validateStatus: () => true,
        });
        return res.status === 404;
      } catch {
        return false;
      }
    },
  },
  {
    name: "Reddit",
    maxLength: 20,
    unreliable: true,
    url: (u) => `https://reddit.com/user/${u}`,
    checkAvailability: async (_u) => {
      throw new Error("unreliable");
    },
  },
  {
    name: "Pinterest",
    maxLength: 15,
    unreliable: true,
    url: (u) => `https://pinterest.com/${u}`,
    checkAvailability: async (_u) => {
      throw new Error("unreliable");
    },
  },
  {
    name: "Twitch",
    maxLength: 25,
    url: (u) => `https://twitch.tv/${u}`,
    checkAvailability: async (u) => {
      try {
        const token = await getTwitchToken();
        if (!token) return false;
        const res = await axios.get(`https://api.twitch.tv/helix/users`, {
          params: { login: u },
          headers: {
            "Client-Id": process.env.TWITCH_CLIENT_ID!,
            Authorization: `Bearer ${token}`,
          },
          validateStatus: () => true,
        });
        return res.data?.data?.length === 0;
      } catch {
        return false;
      }
    },
  },
  {
    name: "YouTube",
    maxLength: 30,
    url: (u) => `https://youtube.com/@${u}`,
    checkAvailability: async (u) => {
      try {
        const res = await axios.get(
          `https://www.googleapis.com/youtube/v3/channels`,
          {
            params: {
              part: "id",
              forHandle: u,
              key: process.env.YOUTUBE_API_KEY,
            },
            validateStatus: () => true,
          },
        );
        return res.data?.pageInfo?.totalResults === 0;
      } catch {
        return false;
      }
    },
  },
  {
    name: "LinkedIn",
    maxLength: 100,
    unreliable: true,
    url: (u) => `https://linkedin.com/in/${u}`,
    checkAvailability: async (_u) => {
      throw new Error("unreliable");
    },
  },
  {
    name: "Snapchat",
    maxLength: 15,
    url: (u) => `https://snapchat.com/add/${u}`,
    checkAvailability: async (u) => {
      try {
        const res = await axios.get(`https://www.snapchat.com/add/${u}`, {
          timeout: 8000,
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            Accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
          },
          validateStatus: () => true,
        });
        // Taken = 200, Available = 404
        return res.status === 404;
      } catch {
        return false;
      }
    },
  },
  {
    name: "Medium",
    maxLength: 30,
    unreliable: true,
    url: (u) => `https://medium.com/@${u}`,
    checkAvailability: async (_u) => {
      throw new Error("unreliable");
    },
  },
  {
    name: "Tumblr",
    maxLength: 32,
    url: (u) => `https://${u}.tumblr.com`,
    checkAvailability: async (u) => {
      try {
        const res = await axios.get(`https://${u}.tumblr.com`, {
          timeout: 5000,
          headers: { "User-Agent": "Mozilla/5.0" },
          validateStatus: () => true,
        });
        return res.status === 404;
      } catch {
        return false;
      }
    },
  },
  {
    name: "SoundCloud",
    maxLength: 25,
    unreliable: true,
    url: (u) => `https://soundcloud.com/${u}`,
    checkAvailability: async (_u) => {
      throw new Error("unreliable");
    },
  },
  {
    name: "Telegram",
    maxLength: 32,
    url: (u) => `https://t.me/${u}`,
    checkAvailability: async (u) => {
      try {
        const res = await axios.get(`https://t.me/${u}`, {
          timeout: 5000,
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          },
          validateStatus: () => true,
        });
        const html = res.data ?? "";
        const ogTitle =
          html.match(/<meta property="og:title" content="(.*?)"/i)?.[1] ?? "";
        return ogTitle.toLowerCase().startsWith("telegram:");
      } catch {
        return false;
      }
    },
  },
  {
    name: "DevTo",
    maxLength: 50,
    url: (u) => `https://dev.to/${u}`,
    checkAvailability: async (u) => {
      try {
        const res = await axios.get(`https://dev.to/${u}`, {
          timeout: 5000,
          headers: { "User-Agent": "Mozilla/5.0" },
          validateStatus: () => true,
        });
        return res.status === 404;
      } catch {
        return false;
      }
    },
  },
];

export async function checkUsername(
  username: string,
): Promise<PlatformResult[]> {
  const results = await Promise.allSettled(
    platforms.map(async (platform) => {
      if (platform.unreliable) {
        return {
          platform: platform.name,
          available: false,
          url: platform.url(username),
          error: true,
          maxLength: platform.maxLength,
        };
      }

      if (username.length > platform.maxLength) {
        return {
          platform: platform.name,
          available: false,
          url: platform.url(username),
          tooLong: true,
          maxLength: platform.maxLength,
        };
      }

      const available = await platform.checkAvailability(username);
      return {
        platform: platform.name,
        available,
        url: platform.url(username),
        tooLong: false,
        maxLength: platform.maxLength,
      };
    }),
  );

  return results.map((result, index) => {
    if (result.status === "fulfilled") return result.value;
    return {
      platform: platforms[index].name,
      available: false,
      url: platforms[index].url(username),
      error: true,
      maxLength: platforms[index].maxLength,
    };
  });
}

export async function checkMultipleUsernames(
  usernames: string[],
): Promise<Record<string, PlatformResult[]>> {
  const results: Record<string, PlatformResult[]> = {};
  await Promise.all(
    usernames.map(async (username) => {
      results[username] = await checkUsername(username);
    }),
  );
  return results;
}

export function getAvailabilityScore(results: PlatformResult[]): number {
  const eligible = results.filter((r) => !r.tooLong && !r.error);
  if (eligible.length === 0) return 0;
  const available = eligible.filter((r) => r.available).length;
  return Math.round((available / eligible.length) * 100);
}
