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

export default function ServerBlockItem({
  server,
  onClose,
}: {
  server: GameServer;
  onClose?: (isOpen: boolean) => void;
}) {
  const router = useRouter();
  const pathName = usePathname();

  const handlerServerPage = (ip: string, port: string) => {
    if (pathName === "/myServers" && onClose) {
      onClose(true);
    } else {
      router.push(`/serverPage/${ip}:${port}`);
    }
  };

  const safePoints = (server: GameServer) => {
    const points =
      server.service.balls?.listService?.reduce(
        (acc, item) => acc + item.quantity,
        0
      ) || 0;
    return server.rating + points;
  };

  return (
    <div
      className={styles.serverBlockItem}
      style={{
        // Если нужен цветной бордер от привилегии, можно добавить сюда
        backgroundColor:
          server.service.color.colorName !== "none"
            ? "transparent" // Или цвет фона, если нужен
            : undefined,
        border:
          server.service.color.colorName !== "none"
            ? "transparent" // Или цвет фона, если нужен
            : undefined,
      }}
      onClick={() => handlerServerPage(server.ip, String(server.port))}
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
            <div onClick={(e) => e.stopPropagation()}>
              <CoppyButton ip={server.ip} port={String(server.port)} />
            </div>
          </div>
        </div>

        {/* ПРАВАЯ ЧАСТЬ: МЕТА (Фиксированная ширина 300px) */}
        <div className={styles.rightMetaGroup}>
          {/* 1. Кнопка Play */}
          <div className={styles.playBtn}>
            <Play width="16" height="16" ip={server.ip} port={server.port} />
          </div>

          {/* 2. Игроки */}
          <div className={styles.playersWrapper}>
            <PlayersInfo
              players={server.players}
              maxPlayers={server.maxPlayers}
            />
          </div>

          {/* 3. Карта (с троеточием) */}
          <div className={styles.mapInfo} title={server.map}>
            {server.map}
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
