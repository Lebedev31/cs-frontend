// Этот компонент по умолчанию является Server Component
import { Suspense } from "react";
// Импортируем наш переименованный клиентский компонент
import ChangePassword from "@/Components/Registration/ChangePassword/ChangePassword";

export default function ChangePasswordPage() {
  return (
    // Оборачиваем клиентский компонент в Suspense
    // Это говорит Next.js, что компонент ChangePasswordForm зависит от
    // клиентских API (как useSearchParams) и его нужно рендерить
    // только на клиенте после загрузки.
    <Suspense fallback={<div>Проверка токена...</div>}>
      <ChangePassword />
    </Suspense>
  );
}
