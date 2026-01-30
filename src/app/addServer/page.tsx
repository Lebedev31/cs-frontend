import { Metadata } from "next";
import WrapperAddServer from "@/Components/AddServer/WrapperAddServer";

export const metadata: Metadata = {
  title: "Добавить сервер | GameState-Monitor",
  description:
    "Добавьте свой сервер CS 1.6, CS:GO или CS2 в наш рейтинг бесплатно. Увеличьте количество игроков и популярность вашего сервера.",
  keywords: [
    "добавить сервер cs",
    "добавить сервер в мониторинг",
    "регистрация сервера",
  ],
  openGraph: {
    title: "Добавить сервер в мониторинг - gamestate-monitor.ru",
    url: "/addServer",
  },
  alternates: { canonical: "/addServer" },
  robots: { index: true, follow: true },
};

export default function AddServerPage() {
  return <WrapperAddServer />;
}
