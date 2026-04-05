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

const platforms: Platform[] = [
  {
    name: "Instagram",
    maxLength: 30,
    url: (u) => `https://instagram.com/${u}`,
    checkAvailability: async (u) => {
      try {
        const res = await axios.get(`https://www.instagram.com/${u}/`, {
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
    url: (u) => `https://tiktok.com/@${u}`,
    checkAvailability: async (u) => {
      try {
        const res = await axios.get(`https://www.tiktok.com/@${u}`, {
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
    name: "GitHub",
    maxLength: 39,
    url: (u) => `https://github.com/${u}`,
    checkAvailability: async (u) => {
      try {
        const res = await axios.get(`https://github.com/${u}`, {
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
    name: "Reddit",
    maxLength: 20,
    url: (u) => `https://reddit.com/user/${u}`,
    checkAvailability: async (u) => {
      try {
        const res = await axios.get(
          `https://www.reddit.com/user/${u}/about.json`,
          {
            timeout: 5000,
            headers: { "User-Agent": "Mozilla/5.0" },
            validateStatus: () => true,
          },
        );
        return res.status === 404;
      } catch {
        return false;
      }
    },
  },
  {
    name: "Pinterest",
    maxLength: 15,
    url: (u) => `https://pinterest.com/${u}`,
    checkAvailability: async (u) => {
      try {
        const res = await axios.get(`https://www.pinterest.com/${u}/`, {
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
    name: "Twitch",
    maxLength: 25,
    url: (u) => `https://twitch.tv/${u}`,
    checkAvailability: async (u) => {
      try {
        const res = await axios.get(`https://www.twitch.tv/${u}`, {
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
    name: "YouTube",
    maxLength: 30,
    url: (u) => `https://youtube.com/@${u}`,
    checkAvailability: async (u) => {
      try {
        const res = await axios.get(`https://www.youtube.com/@${u}`, {
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
    unreliable: true,
    url: (u) => `https://snapchat.com/add/${u}`,
    checkAvailability: async (_u) => {
      throw new Error("unreliable");
    },
  },
  {
    name: "Medium",
    maxLength: 30,
    url: (u) => `https://medium.com/@${u}`,
    checkAvailability: async (u) => {
      try {
        const res = await axios.get(`https://medium.com/@${u}`, {
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
    url: (u) => `https://soundcloud.com/${u}`,
    checkAvailability: async (u) => {
      try {
        const res = await axios.get(`https://soundcloud.com/${u}`, {
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
    name: "Telegram",
    maxLength: 32,
    url: (u) => `https://t.me/${u}`,
    checkAvailability: async (u) => {
      try {
        const res = await axios.get(`https://t.me/${u}`, {
          timeout: 5000,
          headers: { "User-Agent": "Mozilla/5.0" },
          validateStatus: () => true,
        });
        return !res.data?.includes("If you have Telegram");
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
      // Mark unreliable platforms without making a request
      if (platform.unreliable) {
        return {
          platform: platform.name,
          available: false,
          url: platform.url(username),
          error: true,
          maxLength: platform.maxLength,
        };
      }

      // Check length before making any HTTP request
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
  // Exclude unreliable (error) and too-long platforms from score
  const eligible = results.filter((r) => !r.tooLong && !r.error);
  if (eligible.length === 0) return 0;
  const available = eligible.filter((r) => r.available).length;
  return Math.round((available / eligible.length) * 100);
}
