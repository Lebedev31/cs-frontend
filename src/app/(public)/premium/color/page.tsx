import Color from "@/Components/Premium/Service/Color/Color";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Новый цвет для сервера",
  description:
    "Получите услугу цвет для вашего игрового сервера в мониторинге GameState-Monitor. Приоритетное размещение, уникальное оформление и повышенное доверие игроков.",
  // По твоему запросу установлены значения true
  robots: { index: true, follow: true },
  alternates: { canonical: "/premium/servicePage/color" },
};
export default function ColorPage() {
  return <Color />;
}
