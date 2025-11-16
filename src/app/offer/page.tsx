import { Metadata } from "next";
import Offer from "@/Components/Info/offer/Offer";

export const metadata: Metadata = {
  title: "Договор оферты - Условия использования CS Rating",
  description:
    "Публичная оферта на оказание услуг по размещению информации о серверах Counter-Strike на платформе CS Rating.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/offer" },
};

export default function OfferPage() {
  return <Offer />;
}
