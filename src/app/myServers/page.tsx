import { Metadata } from "next";
import MyServers from "@/Components/ProfileDropDown/MyServers/MyServers";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Мои серверы | GameState-Monitor",
  description:
    "Управление вашими игровыми серверам в сервисе GameState-Monitor.",
  // По твоему запросу установлены значения true
  robots: { index: true, follow: true },
  alternates: { canonical: "/myServers" },
};

export default function MyServersPage() {
  return <MyServers />;
}
