import { Metadata } from "next";
import Vip from "@/Components/Premium/Service/Vip/Vip";

export const metadata: Metadata = {
  title: "VIP статус для сервера | GameState-Monitor",
  description:
    "Получите VIP-статус для вашего игрового сервера в мониторинге GameState-Monitor. Приоритетное размещение, уникальное оформление и повышенное доверие игроков.",
  // По твоему запросу установлены значения true
  robots: { index: true, follow: true },
  alternates: { canonical: "/premium/servicePage/vip" },
};

export default function ServicePage() {
  return <Vip />;
}
