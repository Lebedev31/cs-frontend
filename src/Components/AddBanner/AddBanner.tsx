"use client";
import { useEffect, useRef, useState } from "react";
import styles from "./AdBanner.module.scss";
import {
  useGetActiveBannerQuery,
  useTrackImpressionMutation,
  useTrackClickMutation,
} from "@/redux/apiSlice/bannerApi";
import { apiImg } from "@/redux/api.url";

const POLL_INTERVAL_MS = 60_000; // 60 секунд

export default function AdBanner() {
  const { data, isLoading } = useGetActiveBannerQuery(undefined, {
    pollingInterval: POLL_INTERVAL_MS,
  });

  const [trackImpression] = useTrackImpressionMutation();
  const [trackClick] = useTrackClickMutation();

  // Храним id последнего баннера, по которому уже отправили impression
  const lastTrackedId = useRef<string | null>(null);

  // Управляем анимацией fade при смене баннера
  const [visible, setVisible] = useState(true);
  const prevBannerId = useRef<string | null>(null);

  const banner = data?.data ?? null;

  // Анимация fade-out → смена → fade-in при смене баннера
  useEffect(() => {
    if (!banner) return;

    if (prevBannerId.current && prevBannerId.current !== banner._id) {
      // Баннер сменился — сначала гасим
      setVisible(false);
      const timer = setTimeout(() => {
        setVisible(true);
        prevBannerId.current = banner._id;
      }, 400); // длительность fade-out
      return () => clearTimeout(timer);
    }

    prevBannerId.current = banner._id;
  }, [banner?._id]);

  // Трекинг показа — только когда баннер сменился (новый id)
  useEffect(() => {
    if (!banner) return;
    if (lastTrackedId.current === banner._id) return;

    lastTrackedId.current = banner._id;
    trackImpression({ id: banner._id });
  }, [banner?._id, trackImpression]);

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
