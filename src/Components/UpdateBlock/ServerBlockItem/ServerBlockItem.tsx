"use client";
import styles from "./ServerBlockItem.module.scss";
import { GameServer } from "@/types/type";
import Image from "next/image";
import "flag-icons/css/flag-icons.min.css";
import PlayersInfo from "../Elements/PlayersInfo/PlayersInfo";
import Play from "../Elements/Play/Play";
import CoppyButton from "../Elements/CopyButton/CoppyButton";
import { useRouter } from "next/navigation";

export default function ServerBlockItem({ server }: { server: GameServer }) {
  const router = useRouter();
  const handlerServerPage = (ip: string, port: string) => {
    router.push(`/serverPage/${ip}:${port}`);
  };
  return (
    <div
      className={styles.serverBlockItem}
      onClick={() => handlerServerPage(server.ip, String(server.port))}
    >
      {/* Блок 1-2: Название сервера и адрес с флагом и статусом */}
      <div className={styles.serverInfo}>
        <div className={styles.nameRow}>
          <span className={styles.statusBadge}>ВИП</span>
          <span className={styles.name}>{server.name}</span>
        </div>
        <div className={styles.addressRow}>
          <p className={styles.points}>Баллы сервера: 0</p>
          <div className={styles.countryFlag}>
            <span className="fi fi-ru"></span> {/* 🇷🇺 как SVG */}{" "}
          </div>
          <p className={styles.address}>
            {server.ip}:{server.port}
          </p>
          {/* Блок 3: Кнопка скопировать адрес */}
          <CoppyButton ip={server.ip} port={String(server.port)} />
        </div>
      </div>

      {/* Блок 4: Кнопка играть */}
      <Play width="16" height="16" />
      {/* Блок 5: Игроки с иконкой */}
      <PlayersInfo players={server.players} maxPlayers={server.maxPlayers} />
      {/* Блок 6: Карта */}
      <div className={styles.mapInfo}>
        <p className={styles.map}>{server.map}</p>
      </div>

      <div>
        <Image
          width={45}
          height={45}
          src="/logo.jpg"
          alt="CS 1.6 Server Parser"
        />
      </div>
    </div>
  );
}
