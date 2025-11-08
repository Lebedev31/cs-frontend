import Link from "next/link";
import Image from "next/image";
import styles from "./Footer.module.scss";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p className={styles.description}>
        Сайт посвящён легендарной игре <strong>Counter-Strike 1.6</strong> —
        культовому шутеру, который навсегда изменил мир онлайн-игр. Здесь вы
        можете найти лучшие игровые серверы, ознакомиться с их рейтингом,
        следить за активностью игроков и выбирать площадки с оптимальным пингом
        и настроенной античит-системой. Мы собираем и обновляем информацию,
        чтобы каждый игрок мог быстро найти подходящий сервер и погрузиться в
        атмосферу классического CS 1.6, где решают не скины, а мастерство и
        командная работа.
      </p>
      <div className={styles.container}>
        <div className={styles.logo}>
          <div className={styles.logoCircle}>
            <a href="#" rel="noopener noreferrer">
              <Image width={70} height={70} alt="VK" src="/vk.png" />
            </a>
          </div>
        </div>
        <nav className={styles.nav}>
          <Link href="/contacts" className={styles.link}>
            Контакты
          </Link>
          <Link href="/offer" className={styles.link}>
            Договор оферты
          </Link>
          <Link href="/policy" className={styles.link}>
            Политика конфиденциальности
          </Link>
          <Link href="/agreement" className={styles.link}>
            Пользовательское соглашение
          </Link>
        </nav>
      </div>
      <div className={styles.tagline}>
        <p>Мониторинг {new Date().getFullYear()} (пример)</p>
      </div>
    </footer>
  );
}
