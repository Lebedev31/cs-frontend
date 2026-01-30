import { Suspense } from "react";
import RegisterBlock from "@/Components/Registration/RegisterBlock";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Вход в аккаунт - Авторизация | GameState-Monitor",
  description:
    "Войдите в личный кабинет gamestate-monitor.ru для управления серверами, просмотра статистики и использования дополнительных возможностей.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/login" },
};

export default function Login() {
  return (
    <Suspense fallback={<div>Проверка параметров...</div>}>
      <RegisterBlock />
    </Suspense>
  );
}
