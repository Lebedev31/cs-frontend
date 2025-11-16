import { Metadata } from "next";
import RegisterBlock from "@/Components/Registration/RegisterBlock";

export const metadata: Metadata = {
  title: "Вход в аккаунт - Авторизация на CS Rating",
  description:
    "Войдите в личный кабинет CS Rating для управления серверами, просмотра статистики и использования дополнительных возможностей.",
  robots: { index: false, follow: true }, // Не индексируем страницу входа
  alternates: { canonical: "/login" },
};

export default function Login() {
  return <RegisterBlock />;
}
