import { Metadata } from "next";
import WrapperSettingServer from "@/Components/AddServer/WrapperSettingServer";

export default function SettingServerPage() {
  return <WrapperSettingServer />;
}

export const metadata: Metadata = {
  title: "Настройки сервера",
  description:
    "Панель управления игровым сервером. Изменяйте описание, обновляйте данные и настраивайте отображение вашего сервера в мониторинге.",
  // По твоему запросу установлены значения true
  robots: { index: true, follow: true },
  // Для динамических страниц canonical обычно не указывают жестко,
  // но если нужно, то без ID это будет выглядеть так:
  alternates: { canonical: "/settingServer" },
};
