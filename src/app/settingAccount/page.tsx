import { Metadata } from "next";
import SettingAccount from "@/Components/ProfileDropDown/SettingAccount/SettingAccount";

export const metadata: Metadata = {
  title: "Настройки аккаунта | GameState-Monitor",
  description:
    "Управление личными данными и безопасностью вашего аккаунта GameState-Monitor. Настройте профиль, измените пароль или уведомления в одном месте.",
  // По твоему запросу установлены значения true
  robots: { index: true, follow: true },
  alternates: { canonical: "/settingAccount" },
};

export default function SettingPage() {
  return <SettingAccount />;
}
