import { MetadataRoute } from "next";

interface Server {
  id: string; // "91.234.12.5:27015"
  name: string;
  ip: string;
  port: number;
}

interface ApiResponse {
  data: Server[];
}

// --- Утилиты для очистки URL ---

const cyrillicMap: Record<string, string> = {
  а: "a",
  б: "b",
  в: "v",
  г: "g",
  д: "d",
  е: "e",
  ё: "yo",
  ж: "zh",
  з: "z",
  и: "i",
  й: "y",
  к: "k",
  л: "l",
  м: "m",
  н: "n",
  о: "o",
  п: "p",
  р: "r",
  с: "s",
  т: "t",
  у: "u",
  ф: "f",
  х: "h",
  ц: "ts",
  ч: "ch",
  ш: "sh",
  щ: "sch",
  ъ: "",
  ы: "y",
  ь: "",
  э: "e",
  ю: "yu",
  я: "ya",
};

function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      // Транслитерация
      .split("")
      .map((char) => cyrillicMap[char] || char)
      .join("")
      // Убираем всё, кроме латиницы, цифр и пробелов
      .replace(/[^a-z0-9\s-]/g, "")
      // Пробелы в дефисы
      .trim()
      .replace(/\s+/g, "-")
      // Убираем двойные дефисы
      .replace(/-+/g, "-")
  );
}

// ------------------------------

async function getServers(): Promise<Server[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}server-list/all`,
      { next: { revalidate: 86400 } },
    );
    if (!res.ok) return [];
    const json: ApiResponse = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://gamestate-monitor.ru";

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/server-list/cs2`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/server-list/csgo`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/addServer`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/premium`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/premium/servicePage/vip`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/premium/servicePage/top`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/premium/servicePage/color`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/premium/servicePage/balls`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contacts`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/questions`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/agreement`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/policy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/offer`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const servers = await getServers();
  const serverPages: MetadataRoute.Sitemap = servers.map((server) => {
    // Очищаем имя сервера
    const cleanName = slugify(server.name) || "server";
    // Формируем финальный slug. encodeURIComponent нужен только для символа ":" в id (ip:port)
    const slug = `${cleanName}-${server.id}`;

    return {
      url: `${baseUrl}/server/${encodeURIComponent(slug)}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    };
  });

  return [...staticPages, ...serverPages];
}
