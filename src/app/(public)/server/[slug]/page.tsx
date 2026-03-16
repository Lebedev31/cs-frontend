import { Metadata } from "next";
import ServerPage from "@/Components/ServerPage/ServerPage";
import { GameServer } from "@/types/type";

type ParamsType = Promise<{ slug: string }>;

async function fetchServer(slug: string): Promise<GameServer | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL; // твой apiUrl
    const res = await fetch(`${apiUrl}server-list/server/${slug}`, {
      next: { revalidate: 60 }, // кэш на 60 сек чтобы не долбить при каждом боте
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: ParamsType;
}): Promise<Metadata> {
  const { slug } = await params;
  const fullSlug = decodeURIComponent(slug);
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://gamestate-monitor.ru";

  const server = await fetchServer(fullSlug);

  const title = server ? `${server.name} [${fullSlug}]` : `Сервер ${fullSlug}`;

  const description = server
    ? `Сервер ${server.name} (${fullSlug}). Игроков: ${server.players}/${server.maxPlayers}, карта: ${server.map}, режим: ${server.mode}. Рейтинг и отзывы на GameState-Monitor.`
    : `Подробная информация об игровом сервере Counter-Strike: ${fullSlug}.`;

  return {
    title: `${title} - Информация и статистика`,
    description,
    keywords: [
      server?.name ?? `сервер ${fullSlug}`,
      "counter strike сервер",
      "статистика сервера",
      "онлайн игроки",
      "cs рейтинг сервера",
    ],
    openGraph: {
      title: `${title} | GameState-Monitor`,
      description,
      url: `${baseUrl}/server/${encodeURIComponent(slug)}`,
      type: "website",
    },
    alternates: {
      canonical: `${baseUrl}/server/${encodeURIComponent(slug)}`,
    },
    robots: { index: true, follow: true },
  };
}

export default function Server() {
  return <ServerPage />;
}
