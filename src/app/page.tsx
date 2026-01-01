import { Metadata } from "next";
import Main from "@/Components/Main/Main";

// SEO для главной страницы
export const metadata: Metadata = {
  title: "Мониторинг серверов CS 1.6, CS:GO и CS2 - Рейтинг и статистика",
  description:
    "Актуальный мониторинг игровых серверов Counter-Strike 1.6, CS:GO и CS2. Рейтинг серверов по популярности, онлайн игроков, карты и режимы. Найдите лучший сервер для игры!",
  keywords: [
    "мониторинг серверов cs 1.6",
    "серверы cs go",
    "серверы cs2",
    "рейтинг серверов counter strike",
    "топ серверов cs",
    "найти сервер cs",
    "онлайн серверы",
    "игровые серверы",
  ],
  openGraph: {
    title: "gamestate-monitor.ru - Мониторинг серверов Counter-Strike",
    description:
      "Найдите лучшие серверы CS 1.6, CS:GO и CS2. Рейтинг, статистика, онлайн игроков",
    url: "/",
    type: "website",
  },
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return (
    <>
      {/* SEO: Скрытый H1 для поисковиков */}
      <h1
        style={{
          position: "absolute",
          left: "-9999px",
          fontSize: "1px",
        }}
      >
        Мониторинг и рейтинг серверов Counter-Strike 1.6, CS:GO и CS2
      </h1>

      <Main />
    </>
  );
}
