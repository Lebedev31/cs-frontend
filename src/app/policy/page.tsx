import { Metadata } from "next";
import Policy from "@/Components/Info/policy/Policy";

export const metadata: Metadata = {
  title: "Политика конфиденциальности - CS Rating",
  description:
    "Политика конфиденциальности и обработки персональных данных на сайте мониторинга серверов CS Rating.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/policy" },
};

export default function PolicyPage() {
  return <Policy />;
}
