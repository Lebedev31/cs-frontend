import { Metadata } from "next";
import Agreement from "@/Components/Info/agreement/Agreement";

export const metadata: Metadata = {
  title: "Пользовательское соглашение - gamestate-monitor.ru",
  description:
    "Правила использования сервиса мониторинга серверов gamestate-monitor.ru. Права и обязанности пользователей.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/agreement" },
};

export default function AgreementPage() {
  return <Agreement />;
}
