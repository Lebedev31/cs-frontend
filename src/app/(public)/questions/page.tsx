import { Metadata } from "next";
import Questions from "@/Components/Info/questions/Questions";

export const metadata: Metadata = {
  title: "Часто задаваемые вопросы (FAQ)",
  description:
    "Ответы на популярные вопросы о мониторинге серверов Counter-Strike: как добавить сервер, повысить рейтинг, работает система VIP размещения.",
  keywords: ["faq gamestate-monitor.ru", "вопросы и ответы", "помощь"],
  openGraph: {
    title: "FAQ - Часто задаваемые вопросы",
    url: "/questions",
  },
  alternates: { canonical: "/questions" },
};

export default function QuestionsPage() {
  return <Questions />;
}
