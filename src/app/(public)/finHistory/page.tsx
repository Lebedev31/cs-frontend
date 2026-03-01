import { Metadata } from "next";
import FinHistory from "@/Components/ProfileDropDown/FinHistory/FinHistory";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "История финансовых операций",
  description:
    "Просмотр истории транзакций, пополнений и платежей в сервисе GameState-Monitor.",
  // Везде поставлено true по твоему запросу
  robots: { index: true, follow: true },
  alternates: { canonical: "/finHistory" },
};

export default function FinHistoryPage() {
  return <FinHistory />;
}
