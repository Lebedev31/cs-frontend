import { Metadata } from "next";
import ServerPage from "@/Components/ServerPage/ServerPage";

type ParamsType = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: ParamsType;
}): Promise<Metadata> {
  const { slug } = await params;
  const fullSlug = decodeURIComponent(slug);
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://gamestate-monitor.ru";

  return {
    title: `Сервер ${fullSlug} - Информация и статистика`,
    description: `Подробная информация об игровом сервере Counter-Strike: ${fullSlug}. Количество игроков онлайн, карта, режим игры, рейтинг и отзывы.`,
    keywords: [
      `сервер ${fullSlug}`,
      "counter strike сервер",
      "статистика сервера",
      "онлайн игроки",
      "cs рейтинг сервера",
    ],
    openGraph: {
      title: `Сервер ${fullSlug} | GameState-Monitor`,
      description: `Информация о сервере Counter-Strike ${fullSlug}`,
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
