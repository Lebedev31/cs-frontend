import Link from "next/link";
import Image from "next/image";
import styles from "./Footer.module.scss";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p className={styles.description}>
        GameState-Monitor — специализированный ресурс для поклонников игр
        Counter-Strike 2 (CS2) и Counter-Strike Global Offensive (CS GO). У нас
        собраны актуальные данные обо всех популярных игровых серверах, включая
        статистику игроков, рейтинги и т.д. Удобный интерфейс позволяет легко
        выбрать оптимальный сервер с нужной картой и режимом. Обновляя
        информацию ежедневно, мы помогаем каждому игроку насладиться динамичной
        игрой и испытать себя в любимом шутере, будь то классическое
        противостояние террористов и спецназовцев или захватывающие соревнования
        на картах нового поколения.
      </p>
      <div className={styles.container}>
        <div className={styles.logo}>
          <div className={styles.logoCircle}>
            <a
              href=" https://vk.com/gamestatemonitor"
              rel="noopener noreferrer"
              target="_blank"
            >
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
        <p>GameState-Monitor {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
}
