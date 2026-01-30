import styles from "./Home.module.scss";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.home}>
      <Link href="/">Перейти на главную</Link>
    </div>
  );
}
