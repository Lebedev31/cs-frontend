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
    const safeName = name
      .replace(/[^a-zA-Z0-9а-яА-ЯёЁ\s-_]/g, "")
      .trim()
      .replace(/\s+/g, "-");

    const urlSlug = `${safeName}-${ip}:${port}`;

    if (pathName === "/myServers" && onClose) {
      onClose(true);
    } else {
      router.push(`/serverPage/${urlSlug}`);
    }
  };

  const mapImg = getMapImagePath(server.map || "", server.game);

  return (
    <div
      className={styles.serverBlockItem}
      style={
        {
          backgroundColor:
            server.service.color.colorName === "none"
              ? "#22262c"
              : server.service.color.colorName,
          border:
            server.service.color.colorName === "none"
              ? "1px solid rgba(255, 255, 255, 0.1)" // Упростил для примера, верните переменную если нужно
              : `2px solid ${server.service.color.colorName}`,
          "--bg-map": `url(${mapImg})`, // ПЕРЕДАЕМ КАРТИНКУ В CSS
        } as React.CSSProperties
      }
      onClick={() =>
        handlerServerPage(server.name, server.ip, String(server.port))
      }
    >
      <div className={styles.contentWrapper}>
        <div className={styles.serverInfo}>
          <div className={styles.nameRow}>
            {server.service.vip.status && (
              <div className={styles.vip_image_container}>
                <Image
                  fill
                  src={"/vip.png"}
                  alt="vip"
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

        <div className={styles.rightMetaGroup}>
          <div className={styles.copyBtn} onClick={(e) => e.stopPropagation()}>
            <CoppyButton ip={server.ip} port={String(server.port)} />
          </div>

          <div className={styles.playBtn}>
            <Play width="16" height="16" ip={server.ip} port={server.port} />
          </div>

          <div className={styles.mapInfo} title={server.map}>
            {server.map}
          </div>

          <div className={styles.playersWrapper}>
            <PlayersInfo
              players={server.players}
              maxPlayers={server.maxPlayers}
            />
          </div>
        </div>
      </div>

      <div className={styles.imageContainer}>
        <Image
          fill
          src={mapImg}
          alt={server.map || "map"}
          style={{ objectFit: "cover" }}
        />
      </div>
    </div>
  );
}
