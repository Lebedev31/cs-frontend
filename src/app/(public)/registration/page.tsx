import { Suspense } from "react";
import RegisterBlock from "@/Components/Registration/RegisterBlock";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Регистрация",
  description: "Создайте аккаунт на gamestate-monitor.ru",
  robots: { index: false, follow: true },
  alternates: { canonical: "/registration" },
};

export default function RegistrationPage() {
  return (
    <Suspense fallback={<div>Загрузка...</div>}>
      <RegisterBlock />
    </Suspense>
  );
}
