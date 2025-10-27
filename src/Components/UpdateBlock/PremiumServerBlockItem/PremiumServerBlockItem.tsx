"use client";
import styles from "./PremiumServerBlockItem.module.scss";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { GameServer } from "@/types/type";
import PlayersInfo from "../Elements/PlayersInfo/PlayersInfo";
import Play from "../Elements/Play/Play";
import CoppyButton from "../Elements/CopyButton/CoppyButton";
import Image from "next/image";

export default function PremiumServerBlockItem() {
  const servers: GameServer[] = useSelector(
    (state: RootState) => state.main.originalServers
  ).slice(0, 10);

  return (
    <div className={styles.premiumServerBlockItem}>
      <h2>Топ сервера</h2>
      <ul className={styles.serverList}>
        {servers.map((server) => (
          <li key={server.id} className={styles.serverItem}>
            {/* Левый блок: Название, Карта, Игроки */}
            <div className={styles.serverInfo}>
              <p className={styles.serverName}>{server.name}</p>
              <div className={styles.serverMeta}>
                <div className={styles.map}>{server.map}</div>
                <div className={styles.play}>
                  <PlayersInfo
                    players={server.players}
                    maxPlayers={server.maxPlayers}
                  />
                  <Play width="10" height="10" />
                </div>
              </div>
            </div>

            {/* Центральный блок: Адрес сервера */}
            <div className={styles.serverAddress}>
              <p>{`${server.ip}:${server.port}`}</p>
              <CoppyButton ip={server.ip} port={String(server.port)} />
            </div>

            <Image width={60} height={60} src="/logo.jpg" alt="картинка" />
          </li>
        ))}
      </ul>
    </div>
  );
}
