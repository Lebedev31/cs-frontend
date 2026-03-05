"use client";
import { useEffect, useRef, useState } from "react";
import styles from "./AdBanner.module.scss";
import {
  useGetActiveBannerQuery,
  useTrackImpressionMutation,
  useTrackClickMutation,
} from "@/redux/apiSlice/bannerApi";
import { apiImg } from "@/redux/api.url";

const POLL_INTERVAL_MS = 60_000;
const IMPRESSION_KEY = "banner_impressed";
const IMPRESSION_TTL_MS = 30 * 60 * 1000;

function shouldTrackImpression(bannerId: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = localStorage.getItem(IMPRESSION_KEY);
    if (!raw) return true;
    const { id, ts } = JSON.parse(raw) as { id: string; ts: number };
    if (id === bannerId && Date.now() - ts < IMPRESSION_TTL_MS) return false;
    return true;
  } catch {
    return true;
  }
}

function markImpression(bannerId: string) {
  localStorage.setItem(
    IMPRESSION_KEY,
    JSON.stringify({ id: bannerId, ts: Date.now() }),
  );
}

export default function AdBanner() {
  const { data, isLoading } = useGetActiveBannerQuery(undefined, {
    pollingInterval: POLL_INTERVAL_MS,
  });

  const [trackImpression] = useTrackImpressionMutation();
  const [trackClick] = useTrackClickMutation();

  // Используем ref чтобы не сбрасывался при ремонтировании
  const trackedRef = useRef<Set<string>>(new Set());
  const [visible, setVisible] = useState(true);
  const prevBannerId = useRef<string | null>(null);

  const banner = data?.data ?? null;

  // Анимация при смене баннера
  useEffect(() => {
    if (!banner) return;
    if (prevBannerId.current && prevBannerId.current !== banner._id) {
      setVisible(false);
      const timer = setTimeout(() => {
        setVisible(true);
        prevBannerId.current = banner._id;
      }, 400);
      return () => clearTimeout(timer);
    }
    prevBannerId.current = banner._id;
  }, [banner?._id]);

  // Трекинг — строгая защита от повторов
  useEffect(() => {
    if (!banner) return;

    // Уже трекали в этой сессии компонента
    if (trackedRef.current.has(banner._id)) return;

    // Проверяем localStorage (между сессиями/вкладками)
    if (!shouldTrackImpression(banner._id)) {
      // Добавляем в Set чтобы не проверять localStorage каждый раз
      trackedRef.current.add(banner._id);
      return;
    }

    trackedRef.current.add(banner._id);
    markImpression(banner._id);
    trackImpression({ id: banner._id });
  }, [banner?._id]); // trackImpression намеренно убран из deps — он стабилен но вызывает лишние срабатывания

  const handleClick = () => {
    if (banner) trackClick({ id: banner._id });
  };

  if (isLoading) {
    return (
      <div className={styles.wrapper}>
        <div className={`${styles.container} ${styles.skeleton}`}>
          <div className={styles.skeletonInner} />
        </div>
      </div>
    );
  }

  if (!banner) {
    return (
      <div className={styles.wrapper}>
        <div className={`${styles.container} ${styles.placeholder}`}>
          <span className={styles.placeholderText}>Реклама</span>
          <span className={styles.placeholderSub}>
            Место для вашего баннера
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <a
        href={banner.linkUrl}
        target="_blank"
        rel="nofollow noopener noreferrer"
        className={`${styles.container} ${visible ? styles.fadeIn : styles.fadeOut}`}
        onClick={handleClick}
        aria-label="Рекламный баннер"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${apiImg}${banner.imageUrl}`}
          alt="Реклама"
          className={styles.bannerImg}
        />
        <div className={styles.adLabel}>Реклама</div>
      </a>
    </div>
  );
}
