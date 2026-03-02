import { Metadata } from "next";
import Balls from "@/Components/Premium/Service/Balls/Balls";

export const metadata: Metadata = {
  title: "Купить баллы",
  description:
    "Приобретение баллов для использования премиум-услуг и поднятия рейтинга ваших серверов в системе GameState-Monitor.",
  // По твоему запросу установлены значения true
  robots: { index: true, follow: true },
  alternates: { canonical: "/premium/servicePage/balls" },
};

export default function BallsPage() {
  return <Balls />;
}
