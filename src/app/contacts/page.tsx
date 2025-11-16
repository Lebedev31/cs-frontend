import { Metadata } from "next";
import Contacts from "@/Components/Contacts/Contacts";

export const metadata: Metadata = {
  title: "Контакты - Связаться с CS Rating",
  description:
    "Свяжитесь с нами по вопросам мониторинга серверов Counter-Strike, технической поддержки или сотрудничества. Email, VK, форма обратной связи.",
  keywords: ["контакты cs rating", "техподдержка", "обратная связь"],
  openGraph: {
    title: "Контакты - CS Rating",
    url: "/contacts",
  },
  alternates: { canonical: "/contacts" },
};

export default function ContactsPage() {
  return <Contacts />;
}
