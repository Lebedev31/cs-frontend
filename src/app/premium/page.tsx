import { Metadata } from "next";
import Premium from "@/Components/Premium/Premium";

export const metadata: Metadata = {
  title: "Платные услуги - Раскрутка и продвижение сервера CS",
  description:
    "VIP размещение, TOP позиции, цветное выделение и баллы рейтинга для продвижения вашего сервера Counter-Strike. Увеличьте количество игроков!",
  keywords: [
    "раскрутка сервера cs",
    "vip размещение",
    "продвижение сервера",
    "реклама сервера",
  ],
  openGraph: {
    title: "Раскрутка серверов CS - Платные услуги",
    description: "VIP, TOP, цветное выделение и баллы для продвижения сервера",
    url: "/premium",
  },
  alternates: { canonical: "/premium" },
};

export default function PremiumPage() {
  return <Premium />;
}
