"use client";
import styles from "./Modal.module.scss";
import Link from "next/link";

interface ModalProps {
  isOpen: boolean;
  onClose: (isOpen: boolean) => void;
  serverId: string;
}

export default function Modal({ isOpen, onClose, serverId }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={() => onClose(false)}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={() => onClose(false)}>
          ✕
        </button>
        <h2 className={styles.title}>Выберите действие</h2>
        <div className={styles.button_block}>
          <Link href={`/serverPage/${serverId}`}>
            <button className={styles.confirmButton}>
              Перейти на страницу сервера
            </button>
          </Link>
          <Link href={`/settingServer/${serverId}`}>
            <button className={styles.confirmButton}>
              Редактировать сервер
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
