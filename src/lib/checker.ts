import axios from "axios";

export interface PlatformResult {
  platform: string;
  available: boolean;
  url: string;
  error?: boolean;
}

export interface Platform {
  name: string;
  url: (username: string) => string;
  checkAvailability: (username: string) => Promise<boolean>;
}

const platforms: Platform[] = [
  {
    name: "Instagram",
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
    url: (u) => `https://x.com/${u}`,
    checkAvailability: async (u) => {
      try {
        const res = await axios.get(`https://x.com/${u}`, {
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
    name: "TikTok",
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
    url: (u) => `https://linkedin.com/in/${u}`,
    checkAvailability: async (u) => {
      try {
        const res = await axios.get(`https://www.linkedin.com/in/${u}/`, {
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
    name: "Snapchat",
    url: (u) => `https://snapchat.com/add/${u}`,
    checkAvailability: async (u) => {
      try {
        const res = await axios.get(`https://www.snapchat.com/add/${u}`, {
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
    name: "Medium",
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
    url: (u) => `https://t.me/${u}`,
    checkAvailability: async (u) => {
      try {
        const res = await axios.get(`https://t.me/${u}`, {
          timeout: 5000,
          headers: { "User-Agent": "Mozilla/5.0" },
          validateStatus: () => true,
        });
        // Telegram returns 200 even for non-existent users
        // but the body contains a specific string
        return res.data?.includes("If you have Telegram") === false;
      } catch {
        return false;
      }
    },
  },
  {
    name: "DevTo",
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
      const available = await platform.checkAvailability(username);
      return {
        platform: platform.name,
        available,
        url: platform.url(username),
      };
    }),
  );

  return results.map((result, index) => {
    if (result.status === "fulfilled") {
      return result.value;
    }
    return {
      platform: platforms[index].name,
      available: false,
      url: platforms[index].url(username),
      error: true,
    };
  });
}

export async function checkMultipleUsernames(
  usernames: string[],
): Promise<Record<string, PlatformResult[]>> {
  const results: Record<string, PlatformResult[]> = {};

  // Check all usernames in parallel
  await Promise.all(
    usernames.map(async (username) => {
      results[username] = await checkUsername(username);
    }),
  );

  return results;
}

export function getAvailabilityScore(results: PlatformResult[]): number {
  const available = results.filter((r) => r.available).length;
  return Math.round((available / results.length) * 100);
}
