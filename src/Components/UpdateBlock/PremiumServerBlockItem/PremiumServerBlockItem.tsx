"use client";
import styles from "./PremiumServerBlockItem.module.scss";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { GameServer } from "@/types/type";
import PlayersInfo from "../Elements/PlayersInfo/PlayersInfo";
import Play from "../Elements/Play/Play";
import CoppyButton from "../Elements/CopyButton/CoppyButton";
import Image from "next/image";
import "flag-icons/css/flag-icons.min.css";
import { getMapImagePath } from "@/lib/common";
import { useRouter } from "next/navigation";

export default function PremiumServerBlockItem() {
  const servers: GameServer[] = useSelector(
    (state: RootState) => state.main.originalServers
  ).filter((server) => server.service.top.status);

  const router = useRouter();
  const handlerServerPage = (ip: string, port: string) => {
    router.push(`/serverPage/${ip}:${port}`);
  };

  return (
    <div className={styles.premiumServerBlockItem}>
      <h2>
        {servers.length === 0
          ? "На данный момент ТОП сервера отсутствуют"
          : "Топ сервера"}
      </h2>
      <ul className={styles.serverList}>
        {servers.map((server) => (
          <li
            key={server.id}
            className={styles.serverItem}
            onClick={() => handlerServerPage(server.ip, String(server.port))}
          >
            {/* ЛЕВАЯ ЧАСТЬ: Контент */}
            <div className={styles.contentWrapper}>
              {/* 1. Имя сервера */}
              <div className={styles.serverName}>{server.name}</div>

              {/* 2. Карта */}
              <div className={styles.mapName}>{server.map}</div>

              {/* 3. Нижняя строка: Игроки, Play, Флаг, IP, Копировать */}
              <div className={styles.bottomRow}>
                {/* Группа: Игроки и Кнопка Play */}
                <div className={styles.statsGroup}>
                  <PlayersInfo
                    players={server.players}
                    maxPlayers={server.maxPlayers}
                  />
                  <div className={styles.playBtnWrapper}>
                    <Play
                      width="10"
                      height="10"
                      ip={server.ip}
                      port={server.port}
                    />
                  </div>
                </div>

                {/* Группа: Флаг, IP и Копирование */}
                <div className={styles.ipGroup}>
                  <span
                    className={`fi fi-${server.country.toLowerCase()} ${
                      styles.flag
                    }`}
                  ></span>

                  <span className={styles.ipText}>
                    {`${server.ip}:${server.port}`}
                  </span>

                  <div
                    className={styles.copyWrapper}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <CoppyButton ip={server.ip} port={String(server.port)} />
                  </div>
                </div>
              </div>
            </div>

            {/* ПРАВАЯ ЧАСТЬ: Картинка во всю высоту */}
            <div className={styles.imageContainer}>
              <Image
                fill
                style={{ objectFit: "cover" }}
                src={`${getMapImagePath(server.map || "", server.game)}`}
                alt={server.map || "map image"}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
