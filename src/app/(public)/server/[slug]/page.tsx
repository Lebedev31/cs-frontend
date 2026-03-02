import { Metadata } from "next";
import ServerPage from "@/Components/ServerPage/ServerPage";

type ParamsType = Promise<{ slug: string }>;

const extractServerName = (slug: string): string => {
  const lastColonIndex = slug.lastIndexOf(":");
  if (lastColonIndex === -1) return slug;
  const withoutPort = slug.substring(0, lastColonIndex);
  const lastHyphenIndex = withoutPort.lastIndexOf("-");
  if (lastHyphenIndex === -1) return withoutPort;
  return withoutPort.substring(0, lastHyphenIndex).replace(/-/g, " ");
};

export async function generateMetadata({
  params,
}: {
  params: ParamsType;
}): Promise<Metadata> {
  const { slug } = await params;
  const fullSlug = decodeURIComponent(slug);
  const serverName = extractServerName(fullSlug);
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://gamestate-monitor.ru";

  return {
    title: `Сервер ${serverName} - Информация и статистика`,
    description: `Подробная информация об игровом сервере Counter-Strike: ${serverName}. Количество игроков онлайн, карта, режим игры, рейтинг и отзывы.`,
    keywords: [
      `сервер ${serverName}`,
      "counter strike сервер",
      "статистика сервера",
      "онлайн игроки",
      "cs рейтинг сервера",
    ],
    openGraph: {
      title: `Сервер ${serverName} | GameState-Monitor`,
      description: `Информация о сервере Counter-Strike ${serverName}`,
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
