import { Metadata } from "next";
import { Suspense } from "react";
// Импортируем наш переименованный клиентский компонент
import ChangePassword from "@/Components/Registration/ChangePassword/ChangePassword";

export const metadata: Metadata = {
  title: "Изменение пароля | GameState-Monitor",
  description:
    "Безопасное восстановление доступа и смена пароля в личном кабинете сервиса GameState-Monitor.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/changePasswordPage" },
};

export default function ChangePasswordPage() {
  return (
    <Suspense fallback={<div>Проверка токена...</div>}>
      <ChangePassword />
    </Suspense>
  );
}
