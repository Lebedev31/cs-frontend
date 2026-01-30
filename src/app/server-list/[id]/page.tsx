import { Metadata } from "next";
import FilterServerBlock from "@/Components/FilterServerBlock/FilterServerBlock";
import UpdateBlock from "@/Components/UpdateBlock/UpdateBlock";

interface Props {
  params: { id: string };
}

// Динамическая генерация метаданных
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const isCS2 = params.id.toLowerCase() === "CS2";

  const title = isCS2
    ? "Сервера Counter Strike 2 (CS2) — Мониторинг серверов CS2"
    : "Сервера Counter Strike Global Offensive (CS GO) — Мониторинг серверов CS GO";

  const description = isCS2
    ? "Лучший мониторинг серверов CS2. Найдите подходящий сервер Counter Strike 2 по фильтрам, модам и локации."
    : "Список серверов CS:GO для игры онлайн. Рейтинг, статистика и удобный поиск серверов Counter Strike Global Offensive.";

  return {
    title,
    description,
    robots: { index: true, follow: true },
    alternates: { canonical: `/server-list/${params.id}` },
  };
}

export default function ServerListPage() {
  return (
    <div style={{ paddingLeft: "15px", paddingRight: "15px" }}>
      {/* Теперь компоненты знают, какую игру фильтровать, если передать им params.id */}
      <FilterServerBlock />
      <UpdateBlock />
    </div>
  );
}
