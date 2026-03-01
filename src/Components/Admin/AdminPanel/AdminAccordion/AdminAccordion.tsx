"use client";

import { useState, ReactNode } from "react";
import styles from "./AdminAccordion.module.scss";

type AccordionProps = {
  title: string;
  icon: string;
  children: ReactNode;
  defaultOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
};

export default function AdminAccordion({
  title,
  icon,
  children,
  defaultOpen = false,
  onToggle, // ← добавили деструктуризацию
}: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const handleToggle = () => {
    const next = !isOpen;
    setIsOpen(next);
    onToggle?.(next); // ← вызываем колбэк с новым состоянием
  };

  return (
    <div className={styles.container}>
      <div
        className={`${styles.header} ${isOpen ? styles.header_open : ""}`}
        onClick={handleToggle} // ← заменили inline на handleToggle
      >
        <div className={styles.header__info}>
          <span className={styles.header__icon}>{icon}</span>
          <h2 className={styles.header__title}>{title}</h2>
        </div>
        <div className={styles.header__arrow}>{isOpen ? "▲" : "▼"}</div>
      </div>

      <div
        className={`${styles.content} ${isOpen ? styles.content_visible : ""}`}
      >
        <div className={styles.inner}>{children}</div>
      </div>
    </div>
  );
}
