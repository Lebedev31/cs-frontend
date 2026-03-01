import { Metadata } from "next";
import PaymentForm from "@/Components/ProfileDropDown/PaymentForm/PaymentForm";

export const metadata: Metadata = {
  title: "Пополнение баланса",
  description:
    "Пополнение личного счета в сервисе GameState-Monitor. Удобные способы оплаты для продвижения ваших игровых серверов.",
  // Установлено в true по твоему запросу
  robots: { index: true, follow: true },
  alternates: { canonical: "/payment" },
};

export default function PaymentPage() {
  return <PaymentForm />;
}
