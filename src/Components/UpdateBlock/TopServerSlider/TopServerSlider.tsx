"use client";
import styles from "./TopServerSlider.module.scss";
import PlayersInfo from "../Elements/PlayersInfo/PlayersInfo";
import Play from "../Elements/Play/Play";
import CoppyButton from "../Elements/CopyButton/CoppyButton";
import Image from "next/image";
import "flag-icons/css/flag-icons.min.css";
import { getMapImagePath } from "@/lib/common";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useState, useEffect, useRef, useCallback } from "react";

const SLIDE_INTERVAL = 15000;

export default function TopServerSlider() {
  const servers = useSelector(
    (state: RootState) => state.main.originalServers,
  ).filter((server) => server.service.top.status);

  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animClass, setAnimClass] = useState<string>("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const isAnimating = useRef(false);

  const goTo = useCallback(
    (index: number, dir: "left" | "right") => {
      if (isAnimating.current || servers.length <= 1) return;
      isAnimating.current = true;
      setAnimClass(dir === "right" ? styles.exitLeft : styles.exitRight);

      setTimeout(() => {
        setCurrentIndex(index);
        setAnimClass(dir === "right" ? styles.enterRight : styles.enterLeft);
        setTimeout(() => {
          setAnimClass("");
          isAnimating.current = false;
        }, 300);
      }, 300);
    },
    [servers.length],
  );

  const goPrev = useCallback(() => {
    const prevIndex =
      currentIndex === 0 ? servers.length - 1 : currentIndex - 1;
    goTo(prevIndex, "left");
  }, [currentIndex, servers.length, goTo]);

  const goNext = useCallback(() => {
    const nextIndex =
      currentIndex === servers.length - 1 ? 0 : currentIndex + 1;
    goTo(nextIndex, "right");
  }, [currentIndex, servers.length, goTo]);

  useEffect(() => {
    if (servers.length <= 1) return;
    timerRef.current = setTimeout(goNext, SLIDE_INTERVAL);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentIndex, goNext, servers.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = e.targetTouches[0].clientX;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };
  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      diff > 0 ? goNext() : goPrev();
    }
  };

  const handlerServerPage = (name: string, ip: string, port: string) => {
    const safeName = name
      .replace(/[^a-zA-Z0-9а-яА-ЯёЁ\s-_]/g, "")
      .trim()
      .replace(/\s+/g, "-");
    router.push(`/serverPage/${safeName}-${ip}:${port}`);
  };

  if (servers.length === 0) return null;

  const server = servers[currentIndex];
  const hasMultiple = servers.length > 1;
  const mapImg = getMapImagePath(server.map || "", server.game);

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Топ сервера</h2>
      <div className={styles.sliderWrapper}>
        {hasMultiple && (
          <button
            className={`${styles.arrow} ${styles.arrowLeft}`}
            onClick={goPrev}
          >
            ‹
          </button>
        )}

        <div
          className={`${styles.slide} ${animClass}`}
          onClick={() =>
            handlerServerPage(server.name, server.ip, String(server.port))
          }
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{ "--bg-map": `url(${mapImg})` } as React.CSSProperties}
        >
          <div className={styles.content}>
            <p className={styles.serverName}>{server.name}</p>
            <div className={styles.infoRow}>
              <div className={styles.mapName}>{server.map}</div>
              <div className={styles.statsGroup}>
                <PlayersInfo
                  players={server.players}
                  maxPlayers={server.maxPlayers}
                />
                <div
                  className={styles.playBtn}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Play
                    width="10"
                    height="10"
                    ip={server.ip}
                    port={String(server.port)}
                  />
                </div>
              </div>
              <div className={styles.ipGroup}>
                <span
                  className={`fi fi-${server.country.toLowerCase()} ${styles.flag}`}
                />
                <span className={styles.ipText}>
                  {server.ip}:{server.port}
                </span>
                <div
                  className={styles.copyBtn}
                  onClick={(e) => e.stopPropagation()}
                >
                  <CoppyButton ip={server.ip} port={String(server.port)} />
                </div>
              </div>
            </div>
          </div>
          <div className={styles.imageContainer}>
            <Image
              fill
              style={{ objectFit: "cover" }}
              src={mapImg}
              alt="map"
              sizes="200px"
            />
          </div>
        </div>

        {hasMultiple && (
          <button
            className={`${styles.arrow} ${styles.arrowRight}`}
            onClick={goNext}
          >
            ›
          </button>
        )}
      </div>

      {hasMultiple && (
        <div className={styles.dots}>
          {servers.map((_, i) => (
            <button
              key={i}
              className={`${styles.dot} ${i === currentIndex ? styles.dotActive : ""}`}
              onClick={() => goTo(i, i > currentIndex ? "right" : "left")}
            />
          ))}
        </div>
      )}
    </div>
  );
}
