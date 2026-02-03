import { Metadata } from "next";
import ForgotPassword from "@/Components/Registration/ForgotPassword/ForgotPassword";

export const metadata: Metadata = {
  title: "Восстановление пароля",
  description:
    "Забыли пароль? Восстановите доступ к своему аккаунту GameState-Monitor с помощью электронной почты.",
  // Установлено в true по твоему запросу
  robots: { index: true, follow: true },
  alternates: { canonical: "/forgot" },
};

export default function ForgotPage() {
  return <ForgotPassword />;
}
