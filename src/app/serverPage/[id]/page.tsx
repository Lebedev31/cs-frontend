import { Metadata } from "next";
import ServerPage from "@/Components/ServerPage/ServerPage";

type ParamsType = { id: string };

// Генерация динамических метаданных
export async function generateMetadata({
  params,
}: {
  params: ParamsType | Promise<ParamsType>;
}): Promise<Metadata> {
  // Важно: ожидать params перед доступом к полям
  const resolvedParams = await params;
  const serverId = decodeURIComponent(resolvedParams.id);

  // TODO: при желании можно тут же сделать fetch к API, например:
  // const server = await fetch(`https://api.../servers/${serverId}`).then(r => r.json());

  const absoluteBase = "https://cs-server.fun"; // замени на свой домен

  return {
    title: `Сервер ${serverId} - Информация и статистика`,
    description: `Подробная информация об игровом сервере Counter-Strike ${serverId}. Количество игроков онлайн, карта, режим игры, рейтинг и отзывы.`,
    keywords: [
      `сервер ${serverId}`,
      "counter strike сервер",
      "статистика сервера",
      "онлайн игроки",
      "cs рейтинг сервера",
    ],
    openGraph: {
      title: `Сервер ${serverId} - CS Rating`,
      description: `Информация о сервере Counter-Strike ${serverId}`,
      url: `${absoluteBase}/serverPage/${encodeURIComponent(
        resolvedParams.id
      )}`,
      type: "website",
    },
    alternates: {
      canonical: `${absoluteBase}/serverPage/${encodeURIComponent(
        resolvedParams.id
      )}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

// Если компонент страницы должен знать params, пробрасывай их в компонент:
// export default function Server({ params }: { params: ParamsType }) { ... }
export default function Server() {
  return (
    <>
      <ServerPage />

      {/* Structured Data для сервера — при желании заменить значения на реальные */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "GameServer",
            name: "Counter-Strike Server", // TODO: заменить
            game: "Counter-Strike",
            playersOnline: 0, // TODO: заменить
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.5",
              ratingCount: "100",
            },
          }),
        }}
      />
    </>
  );
}
