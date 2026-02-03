import { Metadata } from "next";
import Top from "@/Components/Premium/Service/Top/Top";

export const metadata: Metadata = {
  title: "Вывод в ТОП",
  description:
    "Закрепите свой сервер в верхних строчках списка мониторинга GameState-Monitor. Максимальный охват аудитории и гарантированный приток новых игроков.",
  // Установлено в true по твоему запросу
  robots: { index: true, follow: true },
  alternates: { canonical: "/premium/servicePage/top" },
};

export default function TopPage() {
  return <Top />;
}
