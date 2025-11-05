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

  if (servers.length === 0) {
    return null;
  }

  return (
    <div className={styles.premiumServerBlockItem}>
      <h2>Топ сервера</h2>
      <ul className={styles.serverList}>
        {servers.map((server) => (
          <li
            key={server.id}
            className={styles.serverItem}
            onClick={() => handlerServerPage(server.ip, String(server.port))}
          >
            {/* Левый блок: Название, Карта, Игроки */}
            <p className={styles.serverName}>{server.name}</p>
            <div className={styles.wrapper}>
              <div className={styles.serverInfo}>
                <div className={styles.serverMeta}>
                  <div className={styles.map}>{server.map}</div>
                  <div className={styles.play}>
                    <PlayersInfo
                      players={server.players}
                      maxPlayers={server.maxPlayers}
                    />
                    <Play
                      width="10"
                      height="10"
                      ip={server.ip}
                      port={server.port}
                    />
                  </div>
                </div>
              </div>
              {/* Центральный блок: Адрес сервера */}
              <div className={styles.serverAddress}>
                <div className={styles.countryFlag}>
                  <span
                    className={`fi fi-${server.country.toLowerCase()}`}
                  ></span>
                </div>
                <p>{`${server.ip}:${server.port}`}</p>
                <CoppyButton ip={server.ip} port={String(server.port)} />
              </div>
              <div className={styles.premium_image}>
                <Image
                  fill
                  style={{ objectFit: "cover" }}
                  src={`${getMapImagePath(server.map || "", server.game)}`}
                  alt="картинка"
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
