import { Metadata } from "next";
import Agreement from "@/Components/Info/agreement/Agreement";

export const metadata: Metadata = {
  title: "Пользовательское соглашение - CS Rating",
  description:
    "Правила использования сервиса мониторинга серверов CS Rating. Права и обязанности пользователей.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/agreement" },
};

export default function AgreementPage() {
  return <Agreement />;
}
