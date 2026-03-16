import { Metadata } from "next";
import FilterServerBlock from "@/Components/FilterServerBlock/FilterServerBlock";
import UpdateBlock from "@/Components/UpdateBlock/UpdateBlock";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const isCS2 = id.toLowerCase() === "cs2";

  const title = isCS2
    ? "Сервера Counter Strike 2 (CS2) — Мониторинг серверов CS2"
    : "Сервера Counter Strike Global Offensive (CS GO) — Мониторинг серверов CS GO";

  const description = isCS2
    ? "Сервера CS2 с разными режимами. Моды, карты, онлайн серверов КС2 в реальном времени"
    : "Сервера CS GO с разными режимами. Моды, карты, онлайн серверов КС ГО в реальном времени";

  return {
    title,
    description,
    robots: { index: true, follow: true },
    alternates: { canonical: `/server-list/${id}` }, // ← используем awaited id
  };
}

export default function ServerListPage() {
  return (
    <div style={{ paddingLeft: "15px", paddingRight: "15px" }}>
      <FilterServerBlock />
      <UpdateBlock />
    </div>
  );
}
