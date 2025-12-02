"use client";
import styles from "./CoppyButton.module.scss";
import { useState, useEffect } from "react";

export default function CoppyButton({
  ip,
  port,
}: {
  ip: string;
  port: string;
}) {
  const [isCopied, setIsCopied] = useState(false);

  const copyServerAddress = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${ip}:${port}`);
    setIsCopied(true);
  };

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => {
        setIsCopied(false);
      }, 800); // Исчезает через 1.5 секунды
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  return (
    <div className={styles.wrapper}>
      <button className={styles.copyButton} onClick={copyServerAddress}>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
          <rect
            x="9"
            y="9"
            width="13"
            height="13"
            rx="2"
            ry="2"
            stroke="#0891b2"
            strokeWidth="2"
          />
          <path
            d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
            stroke="#0891b2"
            strokeWidth="2"
          />
        </svg>
      </button>

      {/* Сообщение появляется рядом */}
      <span className={`${styles.message} ${isCopied ? styles.visible : ""}`}>
        Скопировано
      </span>
    </div>
  );
}
