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
    if (
      server.service.balls &&
      server.service.balls.listService &&
      server.service.balls.listService.length > 0
    ) {
      return server.service.balls.listService.reduce(
        (current, item) => current + item.quantity,
        0
      );
    } else {
      return 0;
    }
  };

  return (
    <div
      className={styles.serverBlockItem}
      style={{
        backgroundColor: `${
          server.service.color.colorName === "none"
            ? "#24222a"
            : server.service.color.colorName
        }`,
      }}
      onClick={() => handlerServerPage(server.ip, String(server.port))}
    >
      {/* Блок 1-2: Название сервера и адрес с флагом и статусом */}
      <div className={styles.serverInfo}>
        <div className={styles.nameRow}>
          {server.service.vip.status ? (
            <span className={styles.statusBadge}>VIP</span>
          ) : null}
          <span className={styles.name}>{server.name}</span>
        </div>
        <div className={styles.addressRow}>
          <p className={styles.points}>
            Баллы сервера: {server.rating + safePoints(server)}
          </p>
          <div className={styles.countryFlag}>
            <span className={`fi fi-${server.country.toLowerCase()}`}></span>
          </div>
          <p className={styles.address}>
            {server.ip}:{server.port}
          </p>
          {/* Блок 3: Кнопка скопировать адрес */}
          <CoppyButton ip={server.ip} port={String(server.port)} />
        </div>
      </div>

      {/* Блок 4: Кнопка играть */}
      <Play width="16" height="16" ip={server.ip} port={server.port} />
      {/* Блок 5: Игроки с иконкой */}
      <PlayersInfo players={server.players} maxPlayers={server.maxPlayers} />
      {/* Блок 6: Карта */}
      <div className={styles.mapInfo}>
        <p className={styles.map}>{server.map}</p>
      </div>

      <div className={styles.image}>
        <Image
          fill
          src={`${getMapImagePath(server.map || "", server.game)}`}
          alt="CS 1.6 Server Parser"
          style={{ objectFit: "cover" }}
        />
      </div>
    </div>
  );
}
