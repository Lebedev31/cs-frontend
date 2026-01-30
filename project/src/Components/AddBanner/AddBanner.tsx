/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useRef } from "react";
import styles from "./AdBanner.module.scss";

type AdFormat = "auto" | "horizontal" | "vertical" | "rectangle";
type AdSize = "small" | "medium" | "large" | "responsive";
type AdProvider = "google" | "yandex" | "custom";

interface AdBannerProps {
  // Основные параметры
  provider?: AdProvider; // Какая рекламная сеть
  slot?: string; // ID блока (для Google)
  blockId?: string; // ID блока (для Яндекс)

  // Настройки отображения
  format?: AdFormat; // Формат баннера
  size?: AdSize; // Размер
  responsive?: boolean; // Адаптивность

  // Кастомная реклама (HTML)
  customHtml?: string; // Свой HTML код

  // Стили и классы
  className?: string; // Дополнительный класс
  style?: React.CSSProperties; // Inline стили

  // Дополнительно
  placeholder?: boolean; // Показывать плейсхолдер при загрузке
  onAdLoad?: () => void; // Колбэк при загрузке
  onAdError?: (error: Error) => void; // Колбэк при ошибке
}

export default function AddBanner({
  provider = "google",
  slot = "",
  blockId = "",
  format = "auto",
  size = "responsive",
  responsive = true,
  customHtml,
  className = "",
  style = {},
  placeholder = true,
  onAdLoad,
  onAdError,
}: AdBannerProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const hasRendered = useRef(false);

  // Определяем CSS класс размера
  const sizeClass = styles[`ad-${size}`] || "";
  const formatClass = styles[`ad-${format}`] || "";

  useEffect(() => {
    // Защита от повторного рендера
    if (hasRendered.current) return;

    try {
      if (provider === "google" && slot) {
        // Google AdSense
        (window as any).adsbygoogle = (window as any).adsbygoogle || [];
        (window as any).adsbygoogle.push({});
        hasRendered.current = true;
        onAdLoad?.();
      } else if (provider === "yandex" && blockId) {
        // Яндекс.Директ
        (window as any).yaContextCb = (window as any).yaContextCb || [];
        (window as any).yaContextCb.push(() => {
          (window as any).Ya.Context.AdvManager.render({
            blockId: blockId,
            renderTo: `yandex-ad-${blockId}`,
          });
        });
        hasRendered.current = true;
        onAdLoad?.();
      } else if (provider === "custom" && customHtml && adRef.current) {
        // Кастомная реклама
        adRef.current.innerHTML = customHtml;
        hasRendered.current = true;
        onAdLoad?.();
      }
    } catch (error) {
      console.error("Ошибка загрузки рекламы:", error);
      onAdError?.(error as Error);
    }
  }, [provider, slot, blockId, customHtml, onAdLoad, onAdError]);

  // Google AdSense
  if (provider === "google") {
    return (
      <div
        className={`${styles.adContainer} ${sizeClass} ${formatClass} ${className}`}
        style={style}
      >
        {placeholder && <div className={styles.adPlaceholder}>Реклама</div>}
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={process.env.NEXT_PUBLIC_GOOGLE_AD_CLIENT || ""}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive={responsive.toString()}
        />
      </div>
    );
  }

  // Яндекс.Директ
  if (provider === "yandex") {
    return (
      <div
        className={`${styles.adContainer} ${sizeClass} ${formatClass} ${className}`}
        style={style}
      >
        {placeholder && <div className={styles.adPlaceholder}>Реклама</div>}
        <div id={`yandex-ad-${blockId}`} />
      </div>
    );
  }

  // Кастомная реклама (любой HTML)
  if (provider === "custom") {
    return (
      <div
        ref={adRef}
        className={`${styles.adContainer} ${sizeClass} ${formatClass} ${className}`}
        style={style}
      />
    );
  }

  return null;
}
