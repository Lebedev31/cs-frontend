import { Metadata } from "next";
import ServerPage from "@/Components/ServerPage/ServerPage";

type ParamsType = { id: string };

// Вспомогательная функция для извлечения имени
const extractServerName = (slug: string): string => {
  // Формат slug: Name-IP:Port (например: Super-Server-Run-127.0.0.1:27015)

  // 1. Находим последнее двоеточие (отделяет порт)
  const lastColonIndex = slug.lastIndexOf(":");
  if (lastColonIndex === -1) return slug; // Если формат нарушен, возвращаем как есть

  // Строка без порта: Super-Server-Run-127.0.0.1
  const withoutPort = slug.substring(0, lastColonIndex);

  // 2. Находим последний дефис (отделяет IP)
  const lastHyphenIndex = withoutPort.lastIndexOf("-");
  if (lastHyphenIndex === -1) return withoutPort;

  // 3. Получаем "сырое" имя: Super-Server-Run
  const rawName = withoutPort.substring(0, lastHyphenIndex);

  // 4. (Опционально) Заменяем дефисы обратно на пробелы для красивого заголовка
  // Так как при создании ссылки ты делал .replace(/\s+/g, "-")
  return rawName.replace(/-/g, " ");
};

export async function generateMetadata({
  params,
}: {
  params: ParamsType | Promise<ParamsType>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const fullSlug = decodeURIComponent(resolvedParams.id);

  // Извлекаем чистое имя
  const serverName = extractServerName(fullSlug);

  const absoluteBase = "https://gamestate-monitor.ru";

  return {
    // Теперь в title будет только имя, например: "Сервер Super Server Run - Информация..."
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
      url: `${absoluteBase}/serverPage/${encodeURIComponent(resolvedParams.id)}`,
      type: "website",
    },
    alternates: {
      canonical: `${absoluteBase}/serverPage/${encodeURIComponent(resolvedParams.id)}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function Server() {
  return (
    <>
      <ServerPage />
      {/* Остальной код... */}
    </>
  );
}
