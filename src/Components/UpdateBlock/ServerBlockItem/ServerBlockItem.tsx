"use client";
import styles from "./ServerBlockItem.module.scss";
import { GameServer } from "@/types/type";
import Image from "next/image";
import "flag-icons/css/flag-icons.min.css";
import PlayersInfo from "../Elements/PlayersInfo/PlayersInfo";
import Play from "../Elements/Play/Play";
import CoppyButton from "../Elements/CopyButton/CoppyButton";
import { useRouter, usePathname } from "next/navigation";
import { getMapImagePath } from "@/lib/common";

export const safePoints = (server: GameServer) => {
  const points =
    server.service.balls?.listService?.reduce(
      (acc, item) => acc + item.quantity,
      0,
    ) || 0;
  return server.rating + points;
};

export default function ServerBlockItem({
  server,
  onClose,
}: {
  server: GameServer;
  onClose?: (isOpen: boolean) => void;
}) {
  const router = useRouter();
  const pathName = usePathname();

  const handlerServerPage = (name: string, ip: string, port: string) => {
    // 1. Очищаем имя от спецсимволов, оставляем буквы, цифры и пробелы
    // 2. Заменяем пробелы на тире
    const safeName = name
      .replace(/[^a-zA-Z0-9а-яА-ЯёЁ\s-_]/g, "")
      .trim()
      .replace(/\s+/g, "-");

    // Формируем URL: Название-IP:Port
    const urlSlug = `${safeName}-${ip}:${port}`;

    if (pathName === "/myServers" && onClose) {
      onClose(true);
    } else {
      router.push(`/serverPage/${urlSlug}`);
    }
  };

  return (
    <div
      className={styles.serverBlockItem}
      style={{
        backgroundColor:
          server.service.color.colorName === "none"
            ? "#22262c"
            : server.service.color.colorName,
        border:
          server.service.color.colorName === "none"
            ? "1px solid rgba(v.$neon-primary, 0.1"
            : `2px solid ${server.service.color.colorName}`,
      }}
      // Передаем также имя сервера для формирования URL
      onClick={() =>
        handlerServerPage(server.name, server.ip, String(server.port))
      }
    >
      {/* ОБЩАЯ ОБЕРТКА КОНТЕНТА (Слева от картинки) */}
      <div className={styles.contentWrapper}>
        {/* ЛЕВАЯ ЧАСТЬ: ИНФО (Растягивается) */}
        <div className={styles.serverInfo}>
          <div className={styles.nameRow}>
            {server.service.vip.status && (
              <div className={styles.vip_image_container}>
                <Image
                  fill
                  src={"/vip.png"}
                  alt={server.map || "map"}
                  style={{ objectFit: "cover" }}
                />
              </div>
            )}
            <span className={styles.name} title={server.name}>
              {server.name}
            </span>
          </div>

          <div className={styles.addressRow}>
            <span className={styles.points}>
              Баллы сервера: {safePoints(server)}
            </span>
            <span
              className={`fi fi-${server.country.toLowerCase()} ${
                styles.countryFlag
              }`}
            ></span>
            <span className={styles.address}>
              {server.ip}:{server.port}
            </span>
          </div>
        </div>

        {/* ПРАВАЯ ЧАСТЬ: КНОПКИ + МЕТА (Фиксированная ширина) */}
        <div className={styles.rightMetaGroup}>
          {/* 1. Кнопка Copy (слева) */}
          <div className={styles.copyBtn} onClick={(e) => e.stopPropagation()}>
            <CoppyButton ip={server.ip} port={String(server.port)} />
          </div>

          {/* 2. Кнопка Play */}
          <div className={styles.playBtn}>
            <Play width="16" height="16" ip={server.ip} port={server.port} />
          </div>

          {/* 3. Карта (с троеточием) */}
          <div className={styles.mapInfo} title={server.map}>
            {server.map}
          </div>

          {/* 4. Игроки */}
          <div className={styles.playersWrapper}>
            <PlayersInfo
              players={server.players}
              maxPlayers={server.maxPlayers}
            />
          </div>
        </div>
      </div>

      {/* КАРТИНКА (Справа) */}
      <div className={styles.imageContainer}>
        <Image
          fill
          src={`${getMapImagePath(server.map || "", server.game)}`}
          alt={server.map || "map"}
          style={{ objectFit: "cover" }}
        />
      </div>
    </div>
  );
}
