import { Metadata } from "next";
import Policy from "@/Components/Info/policy/Policy";

export const metadata: Metadata = {
  title: "Политика конфиденциальности | GameState-Monitor",
  description:
    "Политика конфиденциальности и обработки персональных данных на сайте мониторинга серверов gamestate-monitor.ru.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/policy" },
};

export default function PolicyPage() {
  return <Policy />;
}
